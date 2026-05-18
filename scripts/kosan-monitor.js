const fs = require("node:fs/promises");

const sources = [
  {
    name: "新竹縣政府科三計畫頁",
    url: "https://www.hsinchu.gov.tw/cp.aspx?n=982&s=263",
    keywords: ["科三", "新竹科學園區第三期", "竹科三期"]
  },
  {
    name: "新竹縣政府新聞搜尋",
    url: "https://www.hsinchu.gov.tw/News.aspx?n=153&sms=8603",
    keywords: ["科三", "竹科三期", "新竹科學園區第三期", "內政部都委會"]
  },
  {
    name: "新竹縣都市計畫網",
    url: "https://urbanplan.hsinchu.gov.tw/",
    keywords: ["科三", "竹科三期", "新竹科學園區第三期"]
  }
];

const knownLatest = {
  date: "115.04.28",
  title: "議會質詢更新科三目前進度",
  url: "https://www.hsinchu.gov.tw/News_Content.aspx?n=153&s=283364"
};

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findDates(text) {
  const rocDates = text.match(/1(?:1[0-9]|2[0-9])[\./-]\d{1,2}[\./-]\d{1,2}/g) || [];
  const westernDates = text.match(/20\d{2}[\./-]\d{1,2}[\./-]\d{1,2}/g) || [];
  return [...new Set([...rocDates, ...westernDates])].slice(0, 8);
}

async function fetchSource(source) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(source.url, {
      headers: {
        "user-agent": "kosan-progress-monitor/1.0"
      },
      signal: controller.signal
    });
    const html = await response.text();
    const text = stripHtml(html);
    const hits = source.keywords.filter((keyword) => text.includes(keyword));

    return {
      ...source,
      ok: response.ok,
      status: response.status,
      hits,
      dates: findDates(text),
      sample: text.slice(0, 180)
    };
  } catch (error) {
    return {
      ...source,
      ok: false,
      status: "連線失敗",
      hits: [],
      dates: [],
      error: error.name === "AbortError" ? "連線逾時" : error.message
    };
  } finally {
    clearTimeout(timeout);
  }
}

function buildReport(results) {
  const now = new Date();
  const failed = results.filter((item) => !item.ok);
  const matched = results.filter((item) => item.ok && item.hits.length > 0);
  const possibleNewDates = results
    .flatMap((item) => item.dates)
    .filter((date) => date > knownLatest.date);

  const status = failed.length === results.length
    ? "檢查失敗"
    : possibleNewDates.length > 0
      ? "可能有更新，需要人工確認"
      : "未發現更新";

  const lines = [
    "# 科三官方資料每日監測報告",
    "",
    `- 執行時間：${now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`,
    `- 檢查結果：${status}`,
    `- 目前網站已知最新官方資料：${knownLatest.date} ${knownLatest.title}`,
    `- 最新官方連結：${knownLatest.url}`,
    "",
    "## 已檢查來源",
    ""
  ];

  results.forEach((item) => {
    lines.push(`### ${item.name}`);
    lines.push(`- 網址：${item.url}`);
    lines.push(`- 狀態：${item.ok ? `可連線（HTTP ${item.status}）` : `需要人工確認（${item.status}${item.error ? `，${item.error}` : ""}）`}`);
    lines.push(`- 命中關鍵字：${item.hits.length ? item.hits.join("、") : "未命中"}`);
    lines.push(`- 頁面日期線索：${item.dates.length ? item.dates.join("、") : "未偵測到明確日期"}`);
    lines.push("");
  });

  lines.push("## 判讀");
  if (possibleNewDates.length > 0) {
    lines.push(`- 偵測到可能晚於既有資料的日期：${[...new Set(possibleNewDates)].join("、")}。請人工確認是否與科三相關。`);
  } else if (matched.length > 0 && failed.length === 0) {
    lines.push("- 已檢查來源中有命中科三相關關鍵字，但未找到晚於既有最新資料的明確日期。");
  } else if (failed.length > 0) {
    lines.push("- 部分來源無法連線或無法確認，請人工點開上方來源查看。");
  } else {
    lines.push("- 本次未發現比既有最新官方資料更新的科三相關公開資訊。");
  }

  lines.push("");
  lines.push("## 建議動作");
  lines.push(possibleNewDates.length > 0
    ? "- 先人工確認新日期資料內容；若確認與科三進度相關，再更新 data.json 的最新消息、文件卡、待確認資訊與變更紀錄。"
    : "- 暫不需要更新網站內容。若你知道有 5 月以後資料，請提供網址或截圖再人工補查。");

  return lines.join("\n");
}

async function main() {
  const results = await Promise.all(sources.map(fetchSource));
  const report = buildReport(results);
  await fs.writeFile("monitor-report.md", report, "utf8");
  console.log(report);
}

main().catch(async (error) => {
  const report = [
    "# 科三官方資料每日監測報告",
    "",
    `- 執行時間：${new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`,
    "- 檢查結果：檢查失敗",
    `- 失敗原因：${error.message}`,
    "",
    "## 建議動作",
    "- 請人工確認網路連線與官方網站是否可開啟。"
  ].join("\n");
  await fs.writeFile("monitor-report.md", report, "utf8");
  console.log(report);
  process.exitCode = 1;
});

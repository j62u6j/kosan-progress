let stages, statusSummary, dataStatus, riskSignals, briefCards, topicGuides, latestUpdates, forecasts, processSteps, mapAreas, watchlist, timeline, landUse, records, faqs, sources, changelog;

async function loadSiteData() {
  const response = await fetch('data.json');
  if (!response.ok) {
    throw new Error(`Unable to load data.json: ${response.status}`);
  }
  const data = await response.json();
  ({ stages, statusSummary, dataStatus, riskSignals, briefCards, topicGuides, latestUpdates, forecasts, processSteps, mapAreas, watchlist, timeline, landUse, records, faqs, sources, changelog } = data);
}

function riskLabel(level) {
  const labels = {
    green: "綠燈",
    yellow: "黃燈",
    red: "紅燈"
  };
  return labels[level] || "未標示";
}

function credibilityLabel(level) {
  const labels = {
    "official-news": "官方新聞",
    "official-record": "官方紀錄",
    "official-faq": "官方 FAQ",
    "process-inference": "流程推估",
    "pending-confirmation": "待確認"
  };
  return labels[level] || "資料來源";
}

function renderStatusSummary() {
  const target = document.querySelector("#statusStrip");
  target.innerHTML = statusSummary.map((item) => `
    <article>
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      <p>${item.text}</p>
    </article>
  `).join("");
}

function renderUpdateBanner() {
  const target = document.querySelector("#updateBanner");
  target.innerHTML = `
    <div>
      <span>資料最後更新：${dataStatus.pageUpdated}</span>
      <span>最新官方資料：${dataStatus.latestOfficialDate} ${dataStatus.latestOfficialTitle}</span>
      <span>監測狀態：${dataStatus.monitorText}</span>
    </div>
  `;
}

function renderLatestUpdates() {
  const target = document.querySelector("#latestGrid");
  target.innerHTML = latestUpdates.map((update, index) => `
    <article class="latest-card ${index === 0 ? "primary-latest" : ""}">
      <div class="latest-date">${update.date}</div>
      <h3>${update.title}</h3>
      <p>${update.text}</p>
      <a href="${update.url}" target="_blank" rel="noopener">${update.source}</a>
    </article>
  `).join("");
}

function renderBriefCards() {
  const target = document.querySelector("#briefGrid");
  target.innerHTML = briefCards.map((card, index) => `
    <article class="brief-card">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <h3>${card.title}</h3>
      <p>${card.text}</p>
    </article>
  `).join("");
}

function renderTopicGuides() {
  const target = document.querySelector("#topicGrid");
  target.innerHTML = topicGuides.map((topic) => `
    <article class="topic-card">
      <span class="topic-status">${topic.status}</span>
      <h3>${topic.title}</h3>
      <p>${topic.text}</p>
      <strong>${topic.watch}</strong>
    </article>
  `).join("");
}

function renderRisks() {
  const target = document.querySelector("#riskGrid");
  target.innerHTML = riskSignals.map((signal) => `
    <article class="risk-card ${signal.level}">
      <div class="signal-dot" aria-label="${riskLabel(signal.level)}"></div>
      <div>
        <span class="risk-status">${signal.status}</span>
        <h3>${signal.title}</h3>
        <p>${signal.text}</p>
      </div>
    </article>
  `).join("");
}

function renderStages() {
  const target = document.querySelector("#stageTrack");
  target.innerHTML = stages.map((stage, index) => `
    <article class="stage ${stage.state}">
      <h3>${index + 1}. ${stage.title}</h3>
      <p>${stage.text}</p>
    </article>
  `).join("");
}

function renderTimeline() {
  const target = document.querySelector("#timelineList");
  target.innerHTML = timeline.map((event) => `
    <article class="event">
      <time>${event.date}</time>
      <div>
        <h3>${event.title}</h3>
        <p>${event.text}</p>
      </div>
      <span class="badge ${event.pending ? "pending" : ""}">${event.badge}</span>
    </article>
  `).join("");
}

function renderForecasts() {
  const target = document.querySelector("#forecastGrid");
  target.innerHTML = forecasts.map((item) => `
    <article class="forecast-card">
      <span class="forecast-step">${item.step}</span>
      <span class="forecast-status">${item.status}</span>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join("");
}

function renderProcessFlow() {
  const target = document.querySelector("#processFlow");
  target.innerHTML = processSteps.map((step, index) => `
    <article class="process-step ${step.status}">
      <div class="process-index">${index + 1}</div>
      <span class="process-date">${step.date}</span>
      <h3>${step.title}</h3>
      <p>${step.text}</p>
    </article>
  `).join("");
}

function renderProjectMap(selectedId = "core") {
  const map = document.querySelector("#projectMap");
  const detail = document.querySelector("#mapDetail");
  const selected = mapAreas.find((area) => area.id === selectedId) || mapAreas[0];

  map.innerHTML = `
    <div class="map-river" aria-hidden="true"></div>
    <div class="map-road main-road" aria-hidden="true"></div>
    <div class="map-road branch-road" aria-hidden="true"></div>
    <div class="map-zone zone-core" aria-hidden="true">科三示意範圍</div>
    <div class="map-zone zone-city" aria-hidden="true">新竹生活圈</div>
    ${mapAreas.map((area) => `
      <button class="map-marker ${area.id === selected.id ? "active" : ""}" style="left:${area.x}%; top:${area.y}%;" data-map-id="${area.id}" aria-label="${area.label}">
        <span>${area.label}</span>
      </button>
    `).join("")}
  `;

  detail.innerHTML = `
    <span class="map-type">${selected.type}</span>
    <h3>${selected.title}</h3>
    <p>${selected.text}</p>
    <strong>${selected.note}</strong>
  `;

  map.querySelectorAll(".map-marker").forEach((button) => {
    button.addEventListener("click", () => renderProjectMap(button.dataset.mapId));
  });
}

function renderWatchlist() {
  const target = document.querySelector("#watchlistGrid");
  target.innerHTML = watchlist.map((item) => `
    <article class="watch-card">
      <span class="watch-status">${item.status}</span>
      <h3>${item.title}</h3>
      <time>${item.date}</time>
      <p>${item.text}</p>
    </article>
  `).join("");
}

function renderLandUse() {
  const target = document.querySelector("#landUseChart");
  target.innerHTML = landUse.map((item) => {
    const width = Math.round((item.value / item.max) * 100);
    const km2 = (item.value / 100).toFixed(2);
    return `
      <div class="bar-row">
        <span class="bar-label">${item.label}</span>
        <span class="bar-track" aria-hidden="true"><span class="bar-fill" style="width:${width}%"></span></span>
        <span class="bar-value">${item.value} 公頃<br><small>約 ${km2} 平方公里</small></span>
      </div>
    `;
  }).join("");
}

function getRecordYear(record) {
  const match = record.date.match(/^(\d{3})/);
  return match ? match[1] : "其他";
}

function recordSortValue(record) {
  const match = record.date.match(/^(\d{3})\.(\d{2})\.(\d{2})/);
  if (!match) {
    const year = Number(getRecordYear(record)) || 0;
    return year * 10000;
  }
  return Number(match[1]) * 10000 + Number(match[2]) * 100 + Number(match[3]);
}

function setupRecordFilters() {
  const yearFilter = document.querySelector("#yearFilter");
  const typeFilter = document.querySelector("#typeFilter");
  const years = [...new Set(records.map(getRecordYear))].sort((a, b) => b.localeCompare(a, "zh-Hant"));
  const types = [...new Set(records.map((record) => record.type))].sort((a, b) => a.localeCompare(b, "zh-Hant"));

  yearFilter.innerHTML = `
    <option value="all">全部</option>
    ${years.map((year) => `<option value="${year}">${year} 年</option>`).join("")}
  `;

  typeFilter.innerHTML = `
    <option value="all">全部</option>
    ${types.map((type) => `<option value="${type}">${type}</option>`).join("")}
  `;
}

function getFilteredRecords() {
  const category = document.querySelector("#recordFilter").value;
  const year = document.querySelector("#yearFilter").value;
  const type = document.querySelector("#typeFilter").value;
  const signal = document.querySelector("#signalFilter").value;
  const latestOnly = document.querySelector("#latestOnly").checked;
  const keyword = document.querySelector("#recordSearch").value.trim().toLowerCase();
  const latestYear = Math.max(...records.map((record) => Number(getRecordYear(record))).filter(Boolean)).toString();

  return records.filter((record) => {
    const categoryMatched = category === "all" || record.category === category;
    const yearMatched = year === "all" || getRecordYear(record) === year;
    const typeMatched = type === "all" || record.type === type;
    const signalMatched = signal === "all" || record.risk === signal;
    const latestMatched = !latestOnly || getRecordYear(record) === latestYear;
    const haystack = `${record.date} ${record.title} ${record.text} ${record.type}`.toLowerCase();
    const keywordMatched = !keyword || haystack.includes(keyword);
    return categoryMatched && yearMatched && typeMatched && signalMatched && latestMatched && keywordMatched;
  }).sort((a, b) => recordSortValue(b) - recordSortValue(a));
}

function renderRecords() {
  const target = document.querySelector("#recordsList");
  const count = document.querySelector("#recordCount");
  const filtered = getFilteredRecords();
  count.textContent = `共找到 ${filtered.length} 筆官方公開資料`;
  target.innerHTML = filtered.length ? filtered.map((record) => `
    <article class="record ${record.recent ? "recent-record" : ""}">
      <div class="record-top">
        <time>${record.date}</time>
        <span class="tag ${record.risk}">${record.recent ? "最近更新 / " : ""}${riskLabel(record.risk)} / ${credibilityLabel(record.credibility)} / ${record.type}</span>
      </div>
      <h3>${record.title}</h3>
      <p>${record.text}</p>
      <a class="official-link" href="${record.url}" target="_blank" rel="noopener">開啟官方資料</a>
    </article>
  `).join("") : `
    <article class="record empty-record">
      <h3>沒有符合的文件</h3>
      <p>可改用較短關鍵字，例如「內政部」、「第6次」、「大會」、「聽證」、「公益性」。</p>
    </article>
  `;
}

function renderFaqs() {
  const target = document.querySelector("#faqList");
  target.innerHTML = faqs.map((item) => `
    <details class="faq-item">
      <summary>${item.question}</summary>
      <p>${item.answer}</p>
    </details>
  `).join("");
}

function renderSources() {
  const target = document.querySelector("#sourceList");
  target.innerHTML = sources.map((source) => `
    <article class="source-card">
      <h3>${source.title}</h3>
      <p>${source.text}</p>
      <a class="official-link" href="${source.url}" target="_blank" rel="noopener">查看來源</a>
    </article>
  `).join("");
}

function renderChangelog() {
  const target = document.querySelector("#changelogList");
  target.innerHTML = changelog.map((item) => `
    <article class="change-item">
      <time>${item.date}</time>
      <div>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </div>
    </article>
  `).join("");
}

function bindUi() {
  const menuToggle = document.querySelector("#menuToggle");
  const siteNav = document.querySelector("#siteNav");

  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelector("#recordFilter").addEventListener("change", renderRecords);
  document.querySelector("#recordSearch").addEventListener("input", renderRecords);
  document.querySelector("#yearFilter").addEventListener("change", renderRecords);
  document.querySelector("#typeFilter").addEventListener("change", renderRecords);
  document.querySelector("#signalFilter").addEventListener("change", renderRecords);
  document.querySelector("#latestOnly").addEventListener("change", renderRecords);
  document.querySelector("#clearFilters").addEventListener("click", () => {
    document.querySelector("#recordSearch").value = "";
    document.querySelector("#recordFilter").value = "all";
    document.querySelector("#yearFilter").value = "all";
    document.querySelector("#typeFilter").value = "all";
    document.querySelector("#signalFilter").value = "all";
    document.querySelector("#latestOnly").checked = true;
    renderRecords();
  });

  document.querySelector("#backToTop").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  setupActiveNavigation();
}

function setupActiveNavigation() {
  const navLinks = [...document.querySelectorAll(".nav-links a, .floating-nav a")];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const activeId = `#${visible.target.id}`;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === activeId);
    });
  }, {
    rootMargin: "-25% 0px -60% 0px",
    threshold: [0.08, 0.2, 0.4]
  });

  sections.forEach((section) => observer.observe(section));
}

function renderAll() {
  renderUpdateBanner();
  renderStatusSummary();
  renderLatestUpdates();
  renderBriefCards();
  renderTopicGuides();
  renderRisks();
  renderStages();
  renderTimeline();
  renderForecasts();
  renderProcessFlow();
  renderProjectMap();
  renderWatchlist();
  renderLandUse();
  setupRecordFilters();
  renderRecords();
  renderFaqs();
  renderSources();
  renderChangelog();
}

async function init() {
  try {
    await loadSiteData();
    renderAll();
    bindUi();
  } catch (error) {
    console.error(error);
    document.body.insertAdjacentHTML("afterbegin", `
      <div class="data-error">
        <strong>資料載入失敗</strong>
        <span>請確認 GitHub Pages 已上傳 <code>data.json</code>，並重新整理頁面。若剛更新網站，請等待 Pages 部署完成。</span>
      </div>
    `);
  }
}

init();

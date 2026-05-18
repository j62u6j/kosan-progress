# 新竹科學園區三期（科三）進度追蹤

這是一個純靜態的進度追蹤網站，整理新竹縣政府與相關官方公開資料，呈現科三計畫目前狀態、風險燈號、下一步流程、政府公開文件搜尋與土地使用視覺化。

## 本機瀏覽

直接開啟 `index.html`，或用靜態伺服器啟動：

```powershell
python -m http.server 49156 --bind 127.0.0.1
```

然後瀏覽：

```text
http://127.0.0.1:49156/index.html
```

## GitHub Pages

此專案不需要建置流程。將 `index.html`、`styles.css`、`app.js`、`.nojekyll` 放在 repository 根目錄後，到 GitHub repository 的 Settings > Pages，選擇 `main` branch 和 root folder 即可發布。

## 資料更新

主要資料集中在 `data.json`。若官方公告或會議紀錄更新，請同步更新對應資料陣列，例如 `timeline`、`records`、`latestUpdates`、`watchlist`、`sources` 與 `changelog`。

`app.js` 只負責載入 `data.json` 與渲染頁面，日常更新資料時通常不需要修改程式邏輯。

## 官方資料每日監測

監測腳本位於 `scripts/kosan-monitor.js`，會檢查科三相關官方來源並產生 `monitor-report.md`。

GitHub Actions workflow 位於 `.github/workflows/kosan-monitor.yml`：

- 每天台灣時間約 23:45 自動執行一次。
- 也可以在 GitHub > Actions > Kosan official source monitor > Run workflow 手動執行。
- 每次執行後會上傳報告 artifact，並將 `monitor-report.md` commit 回 repository。
- 若報告顯示「可能有更新，需要人工確認」，請先人工確認官方連結，再更新 `data.json` 與網站內容。

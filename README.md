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

主要資料集中在 `app.js`。若官方公告或會議紀錄更新，請同步更新 `stages`、`riskSignals`、`forecasts`、`timeline`、`records` 與 `sources`。

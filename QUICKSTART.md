# ⚡ 快速入門指南

## � 前置要求

確保你已安裝：
- Node.js (v14 或更高版本) - [下載](https://nodejs.org/)
- npm (NodeJS 會自動安裝)

## 🚀 快速啟動（3 步）

### 步驟 1：安裝依賴
在項目文件夾中打開終端，執行：
```bash
npm install
```

### 步驟 2：啟動伺服器
```bash
npm start
```

### 步驟 3：打開瀏覽器
訪問：**http://127.0.0.1:3000**

✅ 完成！應用已啟動

## 📖 使用步驟

1. **加入圖片**
   - 一次選擇多個 JPG/PNG
   - 或拖放多張圖片到上傳框

2. **選擇轉換模式**
   - Normal：標準向量轉換
   - 3D Print (Optimized)：針對 3D 打印/激光切割優化

3. **選擇轉換範圍（可選）**
   - 在圖片旁點擊「Select area」
   - 用滑鼠或觸控在圖片上畫出封閉外框；框內會轉換，框外會忽略
   - 沒有畫外框就會轉換整張圖片

4. **排隊轉換**
   - 點擊「Convert Queue」
   - 圖片會依次處理；某張失敗不會中斷其餘項目

5. **下載**
   - 在完成的項目旁點擊「Download SVG」
   - SVG 背景透明，保留黑色向量圖形

## 🎯 快速提示

| 功能 | 操作 |
|------|------|
| **加入圖片** | 拖放或多選 JPG/PNG |
| **轉換** | 點擊「Convert Queue」 |
| **下載** | 在完成的項目旁點擊「Download SVG」 |
| **清空** | 點擊「Clear Queue」 |
| **停止服務** | 終端按 Ctrl+C |

## 📋 支持的格式

- **輸入格式**：JPG、PNG
- **每個文件最大**：50MB
- **輸出格式**：SVG（透明背景、黑色圖形）

## 🔒 私隱

- 伺服器只監聽本機 `127.0.0.1`，其他網絡裝置無法連線。
- 圖片只會傳送到同一部電腦上的轉換程式，不會上傳到第三方服務。
- 上載及中間檔案會暫存在本機 `uploads` 資料夾，轉換完成後清理。

## ⚙️ 自訂設置

### 更改埠號
如果 3000 埠被佔用，在環境變量中設置 PORT：

```bash
# Windows (PowerShell)
$env:PORT=3001; npm start

# Windows (Command Prompt)
set PORT=3001 && npm start

# macOS/Linux
PORT=3001 npm start
```

## 👨‍💻 其他命令

```bash
# 啟動伺服器
npm start

# 開發模式（自動重載）
npm run dev
```

或用命令行：
```bash
set PORT=3001 && "C:\Program Files\nodejs\node.exe" server.js
```

## 🆘 常見問題

**Q：卡住不動？**
- A：點 Ctrl+C 停止，重新運行

**Q：轉換失敗？**
- A：確保圖片有效，嘗試縮小文件

**Q：找不到 node？**
- A：檢查 Node.js 是否已安裝
- 運行：`"C:\Program Files\nodejs\node.exe" --version`

**Q：需要安裝依賴？**
- A：運行：`npm install`（只需第一次）

## 📝 快捷方式（可選）

創建桌面快捷方式直接啟動：

### Windows - 創建快捷方式
1. 右擊 `start.bat`
2. 選「發送到」→「桌面（快捷方式）」
3. 以後直接雙擊桌面快捷方式啟動

## 💡 開發模式（自動重載）

編輯文件自動重載（需安裝 nodemon）：

```bash
npm install --save-dev nodemon
npm run dev
```

---

**所有操作完成後記得停止服務**：在終端按 `Ctrl+C`

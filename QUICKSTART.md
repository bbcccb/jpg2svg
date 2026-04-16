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
訪問：**http://localhost:3000**

✅ 完成！應用已啟動

## 📖 使用步驟

1. **上傳圖片**
   - 拖放 JPG/PNG 到上傳框
   - 或點擊「Browse Files」選擇

2. **選擇轉換模式**
   - Normal：標準向量轉換
   - 3D Print (Optimized)：針對 3D 打印/激光切割優化

3. **轉換**
   - 點擊「Convert to SVG」按鈕
   - 等待轉換完成

4. **下載**
   - 點擊「Download SVG」
   - SVG 文件將自動下載

## 🎯 快速提示

| 功能 | 操作 |
|------|------|
| **上傳** | 拖放或點擊選擇 |
| **轉換** | 點擊「Convert to SVG」 |
| **下載** | 點擊「Download SVG」 |
| **重新開始** | 點擊「Convert Another」 |
| **停止服務** | 終端按 Ctrl+C |

## 📋 支持的格式

- **輸入格式**：JPG、PNG
- **最大文件**：50MB
- **輸出格式**：SVG（向量圖）

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

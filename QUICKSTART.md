# ⚡ 快速入門指南

## 🚀 快速啟動（3 步）

### 方法 1：雙擊 start.bat（最簡單）
1. 進入項目文件夾：`c:\Users\chris\jpg-svg`
2. 雙擊 **start.bat** 文件
3. 等待出現 "JPG to SVG Converter running at http://localhost:3000"

### 方法 2：使用命令行
打開終端，執行：
```bash
cd c:\Users\chris\jpg-svg
"C:\Program Files\nodejs\node.exe" server.js
```

## 📖 使用步驟

1. **啟動應用**
   - 雙擊 `start.bat` 或運行上面的命令

2. **打開瀏覽器**
   - 訪問：http://localhost:3000

3. **上傳圖片**
   - 拖放 JPG/PNG 到上傳框
   - 或點擊「Browse Files」選擇

4. **轉換**
   - 點擊「Convert to SVG」按鈕
   - 等待轉換完成

5. **下載**
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

## 🎯 使用場景

### 1️⃣ **一般用戶** - 簡單轉換
1. 雙擊 `start.bat` 啟動
2. 上傳圖片 → Normal 模式 → 下載 SVG
3. 在 Inkscape 等向量編輯器中使用

### 2️⃣ **3D 打印用戶** - 激光切割/雕刻
1. 雙擊 `start.bat` 啟動
2. 上傳圖片 → 3D Print 模式 → 調整筆劃寬度
3. 下載 SVG → 在 LightBurn/K40 軟件中使用

### 3️⃣ **Bambu Studio 用戶** - 浮雕打印
1. 雙擊 `start.bat` 啟動
2. 上傳圖片 → 3D Print 模式 → 下載 SVG
3. 用 Fusion 360 轉換 SVG → STL
4. 在 Bambu Studio 中導入 STL 進行浮雕
📖 詳見：[FUSION360_CONVERSION_GUIDE.md](FUSION360_CONVERSION_GUIDE.md)

## 📋 支持的格式

- **輸入格式**：JPG、PNG
- **最大文件**：50MB
- **輸出格式**：SVG（向量圖）

## ⚙️ 設置不同端口

如果 3000 端口被佔用，編輯 `start.bat`：

```bat
@echo off
set PORT=3001
"C:\Program Files\nodejs\node.exe" server.js
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

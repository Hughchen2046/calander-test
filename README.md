# 日曆預約系統

一個使用 Vite + HTML + Bootstrap 建立的日曆預約系統，具備完整的預約管理功能。

## 功能特色

### 📅 日曆顯示
- 清晰的月曆介面，顯示當月所有日期
- 月份導航功能，可前後切換月份
- 響應式設計，支援桌面和手機裝置

### ⏰ 時段預約
- 每日提供三個時段：
  - 早上 10:00
  - 下午 14:00
  - 晚上 18:00
- 每個時段限制 1 位名額
- 即時顯示時段可用性狀態

### 🎯 預約功能
- 點擊日期選擇預約日期
- 選擇可用時段
- 一鍵完成預約
- 預約後即時更新狀態

### ⚙️ 管理功能
- **開放預訂天數設定**：可設定最多提前多少天開放預約（預設30天）
- **關閉日期管理**：可設定特定日期為不可預約
- **已關閉日期列表**：顯示所有已關閉的日期，可隨時移除

## 技術架構

- **前端框架**：Vite + Vanilla JavaScript
- **UI 框架**：Bootstrap 5
- **樣式**：自定義 CSS + Bootstrap
- **響應式設計**：支援桌面和手機裝置

## 安裝與使用

### 安裝依賴
```bash
npm install
```

### 啟動開發伺服器
```bash
npm run dev
```

### 建置生產版本
```bash
npm run build
```

## 檔案結構

```
calendar-booking-system/
├── index.html          # 主要 HTML 檔案
├── src/
│   ├── main.js         # 主要 JavaScript 邏輯
│   └── style.css       # 自定義樣式
├── package.json        # 專案設定
└── README.md          # 專案說明
```

## 主要類別

### CalendarBookingSystem
主要的日曆預約系統類別，包含以下功能：

- `renderCalendar()` - 渲染日曆介面
- `selectDate(date)` - 選擇日期
- `selectTimeSlot(card)` - 選擇時段
- `makeBooking()` - 執行預約
- `addClosedDate()` - 新增關閉日期
- `isDateAvailable(date)` - 檢查日期是否可用

## 使用說明

1. **選擇日期**：點擊日曆上的可用日期（藍色邊框）
2. **選擇時段**：在時段選擇區域點擊想要的時段
3. **確認預約**：點擊「立即預約」按鈕完成預約
4. **管理設定**：點擊「管理設定」按鈕可以：
   - 調整開放預訂天數
   - 新增或移除關閉日期

## 瀏覽器支援

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 授權

MIT License


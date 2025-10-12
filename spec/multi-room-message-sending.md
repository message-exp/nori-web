# 多房間訊息傳送功能規格

## 概述

在 `/dms` 介面中查看合併聊天室時，讓使用者能夠選擇要將訊息傳送到哪個房間。目前訊息只會傳送到 `roomConfigs` 陣列中的第一個房間。

## 目前狀況

- **位置**: `app/components/room-chat/merged-room-chat.tsx:210-213`
- **問題**: 訊息永遠只傳送到 `roomConfigs[0].roomId`
- **影響**: 使用者無法選擇要將訊息傳送到哪個平台（當聯絡人有多個平台連結時）

## 使用者故事

### 主要情境

作為一個查看擁有多個平台連結（例如 Telegram、Discord、Matrix）的聯絡人的使用者，我希望能選擇要將訊息傳送到哪個平台，這樣我才能控制訊息的傳送目標。

### 邊界情況

1. 聯絡人只有一個平台連結 → 不需要選擇器（維持目前行為）
2. 聯絡人沒有平台連結 → 顯示適當訊息（已處理）
3. 傳送失敗 → 顯示錯誤訊息並提供重試選項

## 解決方案設計

### UI 設計：下拉選單選擇器（單選）

**位置**: 訊息輸入區域，在 `MessageInput` 元件內

**設計草圖**:

```text
┌─────────────────────────────────────────────────┐
│ [Telegram ▼] [Type a message...]          [Send]│
└─────────────────────────────────────────────────┘
```

**選單展開時**:

```text
┌─────────────────────────────────────────────────┐
│ [Telegram ▼] [Type a message...]          [Send]│
│ ┌──────────────┐                                │
│ │ ● Telegram   │                                │
│ │ ○ Discord    │                                │
│ │ ○ Matrix     │                                │
│ └──────────────┘                                │
└─────────────────────────────────────────────────┘
```

**特色**:

- 使用現有的 `BridgeIcon` 元件顯示平台圖示
- 參考 `message.tsx:40-48` 的圖示樣式設計
- 平台圖示搭配圓形背景和顏色提示
- 預設選擇第一個平台
- 記住使用者最後的選擇（per contact，使用 localStorage）

### 現有設計資源

**BridgeIcon 元件** (`app/components/ui/bridge-icon.tsx`):

- 已支援 Telegram、Discord、Matrix 的圖示
- 使用 FontAwesome 品牌圖示（Telegram、Discord）
- 使用 Lucide React 的 MessageCircle（Matrix）
- 可自訂 className 調整大小和顏色

**參考樣式** (`message.tsx:40-48`):

```tsx
<div className="absolute -bottom-1 -right-1 size-5 bg-gray-800 rounded-full flex items-center justify-center ring-1 ring-gray-900">
  <BridgeIcon
    platform={platform}
    className="size-3 text-white"
    showMatrix={true}
  />
</div>
```

## 技術設計

### 元件變更

#### 1. MessageInput 元件強化

**目前**: `app/components/room-chat/message-input.tsx`

**變更內容**:

- 接受 `roomConfigs: RoomConfig[]` 而非單一 `roomId`
- 新增房間選擇器 UI（使用 shadcn/ui 的 Select 元件）
- 新增狀態管理選擇的房間
- 使用 localStorage 記住每個聯絡人的最後選擇

**新的 Props**:

```typescript
interface RoomConfig {
  roomId: string;
  platform: PlatformEnum;
}

interface MessageInputProps {
  roomConfigs: RoomConfig[]; // 取代原本的 roomId: string
  contactId?: string; // 用於 localStorage key
}
```

**內部狀態**:

```typescript
const [selectedRoomId, setSelectedRoomId] = useState<string>(() => {
  // 從 localStorage 讀取上次選擇，或預設第一個
  if (contactId) {
    const saved = localStorage.getItem(`message_target_room_${contactId}`);
    if (saved && roomConfigs.some((rc) => rc.roomId === saved)) {
      return saved;
    }
  }
  return roomConfigs[0]?.roomId || "";
});

// 當選擇改變時，存到 localStorage
useEffect(() => {
  if (contactId && selectedRoomId) {
    localStorage.setItem(`message_target_room_${contactId}`, selectedRoomId);
  }
}, [contactId, selectedRoomId]);
```

#### 2. MergedRoomChat 元件更新

**目前**: `app/components/room-chat/merged-room-chat.tsx:210-213`

**變更內容**:

- 將 `roomConfigs` 傳遞給 `MessageInput`
- 傳遞 `contactName` 的 hash 或 unique ID 作為 `contactId`（如果有的話）

**修改後的程式碼**:

```tsx
{
  /* Message input */
}
<div className="border-t p-4">
  {roomConfigs.length > 0 && (
    <MessageInput
      roomConfigs={roomConfigs}
      contactId={contactId} // 傳遞 contact UUID
    />
  )}
</div>;
```

**Props 更新**:

```typescript
interface MergedRoomChatProps {
  readonly roomConfigs: RoomConfig[];
  readonly contactName: string;
  readonly contactId?: string; // 新增：用於 localStorage key
}
```

#### 3. 房間選擇器 UI 元件

**實作方式**: 直接在 `MessageInput` 內實作（不需要獨立元件）

**使用 shadcn/ui 的 Select 元件**:

```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { BridgeIcon } from "~/components/ui/bridge-icon";
import { getPlatformBgColor, getPlatformDisplayName } from "~/lib/platform-styles";

// 在 MessageInput 元件內部
{roomConfigs.length > 1 && (
  <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
    <SelectTrigger className="w-[140px] mb-2">
      <SelectValue>
        <div className="flex items-center gap-2">
          <div className={`size-5 ${getPlatformBgColor(selectedConfig.platform)} rounded-full flex items-center justify-center`}>
            <BridgeIcon
              platform={selectedConfig.platform}
              className="size-3 text-white"
              showMatrix={true}
            />
          </div>
          <span>{getPlatformDisplayName(selectedConfig.platform)}</span>
        </div>
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      {roomConfigs.map((config) => (
        <SelectItem key={config.roomId} value={config.roomId}>
          <div className="flex items-center gap-2">
            <div className={`size-5 ${getPlatformBgColor(config.platform)} rounded-full flex items-center justify-center`}>
              <BridgeIcon
                platform={config.platform}
                className="size-3 text-white"
                showMatrix={true}
              />
            </div>
            <span>{getPlatformDisplayName(config.platform)}</span>
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)}
```

**重點**:

- 只有在 `roomConfigs.length > 1` 時才顯示選擇器
- 使用 `platform-styles.ts` 的 helper functions 取得顏色和顯示名稱
- 平台圖示使用對應的品牌顏色背景

### 資料流程

```text
使用者輸入訊息
  ↓
使用者從下拉選單選擇目標房間
  ↓
選擇被存到 state 和 localStorage
  ↓
使用者點擊傳送
  ↓
MessageInput.onSubmit() 被呼叫
  ↓
sendTextMessage(selectedRoomId, text)
  ↓
顯示成功/錯誤訊息給使用者
```

### 錯誤處理

1. **傳送失敗**: 顯示錯誤訊息與重試按鈕
2. **網路問題**: 處理 timeout 和重試
3. **使用者回饋**: 使用 toast 通知成功/失敗

**錯誤顯示範例**:

```text
✗ 傳送失敗: Network error
[重試]
```

### 狀態持久化

**使用 localStorage**:

- 每個聯絡人記住上次選擇的房間
- Key 格式: `message_target_room_${contactId}`
- 驗證存儲的 roomId 仍然存在於 roomConfigs 中
- 如果不存在，fallback 到第一個房間

## 實作計劃

### Phase 1: 核心功能實作

1. **建立平台樣式常數檔案**

   - 建立 `app/lib/platform-styles.ts`
   - 定義 `PLATFORM_STYLES` 和 helper functions
   - 匯出各平台顏色和顯示名稱

2. **更新 MessageInput 元件**

   - 修改 Props 接受 `roomConfigs: RoomConfig[]` 和 `contactId?: string`
   - 加入選擇房間的 state
   - 實作房間選擇器 UI（使用 shadcn/ui Select）
   - 加入平台圖示和顏色顯示
   - 加入 localStorage 讀取/寫入邏輯（保留但暫不啟用）

3. **更新 MergedRoomChat 元件**

   - 修改 Props 加入 `contactId?: string`
   - 將 `roomConfigs` 和 `contactId` 傳遞給 `MessageInput`
   - 確保單一房間時選擇器會隱藏

4. **更新路由層**
   - 在 `_home.dms.$type.$id.tsx` 中
   - 將 `currentItem.data.id` 傳遞給 `MergedRoomChat` 作為 `contactId`
   - 同時在 mobile 和 desktop layout 都要更新

### Phase 2: 測試與優化

1. **測試基本功能**

   - 單一房間：選擇器應隱藏
   - 多個房間：選擇器正常顯示
   - 切換平台：訊息傳送到正確的房間
   - 平台顏色：顯示正確

2. **測試各種情境**

   - 2 個平台的聯絡人
   - 3 個平台的聯絡人
   - 傳送訊息成功
   - 傳送訊息失敗（觀察既有錯誤處理）

3. **UI/UX 調整**

   - 檢查行動裝置版面
   - 檢查桌面版面
   - 確認選擇器位置和大小適當
   - 確認顏色對比度足夠

4. **程式碼品質**

   - 執行 TypeScript 檢查
   - 執行 Lint
   - 清理 console.log
   - 加入必要的註解

5. **修正發現的問題**
   - 根據測試結果調整
   - 確保沒有 regression

## 設計決策

### 已確認的需求

1. ✅ **選擇模式**: 單選（一次只能選一個平台）
2. ✅ **單一房間處理**: 當只有一個房間時不顯示選擇器
3. ✅ **平台圖示**: 使用現有的 `BridgeIcon` 元件和樣式
4. ✅ **鍵盤快捷鍵**: 不需要（優先完成核心功能）
5. ✅ **開發方式**: 分階段實作，先核心功能後優化測試

### 細節確認

#### 1. 預設選擇

- **第一次使用**: 預設選擇第一個平台（`roomConfigs[0]`）
- **記憶功能**:
  - 保留 localStorage 讀取/寫入的邏輯程式碼
  - 但目前不實際儲存，為未來 contact-server 的記憶功能預留介面
  - 未來可以改為從 API 讀取使用者偏好設定

#### 2. ContactId 來源

- **使用 Contact UUID**: 從 `ContactCard.id`（UUID string）取得
- **實作方式**:
  - 在 `_home.dms.$type.$id.tsx` 中，`currentItem.data.id` 就是 UUID
  - 需要將 `contactId` 從路由層傳遞到 `MergedRoomChat`
  - 再從 `MergedRoomChat` 傳遞到 `MessageInput`

**程式碼位置參考**: `app/routes/_home.dms.$type.$id.tsx:61`

```typescript
if (type === "contact") {
  const contact = contactCards.find((c) => c.id === id);
  // contact.id 就是 UUID
}
```

#### 3. 選擇器位置

- **位置**: 放在輸入框上方靠左
- **理由**:
  - 視覺上更像是附加在輸入框上的額外選項
  - 不會壓縮輸入框的寬度
  - 在行動裝置上有更好的觸控體驗

**Layout 示意**:

```text
┌─────────────────────────────────────────────┐
│ [Telegram ▼]                                │
│ ┌─────────────────────────────────────────┐ │
│ │ [Type a message...]              [Send] │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

#### 4. 選擇器寬度

- **寬度**: 固定 140px
- **理由**: 避免因平台名稱長度不同而造成版面跳動

#### 5. 錯誤處理

- **方針**: 不要對傳送邏輯做太多干涉，專注在顯示層的 UX 改進
- **實作**:
  - 如果傳送失敗，讓既有的錯誤處理機制處理
  - 僅在 UI 層面提供清楚的視覺回饋
  - 不實作自動重試或複雜的錯誤恢復邏輯

#### 6. 平台顏色

- **使用平台專屬顏色**: 是，為不同平台設定不同背景色
- **顏色規範**:
  - Telegram: `bg-[#0088cc]`（官方品牌藍）
  - Discord: `bg-[#5865F2]`（官方品牌紫）
  - Matrix: `bg-gray-900`（深灰/黑）
- **實作方式**: 建立統一的平台樣式常數檔案

**新增檔案**: `app/lib/platform-styles.ts`

```typescript
import { PlatformEnum } from "~/lib/contacts-server-api/types";

export interface PlatformStyle {
  bgColor: string; // Tailwind class
  textColor: string; // Tailwind class
  hexColor: string; // Hex value
  displayName: string; // Display name
}

export const PLATFORM_STYLES: Record<PlatformEnum, PlatformStyle> = {
  [PlatformEnum.TELEGRAM]: {
    bgColor: "bg-[#0088cc]",
    textColor: "text-white",
    hexColor: "#0088cc",
    displayName: "Telegram",
  },
  [PlatformEnum.DISCORD]: {
    bgColor: "bg-[#5865F2]",
    textColor: "text-white",
    hexColor: "#5865F2",
    displayName: "Discord",
  },
  [PlatformEnum.MATRIX]: {
    bgColor: "bg-gray-900",
    textColor: "text-white",
    hexColor: "#1a1a1a",
    displayName: "Matrix",
  },
};

// Helper functions
export function getPlatformBgColor(platform: PlatformEnum): string;
export function getPlatformTextColor(platform: PlatformEnum): string;
export function getPlatformHexColor(platform: PlatformEnum): string;
export function getPlatformDisplayName(platform: PlatformEnum): string;
```

## 測試清單

- [ ] 傳送訊息到單一房間（既有行為）
- [ ] 切換選擇器並傳送到不同房間
- [ ] 處理傳送失敗
- [ ] 驗證單一房間時選擇器被隱藏
- [ ] 驗證 2 個房間時 UI 正確
- [ ] 驗證 3+ 個房間時 UI 正確
- [ ] 測試 localStorage 持久化
- [ ] 測試錯誤訊息
- [ ] 測試行動裝置和桌面版面
- [ ] 測試無障礙功能（鍵盤導航）

## 成功指標

- 使用者可以在傳送前清楚看到目標房間
- 視覺回饋清楚顯示將傳送到哪個房間
- 傳送失敗時有適當的錯誤處理
- 使用者對功能感到滿意，沒有混淆
- 沒有意外傳送到錯誤房間的情況

## 未來增強

1. **傳送歷史**: 在聊天記錄中顯示每則訊息傳送到哪個平台
2. **智慧預設**: 根據上下文建議應該傳送到哪個平台
3. **回覆上下文**: 回覆訊息時，自動選擇該訊息的平台
4. **批次傳送**: 按住 Shift 或 Ctrl 時可以多選平台
5. **平台狀態指示**: 顯示哪些平台目前離線或有問題

---

**文件狀態**: 待審核
**最後更新**: 2025-10-12
**作者**: 克蕾兒
**審核者**: 待定

# 一個React的Demo

目前還沒有什麼實質功能，與其說demo更像是prototype，不過盡可能做出來邏輯實現的地方可以在開發sdk時放進去測試。

## 安裝

```bash
npm install
```

## 執行

```bash
npm start
```

然後就可以到`localhost:3000`查看目前狀態

## 設定預設頁面

可以到`src/context/PageContext.js`裡面切換預設頁面，考慮之後更新成讀取env?
每個頁面與對應名稱可以到`src/components/PageRouter.js`中查看

(別問我為什麼要這樣設計，問就是gpt想的)

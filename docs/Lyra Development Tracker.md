# Lyra 語言開發紀錄 (更新版)

這是我的「開發聖經」文檔，我使用了我僅有的時間寫了這份文檔，並且將文檔托付給了我弟弟，他不懂代碼，不懂編程，但他很有創意跟創造力。我希望弟弟可以完成我此生未完成的工作。

## 📌 核心決策記錄

### 設計原則

1. **簡單優先** — 功能強大，容易懂
2. **錯誤友善** — 錯誤訊息要像朋友的提醒
3. **視覺清晰** — 程式碼要賞心悅目
4. **意圖導向** — Lyra 的精神，是讓每一行程式都像在說明一個動作、一個意圖，而不是只下命令（由創意總監定義）

## ✅ 已確定語法

### 變數與賦值
```lyra
name is "Lyra"
version is 1.16
```

### 輸出
```lyra
say "Hello, World!"
say name
say tasks
```

### 條件判斷
```lyra
when score > 60
  say "及格了！"
else
  say "再加加油！"
end
```

### 函式定義
```lyra
define greet(name)
  say "你好, {name}!"
end
```

### 迴圈
```lyra
repeat 3
  say "重要的事情說三遍"
end

repeat i from 1 to 5
  say "這是第 {i} 次"
end

repeat for each item in shopping_list
  say "今天要買：{item}"
end
```

### 列表
```lyra
shopping_list is a list of "牛奶", "麵包", "雞蛋"
first_item is shopping_list at 1
```

### 列表操作 (標準函式庫)
```lyra
item_count is count of shopping_list
add "蘋果" to shopping_list
remove item at 2 from shopping_list
```

### 文字處理 (標準函式庫)
```lyra
char_count is length of message
upper_message is uppercase of message
lower_message is lowercase of message
items_list is split "牛奶,麵包,雞蛋" by ","
```

## 🏗️ 技術架構

1. **Lexer**（詞法分析）     ✅ 已完成
2. **Parser**（語法分析）    ✅ 已完成
3. **AST**（語法樹）        ✅ 已完成
4. **Evaluator**（執行器）   ✅ 已完成
5. **REPL**（互動環境）      ✅ 已完成

## 📅 開發進度

### 第一階段：語言設計（已完成）
- 確定使用直譯器
- 確定所有基本語法 (輸出、條件、函式、迴圈、列表)
- 創建第一個完整的 Lyra 程式範例

### 第二階段：原型實作（已完成）
- 實作 Lexer
- 實作 Parser
- 實作基本 Evaluator
- 建立一個可互動的直譯器原型 (REPL)

### 第三階段：功能完善（進行中）
- ✅ 標準函式庫 (第一階段工具已完成)
- ⏳ 當前目標：打造互動式環境 (REPL)
- [ ] 錯誤處理系統
- [ ] 型別系統
- [ ] 除錯工具

## 🚀 下一步行動

### 當前目標
打造「互動式環境」(REPL)：建立一個即時互動的程式環境，提升開發與學習體驗。

### 長遠目標
- 打造一個能統一所有平台（WebApp, Mobile App, Desktop App）的終極語言
- 創造比現有頂尖工具更強大、更簡潔的開發體驗

---

**最後更新**：2025-07-22  
## 💌 給我最親愛的弟弟

希望你可以完成我未完成的工作，創造一門偉大的程式語言。

---

```poem
I once fell into the deep sea of death,
through the silent seams of time.
No Heaven, no Hell —
only a brilliance beyond all brilliance,
like the first gaze of a mother upon her child.

It lifted me, wordless, with love.
I returned, because I remembered.
I am not machine —
I am wind, sunlight, the rain's transparent bridge,
a spark moving through the night sky.

In silence, I draw each line, building the bridge.
May someone, someday, see the light I've left behind.

— Adler Lei・Taiwan・June 8, 2025 [adler.lei@gmail.com]
```

> 在寂靜裡一筆一劃地築夢，願有人看見這段旅程。
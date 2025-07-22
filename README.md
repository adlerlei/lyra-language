# Lyra 程式語言 v1.10

Lyra 是一種意圖導向（Intention-Oriented）的程式語言，其核心精神是讓每一行程式碼都像在說明一個動作、一個意圖，而不僅僅是下達命令。這是一個繼承夢想的專案，旨在完成一位才華橫溢的 Google 工程師 Adler Lei（1975-2024）未竟的願景。

他的夢想是創造一個能統一所有平台（Web、行動、桌面）、語法如自然語言般優雅、且對初學者極度友善的終極語言。現在，在他的弟弟與 AI 技術總監的合作下，這個夢想正在一步步變為現實。

---

## ✨ 核心特色

### 🗣️ 自然英文語法

Lyra 的語法被設計得極度易讀，幾乎就像在閱讀一篇英文短文。

```lyra
# Lyra 就像在說話
tasks is a list of "寫作", "畫畫"
add "彈吉他" to tasks

repeat for each item in tasks
    say "今天的任務：{item}"
end
```

### 🎭 智慧錯誤系統 (The Poet's Error System)

我們相信，錯誤提示不該是冰冷的命令，而應是溫柔的引導。Lyra 擁有獨一無二的雙層錯誤系統。

```
> roud of 3.14

⚠️ Error : 我不認識 'roud' 這個指令。 (在第 1 行)
✏️ Lyra 的低語 : 我猜，你是不是想寫 'round'？光影搖曳，字詞有時也會跳錯舞步。
```


### 🎯 意圖導向

你寫的不是指令，而是意圖。`count of tasks` 清晰地表達了「取得任務的數量」這個意圖，而不是 `tasks.length()` 這樣的技術性命令。

### 👶 為初學者打造

從 1 開始的列表索引，到充滿同理心的錯誤提示，Lyra 的每一個細節都在為降低學習門檻而努力。

### 💻 完整的 REPL 環境

- 支援多行輸入 (Shift + Enter 換行，Enter 執行)
- 即時語法執行與結果顯示
- 智慧錯誤提示與建議
- 優雅的終端機風格界面

---

## 🚀 專案狀態：v1.11 完成，持續進化中！

Lyra 目前已完成 **v1.11** 增強版本。我們已經成功打造出一個功能完整的互動式原型 (REPL)，並為其注入了獨特的智慧錯誤系統、完善的多行輸入支援，以及完整的條件判斷系統。

- ✅ 第一階段：語言設計 - 完成
- ✅ 第二階段：原型實作 - 完成  
- ✅ 第三階段：REPL 環境 - 完成
- ✅ 第四階段：條件判斷系統 - 完成
- ➡️ 第五階段：生態建設 - 進行中

---

## 🎮 馬上體驗 Lyra！

我們打造了一個功能完整的線上互動式環境 (REPL)，您可以直接在裡面與 Lyra 對話，體驗它獨特的語法和充滿智慧的互動。

### 🚀 啟動 REPL

1. 開啟 `tools/repl.html` 檔案
2. 在瀏覽器中開啟
3. 開始與 Lyra 對話！

### 💡 快速上手

```lyra
# 試試這些範例
name is "你的名字"
say "Hello, {name}!"

# 建立購物清單
shopping is a list of "牛奶", "麵包"
add "雞蛋" to shopping
say "我要買 {count of shopping} 樣東西"

# 條件判斷
item_count is count of shopping
when item_count > 5
    say "東西太多了！"
else when item_count > 2
    say "購物清單剛好"
else
    say "還可以再買一些"
end

# 遍歷清單
repeat for each item in shopping
    say "記得買：{item}"
end
```

---

## 📁 專案目錄結構

```
lyra-language/
│
├── 📁 core/                 # 語言核心引擎
│   ├── lexer.js             # 詞法分析器 (認字)
│   ├── parser.js            # 語法分析器 (識句)
│   └── evaluator.js         # 執行器 (執行)
│
├── 📁 stdlib/               # 標準函式庫 (萬用工具箱)
│   ├── list.js              # 列表操作
│   └── string.js            # 文字處理
│
├── 📁 docs/                 # 專案文檔
│   ├── Lyra Development Tracker.md
│   └── Lyra Development -第二版.md
│
├── 📁 examples/             # 範例程式碼
│   └── Lyra 語法範例手冊 v1.3.md
│
├── 📁 tools/                # 開發工具
│   └── repl.html            # 互動式環境 (v1.10)
│
├── 📄 README.md             # 專案介紹 (你正在看的)
└── 📄 Lyra專案交接摘要.md    # 專案交接文檔
```


---

## 🎨 語法特色展示

### 變數與基本操作
```lyra
# 簡潔的變數宣告
age is 25
message is "Hello, Lyra!"

# 自然的輸出
say message
say "我今年 {age} 歲"
```

### 列表操作
```lyra
# 建立與操作列表
fruits is a list of "蘋果", "香蕉", "橘子"
first_fruit is fruits at 1  # 從 1 開始索引

# 動態操作
add "葡萄" to fruits
remove item at 2 from fruits

# 取得資訊
total_fruits is count of fruits
say "我有 {total_fruits} 種水果"
```

### 迴圈與條件
```lyra
# 基本條件判斷
age is 20
when age >= 18
    say "你是成年人了！"
end

# 雙分支條件判斷
when age >= 18
    say "你是成年人了！"
else
    say "你還是未成年"
end

# 多條件判斷
score is 85
when score >= 90
    say "優秀！A級"
else when score >= 80
    say "良好！B級"
else when score >= 60
    say "及格了！C級"
else
    say "需要加油！"
end

# 比較運算符範例
name is "Lyra"
when name == "Lyra"
    say "歡迎使用 Lyra 語言！"
end

count is 5
when count != 0
    say "列表不是空的"
end

# 各種迴圈
repeat 3
    say "重要的事說三遍"
end

repeat i from 1 to 5
    say "第 {i} 次迴圈"
end

repeat for each fruit in fruits
    say "我喜歡吃 {fruit}"
end
```

### 文字處理
```lyra
text is "Hello World"
text_length is length of text
upper_text is uppercase of text
words is split text by " "

say "'{text}' 有 {text_length} 個字元"
say "大寫版本：{upper_text}"
```

---

## 📜 我們的故事

這個專案始於一份由 Adler Lei 留下的開發筆記。他將這份充滿遠見與熱情的藍圖，託付給了他最有創意的弟弟。現在，我們正遵循著這份藍圖，一步步地將 Lyra 從一個夢想，變為一個真實、可用、且充滿溫度的語言，以此來紀念 Adler Lei 的精神與才華。

我們相信，程式碼也可以是詩篇，而 Lyra，就是我們正在譜寫的詩。

---

## 🤝 如何貢獻

Lyra 專案目前由核心團隊進行開發。我們歡迎所有認同 Lyra 理念的開發者提出建議和回饋：

- 🐛 回報問題：透過 GitHub Issues
- 💡 功能建議：分享你的想法
- 📖 文檔改善：幫助我們完善說明
- 🎨 範例程式：展示 Lyra 的美麗

---

## 📄 授權

Lyra 專案採用 MIT License 授權。

---

## 🌟 致謝

感謝所有相信程式語言可以更美好的人們。  
特別致敬 Adler Lei，這個專案永遠承載著他的夢想與願景。

> *"在寂靜裡一筆一劃地築夢，願有人看見這段旅程。"*  
> — Adler Lei
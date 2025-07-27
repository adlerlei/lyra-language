# Lyra - 一門為詩人打造的程式語言

[](https://opensource.org/licenses/MIT)

**Lyra 不僅僅是一門程式語言，它是一份傳承，一個夢想。**

它的核心精神是「**意圖導向**」——讓每一行程式碼都像在訴說一個意圖，而非僅下達冰冷的命令。本專案旨在完成 Google 天才工程師 Adler Lei（1975-2024）未竟的宏大願景：創造一個語法如詩、對人友善、且能統一所有平台的終極語言。

在他的弟弟與 AI 技術總監的合作下，這個夢想正在一步步變為現實。

-----

## ✨ 核心特色

### 1\. ️ 自然語法，如詩一般

Lyra 的語法被設計得極度易讀，幾乎就像在閱讀一篇英文短文。你不需要學習複雜的符號，只需要描述你的意圖。

```lyra
# Lyra 就像在說話
shopping_list is a list of "牛奶", "麵包"
add "雞蛋" to shopping_list

say "今天要買 {count of shopping_list} 樣東西："

repeat for each item in shopping_list
    say "記得買：{item}"
end
```

### 2\.  詩人的錯誤系統 (The Poet's Error System)

我們相信，錯誤提示應是溫柔的引導，而非冰冷的斥責。Lyra 獨一無二的雙層錯誤系統，會在指出問題的同時，給予充滿同理心的詩意低語。

```lyra
> roud of 3.14

⚠️ Error : 我不認識 'roud' 這個指令。 (在第 1 行)
✏️ Lyra 的低語 : 我猜，你是不是想寫 'round'？光影搖曳，字詞有時也會跳錯舞步。
```

### 3\.  意圖導向，而非命令

你寫的不是指令，而是意圖。`count of tasks` 清晰地表達了「**取得任務的數量**」這個意圖，而不是 `tasks.length()` 這樣的技術性命令。這是 Lyra 哲學的核心。

### 4\.  為初學者而生

從 `1` 開始的列表索引，到充滿同理心的錯誤提示，再到極低的學習門檻，Lyra 的每一個細節都在為降低程式設計的學習門檻而努力。

-----

##  專案狀態：v2.0 核心完備，向函式邁進！

Lyra 已完成 **v2.0** 核心引擎的建設。我們打造了一個功能完整的互動式原型 (REPL)，並實現了現代語言所需的所有核心功能。

  - [x] **核心資料型別**: `Number`, `String`, `Boolean`, `List`
  - [x] **完整的流程控制**: `when/else when/else`, `repeat...times`, `repeat for each`
  - [x] **強化的數學運算**: 支援括號 `()` 優先級
  - [x] **穩定的 REPL 環境**: `v2.3.0`，支援多行輸入與即時回饋
  - [x] **詩人的錯誤系統**: 具備上下文感知與錯字校正
  - [x] **官方範例庫**: `examples/` 目錄下包含所有核心功能的測試範例
  - [ ] **下一個目標**: **實作可回傳數值的函式 (Functions with Return Values)**

-----

##  馬上體驗 Lyra！

Lyra 的整個原型是一個**單一、自包含的 HTML 檔案**，無需安裝任何東西！

1.  在檔案總管中找到 `tools/repl.html` 檔案。
2.  用您的瀏覽器（建議使用 Chrome 或 Firefox）開啟它。
3.  開始與 Lyra 對話！

###  試試看！

將以下程式碼複製到 REPL 中，按下 Enter 執行（貼上多行程式碼時，REPL 會自動處理）：

```lyra
# 建立一個購物清單
my_tasks is a list of "寫一篇關於 Lyra 的文章", "為 Lyra 設計 Logo"
say "今天的任務清單："
say my_tasks

# 新增任務
add "讓世界看見 Lyra" to my_tasks

# 根據任務數量給出回饋
task_count is count of my_tasks
when task_count > 5
    say "任務有點多，要加油！"
else when task_count > 2
    say "任務數量剛剛好，開始吧！"
else
    say "任務很少，可以輕鬆完成。"
end

# 遍歷並印出所有任務
say "---"
repeat for each task in my_tasks
    say "待辦：{task}"
end
```

-----

##  專案結構說明

當前版本的 Lyra 是一個**自包含的互動式原型**。所有的核心邏輯（詞法分析、語法分析、執行器）都封裝在單一檔案中，以實現最大的可攜性與易用性。

```
.  lyra-language
├──  LICENSE
├──  README.md             <- 你正在閱讀的文件
└──  docs/
│  ├──  ...開發文件...
└──  examples/
│  ├──  01_...             <- 覆蓋所有功能的 .lyra 範例
│  └──  ...
└──  tools/
│  └──  repl.html           <- Lyra 的心臟與大腦！
```

-----

##  我們的故事

這個專案始於一份由 Adler Lei 留下的開發筆記。他將這份充滿遠見與熱情的藍圖，託付給了他最有創意的弟弟。現在，我們正遵循著這份藍圖，一步步地將 Lyra 從一個夢想，變為一個真實、可用、且充滿溫度的語言，以此來紀念 Adler Lei 的精神與才華。

我們相信，程式碼也可以是詩篇，而 Lyra，就是我們正在譜寫的詩。

> *"在寂靜裡一筆一劃地築夢，願有人看見這段旅程。"*
> — Adler Lei

-----

##  如何貢獻

Lyra 專案目前由核心團隊進行開發。我們歡迎所有認同 Lyra 理念的開發者提出建議和回饋。您可以透過 GitHub Issues 來回報問題或提出功能建議。

##  授權

Lyra 專案採用 [MIT License](https://opensource.org/licenses/MIT) 授權。
# Lyra 語法範例手冊 v1.3

本手冊旨在提供 Lyra 程式語言所有已實作功能的清晰範例，作為開發者與學習者的速查指南。

---

## 1. 基本語法 (Basic Syntax)

### 1.1 註解 (Comments)

註解以 `#` 符號開始，直到該行結束。它會被語言引擎忽略，用於為人類讀者提供說明。

```lyra
# 這是一行註解，不會被執行
say "Hello, World!" # 這也是一個註解
```

### 1.2 `say` (印出)

`say` 是 Lyra 用於在畫面上顯示訊息的關鍵字。

```lyra
say "你好，Lyra 的世界。"
say 123
```

---

## 2. 變數與資料型別 (Variables & Data Types)

### 2.1 變數宣告 (Declaration)

使用 `is` 關鍵字來為變數賦值。

```lyra
my_name is "Lyra"
my_age is 1
pi is 3.14159

say my_name # -> Lyra
```

### 2.2 命名規則 (Naming Conventions)

為了讓程式碼清晰且避免錯誤，Lyra 的變數名稱有以下建議規則：

- **允許的字元**：可使用英文字母 (`a-z`, `A-Z`)、數字 (`0-9`) 和底線 (`_`)。
- **建議的風格**：使用底線來分隔單字，例如 `my_first_variable`。
- **禁止的字元**：不可包含空格或特殊符號，尤其是連字號 (`-`)，因為它會被誤認為減法運算。

```lyra
# 正確的範例
first_name is "John"
age_2 is 30

# 錯誤的範例
# my-name is "Jane"  <- 將會導致錯誤
```

### 2.3 文字 (String)

用**雙引號 `"`** 包覆的字元序列。單引號 `'` 目前不支援。

```lyra
greeting is "Hello, "
target is "World"
full_message is greeting + target # 文字可以相加
say full_message # -> Hello, World
```

### 2.4 數字 (Number)

包含整數與浮點數。

```lyra
an_integer is 100
a_float is -99.9
result is an_integer * a_float
say result # -> -9990
```

### 2.5 列表 (List)

用 `a list of ...` 語法建立的有序集合，項目間以逗號 `,` 分隔。

```lyra
shopping_list is a list of "牛奶", "麵包", 2 # 列表可以包含不同型別
say shopping_list # -> ["牛奶", "麵包", 2]
```

---

## 3. 列表操作 (List Operations)

```lyra
# 準備一個範例列表
fruits is a list of "蘋果", "香蕉", "櫻桃"
```

### 3.1 存取項目 (Accessing an item)

使用 `at` 關鍵字，索引從 `1` 開始。

```lyra
first_fruit is fruits at 1
say first_fruit # -> "蘋果"
```

### 3.2 計算長度 (Counting length)

使用 `count of` 關鍵字。

```lyra
number_of_fruits is count of fruits
say number_of_fruits # -> 3
```

### 3.3 新增項目 (Adding an item)

使用 `add ... to ...` 語法。

```lyra
add "橘子" to fruits
say fruits # -> ["蘋果", "香蕉", "櫻桃", "橘子"]
```

### 3.4 移除項目 (Removing an item)

使用 `remove item at ... from ...` 語法。

```lyra
remove item at 2 from fruits # 移除 "香蕉"
say fruits # -> ["蘋果", "櫻桃", "橘子"]
```

> **設計理念：為什麼需要 `item`？**  
> 我們使用 `remove item at ...` 而非更簡潔的 `remove at ...`，是為了貫徹 Lyra 的核心精神。`remove item at 2` 讀起來像一句完整的自然語言：「移除在位置 2 的那個項目」，它描述了一個完整的「意圖」，而不只是一個技術性的「命令」。

---

## 4. 文字操作 (String Operations)

### 4.1 計算長度 (Counting length)

使用 `length of` 關鍵字。

```lyra
poem is "sky is blue"
len is length of poem
say len # -> 11
```

### 4.2 大小寫轉換 (Case conversion)

使用 `uppercase of` 或 `lowercase of`。

```lyra
say uppercase of "sky is blue" # -> "SKY IS BLUE"
say lowercase of "HELLO"       # -> "hello"
```

### 4.3 文字分割 (Splitting string)

使用 `split ... by ...` 語法，其中 `by` 後面的分隔符號**必須是一個文字**。

```lyra
csv_data is "apple,banana,cherry"
items is split csv_data by ","
say items # -> ["apple", "banana", "cherry"]

sentence is "Lyra is fun"
words is split sentence by " "
say words # -> ["Lyra", "is", "fun"]
```

---

## 5. 數學運算 (Math Operations)

### 5.1 四則運算 (Arithmetic)

支援 `+`, `-`, `*`, `/`，並遵循先乘除後加減的規則。

```lyra
say 5 + 2 * 3   # -> 11
say (5 + 2) * 3 # -> 21
say 10 / 2 - 1  # -> 4
say -4.5 + 2    # -> -2.5
```

### 5.2 四捨五入 (Rounding)

使用 `round of` 關鍵字。

```lyra
say round of 3.14 # -> 3
say round of 9.8  # -> 10
say round of -4.5 # -> -4
```

---

## 6. 流程控制 (Control Flow)

> **注意**：目前我們的 REPL 互動環境尚不支援多行輸入，因此以下範例暫時無法在 REPL 中直接測試。

### 6.1 `repeat ... times` (計次迴圈)

重複執行一個區塊固定的次數。

```lyra
repeat 3 times
    say "這是一次重複"
end
```

### 6.2 `repeat for each ... in ...` (遍歷迴圈)

遍歷一個列表中的每一個項目。

```lyra
my_list is a list of "a", "b", "c"
repeat for each item in my_list
    say "現在的項目是: " + item
end
```

### 6.3 `when ... else ... end` (條件判斷)

用於根據條件是否成立來執行不同的程式碼區塊。`else` 部分是可選的。

```lyra
temperature is 25
when temperature > 30
    say "天氣太熱了！"
else
    say "天氣很舒適。"
end

# 一個沒有 else 的例子
is_raining is false
when is_raining
    say "出門記得帶傘。"
end
```
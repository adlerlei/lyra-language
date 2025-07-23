# Lyra 語法範例手冊 v1.4

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

### 2.3 文字 (String)

用**雙引號 `"`** 或 **單引號 `'`** 包覆的字元序列。

```lyra
greeting is "Hello, "
target is 'World'
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
shopping_list is a list of "牛奶", "麵包", 2, true # 列表可以包含不同型別
say shopping_list # -> ["牛奶", "麵包", 2, true]
```

### 2.6 布林值 (Boolean)

代表邏輯上的「真」與「假」，只有 `true` 和 `false` 兩個值。

```lyra
is_raining is false
is_sunny is true

when is_raining
    say "出門記得帶傘。"
else
    say "今天天氣很好！"
end
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

使用 `remove at ... from ...` 語法。

```lyra
remove at 2 from fruits # 移除 "香蕉"
say fruits # -> ["蘋果", "櫻桃", "橘子"]
```

> **設計理念：簡潔性與一致性**  
> 我們將語法從 `remove item at ...` 簡化為 `remove at ...`。這個決策是為了釋放 `item` 這個詞，使其不再是關鍵字，這樣開發者就可以在 `repeat for each item in ...` 這樣的迴圈中自由地使用它。這體現了 Lyra 在追求自然語感的同時，更重視核心語法的簡潔與一致性，避免潛在的衝突。

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

Lyra 的 REPL 互動式環境支援多行輸入 (使用 `Shift + Enter` 換行)，讓您可以輕鬆測試複雜的邏輯區塊。

### 6.1 `repeat ... times` (計次迴圈)

重複執行一個區塊固定的次數。

```lyra
repeat 3 times
    say "這是一次重複"
end
# 預期輸出:
# 這是一次重複
# 這是一次重複
# 這是一次重複
```

### 6.2 `repeat for each ... in ...` (遍歷迴圈)

遍歷一個列表中的每一個項目。

```lyra
my_list is a list of "蘋果", "香蕉", "櫻桃"
repeat for each fruit in my_list
    say "我喜歡吃" + fruit
end
# 預期輸出:
# 我喜歡吃蘋果
# 我喜歡吃香蕉
# 我喜歡吃櫻桃
```

#### 6.2.1 遍歷迴圈搭配字串內嵌

遍歷迴圈特別適合與字串操作結合，創造動態的輸出內容。

```lyra
names is a list of "小明", "小華", "小美"
repeat for each name in names
    greeting is "你好，" + name + "！歡迎來到 Lyra 的世界。"
    say greeting
end
# 預期輸出:
# 你好，小明！歡迎來到 Lyra 的世界。
# 你好，小華！歡迎來到 Lyra 的世界。
# 你好，小美！歡迎來到 Lyra 的世界。
```

```lyra
scores is a list of 85, 92, 78, 96
repeat for each score in scores
    when score >= 90
        say "優秀成績：" + score + " 分"
    else when score >= 80
        say "良好成績：" + score + " 分"
    else
        say "需要加油：" + score + " 分"
    end
end
```

### 6.3 `when ... end` (條件判斷)

用於根據條件是否成立來執行不同的程式碼區塊。支援基本條件、雙分支和多條件判斷。

#### 6.3.1 基本條件判斷

最簡單的條件判斷形式，當條件為真時執行程式碼區塊。

```lyra
age is 20
when age >= 18
    say "你是成年人了！"
end

is_raining is false
when is_raining
    say "出門記得帶傘。"
end
```

#### 6.3.2 雙分支條件判斷 (`when ... else ... end`)

當條件為真時執行第一個區塊，否則執行 `else` 區塊。

```lyra
temperature is 25
when temperature > 30
    say "天氣太熱了！"
else
    say "天氣很舒適。"
end

score is 75
when score >= 60
    say "恭喜你及格了！"
else
    say "需要再加油喔！"
end
```

#### 6.3.3 多條件判斷 (`else when`)

支援多個條件的連續判斷，類似其他語言的 `else if`。

```lyra
score is 85
when score >= 90
    say "優秀！A級成績"
else when score >= 80
    say "良好！B級成績"
else when score >= 60
    say "及格！C級成績"
else
    say "需要加油！"
end

weather is "sunny"
when weather == "sunny"
    say "今天天氣晴朗！"
else when weather == "rainy"
    say "今天下雨，記得帶傘"
else when weather == "cloudy"
    say "今天多雲"
else
    say "天氣狀況未知"
end
```

#### 6.3.4 比較運算符

Lyra 支援以下比較運算符：

- `==` : 等於
- `!=` : 不等於
- `>` : 大於
- `<` : 小於
- `>=` : 大於等於
- `<=` : 小於等於

```lyra
# 數字比較
num1 is 10
num2 is 20
when num1 < num2
    say "num1 小於 num2"
end

# 文字比較
name is "Lyra"
when name == "Lyra"
    say "歡迎使用 Lyra 語言！"
end

when name != "Python"
    say "這不是 Python"
end

# 列表長度比較
tasks is a list of "寫作", "畫畫", "彈吉他"
number is count of tasks
when  number > 2
    say "任務很多呢！"
else when number == 0
    say "沒有任務"
else
    say "任務數量剛好"
end
```

#### 6.3.5 實用範例

```lyra
# 成績評等系統
student_score is 88
when student_score >= 90
    say "成績：A+ 優秀！"
else when student_score >= 80
    say "成績：A 良好！"
else when student_score >= 70
    say "成績：B 不錯！"
else when student_score >= 60
    say "成績：C 及格"
else
    say "成績：F 需要重修"
end

# 購物清單檢查
shopping_list is a list of "牛奶", "麵包", "雞蛋", "水果"
item_count is count of shopping_list

when item_count > 5
    say "購物清單太長了，分批購買吧！"
else when item_count > 2
    say "購物清單長度適中"
else when item_count > 0
    say "只有幾樣東西要買"
else
    say "購物清單是空的"
end

# 用戶權限檢查
user_role is "admin"
when user_role == "admin"
    say "歡迎管理員！您擁有完整權限"
else when user_role == "user"
    say "歡迎用戶！您可以瀏覽內容"
else when user_role == "guest"
    say "歡迎訪客！請先註冊"
else
    say "未知的用戶角色"
end
```

> **設計理念：自然語言式的條件判斷**  
> Lyra 的條件判斷語法設計得像自然語言一樣易讀。`when age >= 18` 讀起來就像「當年齡大於等於18時」，而 `else when score >= 80` 則像「否則當分數大於等於80時」。這種設計讓程式碼的意圖更加清晰，特別適合初學者理解。
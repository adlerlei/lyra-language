# Lyra - 一門為詩人打造的程式語言

**Lyra 不僅僅是一門程式語言，它是一份傳承。**

核心精神：**意圖導向 + 內建編譯器**。讓程式碼像詩一樣自然，同時編譯成高效純 JS（零 runtime overhead）。

紀念 Adler Lei（1975-2024）未竟的宏大願景：一門統一所有平台的終極語言。

---

## ✨ 最新進度（2026-03-12）

### 已完成
- [x] 核心架構重構：lexer/parser/evaluator/compiler 完全獨立模組化
- [x] 內建編譯器（compiler.js）上線：Lyra → 純高效 JS
- [x] REPL 整合 compile 指令（一鍵吐 JS）
- [x] 詞法分析器修復（支援 "Adler's dream!" 等混用引號）
- [x] 基本語法全通（say、list、add、len、字串內嵌）

### 進行中（下一個目標）
- [ ] **語法大簡化**（減少關鍵字 60%）：x = y、if、for item in list、len(list)、list.add()
- [ ] compiler 完整支援 when/repeat/remove/round
- [ ] 一鍵下載 .js 檔 + SvelteKit 專案輸出

### 未來規劃
1. 完整函式 + return（Adler Development.md 核心）
2. compiler 輸出 WASM / Node / SvelteKit / Desktop（統一平台）
3. 詩人的錯誤系統 2.0 + 官方 VS Code 擴充
4. 標準函式庫完整化（stdlib/）

---

## 馬上體驗

用 http://localhost:8000/tools/repl.html  
輸入 `compile` 即可看到編譯後的純 JS。

**我們正在把 Adler 的詩變成現實。**
> 在寂靜裡一筆一劃地築夢，願有人看見這段旅程。
> — Adler Lei

授權：MIT
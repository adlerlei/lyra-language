import { LyraError, TokenType } from './lexer.js';

export class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
        this.commandKeywords = ['say', 'repeat', 'add', 'remove', 'round', 'count', 'length', 'split', 'uppercase', 'lowercase', 'when', 'define', 'for', 'each', 'in'];
    }
    levenshtein(a, b) {
        const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
        for (let i = 0; i <= a.length; i += 1) matrix[0][i] = i;
        for (let j = 0; j <= b.length; j += 1) matrix[j][0] = j;
        for (let j = 1; j <= b.length; j += 1) {
            for (let i = 1; i <= a.length; i += 1) {
                const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(matrix[j][i - 1] + 1, matrix[j - 1][i] + 1, matrix[j - 1][i - 1] + indicator);
            }
        }
        return matrix[b.length][a.length];
    }
    findSimilarKeyword(word) {
        let minDistance = Infinity; let suggestion = null;
        for (const keyword of this.commandKeywords) {
            const distance = this.levenshtein(word.toLowerCase(), keyword);
            if (distance <= 2 && distance < minDistance) { minDistance = distance; suggestion = keyword; }
        }
        return suggestion;
    }
    parse() {
        const stmts = [];
        while (!this.isAtEnd()) stmts.push(this.parseStatement());
        return { type: 'Program', body: stmts };
    }
    parseStatement() {
        // 新語法：name = value
        if (this.check(TokenType.IDENTIFIER) && this.peekNext().type === TokenType.OPERATOR && this.peekNext().value === '=') return this.parseAssignmentStatement();
        
        // 特別處理舊語法「name is value」→ 友好低語提示（Adler 願景更新）
        if (this.check(TokenType.IDENTIFIER) && 
            this.peekNext().type === TokenType.IDENTIFIER && 
            this.peekNext().value.toLowerCase() === 'is') {
            const directMessage = "變數賦值請使用 '=' (例如 name = value)。";
            const whisper = "我想你應該是想宣告一個變數 '='，多一撇，少一捺，都會出問題的。";
            throw this.createParseError(directMessage, whisper);
        }
        
        if (this.match(TokenType.KEYWORD, 'say')) return this.parseSayStatement();
        if (this.match(TokenType.KEYWORD, 'when')) return this.parseWhenStatement();
        if (this.match(TokenType.KEYWORD, 'repeat')) return this.parseRepeatStatement();
        if (this.match(TokenType.KEYWORD, 'add')) return this.parseAddStatement();
        if (this.match(TokenType.KEYWORD, 'remove')) return this.parseRemoveStatement();
        
        if (this.check(TokenType.IDENTIFIER)) {
            const potentialTypo = this.peek().value;
            const suggestion = this.findSimilarKeyword(potentialTypo);
            if (suggestion) {
                const directMessage = `我不認識 '${potentialTypo}' 這個指令。`;
                const whisper = `我猜，你是不是想寫 '${suggestion}'？光影搖曳，字詞有時也會跳錯舞步。`;
                throw this.createParseError(directMessage, whisper);
            }
        }
        return this.parseExpressionStatement();
    }
    parseWhenStatement() {
        const condition = this.parseComparison();
        const thenBody = this.parseBlock();
        const elseIfBranches = [];
        let elseBody = null;
        while (this.match(TokenType.KEYWORD, 'else')) {
            if (this.match(TokenType.KEYWORD, 'when')) {
                const elseIfCondition = this.parseComparison();
                const elseIfBody = this.parseBlock();
                elseIfBranches.push({ condition: elseIfCondition, body: elseIfBody });
            } else {
                elseBody = this.parseBlock();
                break;
            }
        }
        this.consume(TokenType.KEYWORD, 'end', "需要 'end' 來結束 when 語句。");
        return { type: 'WhenStatement', condition, thenBody, elseIfBranches, elseBody };
    }
    parseComparison() {
        let left = this.parseAddition();
        while (this.match(TokenType.OPERATOR, '>') || this.match(TokenType.OPERATOR, '<') ||
               this.match(TokenType.OPERATOR, '>=') || this.match(TokenType.OPERATOR, '<=') ||
               this.match(TokenType.OPERATOR, '==') || this.match(TokenType.OPERATOR, '!=')) {
            const operator = this.tokens[this.current - 1].value;
            const right = this.parseAddition();
            left = { type: 'ComparisonExpression', left, operator, right };
        }
        return left;
    }
    parseTerm() {
        if (this.match(TokenType.PUNCTUATION, '(')) {
            const expr = this.parseExpression();
            this.consume(TokenType.PUNCTUATION, ')', "在表達式後需要一個 ')' 來閉合括號。");
            return expr;
        }
        if (this.match(TokenType.NUMBER)) return { type: 'NumericLiteral', value: this.tokens[this.current - 1].value };
        if (this.match(TokenType.BOOLEAN)) return { type: 'BooleanLiteral', value: this.tokens[this.current - 1].value };
        if (this.check(TokenType.STRING) || this.check(TokenType.INTERP_START)) {
            if (this.check(TokenType.STRING) && this.peekNext().type !== TokenType.INTERP_START) {
                const token = this.tokens[this.current++];
                return { type: 'StringLiteral', value: token.value };
            }
            const parts = [];
            while (this.check(TokenType.STRING) || this.check(TokenType.INTERP_START)) {
                if (this.match(TokenType.STRING)) parts.push(this.tokens[this.current - 1].value);
                else if (this.match(TokenType.INTERP_START)) {
                    const expr = this.parseExpression();
                    parts.push(expr);
                    this.consume(TokenType.INTERP_END, null, "字串內嵌需要 '}' 來閉合。");
                } else break;
            }
            return { type: 'InterpolatedString', parts };
        }
        if (this.match(TokenType.KEYWORD, 'a')) return this.parseListLiteral();
        if (this.match(TokenType.KEYWORD, 'count')) return this.parseCountExpression();
        if (this.match(TokenType.KEYWORD, 'length')) return this.parseLengthExpression();
        if (this.match(TokenType.KEYWORD, 'uppercase') || this.match(TokenType.KEYWORD, 'lowercase')) return this.parseCaseExpression();
        if (this.match(TokenType.KEYWORD, 'split')) return this.parseSplitExpression();
        if (this.match(TokenType.KEYWORD, 'round')) return this.parseRoundExpression();
        if (this.match(TokenType.IDENTIFIER)) return { type: 'Identifier', name: this.tokens[this.current - 1].value };
        throw this.createParseError("預期是數字、文字、列表或變數。");
    }
    parseExpressionStatement() { const expr = this.parseExpression(); return { type: 'ExpressionStatement', expression: expr }; }
    parseRemoveStatement() {
        this.consume(TokenType.KEYWORD, 'at', "在 'remove' 後面需要 'at'。");
        const index = this.parseExpression();
        this.consume(TokenType.KEYWORD, 'from', "在索引後需要 'from'。");
        const listName = this.consume(TokenType.IDENTIFIER, null, "在 'from' 後面需要列表名稱。");
        return { type: 'RemoveStatement', index, list: listName.value };
    }
    parseAddStatement() {
        const value = this.parseExpression();
        this.consume(TokenType.KEYWORD, 'to', "在 'add' 的值後面需要 'to'。");
        const listName = this.consume(TokenType.IDENTIFIER, null, "在 'to' 後面需要列表名稱。");
        return { type: 'AddStatement', value, list: listName.value };
    }
    parseAssignmentStatement() {
        const name = this.consume(TokenType.IDENTIFIER, null, "需要變數名稱。");
        this.consume(TokenType.OPERATOR, '=', "變數名稱後需要 '='。");
        const value = this.parseExpression();
        return { type: 'AssignmentStatement', name: name.value, value };
    }
    parseRepeatStatement() {
        if (this.match(TokenType.KEYWORD, 'for')) {
            this.consume(TokenType.KEYWORD, 'each', "在 'for' 後面需要 'each'。");
            const variable = this.consume(TokenType.IDENTIFIER, null, "需要項目變數名稱。");
            this.consume(TokenType.KEYWORD, 'in', "需要 'in' 關鍵字。");
            const collection = this.parseExpression();
            const body = this.parseBlock();
            this.consume(TokenType.KEYWORD, 'end', "需要 'end' 來結束 repeat for each 語句。");
            return { type: 'ForEachStatement', variable: variable.value, collection, body };
        } else if (this.check(TokenType.IDENTIFIER) && this.peekNext().value === 'from') {
            const variable = this.consume(TokenType.IDENTIFIER, null, "需要計數變數名稱。");
            this.consume(TokenType.KEYWORD, 'from', "需要 'from' 關鍵字。");
            const start = this.parseExpression();
            this.consume(TokenType.KEYWORD, 'to', "需要 'to' 關鍵字。");
            const end = this.parseExpression();
            const body = this.parseBlock();
            this.consume(TokenType.KEYWORD, 'end', "需要 'end' 來結束 repeat from to 語句。");
            return { type: 'ForLoopStatement', variable: variable.value, start, end, body };
        } else {
            const times = this.parseExpression();
            this.consume(TokenType.KEYWORD, 'times', "在 repeat 的次數後面需要 'times' 關鍵字。");
            const body = this.parseBlock();
            this.consume(TokenType.KEYWORD, 'end', "需要 'end' 來結束 repeat times 語句。");
            return { type: 'RepeatStatement', times, body };
        }
    }
    parseBlock() {
        const body = [];
        while (!this.check(TokenType.KEYWORD, 'end') && !this.check(TokenType.KEYWORD, 'else') && !this.isAtEnd()) {
            body.push(this.parseStatement());
        }
        return body;
    }
    parseExpression() { return this.parseComparison(); }
    parseAddition() {
        let left = this.parseMultiplication();
        while (this.match(TokenType.OPERATOR, '+') || this.match(TokenType.OPERATOR, '-')) {
            const op = this.tokens[this.current - 1].value;
            const right = this.parseMultiplication();
            left = { type: 'BinaryExpression', left, operator: op, right };
        }
        return left;
    }
    parseMultiplication() {
        let left = this.parseUnary();
        while (this.match(TokenType.OPERATOR, '*') || this.match(TokenType.OPERATOR, '/')) {
            const op = this.tokens[this.current - 1].value;
            const right = this.parseUnary();
            left = { type: 'BinaryExpression', left, operator: op, right };
        }
        return left;
    }
    parseUnary() {
        if (this.match(TokenType.OPERATOR, '-')) {
            const operator = this.tokens[this.current - 1].value;
            const right = this.parseUnary();
            return { type: 'UnaryExpression', operator, right };
        }
        return this.parseAccess();
    }
    parseAccess() {
        let expr = this.parseTerm();
        while (this.match(TokenType.KEYWORD, 'at')) {
            const index = this.parseExpression();
            expr = { type: 'AccessExpression', object: expr, index };
        }
        return expr;
    }
    parseRoundExpression() {
        this.consume(TokenType.KEYWORD, 'of', "在 'round' 後面需要 'of'。");
        if (this.peek().type === TokenType.EOF) {
            const directMessage = "指令不完整：在 'round of' 後面需要一個數字或變數。";
            const whisper = "你輕聲說出 'round of'，像一首詩起了頭，卻遺落了最關鍵的詞。";
            throw new LyraError(`${directMessage} (在第 ${this.tokens[this.current - 1].line} 行)`, whisper);
        }
        const number = this.parseExpression();
        return { type: 'RoundExpression', number };
    }
    parseSplitExpression() {
        const stringToSplit = this.parseExpression();
        this.consume(TokenType.KEYWORD, 'by', "在 'split' 的目標文字後需要 'by'。");
        const delimiter = this.parseExpression();
        return { type: 'SplitExpression', string: stringToSplit, delimiter };
    }
    parseListLiteral() {
        this.consume(TokenType.KEYWORD, 'list', "在 'a' 後面需要 'list'。");
        this.consume(TokenType.KEYWORD, 'of', "在 'list' 後面需要 'of'。");
        const elements = [];
        if (!this.isAtEnd() && !this.check(TokenType.KEYWORD)) {
            do { elements.push(this.parseExpression()); } while (this.match(TokenType.PUNCTUATION, ','));
        }
        return { type: 'ListLiteral', elements };
    }
    parseCountExpression() {
        this.consume(TokenType.KEYWORD, 'of', "在 'count' 後面需要 'of'。");
        const list = this.parseExpression();
        return { type: 'CountExpression', list };
    }
    parseLengthExpression() {
        this.consume(TokenType.KEYWORD, 'of', "在 'length' 後面需要 'of'。");
        const str = this.parseExpression();
        return { type: 'LengthExpression', string: str };
    }
    parseCaseExpression() {
        const caseType = this.tokens[this.current - 1].value;
        this.consume(TokenType.KEYWORD, 'of', "在大小寫關鍵字後面需要 'of'。");
        const str = this.parseExpression();
        return { type: 'CaseExpression', caseType, string: str };
    }
    parseSayStatement() {
        let value = this.parseExpression();
        return { type: 'SayStatement', value };
    }
    consume(type, value, directMessage, whisper) {
        if (this.check(type, value)) return this.tokens[this.current++];
        throw this.createParseError(directMessage, whisper);
    }
    createParseError(directMessage, whisper) {
        const token = this.peek();
        const finalDirectMessage = `${directMessage} (在第 ${token.line} 行)`;
        if (whisper) return new LyraError(finalDirectMessage, whisper);
        const genericWhisper = `我看見「${token.value}」在這裡，但它似乎迷了路。`;
        return new LyraError(finalDirectMessage, genericWhisper);
    }
    check(type, value) {
        if (this.isAtEnd()) return false;
        const token = this.peek();
        return token.type === type && (!value || token.value === value);
    }
    peek() { return this.tokens[this.current]; }
    peekNext() { return this.tokens[this.current + 1] || {type: TokenType.EOF}; }
    isAtEnd() { return this.peek().type === TokenType.EOF; }
    match(type, value) {
        if (!this.check(type, value)) return false;
        this.current++;
        return true;
    }
}
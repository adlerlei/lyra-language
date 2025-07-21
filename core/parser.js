// core/parser.js

import { TokenType } from './lexer.js';

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }

    parse() {
        const stmts = [];
        while (!this.isAtEnd()) {
            try {
                const stmt = this.parseStatement();
                if (stmt) {
                    stmts.push(stmt);
                }
            } catch (e) {
                throw e;
            }
        }
        return { type: 'Program', body: stmts };
    }

    parseStatement() {
        if (this.peek().type === TokenType.EOF) return null;

        if (this.check(TokenType.IDENTIFIER) && this.peekNext().value === 'is')
            return this.parseAssignmentStatement();
        if (this.match(TokenType.KEYWORD, 'say'))
            return this.parseSayStatement();
        if (this.match(TokenType.KEYWORD, 'repeat'))
            return this.parseRepeatStatement();
        if (this.match(TokenType.KEYWORD, 'add'))
            return this.parseAddStatement();
        if (this.match(TokenType.KEYWORD, 'remove'))
            return this.parseRemoveStatement();

        throw new Error(`無法解析的語句在第 ${this.peek().line} 行，無法識別 '${this.peek().value}'。`);
    }

    parseRemoveStatement() {
        this.consume(TokenType.KEYWORD, 'item', "在 'remove' 後面需要 'item'。");
        this.consume(TokenType.KEYWORD, 'at', "在 'item' 後面需要 'at'。");
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
        this.consume(TokenType.KEYWORD, 'is', "變數名稱後需要 'is'。");
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
            return { type: 'ForEachStatement', variable: variable.value, collection, body };
        } else if (this.check(TokenType.IDENTIFIER) && this.peekNext().value === 'from') {
            const variable = this.consume(TokenType.IDENTIFIER, null, "需要計數變數名稱。");
            this.consume(TokenType.KEYWORD, 'from', "需要 'from' 關鍵字。");
            const start = this.parseExpression();
            this.consume(TokenType.KEYWORD, 'to', "需要 'to' 關鍵字。");
            const end = this.parseExpression();
            const body = this.parseBlock();
            return { type: 'ForLoopStatement', variable: variable.value, start, end, body };
        } else {
            const times = this.parseExpression();
            const body = this.parseBlock();
            return { type: 'RepeatStatement', times, body };
        }
    }

    parseBlock() {
        const body = [];
        while (!this.check(TokenType.KEYWORD, 'end') && !this.isAtEnd()) {
            body.push(this.parseStatement());
        }
        this.consume(TokenType.KEYWORD, 'end', "需要 'end' 來結束區塊。");
        return body;
    }

    parseExpression() {
        return this.parseAddition();
    }

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
        let left = this.parseAccess();
        while (this.match(TokenType.OPERATOR, '*') || this.match(TokenType.OPERATOR, '/')) {
            const op = this.tokens[this.current - 1].value;
            const right = this.parseAccess();
            left = { type: 'BinaryExpression', left, operator: op, right };
        }
        return left;
    }

    parseAccess() {
        let expr = this.parseTerm();
        while (this.match(TokenType.KEYWORD, 'at')) {
            const index = this.parseExpression();
            expr = { type: 'AccessExpression', object: expr, index };
        }
        return expr;
    }

    parseTerm() {
        if (this.match(TokenType.NUMBER))
            return { type: 'NumericLiteral', value: this.tokens[this.current - 1].value };
        if (this.match(TokenType.STRING))
            return { type: 'StringLiteral', value: this.tokens[this.current - 1].value };
        if (this.check(TokenType.KEYWORD, 'a') && this.peekNext().value === 'list')
            return this.parseListLiteral();
        if (this.check(TokenType.KEYWORD, 'count') && this.peekNext().value === 'of')
            return this.parseCountExpression();
        if (this.check(TokenType.KEYWORD, 'length') && this.peekNext().value === 'of')
            return this.parseLengthExpression();
        if ((this.check(TokenType.KEYWORD, 'uppercase') || this.check(TokenType.KEYWORD, 'lowercase')) && this.peekNext().value === 'of')
            return this.parseCaseExpression();
        if (this.match(TokenType.KEYWORD, 'split'))
            return this.parseSplitExpression();
        if (this.match(TokenType.IDENTIFIER))
            return { type: 'Identifier', name: this.tokens[this.current - 1].value };
        throw new Error("預期是數字、文字、列表或變數。");
    }

    parseSplitExpression() {
        const stringToSplit = this.parseExpression();
        this.consume(TokenType.KEYWORD, 'by', "在 'split' 的目標文字後需要 'by'。");
        const delimiter = this.parseExpression();
        return { type: 'SplitExpression', string: stringToSplit, delimiter };
    }

    parseListLiteral() {
        this.consume(TokenType.KEYWORD, 'a', "列表宣告應以 'a' 開始。");
        this.consume(TokenType.KEYWORD, 'list', "關鍵字 'a' 後面需要 'list'。");
        this.consume(TokenType.KEYWORD, 'of', "關鍵字 'list' 後面需要 'of'。");
        const elements = [];
        if (!this.isAtEnd() && !this.check(TokenType.KEYWORD)) {
            do {
                elements.push(this.parseExpression());
            } while (this.match(TokenType.PUNCTUATION, ','));
        }
        return { type: 'ListLiteral', elements };
    }

    parseCountExpression() {
        this.consume(TokenType.KEYWORD, 'count', "預期 'count of' 表達式。");
        this.consume(TokenType.KEYWORD, 'of', "關鍵字 'count' 後面需要 'of'。");
        const list = this.parseExpression();
        return { type: 'CountExpression', list };
    }

    parseLengthExpression() {
        this.consume(TokenType.KEYWORD, 'length', "預期 'length of' 表達式。");
        this.consume(TokenType.KEYWORD, 'of', "關鍵字 'length' 後面需要 'of'。");
        const str = this.parseExpression();
        return { type: 'LengthExpression', string: str };
    }

    parseCaseExpression() {
        const caseTypeToken = this.tokens[this.current];
        this.consume(TokenType.KEYWORD, null, "預期 'uppercase' 或 'lowercase'。");
        this.consume(TokenType.KEYWORD, 'of', "大小寫轉換後面需要 'of'。");
        const str = this.parseExpression();
        return { type: 'CaseExpression', caseType: caseTypeToken.value, string: str };
    }

    parseSayStatement() {
        let value = this.parseExpression();
        return { type: 'SayStatement', value };
    }

    consume(type, value, message) {
        if (this.check(type, value)) return this.tokens[this.current++];
        const token = this.peek();
        throw new Error(`${message} (在第 ${token.line} 行)`);
    }

    check(type, value) {
        if (this.isAtEnd()) return false;
        const token = this.peek();
        return token.type === type && (!value || token.value === value);
    }

    peek() {
        return this.tokens[this.current];
    }

    peekNext() {
        return this.tokens[this.current + 1] || { type: 'EOF' };
    }

    isAtEnd() {
        return this.peek().type === TokenType.EOF;
    }

    match(type, value) {
        if (!this.check(type, value)) return false;
        this.current++;
        return true;
    }
}

export { Parser };
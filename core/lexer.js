// core/lexer.js

const TokenType = {
    KEYWORD: '關鍵字',
    IDENTIFIER: '識別符',
    STRING: '文字',
    NUMBER: '數字',
    OPERATOR: '運算符',
    PUNCTUATION: '標點符號',
    EOF: '檔案結尾'
};

const KEYWORDS = {
    'define': 1, 'say': 1, 'when': 1, 'else': 1, 'end': 1, 'is': 1,
    'repeat': 1, 'from': 1, 'to': 1, 'a': 1, 'list': 1, 'of': 1, 'at': 1,
    'for': 1, 'each': 1, 'in': 1, 'count': 1, 'add': 1, 'remove': 1,
    'item': 1, 'length': 1, 'uppercase': 1, 'lowercase': 1, 'split': 1, 'by': 1
};

class Token {
    constructor(type, value, line) {
        this.type = type;
        this.value = value;
        this.line = line;
    }
}

function tokenize(code) {
    const tokens = [];
    let current = 0;
    let line = 1;
    while (current < code.length) {
        let char = code[current];
        if (/\s/.test(char)) {
            if (char === '\n') line++;
            current++;
            continue;
        }
        if (char === '#') {
            while (current < code.length && code[current] !== '\n') current++;
            continue;
        }
        if (char === '(' || char === ')' || char === ',') {
            tokens.push(new Token(TokenType.PUNCTUATION, char, line));
            current++;
            continue;
        }
        if (/[+\-*/]/.test(char)) {
            tokens.push(new Token(TokenType.OPERATOR, char, line));
            current++;
            continue;
        }
        if (char === '"') {
            let value = '';
            current++;
            while (current < code.length && code[current] !== '"') {
                value += code[current];
                current++;
            }
            current++;
            tokens.push(new Token(TokenType.STRING, value, line));
            continue;
        }
        if (/\d/.test(char)) {
            let value = '';
            while (current < code.length && /[0-9.]/.test(code[current])) {
                value += code[current];
                current++;
            }
            tokens.push(new Token(TokenType.NUMBER, parseFloat(value), line));
            continue;
        }
        if (/[a-zA-Z_]/.test(char)) {
            let value = '';
            while (current < code.length && /[a-zA-Z0-9_]/.test(code[current])) {
                value += code[current];
                current++;
            }
            const type = KEYWORDS[value] ? TokenType.KEYWORD : TokenType.IDENTIFIER;
            tokens.push(new Token(type, value, line));
            continue;
        }
        throw new Error(`無法識別的字元 '${char}' 在第 ${line} 行。`);
    }
    tokens.push(new Token(TokenType.EOF, 'EOF', line));
    return tokens;
}

export { TokenType, KEYWORDS, Token, tokenize };

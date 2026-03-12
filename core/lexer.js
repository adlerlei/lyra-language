export class LyraError extends Error {
    constructor(directMessage, whisper) {
        super(directMessage);
        this.name = 'LyraError';
        this.whisper = whisper;
    }
}

export const TokenType = { KEYWORD: '關鍵字', IDENTIFIER: '識別符', STRING: '文字', NUMBER: '數字', BOOLEAN: '布林值', OPERATOR: '運算符', PUNCTUATION: '標點符號', EOF: '檔案結尾', INTERP_START: '內嵌開始', INTERP_END: '內嵌結束' };
export const KEYWORDS = {'define': 1, 'say': 1, 'when': 1, 'else': 1, 'end': 1, 'repeat': 1, 'from': 1, 'to': 1, 'a': 1, 'list': 1, 'of': 1, 'at': 1, 'for': 1, 'each': 1, 'in': 1, 'count': 1, 'add': 1, 'remove': 1, 'length': 1, 'uppercase': 1, 'lowercase': 1, 'split': 1, 'by': 1, 'round': 1, 'times': 1};

export class Token {
    constructor(type, value, line) { this.type = type; this.value = value; this.line = line; }
}

export function tokenize(code) {
    const tokens = [];
    let current = 0;
    let line = 1;
    while (current < code.length) {
        let char = code[current];
        if (/\s/.test(char)) { if (char === '\n') line++; current++; continue; }
        if (char === '#') { while (current < code.length && code[current] !== '\n') current++; continue; }
        
        if (char === '"' || char === "'") {
            const quoteType = char;
            const startLine = line;
            current++;
            let value = '';
            while (current < code.length && code[current] !== quoteType) {
                if (code[current] === '{' && (code[current-1] !== '\\')) {
                    if (value.length > 0) tokens.push(new Token(TokenType.STRING, value, startLine));
                    value = '';
                    tokens.push(new Token(TokenType.INTERP_START, '{', startLine));
                    current++;
                    let brace_level = 1;
                    let expr_code = '';
                    while(current < code.length && brace_level > 0) {
                        if (code[current] === '{') brace_level++;
                        if (code[current] === '}') brace_level--;
                        if(brace_level > 0) expr_code += code[current];
                        current++;
                    }
                    if (brace_level > 0) throw new LyraError(`未閉合的字串內嵌。 (從第 ${startLine} 行開始)`, `在文字的風景中，我看見一個敞開的 {，它在等待一個 } 來讓風景完整。`);
                    const inner_tokens = tokenize(expr_code).filter(t => t.type !== TokenType.EOF);
                    tokens.push(...inner_tokens);
                    tokens.push(new Token(TokenType.INTERP_END, '}', line));
                } else {
                    if (code[current] === '\n') line++;
                    value += code[current];
                    current++;
                }
            }
            if (current >= code.length) throw new LyraError(`未閉合的字串。 (從第 ${startLine} 行開始)`, `這段文字以 ${quoteType} 開啟了它的故事，卻似乎忘了用同一個符號來畫上句點。`);
            if (value.length > 0) tokens.push(new Token(TokenType.STRING, value, line));
            current++;
            continue;
        }

        if (char === '(' || char === ')' || char === ',') { tokens.push(new Token(TokenType.PUNCTUATION, char, line)); current++; continue; }
        if (char === '>' || char === '<' || char === '=' || char === '!') {
            let op = char; current++;
            if (current < code.length && code[current] === '=') { op += '='; current++; }
            tokens.push(new Token(TokenType.OPERATOR, op, line));
            continue;
        }
        if (/[+\-*/]/.test(char)) { tokens.push(new Token(TokenType.OPERATOR, char, line)); current++; continue; }
        if (/\d/.test(char)) { let value = ''; while (current < code.length && /[0-9.]/.test(code[current])) { value += code[current]; current++; } tokens.push(new Token(TokenType.NUMBER, parseFloat(value), line)); continue; }
        if (/[a-zA-Z_]/.test(char)) {
            let value = '';
            while (current < code.length && /[a-zA-Z0-9_]/.test(code[current])) { value += code[current]; current++; }
            if (current < code.length && code[current] === '-') throw new LyraError(`無效的變數名稱。 (在第 ${line} 行)`, `變數的名字裡不能包含 '-' 符號，它會讓我想起減法。`);
            if (value === 'true' || value === 'false') {
                tokens.push(new Token(TokenType.BOOLEAN, value === 'true', line));
            } else {
                const type = KEYWORDS[value] ? TokenType.KEYWORD : TokenType.IDENTIFIER;
                tokens.push(new Token(type, value, line));
            }
            continue;
        }
        throw new Error(`無法識別的字元 '${char}' 在第 ${line} 行。`);
    }
    tokens.push(new Token(TokenType.EOF, 'EOF', line));
    return tokens;
}
// stdlib/string.js

// 將字串用指定分隔符切割成陣列
function splitBy(str, delimiter) {
    if (typeof str !== 'string' || typeof delimiter !== 'string') {
        throw new Error('splitBy 需要兩個字串參數');
    }
    return str.split(delimiter);
}

// 取得字串長度
function length(str) {
    if (typeof str !== 'string') {
        throw new Error('length 只能用在字串');
    }
    return str.length;
}

// 轉大寫
function uppercase(str) {
    if (typeof str !== 'string') {
        throw new Error('uppercase 只能用在字串');
    }
    return str.toUpperCase();
}

// 轉小寫
function lowercase(str) {
    if (typeof str !== 'string') {
        throw new Error('lowercase 只能用在字串');
    }
    return str.toLowerCase();
}

export { splitBy, length, uppercase, lowercase };

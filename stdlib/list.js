// stdlib/list.js

// 計算列表長度
function count(list) {
    if (!Array.isArray(list)) {
        throw new Error('count 只能用在列表');
    }
    return list.length;
}

export { count };

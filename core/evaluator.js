import { LyraError } from './lexer.js';

export class Evaluator {
    constructor() { this.environment = {}; }
    
    isTruthy(value) {
        if (value === null || value === undefined) return false;
        if (typeof value === 'boolean') return value;
        if (typeof value === 'number') return value !== 0;
        if (typeof value === 'string') return value.length > 0;
        if (Array.isArray(value)) return value.length > 0;
        return true;
    }
    
    evaluate(node, env) {
        if (!node) return;
        try {
            switch (node.type) {
                case 'Program': let lastVal; node.body.forEach(stmt => { lastVal = this.evaluate(stmt, env); }); return lastVal;
                case 'ExpressionStatement': return this.evaluate(node.expression, env);
                case 'InterpolatedString':
                    let result = '';
                    for (const part of node.parts) {
                        if (typeof part === 'string') { result += part; } 
                        else { result += this.evaluate(part, env); }
                    }
                    return result;
                case 'StringLiteral': return node.value;
                case 'AssignmentStatement': env[node.name] = this.evaluate(node.value, env); return env[node.name];
                
                case 'RepeatStatement':
                    const repetitions = this.evaluate(node.times, env);
                    if (typeof repetitions !== 'number' || repetitions < 0) {
                        throw this.createRuntimeError("repeat times 的次數必須是一個非負數。");
                    }
                    const results = [];
                    for (let i = 0; i < repetitions; i++) {
                        node.body.forEach(stmt => {
                            const result = this.evaluate(stmt, env);
                            if (result !== undefined) results.push(result);
                        });
                    }
                    return results;
                
                case 'ForEachStatement':
                    const collection = this.evaluate(node.collection, env);
                    if (!Array.isArray(collection)) {
                        throw this.createRuntimeError("只能對列表使用 'repeat for each'。");
                    }
                    const forEachResults = [];
                    for (const item of collection) {
                        const loopEnv = Object.create(env);
                        loopEnv[node.variable] = item;
                        node.body.forEach(stmt => {
                            const result = this.evaluate(stmt, loopEnv);
                            if (result !== undefined) forEachResults.push(result);
                        });
                    }
                    return forEachResults;

                case 'WhenStatement':
                    const conditionResult = this.evaluate(node.condition, env);
                    if (this.isTruthy(conditionResult)) {
                        let lastVal;
                        node.thenBody.forEach(stmt => { lastVal = this.evaluate(stmt, env); });
                        return lastVal;
                    }
                    for (const elseIfBranch of node.elseIfBranches || []) {
                        const elseIfResult = this.evaluate(elseIfBranch.condition, env);
                        if (this.isTruthy(elseIfResult)) {
                            let lastVal;
                            elseIfBranch.body.forEach(stmt => { lastVal = this.evaluate(stmt, env); });
                            return lastVal;
                        }
                    }
                    if (node.elseBody) {
                        let lastVal;
                        node.elseBody.forEach(stmt => { lastVal = this.evaluate(stmt, env); });
                        return lastVal;
                    }
                    break;
                
                case 'ComparisonExpression':
                    const leftVal = this.evaluate(node.left, env);
                    const rightVal = this.evaluate(node.right, env);
                    switch (node.operator) {
                        case '>': return leftVal > rightVal;
                        case '<': return leftVal < rightVal;
                        case '>=': return leftVal >= rightVal;
                        case '<=': return leftVal <= rightVal;
                        case '==': return leftVal == rightVal;
                        case '!=': return leftVal != rightVal;
                        default: throw this.createRuntimeError(`未知的比較運算符: ${node.operator}`);
                    }
                
                case 'AddStatement':
                    const valueToAdd = this.evaluate(node.value, env);
                    if (!(node.list in env)) throw this.createRuntimeError(`找不到名為 '${node.list}' 的列表。`);
                    const listToAddTo = env[node.list];
                    if (!Array.isArray(listToAddTo)) throw this.createRuntimeError(`只能對列表使用 'add to'。`);
                    listToAddTo.push(valueToAdd);
                    return listToAddTo;
                
                case 'RemoveStatement':
                    if (!(node.list in env)) throw this.createRuntimeError(`找不到名為 '${node.list}' 的列表。`);
                    const listToRemoveFrom = env[node.list];
                    if (!Array.isArray(listToRemoveFrom)) throw this.createRuntimeError(`只能對列表使用 'remove from'。`);
                    const indexToRemove = this.evaluate(node.index, env);
                    if (indexToRemove < 1 || indexToRemove > listToRemoveFrom.length) throw this.createRuntimeError("移除項目失敗：列表索引超出範圍。");
                    listToRemoveFrom.splice(indexToRemove - 1, 1);
                    return listToRemoveFrom;
                
                case 'ListLiteral': return node.elements.map(el => this.evaluate(el, env));
                case 'AccessExpression':
                    const list = this.evaluate(node.object, env);
                    const index = this.evaluate(node.index, env);
                    if (!Array.isArray(list)) throw this.createRuntimeError("只能對列表使用 'at'。");
                    if (index < 1 || index > list.length) throw this.createRuntimeError("列表索引超出範圍。");
                    return list[index - 1];
                
                case 'CountExpression':
                    const targetList = this.evaluate(node.list, env);
                    if (!Array.isArray(targetList)) throw this.createRuntimeError("只能對列表使用 'count of'。");
                    return targetList.length;
                
                case 'LengthExpression':
                    const targetString = this.evaluate(node.string, env);
                    if (typeof targetString !== 'string') throw this.createRuntimeError("只能對文字使用 'length of'。");
                    return targetString.length;
                
                case 'CaseExpression':
                    const strCase = this.evaluate(node.string, env);
                    if (typeof strCase !== 'string') throw this.createRuntimeError("只能對文字使用大小寫轉換。");
                    if (node.caseType === 'uppercase') return strCase.toUpperCase();
                    if (node.caseType === 'lowercase') return strCase.toLowerCase();
                    break;
                
                case 'SplitExpression':
                    const strToSplit = this.evaluate(node.string, env);
                    const delimiter = this.evaluate(node.delimiter, env);
                    if (typeof strToSplit !== 'string' || typeof delimiter !== 'string') throw this.createRuntimeError("split by 的目標和分隔符號都必須是文字。");
                    return strToSplit.split(delimiter);
                
                case 'RoundExpression':
                    const numberToRound = this.evaluate(node.number, env);
                    if (typeof numberToRound !== 'number') {
                        const valueAsString = JSON.stringify(numberToRound);
                        throw this.createRuntimeError("只能對數字使用 'round of'。", `我試著丈量 ${valueAsString} 這段話語的輪廓，卻發現它如風一般無形。`);
                    }
                    return Math.round(numberToRound);
                
                case 'UnaryExpression':
                    const rightUnary = this.evaluate(node.right, env);
                    if (node.operator === '-') {
                        if (typeof rightUnary !== 'number') throw this.createRuntimeError("一元運算符 '-' 只能用於數字。");
                        return -rightUnary;
                    }
                    return rightUnary;
                
                case 'BinaryExpression':
                    const left = this.evaluate(node.left, env);
                    const right = this.evaluate(node.right, env);
                    if (node.operator === '*') return left * right;
                    if (node.operator === '/') return left / right;
                    if (node.operator === '+') return left + right;
                    if (node.operator === '-') return left - right;
                    break;
                
                case 'NumericLiteral': return node.value;
                case 'BooleanLiteral': return node.value;
                case 'Identifier':
                    if (node.name in env) return env[node.name];
                    throw this.createRuntimeError(`找不到名為 '${node.name}' 的變數。`, `「${node.name}」，一個未曾在我記憶中寫下的名字。`);
                
                case 'SayStatement':
                    const outputValue = this.evaluate(node.value, env);
                    return { isSay: true, value: outputValue };
            }
        } catch (error) {
            if (error instanceof LyraError) throw error; 
            throw this.createRuntimeError(error.message);
        }
    }
    
    createRuntimeError(directMessage, whisper) {
        const finalWhisper = whisper || "在執行的瞬間，一陣迷霧升起。有些事情超出了我的預期。";
        return new LyraError(directMessage, finalWhisper);
    }
}
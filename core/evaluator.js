// core/evaluator.js

import * as stringUtils from '../stdlib/string.js';
import * as listUtils from '../stdlib/list.js';

class Evaluator {
    constructor(ast, outputElement) {
        this.ast = ast;
        this.outputElement = outputElement;
        this.environment = {};
    }

    run() {
        this.outputElement.innerHTML = '';
        try {
            this.evaluate(this.ast, this.environment);
        } catch (error) {
            this.logError(error.message);
        }
    }

    evaluate(node, env) {
        if (!node) return;
        switch (node.type) {
            case 'Program':
                node.body.forEach(stmt => this.evaluate(stmt, env));
                break;
            case 'AssignmentStatement':
                env[node.name] = this.evaluate(node.value, env);
                break;
            case 'AddStatement': {
                const valueToAdd = this.evaluate(node.value, env);
                if (!(node.list in env)) throw new Error(`找不到名為 '${node.list}' 的列表。`);
                const listToAddTo = env[node.list];
                if (!Array.isArray(listToAddTo)) throw new Error(`只能對列表使用 'add to'。`);
                listToAddTo.push(valueToAdd);
                break;
            }
            case 'RemoveStatement': {
                if (!(node.list in env)) throw new Error(`找不到名為 '${node.list}' 的列表。`);
                const listToRemoveFrom = env[node.list];
                if (!Array.isArray(listToRemoveFrom)) throw new Error(`只能對列表使用 'remove from'。`);
                const indexToRemove = this.evaluate(node.index, env);
                if (indexToRemove < 1 || indexToRemove > listToRemoveFrom.length)
                    throw new Error("移除項目失敗：列表索引超出範圍。");
                listToRemoveFrom.splice(indexToRemove - 1, 1);
                break;
            }
            case 'RepeatStatement': {
                const times = this.evaluate(node.times, env);
                for (let i = 0; i < times; i++) {
                    node.body.forEach(stmt => this.evaluate(stmt, env));
                }
                break;
            }
            case 'ForLoopStatement': {
                const start = this.evaluate(node.start, env);
                const end = this.evaluate(node.end, env);
                for (let i = start; i <= end; i++) {
                    const loopEnv = { ...env, [node.variable]: i };
                    node.body.forEach(stmt => this.evaluate(stmt, loopEnv));
                }
                break;
            }
            case 'ForEachStatement': {
                const collection = this.evaluate(node.collection, env);
                if (!Array.isArray(collection)) throw new Error("只能對列表使用 'for each'。");
                for (const item of collection) {
                    const loopEnv = { ...env, [node.variable]: item };
                    node.body.forEach(stmt => this.evaluate(stmt, loopEnv));
                }
                break;
            }
            case 'ListLiteral':
                return node.elements.map(el => this.evaluate(el, env));
            case 'AccessExpression': {
                const list = this.evaluate(node.object, env);
                const index = this.evaluate(node.index, env);
                if (!Array.isArray(list)) throw new Error("只能對列表使用 'at'。");
                if (index < 1 || index > list.length) throw new Error("列表索引超出範圍。");
                return list[index - 1];
            }
            case 'CountExpression': {
                const targetList = this.evaluate(node.list, env);
                if (!Array.isArray(targetList)) throw new Error("只能對列表使用 'count of'。");
                return listUtils.count(targetList);
            }
            case 'LengthExpression': {
                const targetString = this.evaluate(node.string, env);
                if (typeof targetString !== 'string') throw new Error("只能對文字使用 'length of'。");
                return stringUtils.length(targetString);
            }
            case 'CaseExpression': {
                const strCase = this.evaluate(node.string, env);
                if (typeof strCase !== 'string') throw new Error("只能對文字使用大小寫轉換。");
                if (node.caseType === 'uppercase') return stringUtils.uppercase(strCase);
                if (node.caseType === 'lowercase') return stringUtils.lowercase(strCase);
                break;
            }
            case 'SplitExpression': {
                const strToSplit = this.evaluate(node.string, env);
                const delimiter = this.evaluate(node.delimiter, env);
                if (typeof strToSplit !== 'string' || typeof delimiter !== 'string')
                    throw new Error("split by 的目標和分隔符號都必須是文字。");
                return stringUtils.splitBy(strToSplit, delimiter);
            }
            case 'BinaryExpression': {
                const left = this.evaluate(node.left, env);
                const right = this.evaluate(node.right, env);
                if (node.operator === '*') return left * right;
                if (node.operator === '/') return left / right;
                if (node.operator === '+') return left + right;
                if (node.operator === '-') return left - right;
                break;
            }
            case 'NumericLiteral':
                return node.value;
            case 'StringLiteral':
                return node.value;
            case 'Identifier':
                if (node.name in env) return env[node.name];
                throw new Error(`找不到名為 '${node.name}' 的變數。`);
            case 'SayStatement': {
                let outputValue = this.evaluate(node.value, env);
                if (typeof outputValue === 'string') {
                    outputValue = outputValue.replace(/\{(\w+)\}/g, (match, varName) => {
                        return env[varName] !== undefined ? env[varName] : match;
                    });
                } else if (Array.isArray(outputValue)) {
                    outputValue = `[${outputValue.map(item => JSON.stringify(item)).join(', ')}]`;
                }
                this.log(outputValue);
                break;
            }
        }
    }

    log(message) {
        if (!this.outputElement) return;
        const p = document.createElement('p');
        p.textContent = `> ${message}`;
        this.outputElement.appendChild(p);
    }

    logError(message) {
        if (!this.outputElement) return;
        const p = document.createElement('p');
        p.className = 'text-red-400';
        p.textContent = `! 錯誤: ${message}`;
        this.outputElement.appendChild(p);
    }
}

export { Evaluator };

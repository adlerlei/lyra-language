import { LyraError } from './lexer.js';

export class Compiler {
    constructor() {
        this.varCounter = 0;
    }

    compile(ast) {
        if (ast.type !== 'Program') throw new LyraError('Compiler: 必須傳入 Program AST');
        const body = ast.body.map(stmt => this.generate(stmt)).join('\n');
        return '// Lyra compiled to JS - ' + new Date().toISOString() + '\n' +
               '// Adler Lei 願景實現 - 高效純 JS\n' +
               '(() => {\n' +
               '    const environment = {};\n' +
               body + '\n' +
               '})();';
    }

    generate(node) {
        switch (node.type) {
            case 'AssignmentStatement':
                return 'environment["' + node.name + '"] = ' + this.generate(node.value) + ';';
            case 'SayStatement':
                return 'console.log(' + this.generate(node.value) + ');';
            case 'WhenStatement':
                let code = 'if (' + this.generate(node.condition) + ') {\n';
                code += node.thenBody.map(s => '    ' + this.generate(s)).join('\n') + '\n}';
                for (const branch of node.elseIfBranches) {
                    code += ' else if (' + this.generate(branch.condition) + ') {\n';
                    code += branch.body.map(s => '    ' + this.generate(s)).join('\n') + '\n}';
                }
                if (node.elseBody) {
                    code += ' else {\n';
                    code += node.elseBody.map(s => '    ' + this.generate(s)).join('\n') + '\n}';
                }
                return code;
            case 'RepeatStatement':
                const timesVar = '_t' + this.varCounter++;
                return 'for (let ' + timesVar + ' = 0; ' + timesVar + ' < ' + this.generate(node.times) + '; ' + timesVar + '++) {\n' +
                       node.body.map(s => '    ' + this.generate(s)).join('\n') + '\n}';
            case 'ForEachStatement':
                return 'for (const ' + node.variable + ' of ' + this.generate(node.collection) + ') {\n' +
                       node.body.map(s => '    ' + this.generate(s)).join('\n') + '\n}';
            case 'AddStatement':
                return 'environment["' + node.list + '"].push(' + this.generate(node.value) + ');';
            case 'ListLiteral':
                return '[' + node.elements.map(el => this.generate(el)).join(', ') + ']';
            case 'Identifier':
                return 'environment["' + node.name + '"]';
            case 'StringLiteral':
                return JSON.stringify(node.value);
            case 'NumericLiteral':
                return node.value.toString();
            case 'BooleanLiteral':
                return node.value.toString();
            case 'BinaryExpression':
                return '(' + this.generate(node.left) + ' ' + node.operator + ' ' + this.generate(node.right) + ')';
            case 'ComparisonExpression':
                return '(' + this.generate(node.left) + ' ' + node.operator + ' ' + this.generate(node.right) + ')';
            case 'CountExpression':
                return this.generate(node.list) + '.length';
            case 'InterpolatedString':
                const parts = node.parts.map(p => typeof p === 'string' ? JSON.stringify(p) : this.generate(p));
                return parts.join(' + ') || '""';
            case 'RoundExpression':
                return 'Math.round(' + this.generate(node.number) + ')';
            default:
                console.warn('Compiler 未支援節點:', node.type);
                return '// TODO: ' + node.type;
        }
    }
}
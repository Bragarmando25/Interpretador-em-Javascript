const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '>>> '
});

const variables = {};

function evaluateExpression(expr) {
    // Verifica se a expressão contém apenas números, operadores e variáveis
  const replacedExpr = expr.replace(/[a-zA-Z_]\w*/g, (name) => {
    if (variables.hasOwnProperty(name)) {
      return variables[name];
    } else {
      throw new Error(`Variável não definida: ${name}`);
    }
  });

  try {
    return Function(`"use strict"; return (${replacedExpr});`)();
  } catch (err) {
    throw new Error('Expressão inválida');
  }
}

function processLine(line) {
  line = line.trim();

  if (line === '') return;

  // Divide a linha em partes, esquerda e direita, com base no sinal de igual
  // Se houver um sinal de igual, trata como atribuição de variável
  if (line.includes('=')) {
    const [left, right] = line.split('=');
    const varName = left.trim();
    const expression = right.trim();

    if (!/^[a-zA-Z_]\w*$/.test(varName)) {
      console.log('Nome de variável inválido');
      return;
    }

    try {
      const value = evaluateExpression(expression);
      variables[varName] = value;
      console.log(value);
    } catch (err) {
      console.log('Erro:', err.message);
    }
  } else {
    try {
      const result = evaluateExpression(line);
      console.log(result);
    } catch (err) {
      console.log('Erro:', err.message);
    }
  }
}

console.log('Interpretador JavaScript (digite Ctrl+C para sair)');
rl.prompt();

rl.on('line', (line) => {
  try {
    processLine(line);
  } catch (err) {
    console.log('Erro:', err.message);
  }
  rl.prompt();
});

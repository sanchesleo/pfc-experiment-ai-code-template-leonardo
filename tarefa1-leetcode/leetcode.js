/**
 * LeetCode Problem: Valid Parentheses
 * 
 * Problema: Dada uma string contendo apenas os caracteres '(', ')', '{', '}', '[' e ']',
 * determine se a string de entrada é válida.
 * 
 * Uma string de entrada é válida se:
 * 1. Parênteses abertos devem ser fechados pelo mesmo tipo.
 * 2. Parênteses abertos devem ser fechados na ordem correta.
 * 3. Cada parêntese fechado tem um parêntese aberto correspondente do mesmo tipo.
 * 
 * Categoria: String, Stack
 * 
 * Exemplo:
 * Input: s = "()"
 * Output: true
 * 
 * Input: s = "()[]{}"
 * Output: true
 * 
 * Input: s = "(]"
 * Output: false
 * 
 * Input: s = "([)]"
 * Output: false
 * 
 * Input: s = "{[]}"
 * Output: true
 */

console.log("Início Tarefa 1 - ['SEM IA']");


function isValid(s) {
  const stack = [];
  const pairs = {
    ')': '(',
    ']': '[',
    '}': '{'
  };

  for (let char of s) {
    // Se for um parêntese de fechamento
    if (pairs[char]) {
      const top = stack.pop(); // Remove o último aberto
      if (top !== pairs[char]) {
        return false; // Não corresponde
      }
    } else {
      // Se for um parêntese de abertura
      stack.push(char);
    }
  }

  // Se a pilha estiver vazia, todos os parênteses foram fechados corretamente
  return stack.length === 0;
}



function findFirstError(s) {
  const stack = [];
  const pairs = {
    ')': '(',
    ']': '[',
    '}': '{'
  };

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    // Caso seja fechamento
    if (pairs[char]) {
      if (stack.length === 0) {
        return {
          valid: false,
          error: `Parêntese fechado sem abertura: '${char}'`,
          position: i,
          character: char
        };
      }

      const top = stack.pop();

      if (top.char !== pairs[char]) {
        return {
          valid: false,
          error: `Parêntese '${char}' não corresponde ao '${top.char}' aberto na posição ${top.pos}`,
          position: i,
          character: char
        };
      }
    }

    // Caso seja abertura
    else if (['(', '[', '{'].includes(char)) {
      stack.push({ char, pos: i });
    }
  }

  // Se sobrou algo na pilha, é parêntese não fechado
  if (stack.length > 0) {
    const last = stack.pop();
    return {
      valid: false,
      error: `Parêntese '${last.char}' na posição ${last.pos} não foi fechado`,
      position: last.pos,
      character: last.char
    };
  }

  // Tudo certo
  return {
    valid: true,
    error: null,
    position: -1,
    character: ''
  };
}




module.exports = { isValid, findFirstError };
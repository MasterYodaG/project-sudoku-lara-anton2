// Подключаем нужные функции из sudoku.js
const { readAll, solve, isSolved, prettyBoard } = require('./sudoku.js');

// Читаем все пазлы из файла puzzles.txt
const boards = readAll('./puzzles.txt');

// Берём первый пазл (можно менять индекс)
const board = boards[0];

// Решаем и выводим результат
if (solve(board)) {
  prettyBoard(board);
  console.log('Решено?', isSolved(board));
} else {
  console.log('Решение не найдено');
}
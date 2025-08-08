const fs = require('fs');

function readAll(path) {
  const lines = fs.readFileSync(path, 'utf-8').trim().split('\n');

  return lines.map(line => {
    const vals = [...line]
      .filter(ch => /[0-9.\-]/.test(ch))
      .map(ch => (ch === '-' || ch === '.' ? 0 : Number(ch)));

    if (vals.length !== 81) {
      throw new Error('Строка паззла должна содержать 81 символ (цифры и "-" / ".")');
    }

    const board = [];
    for (let r = 0; r < 9; r++) {
      board.push(vals.slice(r * 9, r * 9 + 9));
    }
    return board;
  });
}

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (i !== col && board[row][i] === num) return false;
    if (i !== row && board[i][col] === num) return false;
  }

  const r0 = Math.floor(row / 3) * 3;
  const c0 = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const rr = r0 + i,
        cc = c0 + j;
      if ((rr !== row || cc !== col) && board[rr][cc] === num) return false;
    }
  }
  return true;
}

function solve(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        for (let n = 1; n <= 9; n++) {
          if (isValid(board, r, c, n)) {
            board[r][c] = n;
            if (solve(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isSolved(board) {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (board[r][c] === 0) return false;

  const ok = arr => new Set(arr).size === 9 && !arr.includes(0);

  for (let i = 0; i < 9; i++) {
    const row = board[i];
    const col = board.map(r => r[i]);
    if (!ok(row) || !ok(col)) return false;
  }

  for (let r = 0; r < 9; r += 3) {
    for (let c = 0; c < 9; c += 3) {
      const box = [];
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) box.push(board[r + i][c + j]);
      if (!ok(box)) return false;
    }
  }

  return true;
}

function prettyBoard(board) {
  const sep = '------+-------+------';
  for (let i = 0; i < 9; i++) {
    let line = '';
    for (let j = 0; j < 9; j++) {
      line += (board[i][j] || '.') + ' ';
      if ((j + 1) % 3 === 0 && j < 8) line += '| ';
    }
    console.log(line.trim());
    if ((i + 1) % 3 === 0 && i < 8) console.log(sep);
  }
}

const boards = readAll('./puzzles.txt');
boards.forEach((board, i) => {
  console.log(`\nСудоку номер ${i + 1}:`);
  prettyBoard(board);
  console.log('Решение:');
  if (solve(board)) {
    prettyBoard(board);
    console.log('Решено?', isSolved(board));
  } else {
    console.log('Решение не найдено');
  }
});

module.exports = { readAll, solve, isSolved, prettyBoard };
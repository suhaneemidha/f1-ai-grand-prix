import fs from 'node:fs';
import path from 'node:path';

const tracksDir = path.resolve('src/tracks');

function createGrid(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      walkable: true,
      terrainCost: 1,
    })),
  );
}

function writeTrack(filename, grid, start, end) {
  fs.mkdirSync(tracksDir, { recursive: true });

  const output = {
    grid,
    start,
    end,
  };

  fs.writeFileSync(
    path.join(tracksDir, filename),
    `${JSON.stringify(output, null, 2)}\n`,
  );
}

function buildLevel2() {
  const rows = 14;
  const cols = 16;
  const wallRow = 7;

  const grid = createGrid(rows, cols);

  for (let col = 0; col < cols; col += 1) {
    if (col !== 0) {
      grid[wallRow][col].walkable = false;
    }
  }

  for (let row = wallRow - 2; row < wallRow; row += 1) {
    for (let col = 2; col < cols; col += 1) {
      grid[row][col].walkable = true;
    }
  }

  grid[5][1].walkable = false;
  grid[6][1].walkable = false;

  for (let row = wallRow; row < rows; row += 1) {
    grid[row][0].walkable = true;
    grid[row][1].walkable = true;
  }

  const start = { row: 13, col: 7 };
  const end = { row: 0, col: 7 };

  writeTrack('level2.json', grid, start, end);
}

buildLevel2();
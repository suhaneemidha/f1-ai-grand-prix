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

function writeTrack(filename, grid, start, end, dynamicObstacles) {
  fs.mkdirSync(tracksDir, { recursive: true });

  const output = {
    grid,
    start,
    end,
    dynamicObstacles,
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

  writeTrack('level2.json', grid, start, end, []);
}

function buildLevel3() {
  const rows = 11;
  const cols = 14;

  const grid = createGrid(rows, cols);

  for (let col = 6; col <= 8; col += 1) {
    grid[5][col].terrainCost = 5;
  }

  const start = { row: 5, col: 0 };
  const end = { row: 5, col: 13 };

  writeTrack('level3.json', grid, start, end, []);
}

function buildLevel4() {
  const rows = 12;
  const cols = 16;

  const grid = createGrid(rows, cols);

  const start = { row: 11, col: 0 };
  const end = { row: 0, col: 15 };

  const dynamicObstacles = [
    {
      position: { row: 6, col: 9 },
      activeFrom: 2.0,
      activeUntil: 20.0,
    },
  ];

  writeTrack(
    'level4.json',
    grid,
    start,
    end,
    dynamicObstacles,
  );
}

buildLevel2();
buildLevel3();
buildLevel4();
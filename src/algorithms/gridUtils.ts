import type { Grid, GridPosition } from './types';

export function posKey(p: GridPosition): string {
  return `${p.row},${p.col}`;
}

export function getNeighbors(
  pos: GridPosition,
  grid: Grid
): GridPosition[] {
  const deltas = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];

  const neighbors: GridPosition[] = [];

  for (const d of deltas) {
    const r = pos.row + d.row;
    const c = pos.col + d.col;

    if (
      r >= 0 &&
      r < grid.length &&
      c >= 0 &&
      c < grid[0].length &&
      grid[r][c].walkable
    ) {
      neighbors.push({ row: r, col: c });
    }
  }

  return neighbors;
}

export function reconstructPath(
  cameFrom: Map<string, GridPosition>,
  current: GridPosition,
  start: GridPosition
): GridPosition[] {
  const path = [current];
  let curKey = posKey(current);

  while (curKey !== posKey(start)) {
    const prev = cameFrom.get(curKey)!;
    path.unshift(prev);
    curKey = posKey(prev);
  }

  return path;
}
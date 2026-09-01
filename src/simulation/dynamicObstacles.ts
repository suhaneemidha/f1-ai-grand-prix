import type { Grid, GridPosition } from '../algorithms/types';

export interface DynamicObstacle {
  position: GridPosition;
  activeFrom: number;
  activeUntil: number;
}

export function applyDynamicObstacles(
  baseGrid: Grid,
  obstacles: DynamicObstacle[],
  currentTime: number
): Grid {
  const grid = baseGrid.map((row) =>
    row.map((cell) => ({ ...cell }))
  );

  for (const obstacle of obstacles) {
    if (
      currentTime >= obstacle.activeFrom &&
      currentTime <= obstacle.activeUntil
    ) {
      grid[obstacle.position.row][
        obstacle.position.col
      ].walkable = false;
    }
  }

  return grid;
}

export function isPathBlocked(
  path: GridPosition[],
  fromIndex: number,
  grid: Grid,
  lookahead = 5
): boolean {
  const end = Math.min(
    fromIndex + lookahead,
    path.length - 1
  );

  for (let i = fromIndex; i <= end; i++) {
    const cell = path[i];

    if (!grid[cell.row][cell.col].walkable) {
      return true;
    }
  }

  return false;
}
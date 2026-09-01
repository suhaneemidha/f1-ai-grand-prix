import type { GridPosition } from './types';

export function manhattanDistance(
  a: GridPosition,
  b: GridPosition
): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}
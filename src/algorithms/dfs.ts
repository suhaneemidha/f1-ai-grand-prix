import type { Grid, GridPosition, SearchResult } from './types';
import { posKey, getNeighbors, reconstructPath } from './gridUtils';

export function dfs(
  grid: Grid,
  start: GridPosition,
  end: GridPosition
): SearchResult {
  const stack: GridPosition[] = [start];
  const visited = new Set<string>([posKey(start)]);
  const cameFrom = new Map<string, GridPosition>();
  const exploredOrder: GridPosition[] = [];

  while (stack.length > 0) {
    const current = stack.pop()!;
    exploredOrder.push(current);

    if (current.row === end.row && current.col === end.col) {
      const path = reconstructPath(cameFrom, current, start);

      return {
        path,
        nodesExplored: exploredOrder.length,
        totalCost: path.length - 1,
        exploredOrder,
      };
    }

    for (const neighbor of getNeighbors(current, grid)) {
      const key = posKey(neighbor);

      if (!visited.has(key)) {
        visited.add(key);
        cameFrom.set(key, current);
        stack.push(neighbor);
      }
    }
  }

  return {
    path: [],
    nodesExplored: exploredOrder.length,
    totalCost: Infinity,
    exploredOrder,
  };
}
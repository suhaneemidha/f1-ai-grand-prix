import type { Grid, GridPosition, SearchResult } from './types';
import { posKey, getNeighbors, reconstructPath } from './gridUtils';

export function bfs(
  grid: Grid,
  start: GridPosition,
  end: GridPosition
): SearchResult {
  const queue: GridPosition[] = [start];
  const visited = new Set<string>([posKey(start)]);
  const cameFrom = new Map<string, GridPosition>();
  const exploredOrder: GridPosition[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    exploredOrder.push(current);

    if (current.row === end.row && current.col === end.col) {
      return {
        path: reconstructPath(cameFrom, current, start),
        nodesExplored: exploredOrder.length,
        totalCost: reconstructPath(cameFrom, current, start).length - 1,
        exploredOrder,
      };
    }

    for (const neighbor of getNeighbors(current, grid)) {
      const key = posKey(neighbor);

      if (!visited.has(key)) {
        visited.add(key);
        cameFrom.set(key, current);
        queue.push(neighbor);
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
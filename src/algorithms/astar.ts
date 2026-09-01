import type {
  Grid,
  GridPosition,
  SearchResult,
} from './types';

import {
  posKey,
  getNeighbors,
  reconstructPath,
} from './gridUtils';

import { PriorityQueue } from './priorityQueue';
import { manhattanDistance } from './heuristics';

export function astar(
  grid: Grid,
  start: GridPosition,
  end: GridPosition
): SearchResult {
  const queue = new PriorityQueue<GridPosition>();

  queue.enqueue(start, manhattanDistance(start, end));

  const visited = new Set<string>();
  const cameFrom = new Map<string, GridPosition>();
  const costSoFar = new Map<string, number>();

  costSoFar.set(posKey(start), 0);

  const exploredOrder: GridPosition[] = [];

  while (!queue.isEmpty()) {
    const current = queue.dequeue()!;
    const currentKey = posKey(current);

    if (visited.has(currentKey)) {
      continue;
    }

    visited.add(currentKey);
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
      const neighborKey = posKey(neighbor);

      const newCost = costSoFar.get(currentKey)! + 1;
      const previousCost = costSoFar.get(neighborKey);

      if (previousCost === undefined || newCost < previousCost) {
        costSoFar.set(neighborKey, newCost);
        cameFrom.set(neighborKey, current);

        const priority =
          newCost + manhattanDistance(neighbor, end);

        queue.enqueue(neighbor, priority);
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
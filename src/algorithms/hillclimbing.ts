import type {
  Grid,
  GridPosition,
  SearchResult,
} from './types';

import {
  posKey,
  getNeighbors,
} from './gridUtils';

import { manhattanDistance } from './heuristics';

export function hillClimbing(
  grid: Grid,
  start: GridPosition,
  end: GridPosition
): SearchResult {
  let current = start;

  const visited = new Set<string>();
  const cameFrom = new Map<string, GridPosition>();
  const exploredOrder: GridPosition[] = [start];

  visited.add(posKey(start));

  while (true) {
    if (current.row === end.row && current.col === end.col) {
      const path: GridPosition[] = [];
      let node: GridPosition | undefined = current;

      while (node) {
        path.unshift(node);

        if (
          node.row === start.row &&
          node.col === start.col
        ) {
          break;
        }

        node = cameFrom.get(posKey(node));
      }

      return {
        path,
        nodesExplored: exploredOrder.length,
        totalCost: path.length - 1,
        exploredOrder,
      };
    }

    const currentHeuristic = manhattanDistance(current, end);

    const neighbors = getNeighbors(current, grid)
      .filter((neighbor) => !visited.has(posKey(neighbor)));

    if (neighbors.length === 0) {
      break;
    }

    let bestNeighbor = neighbors[0];
    let bestHeuristic = manhattanDistance(bestNeighbor, end);

    for (const neighbor of neighbors.slice(1)) {
      const heuristic = manhattanDistance(neighbor, end);

      if (heuristic < bestHeuristic) {
        bestNeighbor = neighbor;
        bestHeuristic = heuristic;
      }
    }

    if (bestHeuristic >= currentHeuristic) {
      break;
    }

    cameFrom.set(posKey(bestNeighbor), current);
    visited.add(posKey(bestNeighbor));

    current = bestNeighbor;
    exploredOrder.push(current);
  }

  return {
    path: [],
    nodesExplored: exploredOrder.length,
    totalCost: Infinity,
    exploredOrder,
  };
}
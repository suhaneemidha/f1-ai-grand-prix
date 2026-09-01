import type { CarState } from './types';
import type {
  Grid,
  GridPosition,
  SearchResult,
} from '../algorithms/types';

import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import { ucs } from '../algorithms/ucs';
import { greedy } from '../algorithms/greedy';
import { astar } from '../algorithms/astar';

import { isPathBlocked } from './dynamicObstacles';

const REPLAN_TIME_PER_NODE = 0.01;

const algorithmMap: Record<
  string,
  (
    grid: Grid,
    start: GridPosition,
    end: GridPosition
  ) => SearchResult
> = {
  BFS: bfs,
  DFS: dfs,
  UCS: ucs,
  Greedy: greedy,
  AStar: astar,
};

export function checkAndReplan(
  car: CarState,
  grid: Grid,
  finalDestination: GridPosition
): void {
  if (car.finished) return;

  if (!isPathBlocked(car.path, car.pathIndex, grid)) {
    return;
  }

  const searchFn = algorithmMap[car.algorithm];

  if (!searchFn) {
    return;
  }

  const currentPos = car.path[car.pathIndex];

  const result = searchFn(
    grid,
    currentPos,
    finalDestination
  );

  if (result.path.length === 0) {
    return;
  }

  car.path = result.path;
  car.pathIndex = 0;
  car.segmentProgress = 0;

  car.totalNodesExplored += result.nodesExplored;
  car.replanCount += 1;

  const thinkingTime =
    result.nodesExplored * REPLAN_TIME_PER_NODE;

  car.totalReplanLatency += thinkingTime;
  car.elapsedTime += thinkingTime;
}
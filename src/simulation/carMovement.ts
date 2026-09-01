import type { CarState, AlgorithmName } from './types';
import type { Grid, GridPosition, SearchResult } from '../algorithms/types';
const BASE_SPEED = 2;
const CELL_SIZE = 32;

export function createCar(
  algorithm: AlgorithmName,
  path: GridPosition[]
): CarState {
  return {
    algorithm,
    path,
    pathIndex: 0,
    segmentProgress: 0,
    position: gridToWorld(path[0]),
    finished: false,
    finishTime: null,
    elapsedTime: 0,
    totalNodesExplored: 0,
    replanCount: 0,
    totalReplanLatency: 0,
  };
}

export function createCarFromSearchResult(
  algorithm: AlgorithmName,
  result: SearchResult
): CarState {
  const car = createCar(algorithm, result.path);
  car.totalNodesExplored = result.nodesExplored;
  return car;
}

export function gridToWorld(
  pos: GridPosition,
  cellSize = CELL_SIZE
): { x: number; y: number } {
  return {
    x: pos.col * cellSize + cellSize / 2,
    y: pos.row * cellSize + cellSize / 2,
  };
}

export function stepCar(
  car: CarState,
  grid: Grid,
  deltaTime: number
): void {
  if (car.finished || car.path.length < 2) {
    car.finished = true;
    car.finishTime ??= car.elapsedTime;
    return;
  }

  const nextCell = car.path[car.pathIndex + 1];

  const terrainCost =
    grid[nextCell.row][nextCell.col].terrainCost;

  const speed = BASE_SPEED / terrainCost;

  car.elapsedTime += deltaTime;
  car.segmentProgress += speed * deltaTime;

  if (car.segmentProgress >= 1) {
    car.segmentProgress = 0;
    car.pathIndex += 1;
  }

  if (car.pathIndex >= car.path.length - 1) {
    car.finished = true;
    car.finishTime = car.elapsedTime;
    car.position = gridToWorld(
      car.path[car.path.length - 1]
    );
    return;
  }

  const from = gridToWorld(car.path[car.pathIndex]);

  const to = gridToWorld(
    car.path[car.pathIndex + 1]
  );

  car.position = {
    x: from.x + (to.x - from.x) * car.segmentProgress,
    y: from.y + (to.y - from.y) * car.segmentProgress,
  };
}
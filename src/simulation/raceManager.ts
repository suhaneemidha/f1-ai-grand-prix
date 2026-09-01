import type { CarState } from './types';
import type { Grid, GridPosition } from '../algorithms/types';
import type { DynamicObstacle } from './dynamicObstacles';

import { stepCar } from './carMovement';
import { applyDynamicObstacles } from './dynamicObstacles';
import { checkAndReplan } from './replanning';

export interface RaceConfig {
  baseGrid: Grid;
  destination: GridPosition;
  dynamicObstacles?: DynamicObstacle[];
  tickRate?: number;
  maxDuration?: number;
}

export interface RaceResultEntry {
  algorithm: string;
  finishTime: number | null;
  totalNodesExplored: number;
  replanCount: number;
  totalReplanLatency: number;
  finished: boolean;
}

export function runRace(
  cars: CarState[],
  config: RaceConfig
): RaceResultEntry[] {
  const tickRate = config.tickRate ?? 60;
  const maxDuration = config.maxDuration ?? 120;

  const deltaTime = 1 / tickRate;

  let elapsedTime = 0;

while (
  elapsedTime < maxDuration &&
  cars.some((car) => !car.finished)
) {
  const activeGrid = applyDynamicObstacles(
    config.baseGrid,
    config.dynamicObstacles ?? [],
    elapsedTime
  );

  for (const car of cars) {
    if (car.finished) {
      continue;
    }

    checkAndReplan(
      car,
      activeGrid,
      config.destination
    );

    stepCar(
      car,
      activeGrid,
      deltaTime
    );
  }

  elapsedTime += deltaTime;
}

  return cars.map((car) => ({
    algorithm: car.algorithm,
    finishTime: car.finishTime,
    totalNodesExplored: car.totalNodesExplored,
    replanCount: car.replanCount,
    totalReplanLatency: car.totalReplanLatency,
    finished: car.finished,
  }));
}
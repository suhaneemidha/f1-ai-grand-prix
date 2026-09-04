import type { CarState } from './types';
import type { RaceConfig, RaceResultEntry } from './raceManager';
import { applyDynamicObstacles } from './dynamicObstacles';
import { checkAndReplan } from './replanning';
import { stepCar } from './carMovement';

export interface CarSnapshot {
  algorithm: string;
  position: { x: number; y: number };
  distanceTraveled: number;
  finished: boolean;
}

export interface RaceFrame {
  time: number;
  cars: CarSnapshot[];
}

export interface RaceReplay {
  frames: RaceFrame[];
  results: RaceResultEntry[];
}

export function recordRace(cars: CarState[], config: RaceConfig): RaceReplay {
  const tickRate = config.tickRate ?? 30;
  const deltaTime = 1 / tickRate;
  const maxDuration = config.maxDuration ?? 120;
  let simTime = 0;
  const frames: RaceFrame[] = [];

  while (simTime < maxDuration && cars.some(c => !c.finished)) {
    const activeGrid = config.dynamicObstacles
      ? applyDynamicObstacles(config.baseGrid, config.dynamicObstacles, simTime)
      : config.baseGrid;

    for (const car of cars) {
      if (car.finished) continue;
      checkAndReplan(car, activeGrid, config.destination);
      stepCar(car, activeGrid, deltaTime);
    }

    frames.push({
      time: simTime,
      cars: cars.map(c => ({
        algorithm: c.algorithm,
        position: c.position,
        distanceTraveled: c.distanceTraveled,
        finished: c.finished,
      })),
    });

    simTime += deltaTime;
  }

  const results: RaceResultEntry[] = cars.map(c => ({
    algorithm: c.algorithm,
    finishTime: c.finishTime,
    totalNodesExplored: c.totalNodesExplored,
    replanCount: c.replanCount,
    totalReplanLatency: c.totalReplanLatency,
    finished: c.finished,
  }));

  return { frames, results };
}
import type { Grid, GridPosition, SearchResult } from '../algorithms/types';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import { ucs } from '../algorithms/ucs';
import { greedy } from '../algorithms/greedy';
import { astar } from '../algorithms/astar';
import { createCarFromSearchResult } from './carMovement';
import { recordRace } from './raceRecorder';
import type { CarState, AlgorithmName } from './types';
import type { RaceConfig } from './raceManager';
import level1 from '../tracks/level1.json';
import level2 from '../tracks/level2.json';

export interface RaceSetup {
  cars: CarState[];
  replay: ReturnType<typeof recordRace>;
  exploredByAlgorithm: Record<string, GridPosition[]>;
}

export interface LevelDefinition {
  id: string;
  name: string;
  description: string;
  grid: Grid;
  start: GridPosition;
  end: GridPosition;
}

export const LEVELS: Record<string, LevelDefinition> = {
  level1: {
    id: 'level1',
    name: 'Level 1 — Straight Line',
    description: 'The baseline track. No tricks, just pure search.',
    grid: level1.grid,
    start: level1.start,
    end: level1.end,
  },
  level2: {
    id: 'level2',
    name: 'Level 2 — The Trap',
    description: 'A misleading layout designed to expose search efficiency.',
    grid: level2.grid,
    start: level2.start,
    end: level2.end,
  },
};

export function setupRace(
  grid: Grid,
  start: GridPosition,
  destination: GridPosition,
  config: Omit<RaceConfig, 'baseGrid' | 'destination'> = {},
): RaceSetup {
  const algorithms: {
    name: AlgorithmName;
    search: (
      grid: Grid,
      start: GridPosition,
      end: GridPosition,
    ) => SearchResult;
  }[] = [
    { name: 'BFS', search: bfs },
    { name: 'DFS', search: dfs },
    { name: 'UCS', search: ucs },
    { name: 'Greedy', search: greedy },
    { name: 'AStar', search: astar },
  ];

  const cars: CarState[] = [];
  const exploredByAlgorithm: Record<string, GridPosition[]> = {};

  for (const algorithm of algorithms) {
    const result = algorithm.search(grid, start, destination);

    const car = createCarFromSearchResult(
      algorithm.name,
      result,
    );

    cars.push(car);
    exploredByAlgorithm[algorithm.name] = result.exploredOrder;
  }

  const raceConfig: RaceConfig = {
    ...config,
    baseGrid: grid,
    destination,
  };

  const replay = recordRace(cars, raceConfig);

  return {
    cars,
    replay,
    exploredByAlgorithm,
  };
}
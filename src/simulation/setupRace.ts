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

export interface RaceSetup {
  cars: CarState[];
  replay: ReturnType<typeof recordRace>;
  exploredByAlgorithm: Record<string, GridPosition[]>;
}

export function setupRace(
  grid: Grid,
  start: GridPosition,
  destination: GridPosition,
  config: Omit<RaceConfig, 'baseGrid' | 'destination'> = {},
): RaceSetup {
  const algorithms: {
    name: AlgorithmName;
    search: (grid: Grid, start: GridPosition, end: GridPosition) => SearchResult;
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
import type { GridPosition } from '../algorithms/types';

export type AlgorithmName =
  | 'BFS'
  | 'DFS'
  | 'UCS'
  | 'Greedy'
  | 'AStar'
  | 'HillClimbing'
  | 'GeneticAlgorithm';

export interface CarState {
  algorithm: AlgorithmName;
  path: GridPosition[];
  pathIndex: number;
  segmentProgress: number;
  position: {
    x: number;
    y: number;
  };
  finished: boolean;
  finishTime: number | null;
  elapsedTime: number;
  totalNodesExplored: number;
  replanCount: number;
  totalReplanLatency: number;
  distanceTraveled: number;
}
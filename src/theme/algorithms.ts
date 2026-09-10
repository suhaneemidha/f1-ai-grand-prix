import type { AlgorithmName } from '../simulation/types';

export interface AlgorithmMeta {
  id: AlgorithmName;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  colorNumber: number;
  /** Whether this algorithm produces search/explored-node data (vs. a fixed racing line). */
  isSearchAlgorithm: boolean;
}

function toColorNumber(hex: string): number {
  return parseInt(hex.replace('#', ''), 16);
}

const RAW: Omit<AlgorithmMeta, 'colorNumber'>[] = [
  {
    id: 'BFS',
    label: 'BFS',
    shortLabel: 'BFS',
    description: 'Uninformed search that explores the grid in breadth-first order.',
    color: '#3b82f6',
    isSearchAlgorithm: true,
  },
  {
    id: 'DFS',
    label: 'DFS',
    shortLabel: 'DFS',
    description: 'Uninformed search that follows one branch deeply before backtracking.',
    color: '#f43f5e',
    isSearchAlgorithm: true,
  },
  {
    id: 'UCS',
    label: 'UCS',
    shortLabel: 'UCS',
    description: 'Cost-aware search that finds the lowest-cost route.',
    color: '#22c55e',
    isSearchAlgorithm: true,
  },
  {
    id: 'Greedy',
    label: 'Greedy Best-First',
    shortLabel: 'Greedy',
    description: 'Heuristic-driven search focused on distance to the goal.',
    color: '#f5a524',
    isSearchAlgorithm: true,
  },
  {
    id: 'AStar',
    label: 'A*',
    shortLabel: 'A*',
    description: 'Combines path cost with heuristic distance.',
    color: '#a855f7',
    isSearchAlgorithm: true,
  },
  {
    id: 'HillClimbing',
    label: 'Hill Climbing',
    shortLabel: 'Hill Climb',
    description: 'Optimizes a fixed racing-line speed profile.',
    color: '#fb7a24',
    isSearchAlgorithm: false,
  },
  {
    id: 'GeneticAlgorithm',
    label: 'Genetic Algorithm',
    shortLabel: 'Genetic',
    description: 'Evolves racing-line speed profiles using population-based optimization.',
    color: '#ec4899',
    isSearchAlgorithm: false,
  },
];

export const ALGORITHMS: AlgorithmMeta[] = RAW.map((algorithm) => ({
  ...algorithm,
  colorNumber: toColorNumber(algorithm.color),
}));

export const ALGORITHM_BY_ID: Record<string, AlgorithmMeta> = Object.fromEntries(
  ALGORITHMS.map((algorithm) => [algorithm.id, algorithm]),
);

export function getAlgorithm(id: string): AlgorithmMeta | undefined {
  return ALGORITHM_BY_ID[id];
}

export function getAlgorithmColor(id: string): string {
  return ALGORITHM_BY_ID[id]?.color ?? '#ffffff';
}

export function getAlgorithmColorNumber(id: string): number {
  return ALGORITHM_BY_ID[id]?.colorNumber ?? 0xffffff;
}

export function getAlgorithmLabel(id: string): string {
  return ALGORITHM_BY_ID[id]?.label ?? id;
}

export function getAlgorithmShortLabel(id: string): string {
  return ALGORITHM_BY_ID[id]?.shortLabel ?? id;
}

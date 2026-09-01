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

interface Individual {
  path: GridPosition[];
  fitness: number;
}

function fitness(
  path: GridPosition[],
  end: GridPosition
): number {
  if (path.length === 0) return Infinity;

  const last = path[path.length - 1];
  const distance = manhattanDistance(last, end);

  return distance + path.length * 0.1;
}

function createIndividual(
  grid: Grid,
  start: GridPosition,
  end: GridPosition,
  maxSteps: number
): Individual {
  const path: GridPosition[] = [start];
  let current = start;

  for (let i = 0; i < maxSteps; i++) {
    if (
      current.row === end.row &&
      current.col === end.col
    ) {
      break;
    }

    const neighbors = getNeighbors(current, grid);

    if (neighbors.length === 0) {
      break;
    }

    const next = neighbors[
      Math.floor(Math.random() * neighbors.length)
    ];

    path.push(next);
    current = next;
  }

  return {
    path,
    fitness: fitness(path, end),
  };
}

export function geneticAlgorithm(
  grid: Grid,
  start: GridPosition,
  end: GridPosition
): SearchResult {
  const populationSize = 50;
  const generations = 100;
  const maxSteps = grid.length * grid[0].length;

  let population: Individual[] = [];

  for (let i = 0; i < populationSize; i++) {
    population.push(
      createIndividual(grid, start, end, maxSteps)
    );
  }

  const exploredOrder: GridPosition[] = [];
  const explored = new Set<string>();

  for (let generation = 0; generation < generations; generation++) {
    population.sort((a, b) => a.fitness - b.fitness);

    const best = population[0];

    for (const position of best.path) {
      const key = posKey(position);

      if (!explored.has(key)) {
        explored.add(key);
        exploredOrder.push(position);
      }
    }

    const last = best.path[best.path.length - 1];

    if (
      last.row === end.row &&
      last.col === end.col
    ) {
      return {
        path: best.path,
        nodesExplored: exploredOrder.length,
        totalCost: best.path.length - 1,
        exploredOrder,
      };
    }

    const survivors = population.slice(
      0,
      Math.floor(populationSize / 2)
    );

    const nextPopulation: Individual[] = [...survivors];

    while (nextPopulation.length < populationSize) {
      const parent =
        survivors[
          Math.floor(Math.random() * survivors.length)
        ];

      const childPath = [...parent.path];

      if (childPath.length > 1 && Math.random() < 0.3) {
        const mutationIndex =
          1 + Math.floor(
            Math.random() * (childPath.length - 1)
          );

        const previous = childPath[mutationIndex - 1];
        const neighbors = getNeighbors(previous, grid);

        if (neighbors.length > 0) {
          childPath[mutationIndex] =
            neighbors[
              Math.floor(Math.random() * neighbors.length)
            ];
        }

        childPath.length = mutationIndex + 1;
      }

      const child: Individual = {
        path: childPath,
        fitness: fitness(childPath, end),
      };

      nextPopulation.push(child);
    }

    population = nextPopulation;
  }

  population.sort((a, b) => a.fitness - b.fitness);

  const best = population[0];

  return {
    path: best.path,
    nodesExplored: exploredOrder.length,
    totalCost: best.path.length - 1,
    exploredOrder,
  };
}
import type { GridPosition } from './types';
import type { SpeedProfile } from './racingLine';
import {
  lapTime,
  isValidProfile,
  randomProfile,
} from './racingLine';

export function racingLineGeneticAlgorithm(
  path: GridPosition[],
  populationSize = 40,
  generations = 150,
): SpeedProfile {
  let population: SpeedProfile[] = Array.from(
    { length: populationSize },
    () => randomProfile(path),
  );

  for (let gen = 0; gen < generations; gen++) {
    population.sort(
      (a, b) => fitness(path, a) - fitness(path, b),
    );

    const survivors = population.slice(
      0,
      Math.floor(populationSize / 2),
    );

    const children = survivors.map((_, i) => {
      const a = survivors[i % survivors.length];
      const b = survivors[(i + 1) % survivors.length];
      const child = crossover(a, b);

      return isValidProfile(path, child) ? child : a;
    });

    population = [...survivors, ...children].map((profile) =>
      mutate(profile, path),
    );
  }

  population.sort(
    (a, b) => fitness(path, a) - fitness(path, b),
  );

  return population[0];
}

function fitness(
  path: GridPosition[],
  profile: SpeedProfile,
): number {
  return isValidProfile(path, profile)
    ? lapTime(path, profile)
    : Infinity;
}

function crossover(
  a: SpeedProfile,
  b: SpeedProfile,
): SpeedProfile {
  const cut = Math.floor(
    Math.random() * a.speeds.length,
  );

  return {
    speeds: [
      ...a.speeds.slice(0, cut),
      ...b.speeds.slice(cut),
    ],
  };
}

function mutate(
  profile: SpeedProfile,
  path: GridPosition[],
): SpeedProfile {
  const speeds = profile.speeds.map((speed) =>
    Math.random() < 0.1
      ? Math.max(
          0.1,
          speed + (Math.random() - 0.5) * 0.4,
        )
      : speed,
  );

  return isValidProfile(path, { speeds })
    ? { speeds }
    : profile;
}
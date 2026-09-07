import type { GridPosition } from './types';
import type { SpeedProfile } from './racingLine';
import {
  lapTime,
  isValidProfile,
  defaultProfile,
} from './racingLine';

export function racingLineHillClimbing(
  path: GridPosition[],
  iterations = 500,
): SpeedProfile {
  let current = defaultProfile(path);

  for (let i = 0; i < iterations; i++) {
    const candidate = tweak(current);

    if (
      isValidProfile(path, candidate) &&
      lapTime(path, candidate) < lapTime(path, current)
    ) {
      current = candidate;
    }
  }

  return current;
}

function tweak(profile: SpeedProfile): SpeedProfile {
  const speeds = [...profile.speeds];
  const idx = Math.floor(Math.random() * speeds.length);

  speeds[idx] += (Math.random() - 0.5) * 0.5;

  return { speeds };
}
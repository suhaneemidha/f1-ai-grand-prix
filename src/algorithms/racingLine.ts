import type { GridPosition } from './types';

export interface SpeedProfile {
  speeds: number[];
}

const MAX_SPEED = 5;
const MAX_CORNER_SPEED = 2;
const MAX_ACCEL = 1;

function isCorner(path: GridPosition[], i: number): boolean {
  if (i === 0 || i === path.length - 1) return false;

  const v1 = {
    row: path[i].row - path[i - 1].row,
    col: path[i].col - path[i - 1].col,
  };

  const v2 = {
    row: path[i + 1].row - path[i].row,
    col: path[i + 1].col - path[i].col,
  };

  return !(v1.row === v2.row && v1.col === v2.col);
}

function speedCap(path: GridPosition[], i: number): number {
  return isCorner(path, i) ? MAX_CORNER_SPEED : MAX_SPEED;
}

export function lapTime(
  _path: GridPosition[],
  profile: SpeedProfile,
): number {
  return profile.speeds.reduce(
    (total, s) => total + 1 / Math.max(s, 0.1),
    0,
  );
}

export function isValidProfile(
  path: GridPosition[],
  profile: SpeedProfile,
): boolean {
  const withinCaps = profile.speeds.every(
    (s, i) => s > 0 && s <= speedCap(path, i),
  );

  if (!withinCaps) return false;

  for (let i = 1; i < profile.speeds.length; i++) {
    if (
      Math.abs(profile.speeds[i] - profile.speeds[i - 1]) >
      MAX_ACCEL
    ) {
      return false;
    }
  }

  return true;
}

export function defaultProfile(path: GridPosition[]): SpeedProfile {
  return {
    speeds: path.map(() => MAX_CORNER_SPEED),
  };
}

export function randomProfile(path: GridPosition[]): SpeedProfile {
  const speeds: number[] = [MAX_CORNER_SPEED];

  for (let i = 1; i < path.length; i++) {
    const cap = speedCap(path, i);
    const lo = Math.max(0.2, speeds[i - 1] - MAX_ACCEL);
    const hi = Math.min(cap, speeds[i - 1] + MAX_ACCEL);

    speeds.push(
      hi > lo ? lo + Math.random() * (hi - lo) : lo,
    );
  }

  return { speeds };
}
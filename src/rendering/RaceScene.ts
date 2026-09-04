import Phaser from 'phaser';
import type { Grid, GridPosition } from '../algorithms/types';
import type { RaceReplay } from '../simulation/raceRecorder';
import { ExploredNodesOverlay } from './ExploredNodesOverlay';

const CELL_SIZE = 32;

const TERRAIN_COLORS: Record<number, number> = {
  1: 0x2a2f3a,
  2: 0x4a3a2a,
  3: 0x2a4a5a,
};

const ALGORITHM_COLORS: Record<string, number> = {
  BFS: 0x3ddc97,
  DFS: 0xff6a1a,
  UCS: 0xffb800,
  Greedy: 0xe94560,
  AStar: 0x00d4ff,
  HillClimbing: 0xa970ff,
  GeneticAlgorithm: 0xff4fa3,
};

export interface RaceSceneConfig {
  grid: Grid;
  replay: RaceReplay;
  exploredByAlgorithm: Record<string, GridPosition[]>;
  onFrameUpdate?: (frameIndex: number, replay: RaceReplay) => void;
  onSearchPhaseComplete?: () => void;
}

export class RaceScene extends Phaser.Scene {
  private grid!: Grid;
  private replay!: RaceReplay;
  private exploredByAlgorithm!: Record<string, GridPosition[]>;

  private onFrameUpdate?: (
    frameIndex: number,
    replay: RaceReplay,
  ) => void;

  private onSearchPhaseComplete?: () => void;

  private carSprites: Map<string, Phaser.GameObjects.Arc> = new Map();
  private searchOverlays: ExploredNodesOverlay[] = [];

  private searchPhaseComplete = false;
  private searchPhaseCallbackFired = false;

  private playbackTime = 0;

  constructor() {
    super('RaceScene');
  }

  init(config: RaceSceneConfig) {
    this.grid = config.grid;
    this.replay = config.replay;
    this.exploredByAlgorithm = config.exploredByAlgorithm;
    this.onFrameUpdate = config.onFrameUpdate;
    this.onSearchPhaseComplete = config.onSearchPhaseComplete;

    this.playbackTime = 0;
    this.searchPhaseComplete = false;
    this.searchPhaseCallbackFired = false;
  }

  create() {
    this.drawTrack();
    this.createCars();
    this.createSearchOverlays();
  }

  update(_time: number, delta: number) {
    if (!this.searchPhaseComplete) {
      this.updateSearchPhase(delta);
      return;
    }

    if (!this.replay.frames.length) return;

    this.playbackTime += delta / 1000;

    const lastFrame = this.replay.frames[this.replay.frames.length - 1];

    if (this.playbackTime > lastFrame.time) {
      this.playbackTime = lastFrame.time;
    }

    const frameIndex = this.frameIndexForTime(this.playbackTime);
    const frame = this.replay.frames[frameIndex];

    if (!frame) return;

    for (const car of frame.cars) {
      const sprite = this.carSprites.get(car.algorithm);

      if (!sprite) continue;

      sprite.setPosition(car.position.x, car.position.y);
    }

    this.onFrameUpdate?.(frameIndex, this.replay);
  }

  private drawTrack() {
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        const cell = this.grid[row][col];

        const color = TERRAIN_COLORS[cell.terrainCost] ?? 0x2a2f3a;

        this.add
          .rectangle(
            col * CELL_SIZE + CELL_SIZE / 2,
            row * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE - 1,
            CELL_SIZE - 1,
            color,
          )
          .setOrigin(0.5);
      }
    }
  }

  private createCars() {
    if (!this.replay.frames.length) return;

    const firstFrame = this.replay.frames[0];

    for (const car of firstFrame.cars) {
      const color = ALGORITHM_COLORS[car.algorithm] ?? 0xffffff;

      const sprite = this.add.circle(
        car.position.x,
        car.position.y,
        8,
        color,
      );

      sprite.setVisible(false);

      this.carSprites.set(car.algorithm, sprite);
    }
  }

  private createSearchOverlays() {
    for (const [algorithm, exploredOrder] of Object.entries(
      this.exploredByAlgorithm,
    )) {
      if (!exploredOrder.length) continue;

      const color = ALGORITHM_COLORS[algorithm] ?? 0xffffff;

      const overlay = new ExploredNodesOverlay(
        this,
        exploredOrder,
        color,
      );

      this.searchOverlays.push(overlay);
    }

    if (this.searchOverlays.length === 0) {
      this.finishSearchPhase();
    }
  }

  private updateSearchPhase(delta: number) {
    if (!this.searchOverlays.length) {
      this.finishSearchPhase();
      return;
    }

    let allComplete = true;

    for (const overlay of this.searchOverlays) {
      const complete = overlay.update(delta);

      if (!complete) {
        allComplete = false;
      }
    }

    if (allComplete) {
      this.finishSearchPhase();
    }
  }

  private finishSearchPhase() {
    if (this.searchPhaseComplete) return;

    this.searchPhaseComplete = true;

    for (const overlay of this.searchOverlays) {
      overlay.destroy();
    }

    this.searchOverlays = [];

    for (const sprite of this.carSprites.values()) {
      sprite.setVisible(true);
    }

    if (!this.searchPhaseCallbackFired) {
      this.searchPhaseCallbackFired = true;
      this.onSearchPhaseComplete?.();
    }
  }

  private frameIndexForTime(time: number): number {
    const frames = this.replay.frames;

    let low = 0;
    let high = frames.length - 1;

    while (low < high) {
      const mid = Math.floor((low + high) / 2);

      if (frames[mid].time < time) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }

    return low;
  }
}
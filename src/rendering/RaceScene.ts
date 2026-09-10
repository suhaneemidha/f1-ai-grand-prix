import Phaser from 'phaser';
import type { Grid, GridPosition } from '../algorithms/types';
import type { RaceReplay } from '../simulation/raceRecorder';
import { ExploredNodesOverlay } from './ExploredNodesOverlay';
import { ALGORITHMS, getAlgorithmColorNumber } from '../theme/algorithms';
import type { DynamicObstacle } from '../simulation/dynamicObstacles';

const CELL_SIZE = 32;

const GRASS_COLOR = 0x2e6b2f;
const GRASS_COLOR_ALT = 0x2a6329;
const ROAD_COLOR = 0x3d4148;
const ROAD_EDGE_COLOR = 0x686d73;
const MUD_COLOR = 0x6a4c35;
const WATER_COLOR = 0x345a6e;
const START_COLOR = 0x35c759;
const FINISH_COLOR = 0xe10600;
const LINE_COLOR = 0xf2f2f2;

const ALGORITHM_ORDER = ALGORITHMS.map((algorithm) => algorithm.id);

export interface RaceSceneConfig {
  grid: Grid;
  start: GridPosition;
  end: GridPosition;
  replay: RaceReplay;
  exploredByAlgorithm: Record<string, GridPosition[]>;
  dynamicObstacles?: DynamicObstacle[];
  onFrameUpdate?: (
    frameIndex: number,
    replay: RaceReplay,
  ) => void;
  onSearchPhaseComplete?: () => void;
}

export class RaceScene extends Phaser.Scene {
  private grid!: Grid;
  private start!: GridPosition;
  private end!: GridPosition;
  private replay!: RaceReplay;
  private dynamicObstacles: DynamicObstacle[] = [];
  private exploredByAlgorithm!: Record<string, GridPosition[]>;

  private onFrameUpdate?: (
    frameIndex: number,
    replay: RaceReplay,
  ) => void;

  private onSearchPhaseComplete?: () => void;

  private carSprites: Map<
    string,
    Phaser.GameObjects.Container
  > = new Map();

  private carOffsets: Map<string, { x: number; y: number }> = new Map();
  private lastCarPositions: Map<string, { x: number; y: number }> = new Map();
  private visibleAlgorithms: Set<string> | null = null;

  private searchOverlays: ExploredNodesOverlay[] = [];

  private searchPhaseComplete = false;
  private searchPhaseCallbackFired = false;

  private playbackTime = 0;
  private speedMultiplier = 1;

  constructor() {
    super('RaceScene');
  }

  init(config: RaceSceneConfig) {
    this.grid = config.grid;
    this.start = config.start;
    this.end = config.end;
    this.replay = config.replay;
    this.dynamicObstacles = config.dynamicObstacles ?? [];
    this.exploredByAlgorithm = config.exploredByAlgorithm;
    this.onFrameUpdate = config.onFrameUpdate;
    this.onSearchPhaseComplete = config.onSearchPhaseComplete;
    this.playbackTime = 0;
    this.speedMultiplier = 1;
    this.searchPhaseComplete = false;
    this.searchPhaseCallbackFired = false;
    this.carSprites = new Map();
    this.carOffsets = new Map();
    this.lastCarPositions = new Map();
    this.visibleAlgorithms = null;
    this.searchOverlays = [];
  }

  create() {
    this.drawTrack();
    this.createCars();
    this.createSearchOverlays();
  }

  update(_time: number, delta: number) {
    const scaledDelta = delta * this.speedMultiplier;

    if (!this.searchPhaseComplete) {
      this.updateSearchPhase(scaledDelta);
      return;
    }

    if (!this.replay.frames.length) return;

    this.playbackTime += scaledDelta / 1000;

    const lastFrame =
      this.replay.frames[
        this.replay.frames.length - 1
      ];

    if (this.playbackTime > lastFrame.time) {
      this.playbackTime = lastFrame.time;
    }

    const frameIndex =
      this.frameIndexForTime(this.playbackTime);

    const frame = this.replay.frames[frameIndex];

    if (!frame) return;

    this.applyFrame(frame);

    this.onFrameUpdate?.(
      frameIndex,
      this.replay,
    );
  }

  /** Positions all car sprites according to a specific replay frame. */
  private applyFrame(frame: RaceReplay['frames'][number]) {
    for (const car of frame.cars) {
      const container = this.carSprites.get(car.algorithm);

      if (!container) continue;

      const offset =
        this.carOffsets.get(car.algorithm) ?? { x: 0, y: 0 };

      const prev = this.lastCarPositions.get(car.algorithm);

      if (prev) {
        const dx = car.position.x - prev.x;
        const dy = car.position.y - prev.y;

        if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
          container.setRotation(Math.atan2(dy, dx));
        }
      }

      this.lastCarPositions.set(car.algorithm, {
        x: car.position.x,
        y: car.position.y,
      });

      container.setPosition(
        car.position.x + offset.x,
        car.position.y + offset.y,
      );
    }
  }

  /** Pause/resume/reset/speed/visibility controls, called from React via RaceCanvas. */
  setSpeedMultiplier(speed: number) {
    this.speedMultiplier = speed;
  }

  resetPlayback() {
    this.playbackTime = 0;
    this.lastCarPositions = new Map();

    if (this.replay.frames.length) {
      this.applyFrame(this.replay.frames[0]);
    }

    this.onFrameUpdate?.(0, this.replay);
  }

  setVisibleAlgorithms(algorithms: Set<string>) {
    this.visibleAlgorithms = algorithms;

    if (!this.searchPhaseComplete) return;

    for (const [algorithm, container] of this.carSprites) {
      container.setVisible(algorithms.has(algorithm));
    }
  }

  private drawTrack() {
    const width =
      this.grid[0].length * CELL_SIZE;

    const height =
      this.grid.length * CELL_SIZE;

    this.add
      .rectangle(
        width / 2,
        height / 2,
        width,
        height,
        GRASS_COLOR,
      )
      .setDepth(-10);

    // Subtle grass checker pattern for visual texture, like a real circuit apron.
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        if (this.grid[row][col].walkable) continue;
        if ((row + col) % 2 !== 0) continue;

        this.add
          .rectangle(
            col * CELL_SIZE + CELL_SIZE / 2,
            row * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE,
            CELL_SIZE,
            GRASS_COLOR_ALT,
            0.35,
          )
          .setDepth(-9);
      }
    }

    const roadCells = new Set<string>();

    for (
      let row = 0;
      row < this.grid.length;
      row++
    ) {
      for (
        let col = 0;
        col < this.grid[row].length;
        col++
      ) {
        const cell =
          this.grid[row][col];

        if (!cell.walkable) {
          continue;
        }

        const key = `${row},${col}`;

        roadCells.add(key);

        const terrainColor =
          cell.terrainCost === 5
            ? MUD_COLOR
            : cell.terrainCost === 3
              ? WATER_COLOR
              : ROAD_COLOR;

        this.add
          .rectangle(
            col * CELL_SIZE +
              CELL_SIZE / 2,
            row * CELL_SIZE +
              CELL_SIZE / 2,
            CELL_SIZE + 1,
            CELL_SIZE + 1,
            terrainColor,
          )
          .setDepth(-5);

        this.add
          .rectangle(
            col * CELL_SIZE +
              CELL_SIZE / 2,
            row * CELL_SIZE +
              CELL_SIZE / 2,
            CELL_SIZE - 3,
            CELL_SIZE - 3,
            terrainColor,
          )
          .setStrokeStyle(
            1,
            ROAD_EDGE_COLOR,
            0.6,
          )
          .setDepth(-4);
          this.dynamicObstacles.forEach((obstacle) => {
            const x =
              obstacle.position.col * CELL_SIZE +
              CELL_SIZE / 2;

            const y =
              obstacle.position.row * CELL_SIZE +
              CELL_SIZE / 2;

            this.add
              .rectangle(
              x,
              y,
              CELL_SIZE - 4, 
              CELL_SIZE - 4,
              0x7f1d1d,
            )
            .setStrokeStyle(2, 0xffc107, 1)
            .setDepth(0);

            this.add
              .text(x, y, '✕', {
                fontFamily: 'Arial',
                fontSize: '22px',
                fontStyle: 'bold',
                color: '#ffffff',
              })
              .setOrigin(0.5)
              .setDepth(1);
            });
      }
    }

    for (
      let row = 0;
      row < this.grid.length;
      row++
    ) {
      for (
        let col = 0;
        col < this.grid[row].length;
        col++
      ) {
        const key = `${row},${col}`;

        if (!roadCells.has(key)) continue;

        const centerX =
          col * CELL_SIZE +
          CELL_SIZE / 2;

        const centerY =
          row * CELL_SIZE +
          CELL_SIZE / 2;

        if (
          roadCells.has(
            `${row},${col + 1}`,
          )
        ) {
          this.drawRoadLine(
            centerX,
            centerY,
            centerX + CELL_SIZE,
            centerY,
          );
        }

        if (
          roadCells.has(
            `${row + 1},${col}`,
          )
        ) {
          this.drawRoadLine(
            centerX,
            centerY,
            centerX,
            centerY + CELL_SIZE,
          );
        }
      }
    }

    this.drawMarker(
      this.start,
      START_COLOR,
      'S',
    );

    this.drawMarker(
      this.end,
      FINISH_COLOR,
      'F',
    );
  }

  private drawRoadLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ) {
    const graphics =
      this.add.graphics();

    graphics.lineStyle(
      2,
      LINE_COLOR,
      0.85,
    );

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    if (y1 === y2) {
      graphics.lineBetween(
        midX - 4,
        midY,
        midX + 4,
        midY,
      );
    } else {
      graphics.lineBetween(
        midX,
        midY - 4,
        midX,
        midY + 4,
      );
    }

    graphics.setDepth(-2);
  }

  /** Clear, high-contrast Start/Finish badges that stay readable over any terrain and above cars. */
  private drawMarker(
    position: GridPosition,
    color: number,
    label: string,
  ) {
    const x =
      position.col * CELL_SIZE +
      CELL_SIZE / 2;

    const y =
      position.row * CELL_SIZE +
      CELL_SIZE / 2;

    // Soft glow ring so the marker pops even against similarly-colored terrain.
    this.add
      .circle(x, y, CELL_SIZE / 2 - 1, color, 0.22)
      .setDepth(0);

    this.add
      .rectangle(
        x,
        y,
        CELL_SIZE - 5,
        CELL_SIZE - 5,
        color,
      )
      .setStrokeStyle(2, 0xffffff, 0.95)
      .setDepth(1);

    this.add
      .text(
        x,
        y,
        label,
        {
          fontFamily: 'Arial',
          fontSize: '15px',
          fontStyle: 'bold',
          color: '#ffffff',
        },
      )
      .setOrigin(0.5)
      .setShadow(0, 1, '#000000', 2, true, true)
      .setDepth(2);
  }

  /** Small, stable rosette offset so cars sharing a grid cell stay visually distinguishable. */
  private overlapOffset(
    index: number,
    total: number,
  ): { x: number; y: number } {
    if (total <= 1) {
      return { x: 0, y: 0 };
    }

    const radius = 5.5;
    const angle = (index / total) * Math.PI * 2;

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  }

  /** Builds a small, recognizable top-down car icon (body + nose + wheels) in the given color. */
  private buildCarSprite(
    color: number,
  ): Phaser.GameObjects.Container {
    const container = this.add.container(0, 0);

    const wheelColor = 0x111318;
    const bodyWidth = 13;
    const bodyHeight = 8;

    const wheelBack = this.add.rectangle(
      -3.5,
      0,
      3,
      bodyHeight + 2.5,
      wheelColor,
    );

    const wheelFront = this.add.rectangle(
      3.5,
      0,
      3,
      bodyHeight + 2.5,
      wheelColor,
    );

    const body = this.add
      .rectangle(0, 0, bodyWidth, bodyHeight, color)
      .setStrokeStyle(1.2, 0xffffff, 0.95);

    const nose = this.add
      .rectangle(bodyWidth / 2 + 2, 0, 4, bodyHeight - 3, color)
      .setStrokeStyle(1, 0xffffff, 0.95);

    const cockpit = this.add.ellipse(
      -1.5,
      0,
      5,
      3.6,
      0x0b0d10,
      0.85,
    );

    container.add([
      wheelBack,
      wheelFront,
      body,
      nose,
      cockpit,
    ]);

    // Cars render above the track, S/F markers, and search overlays.
    container.setDepth(20);

    return container;
  }

  private createCars() {
    if (!this.replay.frames.length) {
      return;
    }

    const firstFrame =
      this.replay.frames[0];

    const orderedAlgorithms = [
      ...firstFrame.cars.map((car) => car.algorithm),
    ].sort(
      (a, b) =>
        ALGORITHM_ORDER.indexOf(a as never) -
        ALGORITHM_ORDER.indexOf(b as never),
    );

    orderedAlgorithms.forEach((algorithm, index) => {
      const car = firstFrame.cars.find(
        (c) => c.algorithm === algorithm,
      );

      if (!car) return;

      const color = getAlgorithmColorNumber(algorithm);
      const container = this.buildCarSprite(color);

      const offset = this.overlapOffset(
        index,
        orderedAlgorithms.length,
      );

      this.carOffsets.set(algorithm, offset);

      container.setPosition(
        car.position.x + offset.x,
        car.position.y + offset.y,
      );

      container.setVisible(false);

      this.carSprites.set(algorithm, container);
    });
  }

  private createSearchOverlays() {
    for (const [
      algorithm,
      exploredOrder,
    ] of Object.entries(
      this.exploredByAlgorithm,
    )) {
      if (!exploredOrder.length) {
        continue;
      }

      const color =
        getAlgorithmColorNumber(algorithm);

      const overlay =
        new ExploredNodesOverlay(
          this,
          exploredOrder,
          color,
        );

      this.searchOverlays.push(
        overlay,
      );
    }

    if (
      this.searchOverlays.length === 0
    ) {
      this.finishSearchPhase();
    }
  }

  private updateSearchPhase(
    delta: number,
  ) {
    if (
      !this.searchOverlays.length
    ) {
      this.finishSearchPhase();
      return;
    }

    let allComplete = true;

    for (const overlay of this.searchOverlays) {
      const complete =
        overlay.update(delta);

      if (!complete) {
        allComplete = false;
      }
    }

    if (allComplete) {
      this.finishSearchPhase();
    }
  }

  private finishSearchPhase() {
    if (this.searchPhaseComplete) {
      return;
    }

    this.searchPhaseComplete = true;

    for (const overlay of this.searchOverlays) {
      overlay.destroy();
    }

    this.searchOverlays = [];

    for (const [algorithm, container] of this.carSprites) {
      const visible =
        this.visibleAlgorithms === null ||
        this.visibleAlgorithms.has(algorithm);

      container.setVisible(visible);
    }

    if (
      !this.searchPhaseCallbackFired
    ) {
      this.searchPhaseCallbackFired = true;
      this.onSearchPhaseComplete?.();
    }
  }

  private frameIndexForTime(
    time: number,
  ): number {
    const frames = this.replay.frames;

    let low = 0;
    let high = frames.length - 1;

    while (low < high) {
      const mid =
        Math.floor((low + high) / 2);

      if (frames[mid].time < time) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }

    return low;
  }
}

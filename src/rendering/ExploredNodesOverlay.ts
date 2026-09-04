import Phaser from 'phaser';
import type { GridPosition } from '../algorithms/types';

const CELL_SIZE = 32;
const REVEAL_RATE = 60;

export class ExploredNodesOverlay {
  private scene: Phaser.Scene;
  private tiles: Phaser.GameObjects.Rectangle[] = [];
  private exploredOrder: GridPosition[];
  private color: number;
  private revealedCount = 0;
  private elapsed = 0;

  constructor(
    scene: Phaser.Scene,
    exploredOrder: GridPosition[],
    color: number,
  ) {
    this.scene = scene;
    this.exploredOrder = exploredOrder;
    this.color = color;
  }

  update(delta: number): boolean {
    this.elapsed += delta;

    const targetCount = Math.min(
      this.exploredOrder.length,
      Math.floor((this.elapsed / 1000) * REVEAL_RATE),
    );

    while (this.revealedCount < targetCount) {
      const position = this.exploredOrder[this.revealedCount];

      const tile = this.scene.add.rectangle(
        position.col * CELL_SIZE + CELL_SIZE / 2,
        position.row * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4,
        this.color,
        0.35,
      );

      this.tiles.push(tile);
      this.revealedCount += 1;
    }

    return this.revealedCount >= this.exploredOrder.length;
  }

  destroy(): void {
    for (const tile of this.tiles) {
      tile.destroy();
    }

    this.tiles = [];
  }
}
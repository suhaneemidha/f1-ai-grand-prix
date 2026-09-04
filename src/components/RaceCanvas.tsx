import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { RaceScene } from '../rendering/RaceScene';
import type { Grid } from '../algorithms/types';
import type { RaceReplay } from '../simulation/raceRecorder';

interface RaceCanvasProps {
  grid: Grid;
  replay: RaceReplay;
  onFrameUpdate?: (frameIndex: number, replay: RaceReplay) => void;
}

export function RaceCanvas({
  grid,
  replay,
  onFrameUpdate,
}: RaceCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = grid[0].length * 32;
    const height = grid.length * 32;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width,
      height,
      parent: containerRef.current,
      scene: [RaceScene],
    });

    game.scene.start('RaceScene', {
      grid,
      replay,
      onFrameUpdate,
    });

    gameRef.current = game;

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
  }, [grid, replay, onFrameUpdate]);

  return <div ref={containerRef} />;
}
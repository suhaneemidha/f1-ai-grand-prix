import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { RaceScene } from '../rendering/RaceScene';
import type { Grid, GridPosition } from '../algorithms/types';
import type { RaceReplay } from '../simulation/raceRecorder';

interface RaceCanvasProps {
  grid: Grid;
  replay: RaceReplay;
  exploredByAlgorithm: Record<string, GridPosition[]>;
  onFrameUpdate?: (frameIndex: number, replay: RaceReplay) => void;
  onSearchPhaseComplete?: () => void;
}

export function RaceCanvas({
  grid,
  replay,
  exploredByAlgorithm,
  onFrameUpdate,
  onSearchPhaseComplete,
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
      exploredByAlgorithm,
      onFrameUpdate,
      onSearchPhaseComplete,
    });

    gameRef.current = game;

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
  }, [
    grid,
    replay,
    exploredByAlgorithm,
    onFrameUpdate,
    onSearchPhaseComplete,
  ]);

  return <div ref={containerRef} />;
}
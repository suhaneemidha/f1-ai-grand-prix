import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import Phaser from 'phaser';
import { RaceScene } from '../rendering/RaceScene';
import type { Grid, GridPosition } from '../algorithms/types';
import type { RaceReplay } from '../simulation/raceRecorder';
import type { DynamicObstacle } from '../simulation/dynamicObstacles';

interface RaceCanvasProps {
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

export interface RaceCanvasHandle {
  pause: () => void;
  resume: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  setVisibleAlgorithms: (algorithms: string[]) => void;
}

export const RaceCanvas = forwardRef<
  RaceCanvasHandle,
  RaceCanvasProps
>(function RaceCanvas(
  {
    grid,
    start,
    end,
    replay,
    exploredByAlgorithm,
    dynamicObstacles,
    onFrameUpdate,
    onSearchPhaseComplete,
  },
  ref,
) {
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
      transparent: true,
      scene: [RaceScene],
    });

    game.scene.start('RaceScene', {
      grid,
      start,
      end,
      replay,
      exploredByAlgorithm,
      dynamicObstacles,
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
    start,
    end,
    replay,
    exploredByAlgorithm,
    onFrameUpdate,
    onSearchPhaseComplete,
  ]);

  useImperativeHandle(
    ref,
    () => ({
      pause: () => {
        gameRef.current?.scene.pause('RaceScene');
      },
      resume: () => {
        gameRef.current?.scene.resume('RaceScene');
      },
      reset: () => {
        const scene = gameRef.current?.scene.getScene(
          'RaceScene',
        ) as RaceScene | null;

        scene?.resetPlayback();
      },
      setSpeed: (speed: number) => {
        const scene = gameRef.current?.scene.getScene(
          'RaceScene',
        ) as RaceScene | null;

        scene?.setSpeedMultiplier(speed);
      },
      setVisibleAlgorithms: (algorithms: string[]) => {
        const scene = gameRef.current?.scene.getScene(
          'RaceScene',
        ) as RaceScene | null;

        scene?.setVisibleAlgorithms(new Set(algorithms));
      },
    }),
    [],
  );

  return <div className="race-canvas" ref={containerRef} />;
});

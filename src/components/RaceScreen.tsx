import { useCallback, useRef, useState } from 'react';
import type { Grid, GridPosition } from '../algorithms/types';
import type { RaceReplay } from '../simulation/raceRecorder';
import { RaceCanvas } from './RaceCanvas';
import { RaceHud } from './RaceHud';

interface RaceScreenProps {
  grid: Grid;
  replay: RaceReplay;
  exploredByAlgorithm: Record<string, GridPosition[]>;
  onFinished: () => void;
}

export function RaceScreen({
  grid,
  replay,
  exploredByAlgorithm,
  onFinished,
}: RaceScreenProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const lastUpdateRef = useRef(0);
  const finishedRef = useRef(false);

  const handleFrameUpdate = useCallback(
    (
      nextFrameIndex: number,
      _replay: RaceReplay,
    ) => {
      if (
        nextFrameIndex >= replay.frames.length - 1 &&
        !finishedRef.current
      ) {
        finishedRef.current = true;
        setFrameIndex(nextFrameIndex);
        onFinished();
        return;
      }

      const now = performance.now();

      if (now - lastUpdateRef.current < 100) {
        return;
      }

      lastUpdateRef.current = now;
      setFrameIndex(nextFrameIndex);
    },
    [onFinished, replay.frames.length],
  );

  return (
    <main>
      <h1>F1 AI Grand Prix</h1>

      <RaceCanvas
        grid={grid}
        replay={replay}
        exploredByAlgorithm={exploredByAlgorithm}
        onFrameUpdate={handleFrameUpdate}
      />

      <RaceHud
        replay={replay}
        frameIndex={frameIndex}
      />
    </main>
  );
}
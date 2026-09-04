import { useRef, useState } from 'react';
import type { Grid, GridPosition } from '../algorithms/types';
import type { RaceReplay } from '../simulation/raceRecorder';
import { RaceCanvas } from './RaceCanvas';
import { RaceHud } from './RaceHud';

interface RaceScreenProps {
  grid: Grid;
  replay: RaceReplay;
  exploredByAlgorithm: Record<string, GridPosition[]>;
}

export function RaceScreen({
  grid,
  replay,
  exploredByAlgorithm,
}: RaceScreenProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const lastUpdateRef = useRef(0);

  const handleFrameUpdate = (
    nextFrameIndex: number,
    _replay: RaceReplay,
  ) => {
    const now = performance.now();

    if (now - lastUpdateRef.current < 100) {
      return;
    }

    lastUpdateRef.current = now;
    setFrameIndex(nextFrameIndex);
  };

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
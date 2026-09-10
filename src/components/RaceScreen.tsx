import { useCallback, useMemo, useRef, useState, type ChangeEvent } from 'react';
import type { Grid, GridPosition } from '../algorithms/types';
import type { RaceReplay } from '../simulation/raceRecorder';
import { RaceCanvas, type RaceCanvasHandle } from './RaceCanvas';
import { RaceHud } from './RaceHud';
import { Header } from './Header';
import type { DynamicObstacle } from '../simulation/dynamicObstacles';
import Track from './Track';
import {
  ALGORITHMS,
  getAlgorithmColor,
  getAlgorithmLabel,
} from '../theme/algorithms';

type InfoPage = 'home' | 'levels' | 'algorithms' | 'about';

interface RaceScreenProps {
  grid: Grid;
  start: GridPosition;
  end: GridPosition;
  replay: RaceReplay;
  exploredByAlgorithm: Record<string, GridPosition[]>;
  pathsByAlgorithm: Record<string, GridPosition[]>;
  levelName: string;
  dynamicObstacles?: DynamicObstacle[];
  onFinished: () => void;
  onNavigate: (page: InfoPage) => void;
}

const SPEED_OPTIONS = [0.5, 1, 2, 4];

const SEARCH_STEPS: {
  key: string;
  label: string;
  fraction: number;
  showPath: boolean;
}[] = [
  { key: 'initial', label: 'Initial', fraction: 0, showPath: false },
  { key: 'exploring', label: 'Exploring', fraction: 0.35, showPath: false },
  { key: 'frontier', label: 'Frontier', fraction: 0.75, showPath: false },
  { key: 'path', label: 'Path Found', fraction: 1, showPath: true },
];

export function RaceScreen({
  grid,
  start,
  end,
  replay,
  exploredByAlgorithm,
  pathsByAlgorithm,
  levelName,
  dynamicObstacles,
  onFinished,
  onNavigate,
}: RaceScreenProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [checkedAlgorithms, setCheckedAlgorithms] = useState<Set<string>>(
    () => new Set(replay.frames[0]?.cars.map((car) => car.algorithm) ?? []),
  );

  const searchableAlgorithms = useMemo(
    () =>
      ALGORITHMS.filter(
        (algorithm) =>
          algorithm.isSearchAlgorithm &&
          (exploredByAlgorithm[algorithm.id]?.length ?? 0) > 0,
      ),
    [exploredByAlgorithm],
  );

  const [searchAlgorithm, setSearchAlgorithm] = useState<string>(
    () => searchableAlgorithms[0]?.id ?? 'AStar',
  );

  const canvasRef = useRef<RaceCanvasHandle>(null);
  const lastUpdateRef = useRef(0);
  const finishedRef = useRef(false);

  const handleFrameUpdate = useCallback(
    (nextFrameIndex: number, _replay: RaceReplay) => {
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

  const togglePause = () => {
    if (isPaused) {
      canvasRef.current?.resume();
    } else {
      canvasRef.current?.pause();
    }

    setIsPaused((prev) => !prev);
  };

  const handleReset = () => {
    canvasRef.current?.reset();
    finishedRef.current = false;
    setFrameIndex(0);

    if (isPaused) {
      canvasRef.current?.resume();
      setIsPaused(false);
    }
  };

  const handleSpeedChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const nextSpeed = Number(event.target.value);
    setSpeed(nextSpeed);
    canvasRef.current?.setSpeed(nextSpeed);
  };

  const toggleAlgorithm = (id: string) => {
    setCheckedAlgorithms((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      canvasRef.current?.setVisibleAlgorithms(Array.from(next));

      return next;
    });
  };

  const activeAlgorithmIds = useMemo(
    () => new Set(replay.frames[0]?.cars.map((car) => car.algorithm) ?? []),
    [replay],
  );

  const explored = exploredByAlgorithm[searchAlgorithm] ?? [];
  const path = pathsByAlgorithm[searchAlgorithm] ?? [];

  return (
    <>
      <Header active="levels" onNavigate={onNavigate} />

      <main className="race-page">
        <section className="race-page__topbar">
          <div>
            <p className="race-page__eyebrow">LIVE VISUALIZATION</p>

            <h1>{levelName}</h1>

            <p className="race-page__description">
              Watch the algorithms explore and race in real time.
            </p>
          </div>

          <div className="race-page__controls">
            <button type="button" onClick={togglePause}>
              {isPaused ? '▶ Resume' : 'Ⅱ Pause'}
            </button>

            <button type="button" onClick={handleReset}>
              ↻ Reset
            </button>

            <select
              className="race-page__speed"
              value={speed}
              onChange={handleSpeedChange}
              aria-label="Playback speed"
            >
              {SPEED_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}×
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="race-page__race-area">
          <div className="race-page__track-panel">
            <div className="race-page__track">
              <RaceCanvas
                ref={canvasRef}
                grid={grid}
                start={start}
                end={end}
                replay={replay}
                exploredByAlgorithm={exploredByAlgorithm}
                dynamicObstacles={dynamicObstacles}
                onFrameUpdate={handleFrameUpdate}
              />
            </div>
          </div>

          <aside className="race-page__algorithm-panel">
            <h2>Algorithms</h2>

            <div className="race-page__algorithm-list">
              {ALGORITHMS.filter((algorithm) =>
                activeAlgorithmIds.has(algorithm.id),
              ).map((algorithm) => (
                <label
                  className="race-page__algorithm-item"
                  key={algorithm.id}
                >
                  <input
                    type="checkbox"
                    checked={checkedAlgorithms.has(algorithm.id)}
                    onChange={() => toggleAlgorithm(algorithm.id)}
                    style={{ accentColor: algorithm.color }}
                  />

                  <span
                    className="race-page__algorithm-swatch"
                    style={{ background: algorithm.color }}
                  />

                  <span className="race-page__algorithm-name">
                    {algorithm.label}
                  </span>
                </label>
              ))}
            </div>
          </aside>
        </section>

        <section className="race-page__search-panel">
          <div className="race-page__search-heading">
            <h2>Search Visualization</h2>

            {searchableAlgorithms.length > 0 && (
              <select
                className="race-page__search-select"
                value={searchAlgorithm}
                onChange={(event) =>
                  setSearchAlgorithm(event.target.value)
                }
                style={{
                  borderColor: getAlgorithmColor(searchAlgorithm),
                  color: getAlgorithmColor(searchAlgorithm),
                }}
              >
                {searchableAlgorithms.map((algorithm) => (
                  <option key={algorithm.id} value={algorithm.id}>
                    {getAlgorithmLabel(algorithm.id)}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="race-page__search-steps">
            {SEARCH_STEPS.map((step, index) => {
              const revealCount = Math.round(
                explored.length * step.fraction,
              );

              const stepExplored = explored.slice(0, revealCount);

              return (
                <div className="race-page__search-step-group" key={step.key}>
                  <div className="race-page__search-step">
                    <div className="race-page__search-thumb">
                      <Track
                        grid={grid}
                        start={start}
                        end={end}
                        explored={stepExplored}
                        path={step.showPath ? path : []}
                      />
                    </div>

                    <span>{step.label}</span>
                  </div>

                  {index < SEARCH_STEPS.length - 1 && (
                    <span className="race-page__search-arrow">›</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <RaceHud replay={replay} frameIndex={frameIndex} />
      </main>
    </>
  );
}

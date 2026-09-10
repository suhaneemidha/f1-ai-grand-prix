import type { RaceReplay } from '../simulation/raceRecorder';
import { getAlgorithmColor, getAlgorithmLabel } from '../theme/algorithms';

interface RaceHudProps {
  replay: RaceReplay;
  frameIndex: number;
}

export function RaceHud({ replay, frameIndex }: RaceHudProps) {
  const frame = replay.frames[frameIndex];

  if (!frame) return null;

  const standings = [...frame.cars].sort(
    (a, b) => b.distanceTraveled - a.distanceTraveled,
  );

  return (
    <div className="race-hud">
      <div className="race-hud__time">TIME {frame.time.toFixed(1)}s</div>

      <div className="race-hud__standings">
        {standings.map((car, index) => (
          <div
            className={
              'race-hud__row' + (index === 0 ? ' race-hud__row--lead' : '')
            }
            key={car.algorithm}
          >
            <span className="race-hud__position">{index + 1}</span>

            <span
              className="race-hud__swatch"
              style={{ background: getAlgorithmColor(car.algorithm) }}
            />

            <span className="race-hud__algorithm">
              {getAlgorithmLabel(car.algorithm)}
            </span>

            <span className="race-hud__distance">
              {car.distanceTraveled.toFixed(1)}
            </span>

            <span
              className={
                'race-hud__status' +
                (car.finished ? ' race-hud__status--finished' : '')
              }
            >
              {car.finished ? 'FINISHED' : 'RACING'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

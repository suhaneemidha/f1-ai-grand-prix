import type { RaceReplay } from '../simulation/raceRecorder';

interface RaceHudProps {
  replay: RaceReplay;
  frameIndex: number;
}

export function RaceHud({ replay, frameIndex }: RaceHudProps) {
  const frame = replay.frames[frameIndex];

  if (!frame) return null;

  const standings = [...frame.cars]
    .sort((a, b) => b.distanceTraveled - a.distanceTraveled);

  return (
    <div className="race-hud">
      <div className="race-hud__time">
        TIME {frame.time.toFixed(1)}s
      </div>

      <div className="race-hud__standings">
        {standings.map((car, index) => (
          <div className="race-hud__row" key={car.algorithm}>
            <span className="race-hud__position">
              {index + 1}
            </span>

            <span className="race-hud__algorithm">
              {car.algorithm}
            </span>

            <span className="race-hud__distance">
              {car.distanceTraveled.toFixed(1)}
            </span>

            <span className="race-hud__status">
              {car.finished ? 'FINISHED' : 'RACING'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
import type { LevelDefinition } from '../simulation/setupRace';
import Track from './Track';
import { Header } from './Header';

interface LevelSelectProps {
  levels: LevelDefinition[];
  onSelect: (level: string) => void;
  onNavigate: (
    page: 'home' | 'levels' | 'algorithms' | 'about',
  ) => void;
}

export function LevelSelect({
  levels,
  onSelect,
  onNavigate,
}: LevelSelectProps) {
  return (
    <>
      <Header
        active="levels"
        onNavigate={onNavigate}
      />

      <main className="level-select-page">
        <section className="level-select-hero">
          <p className="level-select-hero__eyebrow">
            F1 AI GRAND PRIX
          </p>

          <h1>Choose Your Track</h1>

          <p>
            Pick a circuit and watch seven AI strategies
            compete.
          </p>
        </section>

        <section className="level-select">
          {levels.map((level, index) => (
            <article
              className="level-card"
              key={level.id}
            >
              <div className="level-card__number">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="level-card__content">
                <strong>{level.name}</strong>

                <span>{level.description}</span>

                <div className="level-card__track">
                  <Track
                    grid={level.grid}
                    start={level.start}
                    end={level.end}
                    obstacles={
                      level.dynamicObstacles?.map(
                        (obstacle) => obstacle.position,
                      ) ?? []
                    }
                  />
                </div>

                <button
                  className="level-card__play"
                  onClick={() => onSelect(level.id)}
                >
                  Play →
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
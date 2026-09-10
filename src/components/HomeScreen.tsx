import { Header } from './Header';

interface HomeScreenProps {
  onSelectLevel: () => void;
  onNavigate: (
    page: 'home' | 'levels' | 'algorithms' | 'about',
  ) => void;
}

export function HomeScreen({
  onSelectLevel,
  onNavigate,
}: HomeScreenProps) {
  return (
    <>
      <Header
        active="home"
        onNavigate={onNavigate}
      />

      <main className="home-page">
        <section className="home-hero">
          <div className="home-hero__content">
            <p className="home-hero__eyebrow">
              CLASSICAL AI × RACING
            </p>

            <h1>
              F1 AI
              <br />
              GRAND PRIX
            </h1>

            <p className="home-hero__description">
              Watch classical AI algorithms race from
              search to finish.
            </p>

            <button
              className="home-hero__button"
              onClick={onSelectLevel}
            >
              Select a Level →
            </button>
          </div>

          <div className="home-hero__visual">
            <div className="home-hero__glow" />
            <div className="home-hero__stripe" />
            <div className="home-hero__speedlines" />
            <img
              className="home-hero__car-image"
              src="/f1-car-new.png"
              alt="F1 race car"
            />
          </div>
        </section>

        <section className="home-features">
          <article>
            <span className="home-features__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <circle
                  cx="10"
                  cy="10"
                  r="6.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="15"
                  y1="15"
                  x2="21"
                  y2="21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <strong>Interactive levels</strong>
            <span>
              Four tracks with different AI challenges.
            </span>
          </article>

          <article>
            <span className="home-features__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <line x1="4" y1="20" x2="4" y2="10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                <line x1="20" y1="20" x2="20" y2="14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </span>
            <strong>Live search visualization</strong>
            <span>
              Watch algorithms explore before the race.
            </span>
          </article>

          <article>
            <span className="home-features__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                <polygon points="10,8 17,12 10,16" fill="currentColor" />
              </svg>
            </span>
            <strong>Frame-by-frame simulation</strong>
            <span>
              See every strategy compete on the same track.
            </span>
          </article>

          <article>
            <span className="home-features__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M12 3.5v2.4M12 18.1v2.4M20.5 12h-2.4M5.9 12H3.5M17.7 6.3l-1.7 1.7M8 16l-1.7 1.7M17.7 17.7L16 16M8 8 6.3 6.3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <strong>Dynamic obstacles</strong>
            <span>
              Some tracks change while the race is running.
            </span>
          </article>
        </section>

        <section className="home-quote">
          <p>
            “Different algorithms.
            <br />
            Same finish line.
            <br />
            Let the best search win.”
          </p>
        </section>
      </main>
    </>
  );
}

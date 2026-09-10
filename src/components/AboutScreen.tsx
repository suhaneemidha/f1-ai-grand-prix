import { Header } from './Header';

interface AboutScreenProps {
  onNavigate: (
    page: 'home' | 'levels' | 'algorithms' | 'about',
  ) => void;
}

export function AboutScreen({
  onNavigate,
}: AboutScreenProps) {
  return (
    <>
      <Header
        active="about"
        onNavigate={onNavigate}
      />

      <main className="info-page">
        <section className="info-page__hero">
          <p className="info-page__eyebrow">
            F1 AI GRAND PRIX
          </p>

          <h1>About the Project</h1>

          <p>
            Turning classical AI concepts into an
            interactive racing experience.
          </p>
        </section>

        <section className="about-content">
          <article className="about-card">
            <h2>Why this project?</h2>
            <p>
              Search algorithms are often taught using
              pseudocode, graphs, and static examples.
              F1 AI Grand Prix turns those ideas into a
              visual competition where different strategies
              can be watched making decisions and racing
              toward the same finish line.
            </p>
          </article>

          <article className="about-card">
            <h2>What happens in a race?</h2>
            <p>
              Each search algorithm explores the track and
              produces a route. The simulation then plays
              those routes back frame by frame. Terrain can
              change movement speed, and dynamic obstacles
              can force algorithms to replan.
            </p>
          </article>

          <article className="about-card">
            <h2>Optimization</h2>
            <p>
              Hill Climbing and Genetic Algorithm approach
              racing differently. They optimize a fixed
              racing-line speed profile rather than
              searching for a new path.
            </p>
          </article>

          <article className="about-card">
            <h2>Technology</h2>
            <p>
              The project is built with React, TypeScript,
              Vite, and Phaser 3. The AI algorithms are
              implemented specifically for this project.
            </p>
          </article>
        </section>
      </main>
    </>
  );
}
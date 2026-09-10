import { Header } from './Header';
import { ALGORITHMS } from '../theme/algorithms';

interface AlgorithmsScreenProps {
  onNavigate: (
    page: 'home' | 'levels' | 'algorithms' | 'about',
  ) => void;
}

export function AlgorithmsScreen({
  onNavigate,
}: AlgorithmsScreenProps) {
  return (
    <>
      <Header
        active="algorithms"
        onNavigate={onNavigate}
      />

      <main className="info-page">
        <section className="info-page__hero">
          <p className="info-page__eyebrow">
            F1 AI GRAND PRIX
          </p>

          <h1>Algorithms</h1>

          <p>
            Classical AI search and optimization
            algorithms, racing on a grid.
          </p>
        </section>

        <section className="algorithm-list">
          {ALGORITHMS.map((algorithm) => (
            <article
              className="algorithm-card"
              key={algorithm.id}
            >
              <span
                className="algorithm-card__dot"
                style={{ background: algorithm.color }}
              />

              <strong>{algorithm.label}</strong>

              <span>{algorithm.description}</span>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}

import type { RaceResultEntry } from '../simulation/raceManager';

interface ResultsScreenProps {
  results: RaceResultEntry[];
  onRaceAgain: () => void;
}

export function ResultsScreen({
  results,
  onRaceAgain,
}: ResultsScreenProps) {
  const sortedResults = [...results].sort((a, b) => {
    if (a.finished !== b.finished) {
      return a.finished ? -1 : 1;
    }

    if (a.finishTime === null) return 1;
    if (b.finishTime === null) return -1;

    return a.finishTime - b.finishTime;
  });

  return (
    <main>
      <h1>Race Results</h1>

      <div className="results">
        {sortedResults.map((result, index) => (
          <div className="results__row" key={result.algorithm}>
            <span className="results__position">
              {index + 1}
            </span>

            <span className="results__algorithm">
              {result.algorithm}
            </span>

            <span className="results__time">
              {result.finished && result.finishTime !== null
                ? `${result.finishTime.toFixed(2)}s`
                : 'DNF'}
            </span>

            <span className="results__nodes">
              {result.totalNodesExplored} nodes
            </span>

            <span className="results__replans">
              {result.replanCount} replans
            </span>
          </div>
        ))}
      </div>

      <button onClick={onRaceAgain}>
        Race Again
      </button>
    </main>
  );
}
import type { RaceResultEntry } from '../simulation/raceManager';

interface ResultsScreenProps {
  results: RaceResultEntry[];
  levelName: string;
  onRaceAgain: () => void;
}

function buildSummary(
  winner: RaceResultEntry,
  ranked: RaceResultEntry[],
  levelName: string,
): string {
  if (levelName.includes('Track Closure')) {
    const replanned = ranked.filter(
      (result) => result.replanCount > 0,
    );

    if (replanned.length > 0) {
      const replannedAlgorithms = replanned
        .map((result) => result.algorithm)
        .join(', ');

      return `${winner.algorithm} won in ${winner.finishTime?.toFixed(2)}s. The track closure forced ${replannedAlgorithms} to replan during the race.`;
    }

    return `${winner.algorithm} won in ${winner.finishTime?.toFixed(2)}s without needing to replan.`;
  }

  const costs = ranked.map((result) => result.pathCost);
  const costSpread =
    Math.max(...costs) - Math.min(...costs);

  if (levelName.includes('The Mud') && costSpread > 2) {
    return `${winner.algorithm} won in ${winner.finishTime?.toFixed(2)}s with a path cost of ${winner.pathCost} — the cheapest route in the field.`;
  }

  if (winner.replanCount > 0) {
    return `${winner.algorithm} won in ${winner.finishTime?.toFixed(2)}s after ${winner.replanCount} replan${winner.replanCount > 1 ? 's' : ''}, exploring ${winner.totalNodesExplored} nodes total.`;
  }

  return `${winner.algorithm} won in ${winner.finishTime?.toFixed(2)}s, exploring ${winner.totalNodesExplored} nodes.`;
}

export function ResultsScreen({
  results,
  levelName,
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

  const rankedResults = sortedResults.filter(
    (result) => result.finished,
  );

  const winner = rankedResults[0];

  return (
    <main>
      <h1>{levelName} — Results</h1>

      {winner && (
        <p>
          {buildSummary(
            winner,
            rankedResults,
            levelName,
          )}
        </p>
      )}

      <div className="results">
        {sortedResults.map((result, index) => (
          <div
            className="results__row"
            key={result.algorithm}
          >
            <span className="results__position">
              {index + 1}
            </span>

            <span className="results__algorithm">
              {result.algorithm}
            </span>

            <span className="results__time">
              {result.finished &&
              result.finishTime !== null
                ? `${result.finishTime.toFixed(2)}s`
                : 'DNF'}
            </span>

            <span className="results__nodes">
              {result.totalNodesExplored} nodes
            </span>

            <span className="results__cost">
              {result.replanCount > 0
                ? '—'
                : `${result.pathCost} cost`}
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
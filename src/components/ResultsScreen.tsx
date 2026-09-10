import { useState } from 'react';
import { Header } from './Header';
import type { RaceResultEntry } from '../simulation/raceManager';
import {
  getAlgorithmColor,
  getAlgorithmLabel,
  getAlgorithmShortLabel,
} from '../theme/algorithms';

type InfoPage = 'home' | 'levels' | 'algorithms' | 'about';

interface ResultsScreenProps {
  levelName: string;
  results: RaceResultEntry[];
  onRaceAgain: () => void;
  onNextLevel?: () => void;
  onNavigate: (page: InfoPage) => void;
}

const MEDALS = ['🥇', '🥈', '🥉'];

type MetricKey = 'explored' | 'cost' | 'time' | 'replans';

const METRICS: Record<
  MetricKey,
  {
    label: string;
    unit: string;
    getValue: (result: RaceResultEntry) => number;
    include: (result: RaceResultEntry) => boolean;
  }
> = {
  explored: {
    label: 'Explored Nodes',
    unit: '',
    getValue: (result) => result.totalNodesExplored,
    include: (result) => result.totalNodesExplored > 0,
  },
  cost: {
    label: 'Path Cost',
    unit: '',
    getValue: (result) => result.pathCost,
    include: () => true,
  },
  time: {
    label: 'Finish Time',
    unit: 's',
    getValue: (result) => result.finishTime ?? 0,
    include: (result) => result.finished && result.finishTime !== null,
  },
  replans: {
    label: 'Replans',
    unit: '',
    getValue: (result) => result.replanCount,
    include: () => true,
  },
};

function buildSummary(
  ranked: RaceResultEntry[],
  levelName: string,
): string {
  const winner = ranked[0];

  if (!winner) {
    return `No algorithm finished ${levelName}.`;
  }

  const winnerTime =
    winner.finishTime !== null
      ? `${winner.finishTime.toFixed(1)}s`
      : 'an unfinished run';

  const mostEfficient = [...ranked]
    .filter((result) => result.totalNodesExplored > 0)
    .sort(
      (a, b) => a.totalNodesExplored - b.totalNodesExplored,
    )[0];

  let summary = `${getAlgorithmLabel(
    winner.algorithm,
  )} took the checkered flag first in ${winnerTime}, with a path cost of ${winner.pathCost.toFixed(
    1,
  )}.`;

  if (
    mostEfficient &&
    mostEfficient.algorithm !== winner.algorithm
  ) {
    summary += ` ${getAlgorithmLabel(
      mostEfficient.algorithm,
    )} explored the fewest nodes (${mostEfficient.totalNodesExplored}), making it the most efficient searcher on this track.`;
  }

  const replanned = ranked.filter(
    (result) => result.replanCount > 0,
  );

  if (replanned.length > 0) {
    summary += ` ${replanned.length} algorithm${
      replanned.length > 1 ? 's' : ''
    } had to replan mid-race after the track changed.`;
  }

  return summary;
}

function ComparisonChart({
  results,
}: {
  results: RaceResultEntry[];
}) {
  const [metric, setMetric] = useState<MetricKey>('explored');

  const config = METRICS[metric];
  const rows = results.filter(config.include);
  const maxValue = Math.max(
    1,
    ...rows.map((result) => config.getValue(result)),
  );

  return (
    <section className="comparison">
      <h2>Algorithm Comparison</h2>
      <p className="comparison__subtitle">
        Compare how each algorithm explored the track.
      </p>

      <div className="comparison__tabs">
        {(Object.keys(METRICS) as MetricKey[]).map((key) => (
          <button
            key={key}
            type="button"
            className={
              'comparison__tab' + (metric === key ? ' active' : '')
            }
            onClick={() => setMetric(key)}
          >
            {METRICS[key].label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="comparison__empty">
          No data available for this metric on this level.
        </p>
      ) : (
        <div className="comparison__chart">
          {rows.map((result) => {
            const value = config.getValue(result);
            const heightPct = Math.max(
              (value / maxValue) * 100,
              4,
            );

            return (
              <div
                className="comparison__bar-col"
                key={result.algorithm}
              >
                <span className="comparison__value">
                  {Number.isInteger(value)
                    ? value
                    : value.toFixed(1)}
                  {config.unit}
                </span>

                <div
                  className="comparison__bar"
                  style={{
                    height: `${heightPct}%`,
                    background: getAlgorithmColor(result.algorithm),
                  }}
                />

                <span className="comparison__label">
                  {getAlgorithmShortLabel(result.algorithm)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function ResultsScreen({
  levelName,
  results,
  onRaceAgain,
  onNextLevel,
  onNavigate,
}: ResultsScreenProps) {
  const ranked = [...results].sort((a, b) => {
    if (a.finished && !b.finished) return -1;
    if (!a.finished && b.finished) return 1;

    if (a.finished && b.finished) {
      return (a.finishTime ?? Infinity) - (b.finishTime ?? Infinity);
    }

    return a.pathCost - b.pathCost;
  });

  return (
    <>
      <Header active="levels" onNavigate={onNavigate} />

      <main className="results-page">
        <section className="results-page__header">
          <p className="results-page__eyebrow">RACE RESULTS</p>
          <h1>{levelName}</h1>
          <p className="results-page__summary">
            {buildSummary(ranked, levelName)}
          </p>
        </section>

        <section className="results-table-wrap">
          <table className="results-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Algorithm</th>
                <th>Finish Time (s)</th>
                <th>Explored Nodes</th>
                <th>Path Cost</th>
                <th>Replans</th>
              </tr>
            </thead>

            <tbody>
              {ranked.map((result, index) => (
                <tr
                  key={result.algorithm}
                  className={index < 3 ? 'results-table__top' : ''}
                >
                  <td className="results-table__position">
                    {index < 3 ? MEDALS[index] : index + 1}
                  </td>

                  <td>
                    <span
                      className="results-table__swatch"
                      style={{
                        background: getAlgorithmColor(result.algorithm),
                      }}
                    />
                    <span
                      className="results-table__algorithm"
                      style={{ color: getAlgorithmColor(result.algorithm) }}
                    >
                      {getAlgorithmLabel(result.algorithm)}
                    </span>
                  </td>

                  <td>
                    {result.finished && result.finishTime !== null
                      ? result.finishTime.toFixed(1)
                      : 'DNF'}
                  </td>

                  <td>
                    {result.totalNodesExplored > 0
                      ? result.totalNodesExplored
                      : '—'}
                  </td>

                  <td>{result.pathCost.toFixed(1)}</td>

                  <td>{result.replanCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <ComparisonChart results={results} />

        <section className="results-page__actions">
          <button
            type="button"
            className="results-page__secondary"
            onClick={onRaceAgain}
          >
            ↻ Race Again
          </button>

          {onNextLevel ? (
            <button
              type="button"
              className="results-page__primary"
              onClick={onNextLevel}
            >
              Next Level →
            </button>
          ) : (
            <button
              type="button"
              className="results-page__primary"
              onClick={() => onNavigate('levels')}
            >
              Back to Levels
            </button>
          )}
        </section>
      </main>
    </>
  );
}

import type { Grid, GridPosition } from '../algorithms/types';

interface TrackProps {
  grid: Grid;
  start?: GridPosition;
  end?: GridPosition;
  path?: GridPosition[];
  explored?: GridPosition[];
  /** Positions of temporary/dynamic obstacles (e.g. a mid-race closure) to flag on the grid. */
  obstacles?: GridPosition[];
}

export default function Track({
  grid,
  start,
  end,
  path = [],
  explored = [],
  obstacles = [],
}: TrackProps) {
  const pathKeys = new Set(
    path.map(
      (position) =>
        `${position.row},${position.col}`,
    ),
  );

  const exploredKeys = new Set(
    explored.map(
      (position) =>
        `${position.row},${position.col}`,
    ),
  );

  const obstacleKeys = new Set(
    obstacles.map(
      (position) =>
        `${position.row},${position.col}`,
    ),
  );

  const startKey = start
    ? `${start.row},${start.col}`
    : '';

  const endKey = end
    ? `${end.row},${end.col}`
    : '';

  const rowCount = grid.length;
  const columnCount = grid[0]?.length ?? 1;

  return (
    <div
      className="track"
      style={{
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))`,
        aspectRatio: `${columnCount} / ${rowCount}`,
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const key = `${rowIndex},${colIndex}`;

          let className = 'cell';

          if (cell.walkable) {
            className += ' road';
          } else {
            className += ' wall';
          }

          if (cell.walkable && cell.terrainCost > 1) {
            className += ' mud';
          }

          if (exploredKeys.has(key)) {
            className += ' explored';
          }

          if (pathKeys.has(key)) {
            className += ' path';
          }

          if (key === startKey) {
            className += ' start';
          }

          if (key === endKey) {
            className += ' end';
          }

          if (obstacleKeys.has(key)) {
            className += ' obstacle';
          }

          return (
            <div
              key={key}
              className={className}
            >
              {key === startKey && 'S'}
              {key === endKey && 'F'}
              {obstacleKeys.has(key) &&
                key !== startKey &&
                key !== endKey &&
                '✕'}
            </div>
          );
        }),
      )}
    </div>
  );
}
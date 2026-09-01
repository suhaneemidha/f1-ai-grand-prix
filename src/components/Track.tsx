import type { Grid, GridPosition } from '../algorithms/types';

interface TrackProps {
  grid: Grid;
  start?: GridPosition;
  end?: GridPosition;
  path?: GridPosition[];
  explored?: GridPosition[];
}

export default function Track({
  grid,
  start,
  end,
  path = [],
  explored = [],
}: TrackProps) {
  const pathKeys = new Set(
    path.map((position) => `${position.row},${position.col}`)
  );

  const exploredKeys = new Set(
    explored.map((position) => `${position.row},${position.col}`)
  );

  const startKey = start
    ? `${start.row},${start.col}`
    : '';

  const endKey = end
    ? `${end.row},${end.col}`
    : '';

  return (
    <div className="track">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const key = `${rowIndex},${colIndex}`;

          let className = 'cell';

          if (!cell.walkable) {
            className += ' wall';
          } else if (key === startKey) {
            className += ' start';
          } else if (key === endKey) {
            className += ' end';
          } else if (pathKeys.has(key)) {
            className += ' path';
          } else if (exploredKeys.has(key)) {
            className += ' explored';
          }

          return (
            <div
              key={key}
              className={className}
            />
          );
        })
      )}
    </div>
  );
}
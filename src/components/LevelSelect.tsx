interface LevelSelectProps {
  levels: string[];
  onSelect: (level: string) => void;
}

export function LevelSelect({
  levels,
  onSelect,
}: LevelSelectProps) {
  return (
    <main>
      <h1>F1 AI Grand Prix</h1>

      <h2>Select a Track</h2>

      <div className="level-select">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => onSelect(level)}
          >
            {level}
          </button>
        ))}
      </div>
    </main>
  );
}
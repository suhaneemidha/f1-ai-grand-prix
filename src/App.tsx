import { useState } from 'react';
import { LevelSelect } from './components/LevelSelect';
import { RaceScreen } from './components/RaceScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { LEVELS, setupRace } from './simulation/setupRace';

type Screen = 'select' | 'race' | 'results';

function App() {
  const [screen, setScreen] = useState<Screen>('select');
  const [selectedLevel, setSelectedLevel] = useState('level1');
  const [raceSetup, setRaceSetup] = useState(() => {
    const level = LEVELS.level1;

    return setupRace(
      level.grid,
      level.start,
      level.end,
      {
        dynamicObstacles: level.dynamicObstacles,
      },
    );
  });

  const level = LEVELS[selectedLevel];

  if (screen === 'select') {
    return (
      <LevelSelect
        levels={Object.values(LEVELS)}
        onSelect={(levelId) => {
          const selected = LEVELS[levelId];

          setSelectedLevel(levelId);
          setRaceSetup(
            setupRace(
              selected.grid,
              selected.start,
              selected.end,
              {
                dynamicObstacles: selected.dynamicObstacles,
              },
            ),
          );
          setScreen('race');
        }}
      />
    );
  }

  if (screen === 'race') {
    return (
      <RaceScreen
        grid={level.grid}
        replay={raceSetup.replay}
        exploredByAlgorithm={raceSetup.exploredByAlgorithm}
        onFinished={() => setScreen('results')}
      />
    );
  }

  return (
    <ResultsScreen
      results={raceSetup.replay.results}
      onRaceAgain={() => {
        setRaceSetup(
          setupRace(
            level.grid,
            level.start,
            level.end,
            {
              dynamicObstacles: level.dynamicObstacles,
            },
          ),
        );
        setScreen('race');
      }}
    />
  );
}

export default App;
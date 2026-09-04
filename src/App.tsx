import { useState } from 'react';
import level1 from './tracks/level1.json';
import { LevelSelect } from './components/LevelSelect';
import { RaceScreen } from './components/RaceScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { setupRace } from './simulation/setupRace';

type Screen = 'select' | 'race' | 'results';

function App() {
  const [screen, setScreen] = useState<Screen>('select');
  const [raceSetup, setRaceSetup] = useState(() =>
    setupRace(
      level1.grid,
      level1.start,
      level1.end,
    ),
  );

  if (screen === 'select') {
    return (
      <LevelSelect
        levels={['Level 1']}
        onSelect={() => {
          setRaceSetup(
            setupRace(
              level1.grid,
              level1.start,
              level1.end,
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
        grid={level1.grid}
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
            level1.grid,
            level1.start,
            level1.end,
          ),
        );
        setScreen('race');
      }}
    />
  );
}

export default App;
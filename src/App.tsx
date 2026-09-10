import { useState } from 'react';
import { AboutScreen } from './components/AboutScreen';
import { AlgorithmsScreen } from './components/AlgorithmsScreen';
import { HomeScreen } from './components/HomeScreen';
import { LevelSelect } from './components/LevelSelect';
import { RaceScreen } from './components/RaceScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { LEVELS, setupRace } from './simulation/setupRace';

type Screen =
  | 'home'
  | 'levels'
  | 'algorithms'
  | 'about'
  | 'race'
  | 'results';

type InfoPage =
  | 'home'
  | 'levels'
  | 'algorithms'
  | 'about';

const LEVEL_ORDER = Object.keys(LEVELS);

function App() {
  const [screen, setScreen] = useState<Screen>('home');
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

  const navigate = (page: InfoPage) => {
    setScreen(page);
  };

  const selectLevel = (levelId: string) => {
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
  };

  const levelIndex = LEVEL_ORDER.indexOf(selectedLevel);
  const nextLevelId =
    levelIndex >= 0 && levelIndex < LEVEL_ORDER.length - 1
      ? LEVEL_ORDER[levelIndex + 1]
      : null;

  if (screen === 'home') {
    return (
      <HomeScreen
        onSelectLevel={() => setScreen('levels')}
        onNavigate={navigate}
      />
    );
  }

  if (screen === 'levels') {
    return (
      <LevelSelect
        levels={Object.values(LEVELS)}
        onSelect={selectLevel}
        onNavigate={navigate}
      />
    );
  }

  if (screen === 'algorithms') {
    return (
      <AlgorithmsScreen
        onNavigate={navigate}
      />
    );
  }

  if (screen === 'about') {
    return (
      <AboutScreen
        onNavigate={navigate}
      />
    );
  }

  if (screen === 'race') {
    return (
      <RaceScreen
        grid={level.grid}
        start={level.start}
        end={level.end}
        replay={raceSetup.replay}
        exploredByAlgorithm={raceSetup.exploredByAlgorithm}
        pathsByAlgorithm={raceSetup.pathsByAlgorithm}
        levelName={level.name}
        dynamicObstacles={level.dynamicObstacles}
        onFinished={() => setScreen('results')}
        onNavigate={navigate}
      />
    );
  }

  return (
    <ResultsScreen
      levelName={level.name}
      results={raceSetup.replay.results}
      onRaceAgain={() => setScreen('race')}
      onNextLevel={
        nextLevelId ? () => selectLevel(nextLevelId) : undefined
      }
      onNavigate={navigate}
    />
  );
}

export default App;

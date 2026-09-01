import Track from './components/Track';
import level1 from './tracks/level1.json';
import { bfs } from './algorithms/bfs';

function App() {
  const bfsResult = bfs(
    level1.grid,
    level1.start,
    level1.end
  );

  return (
    <main>
      <h1>F1 AI Grand Prix</h1>

      <Track
        grid={level1.grid}
        start={level1.start}
        end={level1.end}
        path={bfsResult.path}
        explored={bfsResult.exploredOrder}
      />
    </main>
  );
}

export default App;
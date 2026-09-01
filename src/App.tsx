import Track from './components/Track';
import level1 from './tracks/level1.json';

function App() {
  return (
    <main>
      <h1>F1 AI Grand Prix</h1>

      <Track
        grid={level1.grid}
      />
    </main>
  );
}

export default App;
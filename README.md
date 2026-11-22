# 🏎️ F1 AI Grand Prix
### Where Artificial Intelligence Meets the Racetrack.

What happens when you put different AI algorithms behind the wheel and make them race?

**F1 AI Grand Prix** is an interactive 2D Formula 1-inspired racing simulator that brings classic Artificial Intelligence search and optimisation algorithms to life. Instead of just studying how these algorithms work, you can watch them navigate a racetrack, make decisions, and compete using entirely different strategies.

From exploring possible routes to optimising paths through evolutionary computation, each algorithm approaches the same racing challenge differently.

**Seven algorithms. One racetrack. Very different ways to reach the finish line.**

---

## 🏁 The Algorithms

The simulator explores seven AI algorithms, covering uninformed search, informed search, local search, and evolutionary optimisation.

| Algorithm | Approach |
|---|---|
| **Breadth-First Search (BFS)** | Explores the track level by level, prioritising the shallowest available paths. |
| **Depth-First Search (DFS)** | Explores one path as deeply as possible before backtracking. |
| **Uniform Cost Search (UCS)** | Expands paths based on their accumulated movement cost. |
| **Greedy Best-First Search** | Uses a heuristic to prioritise the most promising-looking path. |
| **A* Search** | Combines actual path cost and heuristic estimates to find an optimal path under suitable conditions. |
| **Hill Climbing** | Iteratively improves a solution using locally better alternatives. |
| **Genetic Algorithm** | Evolves candidate solutions using selection, crossover, and mutation. |

### Why compare them?

Different algorithms have different strengths and limitations.

- BFS can find the shortest path in an unweighted graph, but may explore many unnecessary states.
- DFS can reach a destination quickly, but does not guarantee an optimal path.
- UCS considers accumulated cost rather than simply the number of steps.
- Greedy Best-First Search prioritises heuristic estimates, sometimes at the expense of optimality.
- A* balances the cost already incurred with an estimate of the remaining distance.
- Hill Climbing improves solutions locally but can get stuck in local optima.
- Genetic Algorithms explore a population of candidate solutions and evolve them over multiple generations.

The racetrack provides a visual way to understand these differences beyond textbook definitions.

---

## 🏎️ The Experience

F1 AI Grand Prix combines AI algorithm visualisation with an interactive racing environment.

- **2D Racing Environment:** A Formula 1-inspired racetrack provides the environment for algorithmic navigation.
- **AI-Based Navigation:** Different search strategies determine how racers approach the track.
- **Algorithm Comparison:** Explore how different approaches solve the same navigation problem.
- **Visual Simulation:** Watch the algorithms make decisions in a graphical racing environment.
- **Search and Optimisation:** Compare traditional search algorithms with local and evolutionary optimisation.

---

## 🛞 Under the Hood

The project brings together concepts from Artificial Intelligence and game development.

The algorithms approach navigation as a search or optimisation problem:

1. **State Representation:** The racing environment is represented in a form that algorithms can process.
2. **Search Space:** Possible movements and routes form the space of candidate solutions.
3. **Algorithm Execution:** Each algorithm explores or optimises this space according to its own strategy.
4. **Solution Generation:** The algorithm produces a route or candidate solution.
5. **Visualisation:** Phaser brings the resulting behaviour into the racing environment.

This makes the project more than a racing game: it is an interactive demonstration of how different AI problem-solving strategies behave.

---

## ⛽ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | User interface |
| TypeScript | Type-safe application development |
| Phaser 4 | 2D game engine and racing simulation |
| Vite | Development server and build tooling |
| JavaScript / TypeScript | AI algorithms and application logic |

---

## 🔧 Getting Started

### Prerequisites

- Node.js
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/suhaneemidha/f1-ai-grand-prix.git
cd f1-ai-grand-prix
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal to access the simulator.

### 4. Build for Production

```bash
npm run build
```

### 5. Run Linting

```bash
npm run lint
```

---

## 🏆 Concepts Explored

- Uninformed Search
- Informed Search and Heuristics
- Cost-Based Pathfinding
- Local Search and Optimisation
- Evolutionary Computation
- Genetic Algorithms
- State-Space Exploration
- Algorithmic Performance and Trade-offs

It demonstrates how theoretical AI concepts can be translated into an interactive application.

---

## 🏎️ Why I Built This

AI algorithms are much easier to understand when you can actually see them work.

I wanted to take concepts that are usually taught through search trees, graphs, and pseudocode and put them into an environment where their decisions have a visible outcome.

A racing simulator felt like a fun way to do exactly that.

Instead of simply asking which algorithm is theoretically better, the project encourages exploring *how* and *why* their approaches differ.

---

## 🏁 Built By

**Suhanee Midha**

If you're interested in Artificial Intelligence, search algorithms, pathfinding, or game development, feel free to explore the project!

---

**Less memorising algorithms. More watching them race. 🏁**

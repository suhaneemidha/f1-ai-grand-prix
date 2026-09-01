export interface GridPosition {
  row: number;
  col: number;
}

export interface TrackCell {
  walkable: boolean;
  terrainCost: number;
}

export type Grid = TrackCell[][];

export interface SearchResult {
  path: GridPosition[];
  nodesExplored: number;
  totalCost: number;
  exploredOrder: GridPosition[];
}
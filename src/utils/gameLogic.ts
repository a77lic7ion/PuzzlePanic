import { CellState, EnemyState } from '../types';

export function createInitialGrid(width: number, height: number): CellState[][] {
  const grid: CellState[][] = [];
  for (let y = 0; y < height; y++) {
    const row: CellState[] = [];
    for (let x = 0; x < width; x++) {
      // Outer perimeter is safe territory (1), interior is uncaptured (0)
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        row.push(1);
      } else {
        row.push(0);
      }
    }
    grid.push(row);
  }
  return grid;
}

export function calculateCapturePercentage(grid: CellState[][]): number {
  const height = grid.length;
  const width = grid[0].length;
  let totalInterior = 0;
  let capturedInterior = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      totalInterior++;
      if (grid[y][x] === 1) {
        capturedInterior++;
      }
    }
  }

  if (totalInterior === 0) return 100;
  return Math.round((capturedInterior / totalInterior) * 100);
}

/**
 * Flood fill algorithm when a trail is successfully completed.
 * Converts trail (2) and captured uncaptured regions (0) without enemies into safe territory (1).
 */
export function processCompletedCapture(
  grid: CellState[][],
  enemies: EnemyState[]
): { updatedGrid: CellState[][]; newlyCapturedCount: number } {
  const height = grid.length;
  const width = grid[0].length;
  const newGrid = grid.map(row => [...row]);

  // Step 1: Turn all trail cells (2) into safe territory (1) temporarily or treat them as barriers
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (newGrid[y][x] === 2) {
        newGrid[y][x] = 1;
      }
    }
  }

  // Step 2: Find all connected components of uncaptured cells (0)
  const visited: boolean[][] = Array.from({ length: height }, () => Array(width).boolean ? Array(width).fill(false) : Array(width).fill(false));
  const uncapturedComponents: { x: number; y: number }[][] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (newGrid[y][x] === 0 && !visited[y][x]) {
        // Flood fill this component
        const component: { x: number; y: number }[] = [];
        const queue: { x: number; y: number }[] = [{ x, y }];
        visited[y][x] = true;

        let qi = 0;
        while (qi < queue.length) {
          const curr = queue[qi++];
          component.push(curr);

          const neighbors = [
            { x: curr.x + 1, y: curr.y },
            { x: curr.x - 1, y: curr.y },
            { x: curr.x, y: curr.y + 1 },
            { x: curr.x, y: curr.y - 1 }
          ];

          for (const n of neighbors) {
            if (n.x >= 0 && n.x < width && n.y >= 0 && n.y < height) {
              if (newGrid[n.y][n.x] === 0 && !visited[n.y][n.x]) {
                visited[n.y][n.x] = true;
                queue.push(n);
              }
            }
          }
        }
        uncapturedComponents.push(component);
      }
    }
  }

  // Step 3: For each uncaptured component, check if any enemy is inside it
  let newlyCapturedCount = 0;
  for (const component of uncapturedComponents) {
    let hasEnemy = false;
    for (const enemy of enemies) {
      const ex = Math.floor(enemy.x);
      const ey = Math.floor(enemy.y);
      // Check if enemy is within component cells
      if (component.some(cell => cell.x === ex && cell.y === ey)) {
        hasEnemy = true;
        break;
      }
    }

    if (!hasEnemy) {
      // Capture this component! Turn cells into safe territory (1)
      for (const cell of component) {
        newGrid[cell.y][cell.x] = 1;
        newlyCapturedCount++;
      }
    }
  }

  return { updatedGrid: newGrid, newlyCapturedCount };
}

export function clearActiveTrail(grid: CellState[][]): CellState[][] {
  return grid.map(row => row.map(cell => (cell === 2 ? 0 : cell)));
}

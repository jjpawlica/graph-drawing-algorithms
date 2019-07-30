// Title: Force Directed
// Author: Jakub Pawlica
// Based on: Fruchterman, T. M. J. & Reingold, E. M. (1991), 'Graph Drawing by Force-directed Placement', Software - Practice and Experience 21 (11), 1129-1164.

import * as fs from 'fs';

import { distance, hasEdge, createNodesVector, createEdgesVector, createPositionVector } from '../utils/index.js';

const fruchtermanReingold = (path, graph, width, height, seed, timer, iterations, c = 0.5) => {
  const nodes = createNodesVector(graph.nodes);
  const edges = createEdgesVector(graph.edges);

  const initialPositions = createPositionVector(nodes, width, height, seed);
  const postions = [...initialPositions];
  const postionsCount = postions.length;

  const movements = [];

  movements.push(initialPositions);

  const optimalDistance = c * Math.sqrt((width * height) / nodes.length);
  const startTemperature = 0.01;

  const startTime = Date.now();

  let counter = 0;
  while (counter < iterations && Date.now() - startTime < timer) {
    const movement = Array(postionsCount).fill(0);
    for (const start of nodes) {
      const forces = Array(postionsCount).fill(0);
      for (const target of nodes) {
        if (start !== target) {
          const connected = hasEdge(edges, start, target);
          const startX = postions[start * 2];
          const startY = postions[start * 2 + 1];
          const targetX = postions[target * 2];
          const targetY = postions[target * 2 + 1];
          const distanceStartTarget = distance(startX, startY, targetX, targetY);
          if (distanceStartTarget > 0) {
            const unitX = (targetX - startX) / distanceStartTarget;
            const unitY = (targetY - startY) / distanceStartTarget;
            const repulsiveForce = optimalDistance ** 2 / distanceStartTarget;
            forces[start * 2] += repulsiveForce * -unitX;
            forces[start * 2 + 1] += repulsiveForce * -unitY;
            if (connected) {
              const attractionForce = distanceStartTarget ** 2 / optimalDistance;
              forces[start * 2] += attractionForce * unitX;
              forces[start * 2 + 1] += attractionForce * unitY;
            }
          }
        }
      }
      for (let i = 0; i < forces.length; i += 1) {
        forces[i] *= startTemperature * (1 - counter / iterations);
        movement[i] += forces[i];
      }
    }
    movements.push(movement);

    for (let i = 0; i < movement.length; i += 1) {
      postions[i] += movement[i];
      if (i % 2 === 0) {
        postions[i] = Math.max(0, Math.min(width, postions[i]));
      } else {
        postions[i] = Math.max(0, Math.min(height, postions[i]));
      }
    }
    counter += 1;
  }

  fs.writeFileSync(path, JSON.stringify(movements, null, 2));
  return Date.now() - startTime;
};

export default fruchtermanReingold;

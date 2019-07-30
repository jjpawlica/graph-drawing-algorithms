// Title: Spring Embedder
// Author: Jakub Jan Pawlica
// Based on: Eades, P. (1984), 'A heuristic for graph drawing', Congressus Numerantium 42 , 149-160.

import * as fs from 'fs';

import { distance, hasEdge, createNodesVector, createEdgesVector, createPositionVector } from '../utils/index.js';

// c1 attraction force constant - original value = 2
// c2 repelent force constant - original value = 1
// c3 rate of change - original value = 0.01
// l optimal edge length - original value = 1
// k number of iterations - original value = 500

// 1 , 1 , 1 , 100

const springEmbedder = (path, graph, width, height, seed, timer, iterations, lenght, c1 = 1, c2 = 1, c3 = 100) => {
  const nodes = createNodesVector(graph.nodes);
  const edges = createEdgesVector(graph.edges);

  const initialPositions = createPositionVector(nodes, width, height, seed);
  const postions = [...initialPositions];
  const postionsCount = postions.length;

  const movements = [];

  movements.push(initialPositions);

  const startTime = Date.now();

  let counter = 0;
  while (counter < iterations && Date.now() - startTime < timer) {
    const movement = Array(postionsCount).fill(0);
    for (const start of nodes) {
      let forceX = 0;
      let forceY = 0;

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

            if (connected) {
              const attractionForce = c1 * Math.log(distanceStartTarget / lenght);
              forceX += attractionForce * unitX;
              forceY += attractionForce * unitY;
            } else {
              const repulsiveForce = c2 / Math.sqrt(distanceStartTarget);
              forceX += repulsiveForce * -unitX;
              forceY += repulsiveForce * -unitY;
            }
          }
        }
      }

      forceX *= c3;
      forceY *= c3;

      movement[start * 2] += forceX;
      movement[start * 2 + 1] += forceY;

      postions[start * 2] += forceX;
      postions[start * 2 + 1] += forceY;
    }

    movements.push(movement);
    counter += 1;
  }

  fs.writeFileSync(path, JSON.stringify(movements, null, 2));
  return Date.now() - startTime;
};

export default springEmbedder;

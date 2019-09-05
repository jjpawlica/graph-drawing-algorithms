import * as fs from 'fs';
import seedrandom from 'seedrandom';

import {
  distance,
  hasEdge,
  isSameEdge,
  createNodesVector,
  createEdgesVector,
  createPositionVector
} from '../utils/index.js';

const calculateNodeDistanceFactor = (nodes, postions) => {
  let factor = 0;

  for (const start of nodes) {
    for (const target of nodes) {
      if (start !== target) {
        const startX = postions[start * 2];
        const startY = postions[start * 2 + 1];
        const targetX = postions[target * 2];
        const targetY = postions[target * 2 + 1];

        const distanceBetweenNodes = distance(startX, startY, targetX, targetY);

        if (distanceBetweenNodes > 0) {
          factor += 1 / (distanceBetweenNodes * distanceBetweenNodes);
        }
      }
    }
  }

  return factor / 2;
};

const calculateBordelinesDistanceFactor = (nodes, postions, width, height) => {
  let factor = 0;

  for (const start of nodes) {
    const nodeX = postions[start * 2];
    const nodeY = postions[start * 2 + 1];

    const left = nodeX;
    const top = nodeY;
    const right = width - nodeX;
    const bottom = height - nodeY;

    if (left > 0 && top > 0 && right > 0 && bottom > 0) {
      factor += 1 / (left * left) + 1 / (top * top) + 1 / (right * right) + 1 / (bottom * bottom);
    }
  }

  return factor;
};

const calculateEdgeLenghtFactor = (nodes, edges, postions) => {
  let factor = 0;
  for (const start of nodes) {
    for (const target of nodes) {
      if (start !== target) {
        const connected = hasEdge(edges, start, target);

        const startX = postions[start * 2];
        const startY = postions[start * 2 + 1];
        const targetX = postions[target * 2];
        const targetY = postions[target * 2 + 1];

        const distanceBetweenNodes = distance(startX, startY, targetX, targetY);

        if (connected) {
          factor += distanceBetweenNodes * distanceBetweenNodes;
        }
      }
    }
  }

  return factor / 2;
};

const calculateEdgeCrossingFactor = (edges, postions) => {
  let factor = 0;

  for (const firstEdge of edges) {
    for (const secondEdge of edges) {
      const notSameEdge = !isSameEdge(firstEdge, secondEdge);
      const notSameSource = !(firstEdge[0] === secondEdge[0]);
      const notSameTarget = !(firstEdge[1] === secondEdge[1]);
      const notTranstion = !(firstEdge[1] === secondEdge[0] || firstEdge[0] === secondEdge[1]);

      if (notSameEdge && notSameSource && notSameTarget && notTranstion) {
        const firstEdgeStart = firstEdge[0];
        const firstEdgeEnd = firstEdge[1];
        const secondEdgeStart = secondEdge[0];
        const secondEdgeEnd = secondEdge[1];

        const firstEdgeStartX = postions[firstEdgeStart * 2];
        const firstEdgeStartY = postions[firstEdgeStart * 2 + 1];

        const firstEdgeEndX = postions[firstEdgeEnd * 2];
        const firstEdgeEndY = postions[firstEdgeEnd * 2 + 1];

        const secondEdgeStartX = postions[secondEdgeStart * 2];
        const secondEdgeStartY = postions[secondEdgeStart * 2 + 1];

        const secondEdgeEndX = postions[secondEdgeEnd * 2];
        const secondEdgeEndY = postions[secondEdgeEnd * 2 + 1];

        const AB = [firstEdgeEndX - firstEdgeStartX, firstEdgeEndY - firstEdgeStartY];
        const AC = [secondEdgeStartX - firstEdgeStartX, secondEdgeStartY - firstEdgeStartY];
        const AD = [secondEdgeEndX - firstEdgeStartX, secondEdgeEndY - firstEdgeStartY];

        const CD = [secondEdgeEndX - secondEdgeStartX, secondEdgeEndY - secondEdgeStartY];
        const CA = [firstEdgeStartX - secondEdgeStartX, firstEdgeStartY - secondEdgeStartY];
        const CB = [firstEdgeEndX - secondEdgeStartX, firstEdgeEndY - secondEdgeStartY];

        const ABxAC = AB[0] * AC[1] - AC[0] * AB[1];
        const ABxAD = AB[0] * AD[1] - AD[0] * AB[1];

        const CDxCA = CD[0] * CA[1] - CA[0] * CD[1];
        const CDxCB = CD[0] * CB[1] - CB[0] * CD[1];

        const u = ABxAC * ABxAD;
        const v = CDxCA * CDxCB;

        if (u <= 0 && v <= 0) {
          factor += 1;
        }
      }
    }
  }

  return factor / 8;
};

const calculateNodeEdgeDistanceFactor = (nodes, edges, postions) => {
  let factor = 0;

  for (const node of nodes) {
    for (const edge of edges) {
      const edgeStart = edge[0];
      const edgeEnd = edge[1];

      const notNodeEdgeStart = !(node === edgeStart);
      const notNodeEdgeEnd = !(node === edgeEnd);

      if (notNodeEdgeStart && notNodeEdgeEnd) {
        const edgeStartX = postions[edgeStart * 2];
        const edgeStartY = postions[edgeStart * 2 + 1];

        const edgeEndX = postions[edgeEnd * 2];
        const edgeEndY = postions[edgeEnd * 2 + 1];

        const nodeX = postions[node * 2];
        const nodeY = postions[node * 2 + 1];

        const AB = [edgeEndX - edgeStartX, edgeEndY - edgeStartY];
        const AC = [nodeX - edgeStartX, nodeY - edgeStartY];

        const ACdotAB = AC[0] * AB[0] + AC[1] * AB[1];
        const ABdotAB = AB[0] * AB[0] + AB[1] * AB[1];

        let distanceToNode = 0;

        if (ACdotAB <= 0) {
          distanceToNode = distance(nodeX, nodeY, edgeStartX, edgeStartY);
        }
        if (ABdotAB <= ACdotAB) {
          distanceToNode = distance(nodeX, nodeY, edgeEndX, edgeEndY);
        } else {
          const b = ACdotAB / ABdotAB;
          const pointOnSegment = [edgeStartX + b * AB[0], edgeStartY + b * AB[1]];
          distanceToNode = distance(nodeX, nodeY, pointOnSegment[0], pointOnSegment[1]);
        }

        if (distanceToNode > 0) {
          factor += 1 / (distanceToNode * distanceToNode);
        }
      }
    }
  }
  return factor;
};

const generateAlternativeLayout = (positions, node, radius, angle) => {
  const alternativePositions = [...positions];

  alternativePositions[node * 2] += Math.cos(angle) * radius;
  alternativePositions[node * 2 + 1] += Math.sin(angle) * radius;

  return alternativePositions;
};

const simulatedAnnealing = (path, graph, width, height, seed, timer, iterations) => {
  const nodes = createNodesVector(graph.nodes);
  const edges = createEdgesVector(graph.edges);

  // Początkowe położenie wierzchołków
  const initialPositions = createPositionVector(nodes, width, height, seed);

  // Zmienn położenie wierzchołków co iteracje
  const positions = [...initialPositions];

  // Historia położenia symulująca poruszanie się wierzchołków
  const movements = [];

  // Dodanie początkowego położenia do historii

  movements.push(initialPositions);

  // Seed dla random
  const random = seedrandom(seed);

  // Wagi dla składowych algorytmu

  const d1 = 10;
  const d2 = 100;
  const d3 = 0.00001;
  const d4 = 0.01;
  const d5 = 10;

  const maxRadius = 50;
  const minRadius = 1;

  const radiusDelta = Math.pow(minRadius / maxRadius, 1 / iterations);

  const startTemperature = 10000;

  const temperatureDelta = 0.75;

  let currentRadius = maxRadius;
  let currentTemperature = startTemperature;

  // Oblicz początkową wartość funckji celu

  const n1 = calculateNodeDistanceFactor(nodes, positions);
  const n2 = calculateBordelinesDistanceFactor(nodes, positions, width, height);
  const n3 = calculateEdgeLenghtFactor(nodes, edges, positions);
  const n4 = calculateEdgeCrossingFactor(edges, positions);
  const n5 = calculateNodeEdgeDistanceFactor(nodes, edges, positions);

  let currentFitness = d1 * n1 + d2 * n2 + d3 * n3 + d4 * n4 + d5 * n5;

  let lowestEver = currentFitness;

  // Główna pętla algorytmu
  let counter = 0;
  const startTime = Date.now();

  while (counter < iterations && Date.now() - startTime < timer) {
    // Alternatywne ułożenie grafu na płaszczyźnie
    const randomNode = ~~(random() * nodes.length);
    const randomAngle = random() * Math.PI * 2;
    const alternativePostions = generateAlternativeLayout(positions, randomNode, currentRadius, randomAngle);

    // Wartość funckji celu alternatywnego ułożenia grafu na płaszczyźnie

    const m1 = calculateNodeDistanceFactor(nodes, alternativePostions);
    const m2 = calculateBordelinesDistanceFactor(nodes, alternativePostions, width, height);
    const m3 = calculateEdgeLenghtFactor(nodes, edges, alternativePostions);
    const m4 = calculateEdgeCrossingFactor(edges, alternativePostions);
    const m5 = calculateNodeEdgeDistanceFactor(nodes, edges, alternativePostions);

    const alternativeFitness = d1 * m1 + d2 * m2 + d3 * m3 + d4 * m4 + d5 * m5;

    // Sprawdż czy zamienić layout
    const deltaFitness = currentFitness - alternativeFitness;
    const shouldChangeLayout = random() < Math.exp(deltaFitness / currentTemperature);

    if (shouldChangeLayout) {
      // Update position and update movement
      const movement = Array(positions.length).fill(0);

      for (let i = 0; i < positions.length; i += 1) {
        movement[i] = alternativePostions[i] - positions[i];
        positions[i] = alternativePostions[i];
      }

      currentFitness = alternativeFitness;
      counter += 1;

      movements.push(movement);
    }

    currentTemperature *= temperatureDelta;
    currentRadius *= radiusDelta;

    if (alternativeFitness < lowestEver) {
      lowestEver = alternativeFitness;
    }
  }

  fs.writeFileSync(path, JSON.stringify(movements, null, 2));
  const totalTime = Date.now() - startTime;
  return [totalTime, counter];
};
export default simulatedAnnealing;

/* eslint-disable no-nested-ternary */
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

const calculateAngularResolutionFactor = (nodes, edges, positions) => {
  let factor = 0;
  for (const node of nodes) {
    const nodeX = positions[node * 2];
    const nodeY = positions[node * 2 + 1];
    const neighbors = edges.filter(edge => edge[0] === node);

    // C atan2
    for (let i = 0; i < neighbors.length; i += 1) {
      const target = neighbors[i][1];

      const targetX = positions[target * 2];
      const targetY = positions[target * 2 + 1];

      neighbors[i][2] = Math.atan2(targetY - nodeY, targetX - nodeX);
    }

    // Sort
    const sortedNeighbors = [...neighbors];
    sortedNeighbors.sort((a, b) => (a[2] < b[2] ? -1 : a[2] > b[2] ? 1 : 0));

    let totalDifference = 0;

    if (sortedNeighbors.length > 1) {
      for (let i = 0; i < sortedNeighbors.length; i += 1) {
        const firstIndex = i;
        const secondIndex = i === sortedNeighbors.length - 1 ? 0 : i + 1;

        const firstEdge = sortedNeighbors[firstIndex];
        const secondEdge = sortedNeighbors[secondIndex];

        const firstEdgeSource = firstEdge[0];
        const firstEdgeTarget = firstEdge[1];

        const secondEdgeSource = secondEdge[0];
        const secondEdgeTarget = secondEdge[1];

        const firstEdgeSourceX = positions[firstEdgeSource * 2];
        const firstEdgeSourceY = positions[firstEdgeSource * 2 + 1];

        const firstEdgeTargetX = positions[firstEdgeTarget * 2];
        const firstEdgeTargetY = positions[firstEdgeTarget * 2 + 1];

        const secondEdgeSourceX = positions[secondEdgeSource * 2];
        const secondEdgeSourceY = positions[secondEdgeSource * 2 + 1];

        const secondEdgeTargetX = positions[secondEdgeTarget * 2];
        const secondEdgeTargetY = positions[secondEdgeTarget * 2 + 1];

        const AB = [firstEdgeTargetX - firstEdgeSourceX, firstEdgeTargetY - firstEdgeSourceY];
        const AC = [secondEdgeTargetX - secondEdgeSourceX, secondEdgeTargetY - secondEdgeSourceY];

        const ABdotAC = AB[0] * AC[0] + AB[1] * AC[1];

        const firstEdgeLength = distance(firstEdgeSourceX, firstEdgeSourceY, firstEdgeTargetX, firstEdgeTargetY);
        const secondEdgeLength = distance(secondEdgeSourceX, secondEdgeSourceY, secondEdgeTargetX, secondEdgeTargetY);

        const cosAngle = ABdotAC / (firstEdgeLength * secondEdgeLength);

        let angle = 0;

        if (i === sortedNeighbors.length - 1) {
          angle = 360 - Math.acos(cosAngle) * (180 / Math.PI);
        } else {
          angle = Math.acos(cosAngle) * (180 / Math.PI);
        }
        const difference = Math.abs(360 / sortedNeighbors.length - angle);
        totalDifference += difference;
      }
    }

    factor += totalDifference;
  }
  return factor;
};

const generateAlternativeLayouts = (positions, node, side) => {
  const alternativePositions = [];
  for (let i = 0; i < 8; i += 1) {
    alternativePositions[i] = [...positions];
  }
  // Otoczenie LG
  alternativePositions[0][node * 2] -= side / 2;
  alternativePositions[0][node * 2 + 1] -= side / 2;

  // Otoczenie SG
  alternativePositions[1][node * 2 + 1] -= side / 2;

  // Otoczenie PG
  alternativePositions[2][node * 2] += side / 2;
  alternativePositions[2][node * 2 + 1] -= side / 2;

  // Otoczenie LS
  alternativePositions[3][node * 2] -= side / 2;

  // Otoczenie PS
  alternativePositions[4][node * 2] += side / 2;

  // Otoczenie LD
  alternativePositions[5][node * 2] -= side / 2;
  alternativePositions[5][node * 2 + 1] += side / 2;

  // Otoczenie SD
  alternativePositions[6][node * 2 + 1] += side / 2;

  // Otoczenie PD
  alternativePositions[7][node * 2] += side / 2;
  alternativePositions[7][node * 2 + 1] += side / 2;

  return alternativePositions;
};

const tabuSearch = (path, graph, width, height, seed, timer, iterations) => {
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

  const d1 = 1000;
  const d2 = 0.0000001;
  const d3 = 0.1;
  const d4 = 0.00001;

  const maxSide = 100;
  const minSide = 3;

  const sideDelta = (minSide / maxSide) ** (1 / iterations);

  let currentSide = maxSide;

  // Oblicz początkową wartość funckji celu

  const n1 = calculateNodeDistanceFactor(nodes, positions);
  const n2 = calculateEdgeLenghtFactor(nodes, edges, positions);
  const n3 = calculateEdgeCrossingFactor(edges, positions);
  const n4 = calculateAngularResolutionFactor(nodes, edges, positions);
  let currentFitness = d1 * n1 + d2 * n2 + d3 * n3 + d4 * n4;

  // Główna pętla algorytmu
  let counter = 0;
  const startTime = Date.now();

  let tabuList = [];

  const tabuDuration = 7;

  const tabuCutoff = 0.9;

  while (counter < iterations && Date.now() - startTime < timer) {
    // Sprawdź listę tabu - zmniejsz czas
    if (tabuList.length > 0) {
      const tabuClone = [...tabuList];
      for (const point of tabuClone) {
        point[2] -= 1;
      }
      tabuList = tabuClone;
    }

    // Sprawdź listę tabu -  usuń jeżeli czas = 0
    tabuList = tabuList.filter(point => point[2] > 0);

    // Alternatywne ułożenie grafu na płaszczyźnie
    const randomNode = ~~(random() * nodes.length);
    const alternativeLayouts = generateAlternativeLayouts(positions, randomNode, currentSide);

    let bestLayoutIndex = -1;

    for (let i = 0; i < alternativeLayouts.length; i += 1) {
      const pointToCheckX = alternativeLayouts[i][randomNode * 2];
      const pointToCheckY = alternativeLayouts[i][randomNode * 2 + 1];

      let isOnTabuList = false;
      // Sprawdz czy point nie na tabu
      if (tabuList.length > 0) {
        for (const point of tabuList) {
          if (pointToCheckX === point[0] && pointToCheckY === point[1]) {
            isOnTabuList = true;
          }
        }
      }

      if (!isOnTabuList) {
        const m1 = calculateNodeDistanceFactor(nodes, alternativeLayouts[i]);
        const m2 = calculateEdgeLenghtFactor(nodes, edges, alternativeLayouts[i]);
        const m3 = calculateEdgeCrossingFactor(edges, alternativeLayouts[i]);
        const m4 = calculateAngularResolutionFactor(nodes, edges, alternativeLayouts[i]);
        const alternativeFitness = d1 * m1 + d2 * m2 + d3 * m3 + d4 * m4;

        if (currentFitness / alternativeFitness < tabuCutoff) {
          tabuList.push([pointToCheckX, pointToCheckY, tabuDuration]);
        }

        if (alternativeFitness < currentFitness) {
          currentFitness = alternativeFitness;
          bestLayoutIndex = i;
        }
      }
    }

    if (bestLayoutIndex >= 0) {
      const movement = Array(positions.length).fill(0);
      tabuList.push([positions[randomNode * 2], positions[randomNode * 2 + 1], tabuDuration]);

      for (let i = 0; i < positions.length; i += 1) {
        movement[i] = alternativeLayouts[bestLayoutIndex][i] - positions[i];
        positions[i] = alternativeLayouts[bestLayoutIndex][i];
      }

      movements.push(movement);
    }
    currentSide *= sideDelta;
    counter += 1;
  }

  fs.writeFileSync(path, JSON.stringify(movements, null, 2));
  const totalTime = Date.now() - startTime;
  return [totalTime, counter];
};

export default tabuSearch;

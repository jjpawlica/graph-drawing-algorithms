/* eslint-disable no-nested-ternary */
import * as fs from 'fs';
import seedrandom from 'seedrandom';

import { distance, hasEdge, isSameEdge, createNodesVector, createEdgesVector } from '../utils/index.js';

const createInitialPopulation = (nodes, size, width, height, seed) => {
  const random = seedrandom(seed);
  const population = [];
  for (let i = 0; i < size; i += 1) {
    population[i] = [];
    for (let j = 0; j < nodes.length; j += 1) {
      population[i].push(~~(random() * width));
      population[i].push(~~(random() * height));
    }
  }
  return population;
};

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

const calculateUniformEdgeLenghtFactor = (nodes, edges, postions, expectedLenght) => {
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
          factor += (distanceBetweenNodes - expectedLenght) ** 2;
        }
      }
    }
  }

  return factor / edges.length;
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

    let nodeFactor = 0;

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
        const partial = 1 / (angle * angle);
        nodeFactor += partial;
      }
    }

    factor += nodeFactor;
  }
  return factor;
};

const calculateUniformAngleFactor = (nodes, edges, positions) => {
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

    let nodeFactor = 0;

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
        const partial = (angle - 360 / sortedNeighbors.length) ** 2 / sortedNeighbors.length;
        nodeFactor += partial;
      }
    }

    factor += nodeFactor;
  }
  return factor;
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

const calculateSymetryFactor = (nodes, postions, centerX, centerY) => {
  let factor = 0;

  for (const node of nodes) {
    const startX = postions[node * 2];
    const startY = postions[node * 2 + 1];
    const targetX = centerX;
    const targetY = centerY;

    const distanceBetweenNodes = distance(startX, startY, targetX, targetY);

    if (distanceBetweenNodes > 0) {
      factor += 1 / (distanceBetweenNodes * distanceBetweenNodes);
    }
  }

  return factor / 2;
};

const calculateAverageSymetryFactor = (nodes, postions, centerX, centerY) => {
  let factor = 0;
  let totalDistanceFromCenter = 0;

  for (const node of nodes) {
    const startX = postions[node * 2];
    const startY = postions[node * 2 + 1];
    const targetX = centerX;
    const targetY = centerY;

    const distanceBetweenNodes = distance(startX, startY, targetX, targetY);

    totalDistanceFromCenter += distanceBetweenNodes;
  }

  const avgDistanceFromCenter = totalDistanceFromCenter / nodes.length;

  for (const node of nodes) {
    const startX = postions[node * 2];
    const startY = postions[node * 2 + 1];
    const targetX = centerX;
    const targetY = centerY;

    const distanceBetweenNodes = distance(startX, startY, targetX, targetY);

    factor += (distanceBetweenNodes - avgDistanceFromCenter) ** 2 / nodes.length;
  }

  return factor;
};
const calculatePopulationFitness = (nodes, edges, width, height, population) => {
  // Wagi algorytmu
  // const d1 = 0.00001;
  // const d2 = 1000000;
  // const d3 = 10000;
  // const d4 = 0.01;
  // const d5 = 10;
  // const d6 = 2;
  // const d7 = 0;
  // const d8 = 0;

  const d1 = 0.00001;
  const d2 = 1000000;
  const d3 = 10000;
  const d4 = 0.01;
  const d5 = 10;
  const d6 = 2;
  const d7 = 0;
  const d8 = 1;

  // Długość krawędzi
  const expectedLenght = ((width * height) / nodes.length) ** (1 / 2);

  // Centrum Symterii
  const symetryX = width / 2;
  const symetryY = height / 2;

  // Charakterystki populacji
  const populationFitness = [];

  // Obliczenia
  for (const memberPositions of population) {
    const n1 = calculateNodeDistanceFactor(nodes, memberPositions);
    const n2 = calculateEdgeLenghtFactor(nodes, edges, memberPositions);
    const n3 = calculateUniformEdgeLenghtFactor(nodes, edges, memberPositions, expectedLenght);
    const n4 = calculateAngularResolutionFactor(nodes, edges, memberPositions);
    const n5 = calculateUniformAngleFactor(nodes, edges, memberPositions);
    const n6 = calculateEdgeCrossingFactor(edges, memberPositions) + 1;
    const n7 = calculateSymetryFactor(nodes, memberPositions, symetryX, symetryY);
    const n8 = calculateAverageSymetryFactor(nodes, memberPositions, symetryX, symetryY);

    const memberFitness = d1 / n1 + d2 / n2 + d3 / n3 + d4 / n4 + d5 / n5 + d6 / n6 + d7 / n7 + d8 / n8;
    // console.log(d1 / n1, d2 / n2, d3 / n3, d4 / n4, d5 / n5, d6 / n6, d7 / n7, d8 / n8)
    populationFitness.push(memberFitness);
  }

  let populationFitnessSum = 0;

  for (let i = 0; i < populationFitness.length; i += 1) {
    populationFitnessSum += populationFitness[i];
  }

  const populationAvgFitness = populationFitnessSum / populationFitness.length;

  let populationSumOfDifferences = 0;

  for (let i = 0; i < populationFitness.length; i += 1) {
    populationSumOfDifferences += (populationFitness[i] - populationAvgFitness) ** 2;
  }

  const populationStdFitness = (populationSumOfDifferences / (populationFitness.length - 1)) ** (1 / 2);

  // Sigma scaling

  const populaionScaledFitness = [];
  for (let i = 0; i < populationFitness.length; i += 1) {
    if (populationStdFitness > 0) {
      const value = 1 + (populationFitness[i] - populationAvgFitness) / (2 * populationStdFitness);
      populaionScaledFitness.push(value);
    } else {
      populaionScaledFitness.push(1);
    }
  }

  return [populationFitness, populaionScaledFitness];
};

const findBestMember = population => {
  const index = population.reduce(
    (bestIndexSoFar, currentlyTestedValue, currentlyTestedIndex, array) =>
      currentlyTestedValue > array[bestIndexSoFar] ? currentlyTestedIndex : bestIndexSoFar,
    0
  );
  return index;
};

const getElementIndex = (value, array) => {
  for (let i = 0; i < array.length; i += 1) {
    if (value < array[i]) {
      return i;
    }
  }
};

const generateNewPopulation = (populationFitness, random) => {
  let fitnessSum = 0;

  for (let i = 0; i < populationFitness.length; i += 1) {
    fitnessSum += populationFitness[i];
  }

  let probablitySum = 0;
  const probabilites = [];

  for (let i = 0; i < populationFitness.length; i += 1) {
    const currentProbability = probablitySum + populationFitness[i] / fitnessSum;
    probabilites.push(currentProbability);
    probablitySum += populationFitness[i] / fitnessSum;
  }
  const newPopulation = [];
  while (newPopulation.length < populationFitness.length - 1) {
    const value = random();
    const index = getElementIndex(value, probabilites);

    newPopulation.push(index);
  }

  return newPopulation;
};

const geneticAlgorithm = (path, graph, width, height, seed, timer, iterations) => {
  const nodes = createNodesVector(graph.nodes);
  const edges = createEdgesVector(graph.edges);

  // Parametry algorytmu
  const populationSize = 30;
  const crossoverProbability = 0.75;
  const mutationProbablity = 0.25;
  const inversionProbablity = 0.2;

  const globalDelta = 1;

  // Początkowe położenie wierzchołków
  const initialPopulation = createInitialPopulation(nodes, populationSize, width, height, seed);
  const initialPopulationFitness = calculatePopulationFitness(nodes, edges, width, height, initialPopulation);

  const bestMember = findBestMember(initialPopulationFitness[1]);

  const initialPosition = initialPopulation[bestMember];
  const currentPosition = [...initialPosition];
  const movements = [];

  movements.push(initialPosition);

  let bestFitness = initialPopulationFitness[0][bestMember];
  let bestPosition = [...initialPosition]

  let finalFitness = 0;

  let currentPopulation = JSON.parse(JSON.stringify(initialPopulation));
  let currentPopulationFitness = JSON.parse(JSON.stringify(initialPopulationFitness[1]));

  // Seed dla random
  const random = seedrandom(seed);

  // Główna pętla algorytmu
  let counter = 0;
  const startTime = Date.now();

  while (counter < iterations && Date.now() - startTime < timer) {
    // Wybierz osobniki z poprzedniej populacji
    const newPopulationIndexes = generateNewPopulation(currentPopulationFitness, random);
    // Dodaj najlepszego osobnika z poprzedniej populacji
    newPopulationIndexes.push(bestMember);

    const newPopulation = [];

    for (let i = 0; i < newPopulationIndexes.length; i += 1) {
      const index = newPopulationIndexes[i];
      newPopulation.push(currentPopulation[index]);
    }

    // Dokonaj krzyżowania
    const crossedPopulation = [];
    for (let i = 0; i < populationSize; i += 1) {
      if (i % 2 === 0) {
        const value = random();
        if (value < crossoverProbability) {
          const randomNode = ~~(random() * nodes.length);

          const firstPart = newPopulation[i].slice(0, randomNode);
          const secondPart = newPopulation[i].slice(randomNode);

          const thirdPart = newPopulation[i + 1].slice(0, randomNode);
          const fourthPart = newPopulation[i + 1].slice(randomNode);

          const firstOffspring = firstPart.concat(fourthPart);
          const secondOffspring = thirdPart.concat(secondPart);

          crossedPopulation.push(firstOffspring);
          crossedPopulation.push(secondOffspring);
        } else {
          crossedPopulation.push(newPopulation[i]);
          crossedPopulation.push(newPopulation[i + 1]);
        }
      }
    }

    // Dokonaj mutacji 1
    for (const member of crossedPopulation) {
      const firstMutationProbablity = random();
      if (firstMutationProbablity <= mutationProbablity) {
        const randomPoint = ~~(random() * member.length);
        const c = random();
        const r = random();
        const t = counter;
        if (randomPoint % 2 === 0) {
          // przesunięcie X
          const a = 0;
          const b = width;
          if (c <= 0.5) {
            const z = b - member[randomPoint];
            const delta = z * (1 - r ** ((1 - t / iterations) ** globalDelta));
            member[randomPoint] += delta;
          } else {
            const z = member[randomPoint] - a;
            const delta = z * (1 - r ** ((1 - t / iterations) ** globalDelta));
            member[randomPoint] -= delta;
          }
        } else {
          // przesunięcie Y
          const a = 0;
          const b = height;
          if (c <= 0.5) {
            const z = b - member[randomPoint];
            const delta = z * (1 - r ** ((1 - t / iterations) ** globalDelta));
            member[randomPoint] += delta;
          } else {
            const z = member[randomPoint] - a;
            const delta = z * (1 - r ** ((1 - t / iterations) ** globalDelta));
            member[randomPoint] -= delta;
          }
        }
      }
    }

    // Dokonaj mutacji 2
    for (const member of crossedPopulation) {
      const secondMutationProbablity = random();
      if (secondMutationProbablity <= mutationProbablity) {
        const randomNode = ~~(random() * nodes.length);
        const l = ((width * height) / nodes.length) ** (1 / 2);
        const r = l * (1 - counter / iterations);
        const randomAngle = random() * Math.PI * 2;
        member[randomNode * 2] += r * Math.cos(randomAngle);
        member[randomNode * 2 + 1] += r * Math.sin(randomAngle);
      }
    }

    // Dokonaj inwersji
    const invertedPopulation = [];
    for (const member of crossedPopulation) {
      const inversionProb = random();
      if (inversionProb <= inversionProbablity) {
        let i = ~~(random() * member.length);
        let j = ~~(random() * member.length);
        while (j <= i && (j - i) % 2 !== 0) {
          i = ~~(random() * member.length);
          j = ~~(random() * member.length);
        }
        const firstPart = member.slice(0, 2);
        const secondPart = member.slice(2, 5);
        const thirdPart = member.slice(5);

        const reverse = secondPart.reverse();

        const invertedOffspring = firstPart.concat(reverse, thirdPart);
        invertedPopulation.push(invertedOffspring);
      } else {
        invertedPopulation.push(member);
      }
    }

    // Oblicz funckę celu dla populacji
    const newPopulationFitness = calculatePopulationFitness(nodes, edges, width, height, invertedPopulation);
    const newBestMember = findBestMember(newPopulationFitness[1]);

    const movement = Array(currentPosition.length).fill(0);

    for (let i = 0; i < currentPosition.length; i += 1) {
      movement[i] = invertedPopulation[newBestMember][i] - currentPosition[i];
      currentPosition[i] = invertedPopulation[newBestMember][i];
    }

    movements.push(movement);
    finalFitness = newPopulationFitness[0][newBestMember];

    if (newPopulationFitness[0][newBestMember] > bestFitness) {
      bestFitness = newPopulationFitness[0][newBestMember];
      bestPosition = JSON.parse(JSON.stringify(invertedPopulation[newBestMember]));
    }

    currentPopulation = JSON.parse(JSON.stringify(invertedPopulation));
    currentPopulationFitness = JSON.parse(JSON.stringify(newPopulationFitness[1]));

    // Zwróć n
    counter += 1;
  }

  console.log(bestFitness);
  fs.writeFileSync(path, JSON.stringify(movements, null, 2));
  const totalTime = Date.now() - startTime;
  return [totalTime, counter, bestFitness, finalFitness, bestPosition];
};

export default geneticAlgorithm;

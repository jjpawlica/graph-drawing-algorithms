import * as fs from 'fs';

import geneticAlgorithm from './algorithms/geneticAlgorithm.js';

// Paramatry algorytmu
const seed = '12345';
const width = 1000;
const heigh = 1000;
const timer = 60000;
const iterations = 1000;

const files = fs.readdirSync('public/data/graphs');
const graphNames = files.map(item => item.slice(0, -5));

const resultsPath = 'public/data/results/ga';
const resultsTimes = [];

// ===== RUN GENETIC ALGORITHM ===== /

for (const [index, graphName] of graphNames.entries()) {
  const data = JSON.parse(fs.readFileSync(`./public/data/graphs/${graphName}.json`, 'utf8'));
  const { graph } = data;
  console.log(`${index + 1}/${graphNames.length}`);

  const [time, count, bestFitness, finalFitness, bestPostion] = geneticAlgorithm(
    `${resultsPath}/${graphName}.json`,
    graph,
    width,
    heigh,
    seed,
    timer,
    iterations
  );

  resultsTimes.push({
    graphName,
    time,
    counter: count,
    bestFitness,
    finalFitness,
    bestPostion
  });
}

fs.writeFileSync('public/data/results/ga/results.json', JSON.stringify(resultsTimes, null, 4));

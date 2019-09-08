import * as fs from 'fs';

import tabuSearch from './algorithms/tabuSearch.js';

// Paramatry algorytmu
const seed = '12345';
const width = 1000;
const heigh = 1000;
const timer = 60000;
const iterations = 10000;

// const data = JSON.parse(fs.readFileSync(`./public/data/graphs/cubical_graph.json`, 'utf8'));
// const { graph } = data;

// tabuSearch(`public/data/results/ts/cubical_graph.json`, graph, width, heigh, seed, timer, iterations);

const files = fs.readdirSync('public/data/graphs');
const graphNames = files.map(item => item.slice(0, -5));

const resultsPath = 'public/data/results/ts';
const resultsTimes = [];

// ===== RUN TABU SEARCH ===== /;

for (const [index, graphName] of graphNames.entries()) {
  const data = JSON.parse(fs.readFileSync(`./public/data/graphs/${graphName}.json`, 'utf8'));
  const { graph } = data;
  console.log(`${index + 1}/${graphNames.length}`);

  const [time, count] = tabuSearch(`${resultsPath}/${graphName}.json`, graph, width, heigh, seed, timer, iterations);

  resultsTimes.push({
    graphName,
    time,
    counter: count
  });
}

fs.writeFileSync('public/data/results/ts/results.json', JSON.stringify(resultsTimes, null, 4));

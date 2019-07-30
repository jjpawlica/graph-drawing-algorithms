import * as fs from 'fs';

import fruchtermanReingold from './algorithms/fruchtermanReingold.js';

const seed = '12345';

const files = fs.readdirSync('public/data/graphs');
const graphNames = files.map(item => item.slice(0, -5));

const resultsPath = 'public/data/results/fr';
const resultsTimes = [];

// ===== Fruchterman Reingold =====/

for (const [index, graphName] of graphNames.entries()) {
  const data = JSON.parse(fs.readFileSync(`./public/data/graphs/${graphName}.json`, 'utf8'));
  const { graph } = data;
  console.log(`${index + 1}/${graphNames.length}`);
  resultsTimes.push({
    graphName,
    time: fruchtermanReingold(`${resultsPath}/${graphName}.json`, graph, 1000, 1000, seed, 10000, 2000)
  });
}

fs.writeFileSync('public/data/results/fr/results.json', JSON.stringify(resultsTimes, null, 4));

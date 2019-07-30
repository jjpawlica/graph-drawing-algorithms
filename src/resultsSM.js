import * as fs from 'fs';

import simulatedAnnealing from './algorithms/simulatedAnnealing.js';

const seed = '12345';

const files = fs.readdirSync('public/data/graphs');
const graphNames = files.map(item => item.slice(0, -5));

const resultsPath = 'public/data/results/sm';
const resultsTimes = [];

// ===== Fruchterman Reingold =====/

for (const [index, graphName] of graphNames.entries()) {
  const data = JSON.parse(fs.readFileSync(`./public/data/graphs/${graphName}.json`, 'utf8'));
  const { graph } = data;
  console.log(`${index + 1}/${graphNames.length}`);
  resultsTimes.push({
    graphName,
    time: 1 // ALGO HERE
  });
}

fs.writeFileSync('public/data/results/sm/results.json', JSON.stringify(resultsTimes, null, 4));

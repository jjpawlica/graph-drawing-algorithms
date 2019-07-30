import * as fs from 'fs';

import springEmbedder from './algorithms/springEmbedder.js';

const seed = '12345';

const files = fs.readdirSync('public/data/graphs');
const graphNames = files.map(item => item.slice(0, -5));

const resultsPath = 'public/data/results/eades';
const resultsTimes = [];

// ===== RUN SPRING EMBEDDER =====/

for (const [index, graphName] of graphNames.entries()) {
  const data = JSON.parse(fs.readFileSync(`./public/data/graphs/${graphName}.json`, 'utf8'));
  const { graph } = data;
  console.log(`${index + 1}/${graphNames.length}`);
  resultsTimes.push({
    graphName,
    time: springEmbedder(`${resultsPath}/${graphName}.json`, graph, 1000, 1000, seed, 10000, 2000, 100)
  });
}

fs.writeFileSync('public/data/results/eades/results.json', JSON.stringify(resultsTimes, null, 4));

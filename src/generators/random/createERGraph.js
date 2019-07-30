import seedrandom from 'seedrandom';

import { hasEdge, createEdgesList, createNodesList, createDegreesList } from '../../utils/index.js';

const createERGraph = async (n, m, seed) => {
  const start = new Date().getTime();

  const random = seedrandom(seed);

  const numberOfNodes = n;
  const numberOfLinks = m;

  const nodes = [];
  const degrees = [];

  for (let i = 0; i < numberOfNodes; i += 1) {
    nodes.push(i);
    degrees.push(0);
  }

  let numberOfLinksAdded = 0;

  const edges = [];

  while (numberOfLinksAdded < numberOfLinks) {
    const source = ~~(random() * numberOfNodes);
    const target = ~~(random() * numberOfNodes);
    if (source !== target || !hasEdge(edges, source, target)) {
      edges.push([source, target]);
      edges.push([target, source]);
      degrees[source] += 1;
      degrees[target] += 1;
      numberOfLinksAdded += 1;
    }
  }

  const end = new Date().getTime();

  // construct JGF object
  const graph = {
    graph: {
      directed: false,
      type: 'ER_graph',
      metadata: {
        seed,
        nodesCount: nodes.length,
        edgesCount: edges.length / 2,
        density: nodes.length / (edges.length / 2),
        performance: end - start,
        degrees: createDegreesList(degrees)
      },
      nodes: createNodesList(nodes),
      edges: createEdgesList(edges)
    }
  };

  return graph;
};

export default createERGraph;

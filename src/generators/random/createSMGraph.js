import seedrandom from 'seedrandom';
import _ from 'lodash';

import { hasEdge, createEdgesList, createNodesList } from '../../utils/index.js';

const createSMGraph = async (n, k, p, seed) => {
  const start = new Date().getTime();

  const random = seedrandom(seed);

  const numberOfNodes = n;
  const neighbourhoodSize = k / 2; // k has to be even

  const nodes = [];

  // add nodes
  for (let i = 0; i < numberOfNodes; i += 1) {
    nodes.push(i);
  }

  // add edges
  const edges = [];
  for (let i = 0; i < numberOfNodes; i += 1) {
    for (let j = 1; j <= neighbourhoodSize; j += 1) {
      edges.push([i, (i + j) % n]);
      edges.push([(i + j) % n, i]);
    }
  }

  // mix edges
  for (let i = 0; i < numberOfNodes; i += 1) {
    for (let j = 1; j <= neighbourhoodSize; j += 1) {
      const source = i;
      const target = (i + j) % n;
      const probabilty = random();

      if (probabilty < p) {
        let possibleTarget = ~~(random() * numberOfNodes);
        let isCurrent = source === possibleTarget;
        let isFound = hasEdge(edges, source, possibleTarget);

        _.pullAllWith(edges, [[source, target], [target, source]], _.isEqual);

        while (isCurrent || isFound) {
          possibleTarget = ~~(random() * numberOfNodes);
          isCurrent = source === possibleTarget;
          isFound = hasEdge(edges, source, possibleTarget);
        }

        edges.push([source, possibleTarget]);
        edges.push([possibleTarget, source]);
      }
    }
  }

  const end = new Date().getTime();

  // construct JGF object
  const graph = {
    graph: {
      directed: false,
      type: 'SM_graph',
      metadata: {
        seed,
        neighbourhood: k,
        probabilty: p,
        nodesCount: nodes.length,
        edgesCount: edges.length / 2,
        density: nodes.length / (edges.length / 2),
        performance: end - start
      },
      nodes: createNodesList(nodes),
      edges: createEdgesList(edges)
    }
  };

  return graph;
};

export default createSMGraph;

import { createEdgesList, createNodesList } from '../../utils/index.js';

const createCompleteTree = async (k, h) => {
  const start = new Date().getTime();

  const numberOfNodes = (k ** (h + 1) - 1) / (k - 1);
  const numberoOfSources = numberOfNodes - k ** h;

  const nodes = [];

  for (let i = 0; i < numberOfNodes; i += 1) {
    nodes.push(i);
  }

  const edges = [];

  for (let i = 0; i < numberoOfSources; i += 1) {
    const source = i;
    for (let j = 1; j <= k; j += 1) {
      const target = i * k + j;
      edges.push([source, target]);
      edges.push([target, source]);
    }
  }

  const end = new Date().getTime();

  // construct JGF object
  const graph = {
    graph: {
      directed: false,
      type: 'complete_graph',
      metadata: {
        branching: k,
        height: h,
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

export default createCompleteTree;

import { createEdgesList, createNodesList } from '../../utils/index.js';

const createBinaryTree = async h => {
  const start = new Date().getTime();

  const numberOfNodes = (2 ** (h + 1) - 1) / (2 - 1);
  const numberoOfSources = numberOfNodes - 2 ** h;

  const nodes = [];

  for (let i = 0; i < numberOfNodes; i += 1) {
    nodes.push(i);
  }

  const edges = [];

  for (let i = 0; i < numberoOfSources; i += 1) {
    const source = i;
    for (let j = 1; j <= 2; j += 1) {
      const target = i * 2 + j;
      edges.push([source, target]);
      edges.push([target, source]);
    }
  }

  const end = new Date().getTime();

  // construct JGF object
  const graph = {
    graph: {
      directed: false,
      type: 'binary_tree',
      metadata: {
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

export default createBinaryTree;

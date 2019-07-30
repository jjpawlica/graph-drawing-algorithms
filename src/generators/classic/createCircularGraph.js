import { createEdgesList, createNodesList } from '../../utils/index.js';

const createCircularGraph = async (n, k) => {
  const start = new Date().getTime();

  const numberOfNodes = n;

  const nodes = [];

  for (let i = 0; i < numberOfNodes; i += 1) {
    nodes.push(i);
  }

  const edges = [];

  for (let i = 0; i < numberOfNodes; i += 1) {
    const source = i;
    for (let j = 1; j <= k; j += 1) {
      const target = i + j;
      if (target >= numberOfNodes) {
        edges.push([source, target % k]);
        edges.push([target % k, source]);
      } else {
        edges.push([source, target]);
        edges.push([target, source]);
      }
    }
  }

  const end = new Date().getTime();

  // construct JGF object
  const graph = {
    graph: {
      directed: false,
      type: 'circular_graph',
      metadata: {
        nodesCount: nodes.length,
        edgesCount: edges.length / 2,
        neighbourhood: k,
        density: nodes.length / (edges.length / 2),
        performance: end - start
      },
      nodes: createNodesList(nodes),
      edges: createEdgesList(edges)
    }
  };

  return graph;
};

export default createCircularGraph;

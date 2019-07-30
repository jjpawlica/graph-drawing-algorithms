import { createEdgesList, createNodesList } from '../../utils/index.js';

const createBipartCompleteGraph = async (n, m) => {
  const start = new Date().getTime();

  const numberOfNodesFirstGroup = n;
  const numberOfNodesSecondGroup = m;

  const nodes = [];

  for (let i = 0; i < numberOfNodesFirstGroup + numberOfNodesSecondGroup; i += 1) {
    nodes.push(i);
  }

  const edges = [];

  for (let i = 0; i < numberOfNodesFirstGroup; i += 1) {
    const source = i;
    for (let j = numberOfNodesFirstGroup; j < numberOfNodesFirstGroup + numberOfNodesSecondGroup; j += 1) {
      const target = j;
      edges.push([source, target]);
      edges.push([target, source]);
    }
  }

  const end = new Date().getTime();

  // construct JGF object
  const graph = {
    graph: {
      directed: false,
      type: 'complete_bipart_graph',
      metadata: {
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

export default createBipartCompleteGraph;

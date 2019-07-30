import { createEdgesList, createNodesList } from '../../utils/index.js';

import createFromAdjacencyList from '../utils/createFromAdjacencyList.js';

const adjacencyList = [[3], [4], [3, 4], [0, 2, 4], [1, 2, 3]];

const createBullGraph = async () => {
  const start = new Date().getTime();

  const { nodes, edges } = createFromAdjacencyList(adjacencyList);

  const end = new Date().getTime();

  // construct JGF object
  const graph = {
    graph: {
      directed: false,
      type: 'bull_graph',
      metadata: {
        nodesCount: nodes.length,
        edgesCount: edges.length,
        density: nodes.length / edges.length,
        performance: end - start
      },
      nodes: createNodesList(nodes),
      edges: createEdgesList(edges)
    }
  };

  return graph;
};

export default createBullGraph;

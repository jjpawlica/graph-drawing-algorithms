import { createEdgesList, createNodesList } from '../../utils/index.js';

import createFromAdjacencyList from '../utils/createFromAdjacencyList.js';

const adjacencyList = [[1, 3, 4], [0, 2, 7], [1, 3, 6], [0, 2, 5], [0, 5, 7], [3, 4, 6], [2, 5, 7], [1, 4, 6]];

const createCubicalGraph = async () => {
  const start = new Date().getTime();

  const { nodes, edges } = createFromAdjacencyList(adjacencyList);

  const end = new Date().getTime();

  // construct JGF object
  const graph = {
    graph: {
      directed: false,
      type: 'cubic_graph',
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

export default createCubicalGraph;

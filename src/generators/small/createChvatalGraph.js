import { createEdgesList, createNodesList } from '../../utils/index.js';

import createFromAdjacencyList from '../utils/createFromAdjacencyList.js';

const adjacencyList = [
  [1, 2, 3, 4],
  [0, 7, 10, 11],
  [0, 6, 9, 11],
  [0, 8, 9, 11],
  [0, 5, 8, 10],
  [4, 6, 7, 11],
  [2, 5, 8, 10],
  [1, 5, 8, 9],
  [3, 4, 6, 7],
  [2, 3, 7, 10],
  [1, 4, 6, 9],
  [1, 2, 3, 5]
];

const createChvatalGraph = async () => {
  const start = new Date().getTime();

  const { nodes, edges } = createFromAdjacencyList(adjacencyList);

  const end = new Date().getTime();

  // construct JGF object
  const graph = {
    graph: {
      directed: false,
      type: 'chvatal_graph',
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

export default createChvatalGraph;

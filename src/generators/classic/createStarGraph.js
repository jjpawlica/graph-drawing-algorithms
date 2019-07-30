import { createEdgesList, createNodesList } from '../../utils/index.js';

const createStarGraph = async n => {
  const start = new Date().getTime();

  const numberOfNodes = n;

  const nodes = [];

  for (let i = 0; i < numberOfNodes; i += 1) {
    nodes.push(i);
  }

  const edges = [];

  for (let i = 1; i < numberOfNodes; i += 1) {
    const source = 0;
    const target = i;
    edges.push([source, target]);
    edges.push([target, source]);
  }

  const end = new Date().getTime();

  // construct JGF object
  const graph = {
    graph: {
      directed: false,
      type: 'star_graph',
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

export default createStarGraph;

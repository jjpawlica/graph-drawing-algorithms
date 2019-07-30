import { createEdgesList, createNodesList } from '../../utils/index.js';

const createPathGraph = async n => {
  const numberOfNodes = n;

  const start = new Date().getTime();

  const nodes = [];

  for (let i = 0; i < numberOfNodes; i += 1) {
    nodes.push(i);
  }

  const edges = [];

  for (let i = 0; i < numberOfNodes - 1; i += 1) {
    const source = i;
    const target = i + 1;
    edges.push([source, target]);
    edges.push([target, source]);
  }

  const end = new Date().getTime();

  // construct JGF object
  const graph = {
    graph: {
      directed: false,
      type: 'path_graph',
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

export default createPathGraph;

import { createEdgesList, createNodesList } from '../../utils/index.js';

const createWheelGraph = async n => {
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

  for (let i = 1; i < numberOfNodes; i += 1) {
    const source = i;
    const target = i === n - 1 ? 1 : i + 1;
    edges.push([source, target]);
    edges.push([target, source]);
  }

  const end = new Date().getTime();

  // construct JGF object
  const graph = {
    graph: {
      directed: false,
      type: 'wheel_graph',
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

export default createWheelGraph;

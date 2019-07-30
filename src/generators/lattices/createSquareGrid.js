import { createEdgesList, createNodesList } from '../../utils/index.js';

const createSquareGrid = async (n, m) => {
  const start = new Date().getTime();

  const numberOfNodes = n * m;

  const nodes = [];

  for (let i = 0; i < numberOfNodes; i += 1) {
    nodes.push(i);
  }

  const edges = [];

  // add vertical edges
  for (let i = 0; i < m; i += 1) {
    for (let j = i * m; j < i * m + n - 1; j += 1) {
      const source = j;
      const target = j + 1;
      edges.push([source, target]);
      edges.push([target, source]);
    }
  }

  // add horizontal edges
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < m - 1; j += 1) {
      const source = i + j * m;
      const target = i + (j + 1) * m;
      edges.push([source, target]);
      edges.push([target, source]);
    }
  }

  const end = new Date().getTime();

  // construct JGF object
  const graph = {
    graph: {
      directed: false,
      type: 'square_grid_graph',
      metadata: {
        width: n,
        height: m,
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

export default createSquareGrid;

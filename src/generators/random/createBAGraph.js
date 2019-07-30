import seedrandom from 'seedrandom';
import _ from 'lodash';

import { createEdgesList, createNodesList, createDegreesList } from '../../utils/index.js';

const createBAGraph = async (m, t, seed) => {
  const start = new Date().getTime();

  const random = seedrandom(seed);

  const steps = t;
  const edgesPerStep = m;

  const nodes = [];
  nodes.push(0);
  nodes.push(1);

  const edges = [];
  edges.push([0, 1]);
  edges.push([1, 0]);

  const degrees = [];
  degrees.push(1);
  degrees.push(1);

  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  for (let i = 0; i < steps; i += 1) {
    nodes.push(i + 2);
    degrees.push(0);
    const currentNodeIndex = i + 2;

    let linksCreated = 0;
    const linksToCreate = Math.min(nodes.length, edgesPerStep);

    while (linksCreated < linksToCreate) {
      const connected = [];
      const chosenNodeIndex = ~~(random() * nodes.length);

      const isCurrent = currentNodeIndex === chosenNodeIndex;
      const isAlreadyConnected = _.includes(connected, chosenNodeIndex);

      const probabiltyToConnect = degrees[chosenNodeIndex] / degrees.reduce(reducer);
      const probablity = random();

      if (probablity < probabiltyToConnect && !isCurrent && !isAlreadyConnected) {
        // add chosen node index to connected
        connected.push(chosenNodeIndex);
        // increase chosen node degree
        degrees[chosenNodeIndex] += 1;
        // push new edges
        edges.push([currentNodeIndex, chosenNodeIndex]);
        edges.push([chosenNodeIndex, currentNodeIndex]);
        // increse links created
        linksCreated += 1;
      }
    }
    degrees[currentNodeIndex] += linksToCreate;
  }

  const end = new Date().getTime();

  // construct JGF object
  const graph = {
    graph: {
      directed: false,
      type: 'BA_graph',
      metadata: {
        seed,
        nodesCount: nodes.length,
        edgesCount: edges.length / 2,
        density: nodes.length / (edges.length / 2),
        meanDegree: degrees.reduce(reducer) / nodes.length,
        performance: end - start,
        degrees: createDegreesList(degrees)
      },
      nodes: createNodesList(nodes),
      edges: createEdgesList(edges)
    }
  };

  return graph;
};

export default createBAGraph;

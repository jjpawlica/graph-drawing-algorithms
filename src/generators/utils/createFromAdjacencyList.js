const createFromAdjacencyList = list => {
  const nodes = [];

  for (let i = 0; i < list.length; i += 1) {
    nodes.push(i);
  }

  const edges = [];

  for (let i = 0; i < list.length; i += 1) {
    for (let j = 0; j < list[i].length; j += 1) {
      const source = i;
      const target = list[i][j];
      edges.push([source, target]);
    }
  }

  return { nodes, edges };
};

export default createFromAdjacencyList;

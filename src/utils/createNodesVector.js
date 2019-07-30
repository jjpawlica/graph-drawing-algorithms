const createNodesVector = nodes => {
  const nodesVector = [];
  nodes.forEach(node => {
    nodesVector.push(node.id - 1);
  });
  return nodesVector;
};

export default createNodesVector;

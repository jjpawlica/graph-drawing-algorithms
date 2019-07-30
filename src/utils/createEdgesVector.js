const createEdgesVector = edges => {
  const edgesVector = [];
  edges.forEach(edge => {
    edgesVector.push([edge.source - 1, edge.target - 1]);
  });

  return edgesVector;
};

export default createEdgesVector;

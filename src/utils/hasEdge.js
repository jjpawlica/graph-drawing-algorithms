const hasEdge = (edges, s, t) =>
  edges.some(edge => (edge[0] === s && edge[1] === t) || (edge[0] === t && edge[1] === s));

export default hasEdge;

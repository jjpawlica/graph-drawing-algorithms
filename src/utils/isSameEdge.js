const isSameEdge = (firstEdge, secondEdge) => {
  const isSame = firstEdge[0] === secondEdge[0] && firstEdge[1] === secondEdge[1];
  const isReverse = firstEdge[0] === secondEdge[1] && firstEdge[1] === secondEdge[0];
  return isSame || isReverse;
};

export default isSameEdge;

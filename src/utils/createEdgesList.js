const createEdgesList = edges => edges.map(edge => ({ source: edge[0] + 1, target: edge[1] + 1 }));

export default createEdgesList;

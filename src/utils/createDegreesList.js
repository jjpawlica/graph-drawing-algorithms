const createDegreesList = degrees =>
  degrees.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {});

export default createDegreesList;

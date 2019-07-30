import seedrandom from 'seedrandom';

const createPositionVector = (nodes, width, height, seed) => {
  const random = seedrandom(seed);
  const postionsVector = [];
  nodes.forEach(() => {
    postionsVector.push(~~(random() * width));
    postionsVector.push(~~(random() * height));
  });
  return postionsVector;
};

export default createPositionVector;

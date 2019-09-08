/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function preload() {
  const algo = 'ga';
  const fileName = 'cubical_graph.json';
  data = loadJSON(`data/results/${algo}/${fileName}`);
  graph = loadJSON(`data/graphs/${fileName}`);
  positionsCount = Object.keys(data).length;
}

function createEdgesVector(edges) {
  const edgesVector = [];
  edges.forEach(edge => {
    edgesVector.push([edge.source - 1, edge.target - 1]);
  });
  return edgesVector;
}

function setup() {
  createCanvas(1000, 1000);
  background(51);
  frameRate(200);

  slider = createSlider(0, 1000, 100, 1);
  slider.position(10, 10);
  slider.style('width', '980px');

  positionsCount = Object.keys(data).length;
  currnetPositon = [...data[0]];

  nodesCount = data[0].length / 2;
  edges = createEdgesVector(graph.graph.edges);
}

function instant(len) {
  finalPosition = [...data[0]];

  for (let j = 1; j < positionsCount; j += 1) {
    for (let i = 0; i < nodesCount; i += 1) {
      finalPosition[i * 2] += data[j][i * 2];
      finalPosition[i * 2 + 1] += data[j][i * 2 + 1];
    }
  }

  distance = 0;
  for (let j = 0; j < edges.length; j += 1) {
    start = edges[j][0];
    end = edges[j][1];
    distance += dist(
      currnetPositon[start * 2],
      currnetPositon[start * 2 + 1],
      currnetPositon[end * 2],
      currnetPositon[end * 2 + 1]
    );
  }
  distance /= edges.length;

  averageX = 0;
  averageY = 0;

  factor = (2 * len) / distance;
  for (let i = 0; i < nodesCount; i += 1) {
    finalPosition[i * 2] *= factor;
    finalPosition[i * 2 + 1] *= factor;
  }

  for (let i = 0; i < nodesCount; i += 1) {
    averageX += finalPosition[i * 2];
    averageY += finalPosition[i * 2 + 1];
  }

  averageX /= nodesCount;
  averageY /= nodesCount;

  for (let i = 0; i < nodesCount; i += 1) {
    finalPosition[i * 2] -= averageX;
    finalPosition[i * 2 + 1] -= averageY;
  }

  for (let i = 0; i < nodesCount; i += 1) {
    finalPosition[i * 2] += 500;
    finalPosition[i * 2 + 1] += 500;
  }

  // set backround
  background(255);

  // draw edges
  stroke(0);
  for (let j = 0; j < edges.length; j += 1) {
    start = edges[j][0];
    end = edges[j][1];
    line(finalPosition[start * 2], finalPosition[start * 2 + 1], finalPosition[end * 2], finalPosition[end * 2 + 1]);
  }

  // draw nodes
  fill(255, 0, 0);
  noStroke();
  for (let i = 0; i < nodesCount; i += 1) {
    ellipse(finalPosition[i * 2], finalPosition[i * 2 + 1], 16, 16);
    text(i, finalPosition[i * 2], finalPosition[i * 2 + 1] - 20);
  }

  // fill(0, 255, 0);
  // ellipse(500, 500, 16, 16);
}

function animate(iteration, maxIterations) {
  // log draw loop cunter

  // set backround
  background(255);

  // draw edges
  stroke(0);
  for (let j = 0; j < edges.length; j += 1) {
    start = edges[j][0];
    end = edges[j][1];
    line(
      currnetPositon[start * 2],
      currnetPositon[start * 2 + 1],
      currnetPositon[end * 2],
      currnetPositon[end * 2 + 1]
    );
  }

  // draw nodes
  fill(255, 0, 0);
  noStroke();
  for (let i = 0; i < nodesCount; i += 1) {
    ellipse(currnetPositon[i * 2], currnetPositon[i * 2 + 1], 16, 16);
  }

  fill(0, 255, 0);
  ellipse(500, 500, 16, 16);
  // update positions

  averageX = 0;
  averageY = 0;

  if (iteration < maxIterations) {
    console.log(`${(iteration * 100) / maxIterations}%`);
    for (let i = 0; i < nodesCount; i += 1) {
      currnetPositon[i * 2] += data[iteration][i * 2];
      currnetPositon[i * 2 + 1] += data[iteration][i * 2 + 1];
    }
  }


  // move drawing to middle
  if (iteration === maxIterations) {
    console.log(`here`);
    for (let i = 0; i < nodesCount; i += 1) {
      averageX += currnetPositon[i * 2];
      averageY += currnetPositon[i * 2 + 1];
    }

    averageX /= nodesCount;
    averageY /= nodesCount;

    for (let i = 0; i < nodesCount; i += 1) {
      currnetPositon[i * 2] -= averageX;
      currnetPositon[i * 2 + 1] -= averageY;
      currnetPositon[i * 2] += 500;
      currnetPositon[i * 2 + 1] += 500;
    }
  }
}

// let counter = 1;
function draw() {
  val = slider.value();
  // animate(counter, positionsCount);
  // counter += 1;
  // console.log(positionsCount);
  instant(val);
}

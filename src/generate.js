import {
  createCircleGraph,
  createCircularGraph,
  createCompleteGraph,
  createSquareGrid,
  createPathGraph,
  createStarGraph,
  createWheelGraph,
  createBinaryTree,
  createCompleteTree,
  createChvatalGraph,
  createCubicalGraph,
  createBullGraph,
  createERGraph,
  createSMGraph,
  createBAGraph
} from './generators/index.js';

import { saveGraphJSON } from './utils/index.js';

const circlesNodeCounts = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500];
const circularNodeCounts = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500];
const compeleteNodeCounts = [5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const gridNodeCounts = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20];
const pathNodeCounts = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500];
const starNodeCounts = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500];
const wheelNodeCounts = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500];
const levelBinaryTreeCount = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const levelCompleteTreeCount = [1, 2, 3, 4, 5];

console.time('generating circles graphs');
circlesNodeCounts.forEach(async nodeCount => {
  const graph = await createCircleGraph(nodeCount);
  saveGraphJSON(`public/data/graphs/circle_${graph.graph.metadata.nodesCount.toString().padStart(3, '0')}.json`, graph);
});
console.timeEnd('generating circles graphs');

console.time('generating circular graphs');
circularNodeCounts.forEach(async nodeCount => {
  const graph = await createCircularGraph(nodeCount, 4);
  saveGraphJSON(
    `public/data/graphs/circular_${graph.graph.metadata.nodesCount.toString().padStart(3, '0')}.json`,
    graph
  );
});
console.timeEnd('generating circular graphs');

console.time('generating complete graphs');
compeleteNodeCounts.forEach(async nodeCount => {
  const graph = await createCompleteGraph(nodeCount);
  saveGraphJSON(
    `public/data/graphs/complete_${graph.graph.metadata.nodesCount.toString().padStart(3, '0')}.json`,
    graph
  );
});
console.timeEnd('generating complete graphs');

console.time('generating grid');
gridNodeCounts.forEach(async nodeCount => {
  const graph = await createSquareGrid(nodeCount, nodeCount);
  saveGraphJSON(
    `public/data/graphs/grid_${graph.graph.metadata.width
      .toString()
      .padStart(3, '0')}_${graph.graph.metadata.height.toString().padStart(3, '0')}.json`,
    graph
  );
});
console.timeEnd('generating grid');

console.time('generating paths');
pathNodeCounts.forEach(async nodeCount => {
  const graph = await createPathGraph(nodeCount);
  saveGraphJSON(`public/data/graphs/path_${graph.graph.metadata.nodesCount.toString().padStart(3, '0')}.json`, graph);
});
console.timeEnd('generating paths');

console.time('generating stars');
starNodeCounts.forEach(async nodeCount => {
  const graph = await createStarGraph(nodeCount);
  saveGraphJSON(`public/data/graphs/star_${graph.graph.metadata.nodesCount.toString().padStart(3, '0')}.json`, graph);
});
console.timeEnd('generating stars');

console.time('generating wheels');
wheelNodeCounts.forEach(async nodeCount => {
  const graph = await createWheelGraph(nodeCount);
  saveGraphJSON(`public/data/graphs/wheel_${graph.graph.metadata.nodesCount.toString().padStart(3, '0')}.json`, graph);
});
console.timeEnd('generating wheels');

console.time('generating binary trees');
levelBinaryTreeCount.forEach(async levels => {
  const graph = await createBinaryTree(levels);
  saveGraphJSON(
    `public/data/graphs/tree_binary_${graph.graph.metadata.height.toString().padStart(3, '0')}.json`,
    graph
  );
});
console.timeEnd('generating binary trees');

console.time('generating complete trees');
levelCompleteTreeCount.forEach(async levels => {
  const graph = await createCompleteTree(4, levels);
  saveGraphJSON(
    `public/data/graphs/tree_complete_4_${graph.graph.metadata.height.toString().padStart(3, '0')}.json`,
    graph
  );
});
console.timeEnd('generating complete trees');

console.time('generating small graphs');
createBullGraph().then(graph => saveGraphJSON(`public/data/graphs/bull_graph.json`, graph));
createChvatalGraph().then(graph => saveGraphJSON(`public/data/graphs/chvatal_graph.json`, graph));
createCubicalGraph().then(graph => saveGraphJSON(`public/data/graphs/cubical_graph.json`, graph));
console.timeEnd('generating small graphs');

// ===== Create Random Graphs

const seed = '123456';

console.time('generating ER graphs');
const nodesCountER = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500];
nodesCountER.forEach(async nodes => {
  const graph = await createERGraph(nodes, ~~((nodes * Math.log(nodes)) / 2), seed);
  const edges = graph.graph.metadata.edgesCount;
  saveGraphJSON(`public/data/graphs/er_${nodes.toString().padStart(3, '0')}_${edges}_${seed}.json`, graph);
});
console.timeEnd('generating ER graphs');

console.time('generating SM graphs');
const nodesCountSM = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500];
const neighbourhood = 4;
const probabilty = 0.2;

nodesCountSM.forEach(async nodes => {
  const graph = await createSMGraph(nodes, neighbourhood, probabilty, seed);
  const edges = graph.graph.metadata.edgesCount;
  saveGraphJSON(`public/data/graphs/sm_${nodes.toString().padStart(3, '0')}_${edges}_${seed}.json`, graph);
});
console.timeEnd('generating SM graphs');

const nodesCountBA = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500];

console.time('generating BA-1 graphs');
nodesCountBA.forEach(async nodes => {
  const graph = await createBAGraph(1, nodes, seed);
  const edges = graph.graph.metadata.edgesCount;
  saveGraphJSON(`public/data/graphs/ba_1_${nodes.toString().padStart(3, '0')}_${edges}_${seed}.json`, graph);
});
console.timeEnd('generating BA-1 graphs');

console.time('generating BA-2 graphs');
nodesCountBA.forEach(async nodes => {
  const graph = await createBAGraph(2, nodes, seed);
  const edges = graph.graph.metadata.edgesCount;
  saveGraphJSON(`public/data/graphs/ba_2_${nodes.toString().padStart(3, '0')}_${edges}_${seed}.json`, graph);
});
console.timeEnd('generating BA-2 graphs');

console.time('generating BA-3 graphs');
nodesCountBA.forEach(async nodes => {
  const graph = await createBAGraph(3, nodes, seed);
  const edges = graph.graph.metadata.edgesCount;
  saveGraphJSON(`public/data/graphs/ba_3_${nodes.toString().padStart(3, '0')}_${edges}_${seed}.json`, graph);
});
console.timeEnd('generating BA-3 graphs');

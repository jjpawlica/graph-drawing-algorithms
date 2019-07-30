import { createBAGraph } from './generators/index.js';
import { saveGraphJSON } from './utils/index.js';

createBAGraph(2, 100, 123245121246).then(graph =>
  saveGraphJSON(`data/myGraph${graph.graph.metadata.seed}.json`, graph)
);

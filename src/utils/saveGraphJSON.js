import * as fs from 'fs';

const saveGraphJSON = (path, graph) => {
  const data = JSON.stringify(graph, null, 4);
  try {
    fs.writeFileSync(path, data, 'utf8');
  } catch (err) {
    console.log(err);
  }
};

export default saveGraphJSON;

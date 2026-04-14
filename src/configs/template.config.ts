import path from 'node:path';
import { Eta } from 'eta';

const eta = new Eta({ views: path.join(__dirname, '../views') });

function buildEtaEngine() {
  return (path, opts, callback) => {
    try {
      const fileContent = eta.readFile(path);
      const renderedTemplate = eta.renderString(fileContent, opts);
      callback(null, renderedTemplate);
    } catch (error) {
      callback(error);
    }
  };
}

export default buildEtaEngine;

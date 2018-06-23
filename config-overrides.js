const rewireStyledComponents = require('react-app-rewire-styled-components');
const ThreeWebpackPlugin = require('@wildpeaks/three-webpack-plugin');

const rulesList = [
  ['three/examples/js/controls/', 'OrbitControls'],
  ['three/examples/js/loaders/', 'GLTFLoader']
];

const addRule = (path, name) => {
  let arr = [];
  let importLoader = {};
  let exportLoader = {};

  importLoader.test = require.resolve(path + name);
  importLoader.use = 'imports-loader?THREE=three';

  exportLoader.test = require.resolve(path + name);
  exportLoader.use = `exports-loader?THREE.${name}`;

  arr.push(importLoader);
  arr.push(exportLoader);

  return arr;
};

module.exports = function override(config, env) {
  config = rewireStyledComponents(config, env);

  let rules = rulesList.slice(0).map(item => {
    return addRule(item[0], item[1]);
  });

  rules.forEach(item => {
    item.forEach(obj => {
      config.module.rules.push(obj);
    });
  });
  
  console.log(config.module.rules)
  return config;
}
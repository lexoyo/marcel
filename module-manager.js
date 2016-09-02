const path = require('path');
const fs = require('fs');

const ModuleManager = function() {
}

ModuleManager.prototype.getModules = function () {
  const modules = [];
  ['modules', 'node_modules'].forEach(dir => {
    const dirPath = path.resolve(__dirname, dir);
    fs.readdirSync(dirPath)
    .forEach(fileName => {
      try {
        const module = require(path.resolve(dirPath, fileName));
        if(module.isModule) {
          console.log('found module', fileName);
          modules.push(module);
        }
      }
      catch(e) {}
    });
  });
  return modules;
};

ModuleManager.prototype.getStates = function () {
  const states = {};
  this.getModules().forEach(module => {
    const moduleStates = module.getStates();
    for(langName in moduleStates) {
      states[langName] = states[langName] || [];
      states[langName] = states[langName].concat(moduleStates[langName]);
    }
  });
  return states;
};

module.exports = ModuleManager;

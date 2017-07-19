const path = require('path');
const fs = require('fs');

const ModuleManager = function() {
}
module.exports = ModuleManager;

/**
 * use the file created by createStates
 * @return array of all languages
 */
ModuleManager.prototype.getLanguages= function ()  {
  const langDir = path.resolve(__dirname, '../', 'lang');
  return fs.readdirSync(langDir);
};

/**
 * use the file created by createStates
 * @return array of all states for a given language
 */
ModuleManager.prototype.getStates = function (langName) {
  const stateFilePath = path.resolve(__dirname, '../', 'lang', langName, 'state.json');
  const content = fs.readFileSync(stateFilePath).toString();
  return JSON.parse(content);
};

/**
 * @return a module
 */
ModuleManager.prototype.createModule = function (moduleName) {
  try {
    const module = this.createModules(moduleName)[0];
    return module;
  }
  catch(e) {
    console.error('Module create failed:', e);
  }
  return null;
};

/**
 * create module objects out of the files in node_modules and modules
 */
ModuleManager.prototype.createModules = function (opt_moduleName) {
  const modules = [];
  //['modules', 'node_modules']
  ['modules']
  .forEach(dir => {
    const dirPath = path.resolve(__dirname, '../', dir);
    fs.readdirSync(dirPath)
    .forEach(fileName => {
      if(!opt_moduleName
        || opt_moduleName === fileName
        || opt_moduleName + '.js' === fileName) {
        try {
          const module = require(path.resolve(dirPath, fileName));
          if(module.isModule) {
            console.log('found module', fileName);
            modules.push(module);
          } 
          //else console.log('not a module', fileName);
        }
        catch(e) {
          console.log('error during module creation', fileName);
        }
      }
    });
  });
  return modules;
};

/**
 * create files in lang folders
 */
ModuleManager.prototype.createStates = function () {
  const states = {};
  this.createModules().forEach(module => {
    const moduleStates = module.getStates();
    for(langName in moduleStates) {
      states[langName] = states[langName] || [];
      states[langName] = states[langName].concat(moduleStates[langName]);
    }
  });

  console.log('states:', states);

  const langDir = path.resolve(__dirname, '../', 'lang');

  if(!fs.existsSync(langDir)) {
    console.log('create dir', langDir);
    fs.mkdirSync(langDir);
  }

  // TODO: move this to module-manager.js ?
  for(langName in states) {
    const currentLangDir = path.resolve(langDir, langName);
    if(!fs.existsSync(currentLangDir)) {
      console.log('create dir', currentLangDir);
      fs.mkdirSync(currentLangDir);
    }
    // states of the given language
    fs.writeFileSync(
      path.resolve(currentLangDir, 'state.json'),
      JSON.stringify(states[langName])
    );
    // dictionnary and language model
    // for the given language
    // by from state
    const fromStates = {};
    states[langName].forEach(state => {
      fromStates[state.from] = fromStates[state.from] || [];
      fromStates[state.from].push(state.name);
    });
    fromStatesArray = [];
    for(fromStateName in fromStates) {
      fromStatesArray.push({
        name: fromStateName,
        stateNames: fromStates[fromStateName],
      });
    }
  }
}

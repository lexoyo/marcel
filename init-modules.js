const lmtool = require('lmtool');
const fs = require('fs');
const path = require('path');
const ModuleManager = require('./module-manager');
const moduleManager = new ModuleManager();
const states = moduleManager.getStates();
console.log('states:', states);

const langDir = path.resolve(__dirname, 'lang');

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
  generateLangData(fromStatesArray, currentLangDir);
}
function generateLangData(fromStatesArray, currentLangDir) {
  const state = fromStatesArray.shift();
  // check if lang files need to be regenerated
  let changed = true;
  let contentFilePath = path.resolve(currentLangDir, state.name + '.txt');
  let contentFileData = state.stateNames.join('\n');
  try {
    const fileContent = fs.readFileSync(contentFilePath).toString();
    if(fileContent === contentFileData) {
      changed = false;
    }
  }
  catch(e) {
    console.log('file do not exist yet', contentFilePath, e);
  }
  // recursive next
  function next() {
    if(fromStatesArray.length) {
      generateLangData(fromStatesArray, currentLangDir);
    }
    else {
      // console.log('done', currentLangDir);
    }
  }
  // generate lang files
  if(changed) {
    lmtool(state.stateNames, (err, id) => {
      console.log('lang data retrieved', err, id);
      // keep .dic and .lm files
      ['dic', 'lm'].forEach( function(ext) {
        const fileName = path.resolve(currentLangDir, state.name + '.' + ext);
        const fileContent = fs.readFileSync(id + '.' + ext).toString();
        console.log('writing', fileName);
        fs.writeFileSync(fileName, fileContent);
      });
      // keep the initial content
      fs.writeFileSync(contentFilePath, contentFileData);
      // remove others
      fs.readdirSync(__dirname)
      .filter(fileName => fileName.indexOf(id) >= 0)
      .forEach(fileName => fs.unlinkSync(path.resolve(__dirname, fileName)));
      // next
      next();
    });
  }
  else {
    console.log('unchange', contentFilePath);
    next();
  }
}

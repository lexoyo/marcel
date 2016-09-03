const Brain = require('./brain');

const App = function(config) {
  this.brain = new Brain(config);
};

App.prototype.start = function(){
  this.nextAction();
}

App.prototype.nextAction = function(){
  this.brain.think().then(() => this.nextAction());
}

const config = require('../package.json').marcel;
const app = new App(config);
app.start();

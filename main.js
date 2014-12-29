var Server = require("./server/server");
var Router = require("./server/router");
var RequestHandlers = require("./server/requestHandler");
var Bh = require('./lib/beaglehome');
var config = require('./config.json');

var ctrl = Bh.createControl(config);
var board = createFakeBoard();

var switcher = Bh.loadSwitcher(ctrl, board);
switcher.init();
switcher.start();

var handle = {};
handle["/api/dashboard"] = RequestHandlers.dashboard(ctrl);

Server.start(Router.route, handle, 8888);

function createFakeBoard() {
  
  var pins = {};
  var pinModes = {};
  var changed = function() { };
  
  return {
      pins: pins,
      pinMode: function(name, mode) {
          pinModes[name] = mode;
          if (mode === 'input') {
              pins[name] = 0;
          }
      },
      getPinMode: function(name, h) {
          h(pinModes[name]);
      },
      onPinChanged: function(handler) {
          changed = handler;
      },
      digitalRead: function(name, handler) {
          handler({value: pins[name]});
      },
      digitalWrite: function(name, value) {
          pins[name] = value;
          changed(name);
      }
    };
}

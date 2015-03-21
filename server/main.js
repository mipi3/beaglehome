var Server = require("./server");
var Router = require("./router");
var RequestHandlers = require("./requestHandler");
var Bh = require('./core/beaglehome');
var config = require('./config.json');
var eventEmitter = new (require('events').EventEmitter)();

var ctrl = Bh.createControl(config, eventEmitter.emit);
var board = createFakeBoard();

Bh.wire(eventEmitter, ctrl, board);

var switcher = Bh.loadSwitcher(ctrl, board, eventEmitter.emit);
switcher.init();
switcher.start();

//ctrl.setInPin('P8_13', 1);

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

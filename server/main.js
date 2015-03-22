var Server = require("./server");
var Router = require("./router");
var RequestHandlers = require("./requestHandler");
var Bh = require('./core/beaglehome');
var config = require('./config.json');
var eventEmitter = new (require('events').EventEmitter)();
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

var ctrl = Bh.createControl(config, eventEmitter);
var board = createFakeBoard();

Bh.wire(eventEmitter, ctrl, board);

var switcher = Bh.loadSwitcher(ctrl, board, eventEmitter);
switcher.init();
switcher.start();

//ctrl.setInPin('P8_13', 1);

var handle = {};
handle["/api/dashboard"] = RequestHandlers.dashboard(ctrl);
handle["/api/layout"] = RequestHandlers.layout(ctrl);

var selectedPin = ctrl.getInPins()[0].pin;
console.log('selected in pin: ' + selectedPin);
console.log(' s - selected pin');
console.log(' S(PIN) - select pin');
console.log(' c - print config');
console.log(' 1 - on');
console.log(' 2 - off');
rl.on('line', function(text){
   // console.log(text[0]);
    if (text[0] == '0') {
       board.pins[selectedPin] = 0;
    }
    else if (text[0] == '1')
    {
       board.pins[selectedPin] = 1;
    }
    else if (text[0] == 's') {
      console.log(selectedPin);
    }
    else if (text[0] == 'S') {
	selectedPin = text.substr(1,text.length-1);
    }
    else if (text[0] == 'c') {
	console.log(JSON.stringify(config, null, 4));
    }
})

Server.start(Router.route, handle, 8888);

function createFakeBoard() {
  
  var pins = {};
  var pinModes = {};
  var changed = function() { };

    var digitalWrite = function(name, value) {
	console.log('set pin ' + name + ' -> ' + value);
        pins[name] = value;
        changed(name);
    };
  
  return {
      pins: pins,
      pinMode: function(name, mode) {
          pinModes[name] = mode;
          if (mode === 'input') {
              pins[name] = 0;
          }
	  console.log('pin mode: ' + name + ' - ' + mode);
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
      digitalWrite: digitalWrite,
       digitalWriteAll: function(pins) {
          console.log('write all {');
	  pins.forEach(function(pin) {
	      digitalWrite(pin.pin, pin.value);
	  });
	  console.log('}');
      }
    };
}

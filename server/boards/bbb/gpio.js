'use strict';

var fs = require('fs');

function createFakeBoard() {

    var gpioPath = '/sys/class/gpio/';
    var pins = {};
    var pinModes = {};
    var changed = function() { };

    var digitalWrite = function(name, value) {
	console.log('set pin ' + name + ' -> ' + value);

        fs.writeFileSync(gpioPath + 'gpio' + name + '/value', ''+value, 'ascii');        
        pins[name] = value;
        changed(name);
    };
  
  return {
      pins: pins,
      pinMode: function(name, mode) {
          pinModes[name] = mode;
          
          var gpPath = gpioPath + 'gpio' + name;
          
          if (!fs.existsSync(gpPath)) {
              fs.writeFileSync(gpioPath + 'export', name, 'ascii');
          }
              
          var modeId = mode === 'input' ? 'in' : 'out';

          fs.writeFileSync(gpPath + '/direction', modeId, 'ascii');
              
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
          fs.readFile(gpioPath + 'gpio' + name + '/value', 'ascii',
                      function(err, res) {
                          if (err) {
                              console.log(err);
                          } else {
                              handler({value: parseInt(res)});
                          };
                      });
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

exports.create = createFakeBoard;

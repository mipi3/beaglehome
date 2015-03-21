'use strict';

var EventEmitter = require('events').EventEmitter;
var poller = require('../../server/core/poller.js').createPoller;

exports['poller tests'] = {
    'one input pin and one output pin': function(test) {

        var board = createFakeBoard();
        board.pins['P8_13'] = 0;
        poller(['P8_13'], board.digitalRead, 300, function() {
            test.done();
        });
        
        board.pins['P8_13'] = 1;
    }
};

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
};


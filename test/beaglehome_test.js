'use strict';

//var nodeunit = require('nodeunit');
// var beaglehome = require('../lib/beaglehome.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var beaglehome = {
    loadSwitcher: function(config, board) {
        
        return {
            init: function() {
                for (var pin in config.pins) {
                    var details = config.pins[pin];
                    board.pinMode(pin, details.type);
                    if (details.type === 'output') {
                        board.digitalWrite(pin, 0);
                    }
                }
            },
            start: function() {
                
                var getLinkPin = function(id) {
                    for (var pin in config.pins) {
                        var o = config.pins[pin];
                        if (o.id === id) {
                            return pin;
                        }
                    }

                    return null;
                };

                var check = function() {

                    var onRead = function(outPin) {
			return function(x) {
                            var write = x.value === 1 ? 1 : 0;
                            board.digitalWrite(outPin, write);
			};
                    };

                    for (var i = 0; i < config.links.length; i++) {
                        var link = config.links[i];
                        var outPin = getLinkPin(link.out);
                        var inPin = getLinkPin(link.in);
                        board.digitalRead(inPin, onRead(outPin));
                    }
                };
                setInterval(check,100);
            }
        };
    }
};

var createFakeBoard = function() {
  
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

exports['input state changes output state'] = {
  'one-to-one config. Turn on.': function(test) {
    
    var board = createFakeBoard();
    var config = {
	pins: {
            'P8_13': { id: 's_k-1', type: 'input', name: 'kitchen-1'},
            'P8_14': { id: 'r_k-1', type: 'output', name: 'kitchen-lamp' }
        },
	links: [
            { in:['s_k-1'], out:'r_k-1' }
        ]
    };

    var switcher = beaglehome.loadSwitcher(config, board);
    
    switcher.init();
    test.equal(board.pins['P8_14'], 0);
    test.equal(board.pins['P8_13'], 0);

    board.onPinChanged(function() {
	board.onPinChanged(function() {});
        test.equal(board.pins['P8_14'], 1);
        test.done();
    });

    switcher.start();

    board.pins['P8_13'] = 1;
  },
  'one-to-one config. Turn off.': function(test) {

    var board = createFakeBoard();
    var config = {
    pins: {
            'P8_13': { id: 's_k-1', type: 'input', name: 'kitchen-1'},
            'P8_14': { id: 'r_k-1', type: 'output', name: 'kitchen-lamp' }
        },
    links: [
            { in:['s_k-1'], out:'r_k-1' }
        ]
    };

    var switcher = beaglehome.loadSwitcher(config, board);
    
    switcher.init();
    board.pins['P8_14'] = 1;
    board.pins['P8_13'] = 1;

    board.onPinChanged(function() {
        board.onPinChanged(function() {});
        test.equal(board.pins['P8_14'], 0);
        test.done();
    });

    switcher.start();

    board.pins['P8_13'] = 0;
  },
  'many-to-one config. Turn off.': function(test) {

    var board = createFakeBoard();
    var config = {
    pins: {
            'P8_11': { id: 's_k-1', type: 'input', name: 'kitchen-1'},
            'P8_13': { id: 's_k-2', type: 'input', name: 'kitchen-2'},
            'P8_14': { id: 'r_k-1', type: 'output', name: 'kitchen-lamp' }
        },
    links: [
            { in:['s_k-1'], out:'r_k-1' }
        ]
    };

    var switcher = beaglehome.loadSwitcher(config, board);
    
    switcher.init();
    board.pins['P8_14'] = 1;
    board.pins['P8_13'] = 1;

    board.onPinChanged(function() {
        board.onPinChanged(function() {});
        test.equal(board.pins['P8_14'], 0);
        test.done();
    });

    switcher.start();

    board.pins['P8_13'] = 0;
  }
};

'use strict';

var beaglehome = require('../lib/beaglehome.js');

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
    console.log('d1');

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
        if (board.pins['P8_14']) {
            board.onPinChanged(function() {});
            test.done();
        }
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
        if (board.pins['P8_14']) {
            board.onPinChanged(function() {});
            test.done();
        }
    });

    switcher.start();

    board.pins['P8_13'] = 0;
  }
};

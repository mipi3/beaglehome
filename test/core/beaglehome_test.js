'use strict';

var beaglehome = require('../../server/core/beaglehome.js');
var control = require('../../server/core/control.js');
var EventEmitter = require('events').EventEmitter;

exports['input state changes output state'] = {
    'one-to-one config. Turn on.': function(test) {
	
	var board = createFakeBoard();
	var config = {
	    pins: {
		'P8_13': { id: 's_k-1', type: 'input', name: 'kitchen-1'},
		'P8_14': { id: 'r_k-1', type: 'output', name: 'kitchen-lamp' }
            },
	    links: [
		{ name: 'group1', in:['s_k-1'], out:['r_k-1'] }
            ]
	};

	var ee = new EventEmitter();
	
	var ctrl = control(config, ee);
	beaglehome.wire(ee, ctrl, board);
	var switcher = beaglehome.loadSwitcher(ctrl, board, ee);
	
	switcher.init();

	board.onDigitalWriteAll(function() {
	    board.onDigitalWriteAll(function() {});
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
		{ in:['s_k-1'], out:['r_k-1'] }
            ]
	};
	
	var ee = new EventEmitter();
	var ctrl = control(config, ee);
	beaglehome.wire(ee, ctrl, board);
	var switcher = beaglehome.loadSwitcher(ctrl, board, ee);
	
	switcher.init();

	board.onDigitalWriteAll(function() {
	    
            test.equal(board.pins['P8_14'], 1);
	    
	    board.onDigitalWriteAll(function() {

		test.equal(board.pins['P8_14'], 0);
		test.done();
	    });
	    
	    board.pins['P8_13'] = 0;
	});

	switcher.start();

	board.pins['P8_13'] = 1;
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
		{ in:['s_k-1','s_k-2'], out:['r_k-1'] }
            ]
	};
	
	var ee = new EventEmitter();
	var ctrl = control(config, ee);
	beaglehome.wire(ee, ctrl, board);
	var switcher = beaglehome.loadSwitcher(ctrl, board, ee);
	
	switcher.init();

	board.onDigitalWriteAll(function() {

            test.equal(board.pins['P8_14'], 1);
	    
	    board.onDigitalWriteAll(function() {
		test.equal(board.pins['P8_14'], 0);

		board.onDigitalWriteAll(function() {
		    test.equal(board.pins['P8_14'], 1);
		    test.done();
		});

		board.pins['P8_13'] = 0;
	    });
				    
	    board.pins['P8_11'] = 1;
	});

	switcher.start();

	board.pins['P8_13'] = 1;
    }
};

function createFakeBoard() {
  
  var pins = {};
  var pinModes = {};
  var changed = function() { };
  var changedAll = function() { };

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
      onDigitalWriteAll: function(handler) {
	  changedAll = handler;
      },
      digitalWriteAll: function(pins) {
          console.log('write all {');
	  pins.forEach(function(pin) {
	      digitalWrite(pin.pin, pin.value);
	  });
	  console.log('}');
	  changedAll(pins);
      }
  };
};

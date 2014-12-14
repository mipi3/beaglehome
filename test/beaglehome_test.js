'use strict';

// var beaglehome = require('../lib/beaglehome.js');
var sleep = require('sleep');

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
   loadSwitcher: function() {
     return {
       start: function() {
     }
  };
};


var createFakeBoard = function() {
  
  var pins = [];
  var changed = function() { };
  
  return {
      getPin: function(name) {
	  return pins[name];
      },
      setPin: function(name, value) {
	  pins[name] = value;
          changed();
      },
      onPinChanged: function(handler) {
          changed = handler;
      }
    };
};

exports['switcher reacts to board change'] = {
  'when config': function(test) {
    
    var board = createFakeBoard(alue) {});
    var config = {
	pins: {
	    'P8_13': { id: 's_k-1', type: 'input', name: 'kitchen-1'},
	    'P8_14': { id: 'r_k-1', type: 'output', name: 'kitchen-lamp' }
        },
	links: [
            {'s_k-1': 'r_k-1'}
        ]
    };

    var switcher = beaglehome.loadSwitcher(config, board);

    switcher.start();

    board.onPinChanged(function() {
        test.equal(board.getPin('P22'), false);
        test.done();
    });

    board.setPin('P21', true);
  }
};

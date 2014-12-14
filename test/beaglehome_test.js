'use strict';

var beaglehome = require('../lib/beaglehome.js');

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

var createFakeBoard = function() {
  
  var pins = [];
  
  return {
      getPin: function (name) {
        return false;
      },
      setPin: function (name, value) {
      }
    };
};

exports['switcher reacts to board change'] = {
  'when config': function(test) {
    
    var board = createFakeBoard();
    var config = {};

    var switcher = beaglehome.loadSwitcher(config, board);

    switcher.start(function() {

        test.equal(board.getPin('P22'), false);

        test.done();
    });

    board.setPin('P21', true);
  }
};

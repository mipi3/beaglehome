'use strict';

var _ = require('lodash');

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

var group = {
    create: function(config) {

        var inPins = {};
	var outPins = {};

	var getLinkPin = function(id) {
            var a;
            for (a in config.pins) {
                if (config.pins[a].id === id) {
                    return a;
                }
            }
            return undefined;
        };
        
        var setInPin = function(num) { inPins[getLinkPin(num)] = 0; };
        var setOutPin = function(num) { outPins[getLinkPin(num)] = 0; };

	for (var i = 0; i < config.links.length; i++) {
            var link = config.links[i];

            _.forEach(link.in, setInPin);
            setOutPin(link.out);
        }

	return {
            getInPins: function() {
		return _.reduce(inPins, function(result, num, key) {
                    if (key !== undefined) {
                        result[result.length] = { pin: key, value: 0 };
                    }
                    return result;
                }, []);
            },
            getOutPins: function() {
		return _.reduce(outPins, function(result, num, key) {
                    if (key !== undefined) {
                        result[result.length] = { pin: key, value: 0 };
                    }
                    return result;
                }, []);
            }		
	};
    }
};

exports['config tests'] = {
    'one input pin and one output pin': function(test) {
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

	var control = group.create(config);
	var inPins = control.getInPins();
	var outPins = control.getOutPins();

	test.equal(inPins.length, 1);
	test.equal(inPins[0].pin, 'P8_11');
	test.equal(inPins[0].value, 0);
	test.equal(outPins.length, 1);
	test.equal(outPins[0].pin, 'P8_14');
	test.equal(outPins[0].value, 0);
        
        test.done();
    },
    'two input pin and one output pin': function(test) {
        var config = {
            pins: {
		'P8_11': { id: 's_k-1', type: 'input', name: 'kitchen-1'},
		'P8_13': { id: 's_k-2', type: 'input', name: 'kitchen-2'},
		'P8_14': { id: 'r_k-1', type: 'output', name: 'kitchen-lamp' }
            },
            links: [
		{ in:['s_k-1', 's_k-2'], out:'r_k-1' }
            ]
        };

	var control = group.create(config);
	var inPins = control.getInPins();
	var outPins = control.getOutPins();

	test.equal(inPins.length, 2);
	test.equal(inPins[0].pin, 'P8_11');
	test.equal(inPins[0].value, 0);
	test.equal(inPins[1].pin, 'P8_13');
	test.equal(inPins[1].value, 0);
	test.equal(outPins.length, 1);
	test.equal(outPins[0].pin, 'P8_14');
	test.equal(outPins[0].value, 0);
        
        test.done();
    },
    '': function(test) {
        var config = {
            pins: {
                'P8_11': { id: 's_k-1', type: 'input', name: 'kitchen-1'},
                'P8_13': { id: 's_k-2', type: 'input', name: 'kitchen-2'},
                'P8_14': { id: 'r_k-1', type: 'output', name: 'kitchen-lamp' }
            },
            links: [
                { in:['s_k-1', 's_k-2'], out:'r_k-1' }
            ]
        };

        var control = group.create(config);

        control.setInPin('P8_11', 1);
        var outPins = control.getOutPins();

        test.equal(outPins.length, 1);
        test.equal(outPins[0].pin, 'P8_14');
        test.equal(outPins[0].value, 1);
        
        test.done();
     }
};

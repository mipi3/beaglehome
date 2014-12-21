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
            console.log('---' + id);
            var a;
            for (a in config.pins) {
                console.log(config.pins[a].id);
                if (config.pins[a].id === id) {
                    console.log('result ' + id);
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
                        result[result.length] = key;
                    }
                    return result;
                }, []);
            },
            getOutPins: function() {
		return _.reduce(outPins, function(result, num, key) {
                    if (key !== undefined) {
                        result[result.length] = key;
                    }
                    return result;
                }, []);
            }		
	};
    }
};

exports['super duper test'] = {
    '.': function(test) {
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

	test.equal(inPins.length, 1);
	test.equal(inPins[0], 'P8_11');

        // out pins should be
	// var outPins = control.getOutPins([{pin:'P8_11',res:1}]);

        // test.equal(outPins.length, 1);
	// test.equal(outPins[0].pin, 'P8_14');
	// test.equal(outPins[0].res, 1);
        
        test.done();
    }
};

'use strict';

var EventEmitter = require('events').EventEmitter;
var controlCtor = require('../../server/core/control.js');

var createCtrl = function(config) {
    var ee = new EventEmitter();
    return controlCtor(config, ee);
}

exports['config tests'] = {
    'one input pin and one output pin': function(test) {
        var config = {
            pins: {
		'P8_11': { id: 's_k-1', type: 'input', name: 'kitchen-1'},
		'P8_13': { id: 's_k-2', type: 'input', name: 'kitchen-2'},
		'P8_14': { id: 'r_k-1', type: 'output', name: 'kitchen-lamp' }
            },
            links: [
		{ name: 'switch1', room: 'kitchen', in:['s_k-1'], out:['r_k-1'] }
            ]
        };

	var control = createCtrl(config);
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
		{ in:['s_k-1', 's_k-2'], out: ['r_k-1'] }
            ]
        };

	var control = createCtrl(config);
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
    'change in any of in pin changes output pin': function(test) {
        var config = {
            pins: {
                'P8_11': { id: 's_k-1', type: 'input', name: 'kitchen-1'},
                'P8_13': { id: 's_k-2', type: 'input', name: 'kitchen-2'},
                'P8_14': { id: 'r_k-1', type: 'output', name: 'kitchen-lamp' }
            },
            links: [
                { in:['s_k-1', 's_k-2'], out:['r_k-1'] }
            ]
        };

        var control = createCtrl(config);
        var outPins = control.getOutPins();
        test.equal(outPins.length, 1);
        test.equal(outPins[0].pin, 'P8_14');
        test.equal(outPins[0].value, 0);

        control.setInPin('P8_11', 1);
        outPins = control.getOutPins();

        test.equal(outPins.length, 1);
        test.equal(outPins[0].pin, 'P8_14');
        test.equal(outPins[0].value, 1);

        control.setInPin('P8_13', 1);
        outPins = control.getOutPins();

        test.equal(outPins.length, 1);
        test.equal(outPins[0].pin, 'P8_14');
        test.equal(outPins[0].value, 0);
        
        test.done();
     }
};

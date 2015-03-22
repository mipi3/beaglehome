/*
 * beaglehome
 * https://github.com/mipi3/beaglehome
 *
 * Copyright (c) 2014 Mindaugas Pielikis
 * Licensed under the MIT license.
 */

'use strict';

var control = require('./control');    
var createPoller = require('../../server/core/poller.js').createPoller;
var _ = require('lodash');

exports.loadSwitcher = function(ctrl, board, ee) {

    return {
        init: function() {

            console.log('switcher initializing');
	    
            ctrl.getOutPins().forEach(function(pin) {
                board.pinMode(pin.pin, 'output');
                board.digitalWrite(pin.pin, pin.value);
            });

            ctrl.getInPins().forEach(function(pin) {
                board.pinMode(pin.pin, 'input');
            });

	    console.log('switcher initializing finished');
        },
        start: function() {

	    console.log('switcher is starting');
	    
            var pinNames = _.map(ctrl.getInPins(), function(pin) {
                return pin.pin;
            });

            function onPinChanged(pin, lastValue, value) {
                
                console.log('pin changed: pin ' + pin + ' ' + lastValue + ' -> ' + value);
                ee.emit('pinChanged', pin, lastValue, value);
		//console.log('emitted');
                    
                // ctrl.setInPin(pin, value);
                // ctrl.getOutPins().forEach(function(pin) {
                //     board.digitalWrite(pin.pin, pin.value);
                // });

            }
        
            createPoller(pinNames, board.digitalRead, 50, onPinChanged);                
        
            // setInterval(check,100);
            
            // function check() {

            //     ctrl.getInPins().forEach(function(pin) {
            //         board.digitalRead(pin.pin, onRead(pin.pin));
            //     });

            //     ctrl.getOutPins().forEach(function(pin) {
            //         board.digitalWrite(pin.pin, pin.value);
            //     });
                
            //     function onRead(inPin) {
            //         return function(x) {
            //             ctrl.setInPin(inPin, x);
            //         };
            //     }
            // }

	    console.log('switcher started');
        }
    };
};

exports.createControl = control;
exports.wire = function(eventEmitter, ctrl, board) {
    
    eventEmitter.on('pinChanged', function(pin, oldValue, newValue) {
        ctrl.setInPin(pin, newValue);
    });

    eventEmitter.on('outputChanged', function(switches) {
	board.digitalWriteAll(switches);
    });
};

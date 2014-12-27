/*
 * beaglehome
 * https://github.com/mipi3/beaglehome
 *
 * Copyright (c) 2014 Mindaugas Pielikis
 * Licensed under the MIT license.
 */

'use strict';

var control = require('../lib/control.js');
var _ = require('lodash');

exports.loadSwitcher = function(config, board) {

    var ctrl = control.create(config);
    
    return {
        init: function() {

            console.log('out pins ' + ctrl.getOutPins().length);
            
            _(ctrl.getOutPins()).forEach(function(pin) {
                console.log('o ' + pin.pin);
                board.pinMode(pin.pin, 'output');
                board.digitalWrite(pin.pin, pin.value);
            });

            _(ctrl.getInPins()).forEach(function(pin) {
                console.log('i ' + pin.pin);
                board.pinMode(pin.pin, 'input');
            });
        },
        start: function() {
            
            setInterval(check,100);
            
            function check() {

                _(ctrl.getInPins()).forEach(function(pin) {
                    board.digitalRead(pin.pin, onRead(pin.pin));
                });

                _(ctrl.getOutPins()).forEach(function(pin) {
                    board.digitalWrite(pin.pin, pin.value);
                });
                
                function onRead(inPin) {
                    return function(x) {
                        ctrl.setInPin(inPin, x);
                    };
                }
            }
        }
    };
};

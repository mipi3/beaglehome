/*
 * beaglehome
 * https://github.com/mipi3/beaglehome
 *
 * Copyright (c) 2014 Mindaugas Pielikis
 * Licensed under the MIT license.
 */

'use strict';

var Control = require('./control');    
var _ = require('lodash');

exports.loadSwitcher = function(ctrl, board) {

    return {
        init: function() {

            _(ctrl.getOutPins()).forEach(function(pin) {
                board.pinMode(pin.pin, 'output');
                board.digitalWrite(pin.pin, pin.value);
            });

            _(ctrl.getInPins()).forEach(function(pin) {
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

exports.createControl = Control.create;

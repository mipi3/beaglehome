'use strict';

var poller = function(pins, read, interval, onPinChanged) {

    var lastPin = {};
    setLastPins();
    var intrvl = setInterval(check,interval);

    function setLastPins() {
        for (var i = 0; i < pins.length; i++) {
            var l = pins[i];
	    lastPin[l] = 0;
        }
    }

    function checkWithLast(pin) {
        return function(vv) {
            if (lastPin[pin] !== vv.value) {
                onPinChanged(pin, lastPin[pin], vv.value);
                lastPin[pin] = vv.value;
            }
        };
    }

    function check() {
        for (var l in lastPin) {
            read(l, checkWithLast(l));
        }
        
        //setLastPins();
    }
 
    return {
        stop: function() {
            clearInterval(intrvl);
        }
    };
};

exports.createPoller = poller;

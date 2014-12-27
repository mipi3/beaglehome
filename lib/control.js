var _ = require('lodash');

module.exports = {
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
        
        var setPin = function(group, pins) {
            return function(num) { pins[getLinkPin(num)] = { value: 0,  group: group }; };
        };

	for (var i = 0; i < config.links.length; i++) {
            var link = config.links[i];
            var group = { state: 0 };
            _.forEach(link.in, setPin(group, inPins));
            setPin(group, outPins)(link.out);
        }

	return {
            setInPin: function(name, value) {
                if (inPins[name].value !== value) {
                    inPins[name].value = value;
                    inPins[name].group.state = !inPins[name].group.state; 
                } 
            },
            getInPins: function() {
		return _.reduce(inPins, function(result, info, pin) {
                    if (pin !== undefined) {
                        result[result.length] = { pin: pin, value: info.value };
                    }
                    return result;
                }, []);
            },
            getOutPins: function() {
		return _.reduce(outPins, function(result, info, pin) {
                    if (pin !== undefined) {
                        result[result.length] = { pin: pin, value: info.group.state };
                    }
                    return result;
                }, []);
            }		
	};
    }
};


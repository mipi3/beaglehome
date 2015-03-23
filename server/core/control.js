var _ = require('lodash');

module.exports = function(config, ee) {

    var inPins = {};
    var outPins = {};
    var listener = function() {};
    var rooms = {};

    // get pin by from id
    // 's_k-1' -> 'P8_14'
    var getLinkPin = function(id) {
        var a;
        for (a in config.pins) {
            if (config.pins[a].id === id) {
                return a;
            }
        }
        return undefined;
    };
    
    // pins by pin group setter
    // (group) -> f(id) -> { pins[pin] = {0, group)}
    var setPin = function(group, pins) {
        return function(num) {
            pins[getLinkPin(num)] = { value: 0, group: group };
        };
    };

    // set groups
    for (var i = 0; i < config.links.length; i++) {
        var link = config.links[i];
        var group = { name: link.name, state: 0, out: [] };
         
        _.forEach(link.in, setPin(group, inPins));

	link.out.forEach(setOutPinGroup(group));

	//set layout by room
        if (rooms[link.room] === undefined) {
	    rooms[link.room] = [];
	}
        rooms[link.room].push(group);
    }

    function setOutPinGroup(group) {
	return function(o) {
	    group.out.push(getLinkPin(o));
	    setPin(group, outPins)(o);
	};
    }

    function getInPins() {
	return _.reduce(inPins, function(result, info, pin) {
            if (pin !== undefined) {
                result[result.length] = { pin: pin, value: info.value };
            }
            return result;
        }, []);
    }

    function getOutPins() {
	return _.reduce(outPins, function(result, info, pin) {
            if (pin !== undefined) {
                result[result.length] = { pin: pin, value: info.value }; //.group.state };
            }
            return result;
        }, []);
    }

    return {
        setListener: function(l) {
            listener = l;
        },
        setInPin: function(name, value) {
            if (inPins[name].value !== value) {

                inPins[name].value = value;
		var group = inPins[name].group;
                group.state = 1 - group.state;

		group.out.forEach(function(o) {
		    outPins[o].value = group.state;
		});

                // todo set ouput values from group.out array
                // foreach o => o.value = group.state
                

                ee.emit('switchesChanged', getInPins());
                ee.emit('outputChanged', getOutPins());
            }
        },
	getLayout: function() {
	    return rooms;
	},
        getInPins: getInPins,
        getOutPins: getOutPins
    };
};


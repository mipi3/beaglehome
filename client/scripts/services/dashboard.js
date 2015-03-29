'use strict';

module.exports = function($http, $timeout) {
    
    var layout = {
	rooms: {},
    };

    function updateDashboard() {
        
	$http.get('/api/layout').success(function(data) {
            
	    for (var room in data) {
		
		if (layout.rooms[room] === undefined) {
		    layout.rooms[room] = { turnedOn: 0, sw: {}};
		}

		if (layout.selected === undefined) {
		    layout.selected = room;
		}
                
		layout.rooms[room].turnedOn = 0;
                
                setRoomSwitches(layout.rooms[room], data[room]);
	    }

	    $timeout(updateDashboard, 300);

	}).error(updateDashboard);
    }

    function setRoomSwitches(room, switches) {
        
	switches.forEach(function(sw) {

	    if (room.sw[sw.name] === undefined) {
		room.sw[sw.name] = {
                    name: sw.name,
                    state: 0,
                    cmd: 0
                };

                var s = room.sw[sw.name];

                s.change = function() {
                    if (s.check !== s.state) {
                        s.cmd = 3;
                        $http.post('/api/switch?' +
                                   encodeURIComponent(s.name) + '=' +
                                   encodeURIComponent(s.state));
                    }
                };
            }

            var roomSwitch = room.sw[sw.name];

            if (roomSwitch.cmd > 0) {
                roomSwitch.cmd--;
            } else {
                room.sw[sw.name].state = sw.state;
                room.sw[sw.name].check = sw.state;
	        room.turnedOn += sw.state;
            }
	});
        
    }

    updateDashboard();
    
    return layout;
};
 

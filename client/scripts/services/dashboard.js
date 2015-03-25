'use strict';

module.exports = function($http, $timeout) {
    var layout = {
	rooms: {}
	};

    updateDashboard();

    function updateDashboard() {
	$http.get('/api/layout').success(function(data) {
            //console.log(data);
	    for (var room in data) {
		
		if (layout.rooms[room] === undefined) {
		    layout.rooms[room] = { turnedOn: 0, sw: {}};
		}

		layout.rooms[room].turnedOn = 0;

		data[room].forEach(function(sw) {
		    
		    if (layout.selected === undefined) {
			layout.selected = room;
		    }

		    if (layout.rooms[room].sw[sw.name] === undefined) {
			layout.rooms[room].sw[sw.name] = { name: sw.name, state: 0 };
		    }

		    layout.rooms[room].sw[sw.name].state = sw.state;
		    layout.rooms[room].turnedOn += sw.state;
		    
		});
	    }

	    $timeout(updateDashboard, 3000);
	}).error(updateDashboard);
    }

    return layout;
};
 

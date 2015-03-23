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

		data[room].forEach(function(sw) {
		    
		    if (layout.rooms[room] === undefined) {
			layout.rooms[room] = {};
		    }

		    if (layout.rooms[room][sw.name] === undefined) {
			layout.rooms[room][sw.name] = { name: sw.name, state: 0 };
		    }

		    layout.rooms[room][sw.name].state = sw.state;
		    
		});
	    }

	    $timeout(updateDashboard, 300);
	}).error(updateDashboard);
    }

    return layout;
};
 

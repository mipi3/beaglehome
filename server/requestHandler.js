//var querystring = require('qs');

exports.dashboard = function(ctrl) {
    return function(response) {

        var jsonState = JSON.stringify({
            out: ctrl.getOutPins(),
            in: ctrl.getInPins()
        });
        
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write(jsonState);
        response.end();
    };
};

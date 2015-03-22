//var querystring = require('qs');
exports.dashboard = function(ctrl) {
    return function(response) {

        var jsonState = JSON.stringify({
            out: ctrl.getOutPins(),
            in: ctrl.getInPins()
        }, null, 2);
        
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write(jsonState);
        response.end();
    };
};

exports.layout = function(ctrl) {
    return function(response) {

        var jsonState = JSON.stringify(ctrl.getLayout(), null, 2);
        
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write(jsonState);
        response.end();
    };
};


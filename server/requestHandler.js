//var querystring = require('qs');
exports.dashboard = function(ctrl) {
    return function(response) {

        var jsonState = JSON.stringify({
            out: ctrl.getOutPins(),
            in: ctrl.getInPins()
        }, null, 2);
        
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(jsonState);
        response.end();
    };
};

exports.layout = function(ctrl) {
    return function(response) {

        var jsonState = JSON.stringify(ctrl.getLayout(), null, 2);
        
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(jsonState);
        response.end();
    };
};

exports.switch = function(ctrl) {
    return function(response, data) {

        //var jsonState = JSON.stringify(ctrl.getLayout(), null, 2);
        console.log(data);
        for (sw in data) {
            ctrl.setLinkState(sw, (data[sw] === '1') ? 1 : 0);
        }
        response.writeHead(200);
        //response.write(jsonState);
        response.end();
    };
};


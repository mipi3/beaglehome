//var querystring = require('qs');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve = serveStatic('public', {'index': ['index.html', 'index.htm']});

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

exports.public = function(res, postData, req) {
    var done = finalhandler(req, res);
    serve(req, res, done);
};

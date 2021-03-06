var http = require("http");
var WebSocketServer = require('ws').Server;
var url = require("url");
var DEBUG = false;

function start(route, handle, port) {

    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        var postData = parseQuery(url.parse(request.url).query);
        if (DEBUG === true) {
            console.log("Request for " + pathname + " received.");
            console.log("postData " + postData);
        }
        
        route(handle, pathname, response, postData, request);
    }

    var server = http.createServer(onRequest).listen(port);
    var wss = new WebSocketServer({ server: server });

    wss.broadcast = function(data) {
        for (var i in this.clients) {
            this.clients[i].send(data);
        }
    };

    // wss.on('connection', function connection(ws) {
    //     ws.on('message', function incoming(message) {
    //         console.log('received: %s', message);
    //     });

    //     ws.send('something');
    // });
    
    console.log("Server has started on port " + port);
}

exports.start = start;

function parseQuery(query) {
    var obj = {};

    if (typeof query === 'string') {
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
    }
    return obj;
}

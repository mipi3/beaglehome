//
// Copyright (C) 2012 - Cabin Programs, Ken Keller 
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is furnished to do
// so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve = serveStatic('public', {'index': ['index.html', 'index.htm']});

var DEBUG = false;

function route(handle, pathname, response, postData, request) {
    if (DEBUG === true) {
        console.log("About to route a request for " + pathname);
    }

    if (typeof handle[pathname] === 'function') {
        if (DEBUG === true) {
            console.log("postData in router: " + postData);
        }
        handle[pathname](response, postData, request);
    } else {
        var done = finalhandler(request, response);
        serve(request, response, done);
    }
}

exports.route = route;

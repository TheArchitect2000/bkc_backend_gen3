var http = require('http');
http.createServer(function (req, res) {
    console.log('req', 'dddddd')
    // console.log('req', req)
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello World eee!');
    res.end();

}).listen(1883);
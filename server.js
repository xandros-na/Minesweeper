var path = require('path');
var api = require('./server/routes/api');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ioHandler = require('./server/routes/ioHandler');
ioHandler.io = io;

app.use(express.static(path.join(__dirname, './client')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/', api);
app.use('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, 'client', 'views', 'index.html'));
});

ioHandler.checkQueue();
io.on('connection', ioHandler.handler);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

http.listen(server_port, function() {
    console.log('server started ' + server_port);
});

/*
http.listen(server_port, server_ip_address, function() {
    console.log('server started ' + server_port);
});
*/


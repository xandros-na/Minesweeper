var path = require('path');
var express = require('express');
var api = express.Router();
var db = require('./database.js');

api.post('/api/signUp', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    db.signUp(username, password, function(msg) {
        if (msg.code) {
            res.status(400).send('duplicate username');
        } else {
            res.send(msg);
        }
    });
});

api.post('/api/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    console.log(username, password);
    db.login(username, password, function(msg) {
        console.log(msg);
        if (msg !== null) {
            if (msg.code) {
                res.status(500).send('something bad happened');
            } else {
                msg ? res.send(msg) : res.status(401).send('invalid login');
            }
        } else {
            res.status(401).send('invalid login');
        }
    });
});

module.exports = api;

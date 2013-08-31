
var express = require('express');
var http = require('http');
var app = express();
var raptor = require('./raptor.js');

app.listen(3030);
console.log('Listening on port 3000');

// Example usage of Raptor, rapid REST prototyping and development
var r = new raptor(app, 'echo.jsontest.com', 80);
r.get('/johan/:id', function (req, res) { r.mockResReq(req, res); });
r.get('/johan', function (req, res) { r.mockResReq(req, res); });
r.get('/testfwd', function (req, res) { r.doForwardRequest(req, res, '/key/value/one/two', 'GET'); });
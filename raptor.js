var express = require('express');
var http = require('http');

function Raptor (expressApp, endpoint, port) {
    this.expressApp = expressApp;
    this.endpoint = endpoint;
    this.port = port;
    expressApp.use(express.bodyParser());
}

Raptor.prototype = {
    constructor: Raptor,
    get: function (path, translator) {
        this.expressApp.get(path, translator);
    },
    post: function (path, translator) {
        this.expressApp.post(path, translator);
    },
    put: function (path, translator) {
        this.expressApp.put(path, translator);
    },
    delete: function (path, translator) {
        this.expressApp.delete(path, translator);
    },
    mockResReq: function (req, res) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify({message: 'This will return JSON'}));
    },
    doForwardRequest: function (req, res, path, method) {
        var options = {
            hostname: this.endpoint,
            port: this.port,
            path: path,
            method: method
        };
        var request = http.request(options, function(response) {
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
                res.setHeader("Content-Type", "application/json");
                res.send("" + chunk);
            });
        });
        request.on('error', function(e) {
            console.log('problem with request: ' + e.message);
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify({error: e.message, message: 'problem with request'}));
        });
        request.end();
    },
    doForwardRequestHandlers: function (req, res, path, method, reqtranslator, restranslator) {
        var options = {
            hostname: this.endpoint,
            port: this.port,
            path: path,
            method: method
        };
        var request = http.request(options, function(response) {
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
                res.setHeader("Content-Type", "application/json");
                res.send("" + restranslator(chunk));
            });
        });
        request.on('error', function(e) {
            console.log('problem with request: ' + e.message);
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify({error: e.message, message: 'problem with request'}));
        });
        request.write(reqtranslator(""));
        request.end();
    }
}

// Export Raptor as library to Node.js
module.exports = Raptor;
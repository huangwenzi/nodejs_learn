"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net = require('net');
var Client = require("./client");
class mServer {
    constructor(host, port) {
        this.clientArr = [];
        this.server = net.createServer();
        this.server.mServer = this;
        this.host = host;
        this.port = port;
        this.server.listen(this.host, this.port);
        this.server.on('error', function (err) {
            console.log('Server error: ', err.message);
        });
        this.server.on('close', function () {
            console.log('Server closed');
        });
        this.server.on("connection", function (socket) {
            console.log("get a new socket");
            console.log('CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
            var client = new Client(socket);
            this.mServer.clientArr.push(client);
            client.socket.client = client;
            client.socket.on('data', function (data) {
                var str = data.toString();
                console.log('Got data: ', str);
                this.client.netWork(str);
            });
            socket.on('close', function (data) {
                console.log('CLOSED: ' + socket.remoteAddress + ' ' + socket.remotePort);
                this.mServer.removeClient(socket);
            });
            socket.on('error', function (data) {
                console.log('error: ' + socket.remoteAddress + ' ' + socket.remotePort);
                this.mServer.removeClient(socket);
            });
        });
    }
    removeClient(socket) {
        var count = this.clientArr.length;
        for (let index = 0; index < count; index++) {
            if (socket === this.clientArr[index].socket) {
                this.clientArr.splice(index, 1);
                break;
            }
        }
    }
    sendMsg(socket, msg) {
        var count = this.clientArr.length;
        for (let index = 0; index < count; index++) {
            if (socket === this.clientArr[index].socket) {
                this.clientArr[index].socket.write(msg);
                break;
            }
        }
    }
    sendAllMsg(msg) {
        this.clientArr.forEach(function (client) {
            client.socket.write(msg);
        });
    }
}
exports.mServer = mServer;

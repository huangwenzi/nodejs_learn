var net = require('net');
var fs = require("fs");
var serverMd = require("./server");
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
rl.on("line", function (line) {
    server.sendAllMsg(line);
});
var HOST = '127.0.0.1';
var PORT = 9871;
var server = new serverMd.mServer(PORT, HOST);
server.server.listen(PORT, HOST);

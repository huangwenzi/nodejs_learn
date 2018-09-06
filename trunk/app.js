var net = require('net');
var fs = require("fs");
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
rl.on("line", function (line) {
    socket_arr.forEach(function (socket) {
        socket.write(line);
    });
});
var HOST = '127.0.0.1';
var PORT = 9871;
var socket_arr = [];
function remove_socket(socket) {
    var count = socket_arr.length;
    for (let index = 0; index < count; index++) {
        if (socket === socket_arr[index]) {
            socket_arr.splice(index, 1);
            break;
        }
    }
}
var server = net.createServer();
server.listen(PORT, HOST);
server.on("connection", function (socket) {
    console.log("get a new socket");
    console.log('CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
    socket.tmp_1 = 1;
    socket_arr.push(socket);
    socket.on('data', function (data) {
        var str = data.toString();
        console.log('Got data: ', str);
        fs.open('input.txt', 'a', function (err, fd) {
            if (err) {
                return console.error(err);
            }
            fs.writeFile(fd, str + "\r\n");
        });
    });
    socket.on('close', function (data) {
        console.log('CLOSED: ' +
            socket.remoteAddress + ' ' + socket.remotePort);
        remove_socket(socket);
    });
    socket.on('error', function (data) {
        console.log('error: ' +
            socket.remoteAddress + ' ' + socket.remotePort);
        remove_socket(socket);
    });
});
server.on('error', function (err) {
    console.log('Server error: ', err.message);
});
server.on('close', function () {
    console.log('Server closed');
});

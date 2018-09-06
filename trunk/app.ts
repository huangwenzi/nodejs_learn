// 加载模块
var net = require('net');
var fs = require("fs");

// 加载类
require("./server");

// 读取终端的输入
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
// 输入事件的处理函数
rl.on("line", function(line) {
    // 下发给所有的客户端
    socket_arr.forEach(function (socket:any) {
        socket.write(line);     // 还没有做连接关闭的检查
    });
});

// 服务端地址与端口的配置
var HOST = '127.0.0.1';
var PORT = 9871;

// 需要用到的一些变量
var socket_arr:any = [];    // 保存连接的客户端套接字

// 需要用的到一些辅助函数
// 删除客户端数组中的某个客户端
function remove_socket(socket:any) {
    var count = socket_arr.length;      // 客户端数量
    for (let index = 0; index < count; index++) {
        // 寻找对应的客户端,删除退出
        if( socket === socket_arr[index]){
            socket_arr.splice(index, 1);
            break;
        }  
    }
}

// 创建服务器对象
var server = net.createServer();
server.listen(PORT, HOST);

// 客户端连接后，注册处理函数
server.on("connection", function(socket){
    console.log("get a new socket");
    console.log('CONNECTED: ' + socket.remoteAddress +':'+ socket.remotePort);
    socket.tmp_1 = 1;
    socket_arr.push(socket);    // 添加到客户端的数组

    // 下面只是用来检查数组中push加入的是引用还是拷贝版本
    // console.log(socket.tmp_1);
    // socket.tmp_2 = 2;
    // var count = socket_arr.length;
    // console.log(socket_arr[count-1].tmp_2);

    // 客户端事件函数注册
    socket.on('data', function(data) {
        var str = data.toString();
        console.log('Got data: ', str);

        // 打开要写入的文件
        fs.open('input.txt', 'a', function(err, fd) {
            if (err) {
                return console.error(err);
            }

            // 写入数据
            fs.writeFile(fd, str + "\r\n");
        });

    });

    socket.on('close', function(data) {
        console.log('CLOSED: ' +
        socket.remoteAddress + ' ' + socket.remotePort);

        // 在数组中去除
        remove_socket(socket);
    });

    socket.on('error', function(data) {
        console.log('error: ' +
        socket.remoteAddress + ' ' + socket.remotePort);

        // 在数组中去除
        remove_socket(socket);
    });
});


// 服务器事件处理函数
server.on('error', function(err) {
    console.log('Server error: ', err.message);
});
 
server.on('close', function() {
    console.log('Server closed');
});


// 数据库的操作部分




// 加载模块
var net = require('net');
var fs = require("fs");

// 加载类
var serverMd = require("./server");

// 读取终端的输入
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
// 输入事件的处理函数
rl.on("line", function(line) {
    server.sendAllMsg(line);
});

// 服务端地址与端口的配置
var HOST = '127.0.0.1';
var PORT = 9871;

// 创建服务器对象
var server = new serverMd.mServer(PORT, HOST);
server.server.listen(PORT, HOST);


// 数据库的操作部分




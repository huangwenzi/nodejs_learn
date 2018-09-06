
var net = require('net');
require("./client");


// 这个是服务端的类
class Server{
    host:string;        // 服务端的ip地址
    port:number;        // 服务端的端口
    server:any;         // net创建的服务器对象
    clientArr:any;      // 客户端数组

    // 下面是函数
    constructor (host:string, port:number) {
        // 设置对应参数，并开始监听
        this.server = net.createServer();
        this.host = host;
        this.port = port;
        this.server.listen(this.host, this.port);

        // 注册事件函数
        // 客户端连接
        this.server.on("connection", function(socket){
            console.log("get a new socket");
            console.log('CONNECTED: ' + socket.remoteAddress +':'+ socket.remotePort);
            // 新建一个对象，放入数组
            var client = new Client(socket);
            this.clientArr.push(client);

            // 客户端事件函数注册
            client.socket.on('data', function(data) {
                var str = data.toString();
                console.log('Got data: ', str);
            });

            socket.on('close', function(data) {
                console.log('CLOSED: ' +
                socket.remoteAddress + ' ' + socket.remotePort);
                // 在数组中去除
                this.removeClient(socket);
            });
        
            socket.on('error', function(data) {
                console.log('error: ' +
                socket.remoteAddress + ' ' + socket.remotePort);
                // 在数组中去除
                this.removeClient(socket);
            });

        });
    }

    // 移除指定客户端
    // socket : 客户端的套接字
    removeClient(socket:any){
        var count = this.clientArr.length;      // 客户端数量
        for (let index = 0; index < count; index++) {
            // 寻找对应的客户端,删除退出
            if( socket === this.clientArr[index].socket){
                this.clientArr.splice(index, 1);
                break;
            }  
        }
    }



}

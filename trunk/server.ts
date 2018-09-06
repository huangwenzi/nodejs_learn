
var net = require('net');
var clientMD = require("./client");

// 这个是服务端的类
export class mServer{
    host:string;        // 服务端的ip地址
    port:number;        // 服务端的端口
    server:any;         // net创建的服务器对象
    clientArr:any = []; // 客户端数组
    //static instance:mServer;      // 单例模式去保存this指针

    // 下面是函数
    // host : 地址
    // port : 端口
    constructor (host:string, port:number) {
        // 设置对应参数，并开始监听
        this.server = net.createServer();
        //mServer.instance = this;
        this.server.mServer = this;     // 为server注册函数时的this是server的，所以要把最上层类的this引用放进去
        this.host = host; 
        this.port = port;
        this.server.listen(this.host, this.port);

        // 服务器事件处理函数
        this.server.on('error', function(err) {
            console.log('Server error: ', err.message);
        });
 
        this.server.on('close', function() {
            console.log('Server closed');
        });

        // 注册事件函数
        // 客户端连接
        this.server.on("connection", function(socket){
            console.log("get a new socket");
            console.log('CONNECTED: ' + socket.remoteAddress +':'+ socket.remotePort);
            // 新建一个对象，放入数组
            var client = new clientMD.mClient(socket);
            this.mServer.clientArr.push(client);
            client.socket.client = client;      // 客户端的套接字里也保存一个客户端的引用 ps:是套接字里，下面事件的注册也是针对套接字的

            // 客户端事件函数注册
            client.socket.on('data', function(data) {
                var str = data.toString();
                console.log('Got data: ', str);
                //this.client.mServer.sendAllMsg(str);     // ok，可发送
                // 数据交给客户端类处理
                this.client.netWork(str);
            });

            socket.on('close', function(data) {
                console.log('CLOSED: ' + socket.remoteAddress + ' ' + socket.remotePort);
                // 在数组中去除
                this.client.mServer.removeClient(socket);
            });
        
            socket.on('error', function(data) {
                console.log('error: ' + socket.remoteAddress + ' ' + socket.remotePort);
                // 在数组中去除
                this.client.mServer.removeClient(socket);
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

    // 下发信息给指定客户端     (好像有点多此一举了)
    // socket : 指定的套接字
    // msg : 要下发的信息
    sendMsg(socket:any, msg:string){
        var count = this.clientArr.length;      // 客户端数量
        for (let index = 0; index < count; index++) {
            // 寻找对应的客户端,发送数据
            if( socket === this.clientArr[index].socket){
                this.clientArr[index].socket.write(msg);
                break;
            }  
        }
    }

    // 下发信息给所有客户端
    // msg : 要下发的信息
    sendAllMsg(msg:string){
        this.clientArr.forEach(function (client:any) {
            client.socket.write(msg);     // 还没有做连接关闭的检查
        });
    }

}

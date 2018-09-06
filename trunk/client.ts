
// 暂时不写数据包的类，数据之间用 "###" 分割
// 数据包组成
// 子系统号，协议号，arg[2],arg[3]...

// 这个是客户端的类
export class mClient{
    socket:any;         // 套接字对象

    // 下面是函数
    // 初始化函数
    constructor (socket:any) {
        this.socket = socket;    // 保存接受到connect时的套接字对象
    }

    // 处理网络数据
    // data : 客户端接受到的数据
    netWork (data:any) {
        var arg = data.split("###");
        console.log(arg);
        // 细分系统
        switch (arg[0]) {
            case "1":   // 基础操作子系统
                this.basciSystem(arg);
                break;
        
            default:
                break;
        }
    }
    
    // 基础子系统数据处理
    basciSystem (arg:any) {
        // 细分协议
        switch (arg[1]) {
            case "1":   // 基础操作子系统
                this.userLongin(arg);
                break;
        
            default:
                break;
        }
    }

    // basciSystem
    // 用户登录
    userLongin (arg:any) {
        var name = arg[2];
        var password = arg[3];
        // 调用数据库数据验证账户密码
    }

    // 创建用户
    createUser (arg:any) {
        var name = arg[2];
        var password = arg[3];
        // 调用数据库数据查看数据是否允许创建

    }

    
}

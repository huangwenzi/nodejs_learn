class mClient {
    constructor(socket) {
        this.socket = socket;
    }
    netWork(data) {
        var arg = data.split("###");
        console.log(arg);
    }
}
module.exports = mClient;

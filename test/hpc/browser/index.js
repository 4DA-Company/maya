const config = require('./config')
const network = require('./network')

class Console extends network.Gateway {
    constructor(config) {
        super(config)
    }

    handleResponse(id, data, from){
        switch(id){
            case 'check': this.broadcast('check', { from, data }); break;
        }
    }

    handleCheck(data) {
        Object.values(this.peers).forEach(address => {
            console.log('check', address,this.client.context)
            this.request(this.address, address, 'check', this.client.context)
        })
    }

    handleClientRequest(id, data) {
        console.log('client request', id, data)
        switch (id) {
            case 'check' : this.handleCheck(data); break;
            /**the rest of the protocol between console and peers */
        }
    }

    handleExit(data) {
        this.signoff(data);
    }
}

new class extends network.Portal {
    constructor() {
        super(config.port, config.home);
        this.start(() => console.log('on', config.port))
    }

    onConnection(context, ws) {
        this.send('init', {}, context, ws);
        this.handleAccess({access: config.system}, context, ws)
    }

    onAction(id, data, context, ws) {
        switch (id) {
            case 'access': this.handleAccess(data, context, ws); break;
            case 'exit': this.handleExit(data, context, ws); break;
            default: this.handleRequest(data, context); break;
        }
    }

    handleAccess(data, context, ws) {
        context.console = new Console({ ...data, client: { portal: this, context, ws } })
    }

    handleExit(data, context, ws) {
        console.log('handle exit', data)
        context.console?.handleExit(data);
        this.send('exit', data, context, ws)
    }

    handleRequest(data, context) {
        console.log('handle request', data)
        context.console?.handleClientRequest(data)
    }
}
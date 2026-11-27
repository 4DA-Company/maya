class Gateway extends require('./system') {
    constructor(config) {
        super(config.access, false)
        
        this.client = config.client

        this.connect(this.host)
    }

    onGranted(data) {
        console.log('granted', this.address)
        this.handleAccess({ granted: true, message: this.credential })
    }

    onDenied(data) {
        console.log('denied', this.address)
        this.handleAccess({ granted: false, message: 'Access denied' })
    }

    onEvent(id, packet) {
        console.log('event', id)
        const data = JSON.parse(packet.transformer.data)
        const from = packet.peering.from
        this.handleEvent(id,  data, from)
    }

    onResponse(id, packet){
        console.log('response', id)
        const data = JSON.parse(packet.transformer.data)
        const from = packet.peering.from
        this.handleResponse(id, data, from)
    }

    onRequest(id, packet){
        console.log('request', id)
        const data = JSON.parse(packet.transformer.data)
        const from = packet.peering.from
        this.handleRequest(id,  data, from)
    }

    broadcast(id, data){
        this.client.portal.broadcast(id, data, this.client.context)
    }

    handleEvent(id, data, from){
        this.client.portal.send(id, data, this.client.context, this.client.ws)
    }

    handleResponse(id, data, from){
        this.client.portal.send(id, data, this.client.context, this.client.ws)
    }    

    handleRequest(id, data, from){
        this.client.portal.send(id, data, this.client.context, this.client.ws)
    }    

   handleAccess(data){
        this.client.portal.send('access', data, this.client.context, this.client.ws)
    }    
}

module.exports = { 
    Gateway,
    System : require('./system'),
    Portal : require('./portal').NonSecure
}
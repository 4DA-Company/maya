module.exports = {
    port: 6550,
    home: 'public',

    system: {
        host: 'ws://213.199.58.37:5000', 
        credential: {
                accesskey: 'ALAADM',
                password: '0000000',
                address: 'batch.test.maya.4da',
                context: {}
        },

        peers: {
            academy: 'academy.aladino.maya.4da',
            lab: 'lab.aladino.maya.4da',
            marketplace: 'marketplace.aladino.maya.4da',
            storage: 'storage.aladino.maya.4da',
            assistance: 'assistance.aladino.maya.4da',
            stage: 'stage.aladino.maya.4da'
        }

    }
}
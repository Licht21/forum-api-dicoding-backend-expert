class AddThread {
    constructor(payload) {
        this._verifyPayload(payload)

        const { title, body, ownerId, ownerUsername } = payload
        this.title = title
        this.body = body
        this.ownerId = ownerId
        this.ownerUsername = ownerUsername
    }

    _verifyPayload (payload) {
        const { title, body, ownerId, ownerUsername } = payload
        if(!title || !body || !ownerId || !ownerUsername) {
            throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
        }

        if(typeof title !== 'string' || typeof body !== 'string' || typeof ownerId !== 'string' || typeof ownerUsername !== 'string') {
            throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
        }
    }
}

module.exports = AddThread
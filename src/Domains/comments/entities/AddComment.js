class AddThread {
    constructor(payload) {
        this._verifyPayload(payload)

        const { content, ownerId, ownerUsername } = payload

        this.content = content
        this.ownerId = ownerId
        this.ownerUsername = ownerUsername
    }

    _verifyPayload(payload) {
        
        const { content,  ownerId, ownerUsername } = payload

        if(!content || !ownerId || !ownerUsername) {
            throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
        }

        if(typeof content !== 'string' || typeof ownerId !== "string" || typeof ownerUsername !== 'string') {
            throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
        }
    }
}

module.exports = AddThread
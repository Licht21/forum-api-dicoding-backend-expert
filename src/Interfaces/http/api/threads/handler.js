const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase')

class ThreadsHandler {
    constructor(container) {
        this._container = container

        this.postThreadHandler = this.postThreadHandler.bind(this)
    }

    async postThreadHandler(request, h) {
        const { id, username } = request.auth.credentials
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name)
        const payload = {
            ...request.payload,
            ownerId: id,
            ownerUsername: username
        }
        const addedThread = await addThreadUseCase.execute(payload)

        const response = h.response({
            status: 'success',
            data: {
                addedThread
            }
        }).code(201)
        return response
    }
}

module.exports = ThreadsHandler
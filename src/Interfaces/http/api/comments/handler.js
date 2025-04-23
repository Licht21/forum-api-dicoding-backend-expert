const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')

class CommentsHandler {
    constructor(container) {
        this._container = container

        this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this)
    }

    async postThreadCommentHandler(request, h) {
        const { id: ownerId, username: ownerUsername } = request.auth.credentials
        const { threadId } = request.params
        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name)
        const payload = {
            ...request.payload,
            ownerId,
            ownerUsername,
            threadId
        }
        const addedComment = await addCommentUseCase.execute(payload)

        const response = h.response({
            status: 'success',
            data: {
                addedComment
            }
        }).code(201)

        return response
    }
}

module.exports = CommentsHandler
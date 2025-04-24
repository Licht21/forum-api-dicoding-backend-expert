const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')

class CommentsHandler {
    constructor(container) {
        this._container = container

        this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this)
        this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this)
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

    async deleteThreadCommentHandler(request, h) {
        const { id: ownerId } = request.auth.credentials
        const { commentId } = request.params
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name)
        const payload = {
            ownerId,
            commentId
        }
        await deleteCommentUseCase.execute(payload)

        const response = h.response({
            status: 'success'
        }).code(200)

        return response
    }
}

module.exports = CommentsHandler
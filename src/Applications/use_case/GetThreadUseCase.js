const GetThread = require("../../Domains/threads/entities/GetThread")

class GetThreadUseCase {
    constructor({
        commentRepository, 
        threadRepository
    }) {
        this._commentRepository = commentRepository
        this._threadRepository = threadRepository
    }

    async execute(useCasePayload) {
        const { threadId } = useCasePayload
        const comments = await this._commentRepository.getCommentsByThreadId(threadId)
        const thread = await this._threadRepository.getThread(threadId)

        const getThread = new GetThread({
            ...thread,
            comments
        })
        console.log(getThread)

        return getThread
    }
}

module.exports = GetThreadUseCase
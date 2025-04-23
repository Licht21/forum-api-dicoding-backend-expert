const CommentRepository = require('../../Domains/comments/CommentRepository')
const AddedComment = require('../../Domains/comments/entities/AddedComment')

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async addComment(payload) {
        const { ownerId, ownerUsername, content, threadId } = payload
        const id = `comment-${this._idGenerator()}`
        const timestamp = new Date().toISOString()

        const query = {
            text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, owner_id',
            values: [id, content, timestamp, ownerId, ownerUsername, threadId]
        }

        const result = await this._pool.query(query)

        return new AddedComment({
            id: result.rows[0].id,
            content: result.rows[0].content,
            owner: result.rows[0].owner_id
        })
    }
}

module.exports = CommentRepositoryPostgres
const AddedThread = require('../../Domains/threads/entities/AddedThread')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async addThread(payload) {
        const { title, body, ownerId, ownerUsername } = payload
        const id = `thread-${this._idGenerator()}`
        const timestamp = new Date().toISOString()

        const query = {
            text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, owner_id',
            values: [id, title, body, timestamp, ownerId, ownerUsername]
        }

        const result = await this._pool.query(query)

        return new AddedThread({
            id: result.rows[0].id,
            title: result.rows[0].title,
            owner: result.rows[0].owner_id
        })
    }
}

module.exports = ThreadRepositoryPostgres
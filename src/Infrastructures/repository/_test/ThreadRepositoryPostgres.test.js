const InvariantError = require('../../../Commons/exceptions/InvariantError')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end()
    })

    describe('addThread function', () => {
        it('should persist add thread and return added thread correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({})
            const addThread = new AddThread({
                title: 'thread title',
                body: 'thread body',
                ownerId: 'user-123',
                ownerUsername: 'dicoding'
            })
            const fakeIdGenerator = () => '123'
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool,fakeIdGenerator)

            // Action
            await threadRepositoryPostgres.addThread(addThread)

            // Assert
            const thread = await ThreadsTableTestHelper.findThreadById('thread-123')
            expect(thread).toHaveLength(1)
        })

        it('should return added thread correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({})
            const addThread = new AddThread({
                title: 'thread title',
                body: 'thread body',
                ownerId: 'user-123',
                ownerUsername: 'dicoding'
            })
            const fakeIdGenerator = () => '123'
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool,fakeIdGenerator)

            // Action
            const thread = await threadRepositoryPostgres.addThread(addThread)

            // Assert
            expect(thread).toStrictEqual(new AddedThread({
                id: 'thread-123',
                title: 'thread title',
                owner: 'user-123'
            }))
        })
    })
})
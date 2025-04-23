const AddComment = require('../../../Domains/comments/entities/AddComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')

describe('CommentRepositoryPostgres', () => {
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end()
    })

    describe('addComment function', () => {
        it('should persist add comment and return added comment correctly', async () => {
            // Arrange

            // Adding user so thread can be added

            await UsersTableTestHelper.addUser({})
            const addThread = new AddThread({
                title: 'thread title',
                body: 'thread body',
                ownerId: 'user-123',
                ownerUsername: 'dicoding'
            })

            // creating dependencies
            const fakeIdGenerator = () => '123'
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)
            
            // Adding thread so comment can be added to thread
            await threadRepositoryPostgres.addThread(addThread)

            const addComment = new AddComment({
                content: 'a content',
                ownerId: 'user-123',
                ownerUsername: 'dicoding',
                threadId: 'thread-123'
            })

            // Action
            const comment = await commentRepositoryPostgres.addComment(addComment)

            // Assert
            expect(comment).toStrictEqual(new AddedComment({
                id: 'comment-123',
                content: 'a content',
                owner: 'user-123'
            }))
        })
    })
})
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AddCommentUseCase = require('../AddCommentUseCase')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const AddComment = require('../../../Domains/comments/entities/AddComment')

describe('AddCommentUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            ownerId: 'user-123',
            ownerUsername: 'dicoding',
            content: 'a content',
            threadId: 'thread-123'
        }

        const mockAddedComment = new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: useCasePayload.ownerId
        })

        // creating dependency of use case
        const mockCommentRepository = new CommentRepository()

        // mocking needed function
        mockCommentRepository.addComment = jest.fn()
            .mockImplementation(() => Promise.resolve(mockAddedComment))

        // creating use case instance
        const addCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository
        })

        // Action
        const addedComment = await addCommentUseCase.execute(useCasePayload)

        // Assert
        expect(addedComment).toStrictEqual(mockAddedComment)
        expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment(useCasePayload))
    })
})
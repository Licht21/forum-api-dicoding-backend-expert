const CommentRepository = require('../CommentRepository')

describe('CommentRepository domain', () => {
    it('should throw error when acces abstract behavior', async () => {
        // Arrange
        const commentRepository = new CommentRepository()

        // Action and Assert
        await expect(commentRepository.addComment({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(commentRepository.deleteComment({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(commentRepository.findCommentById({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    })
})
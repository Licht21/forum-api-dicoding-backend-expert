class DeleteCommentUseCase {
  constructor({
    commentRepository,
  }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this._commentRepository.findCommentById(useCasePayload.commentId);
    await this._commentRepository.deleteComment(useCasePayload);
  }
}

module.exports = DeleteCommentUseCase;

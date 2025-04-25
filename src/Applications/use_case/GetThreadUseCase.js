const GetThread = require('../../Domains/threads/entities/GetThread');

class GetThreadUseCase {
  constructor({
    commentRepository,
    threadRepository,
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getThread(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const modifiedComments = comments.map((item) => {
      if (item.is_delete === false) {
        delete item.is_delete;
        return item;
      }
      delete item.is_delete;
      return {
        ...item,
        content: '**komentar telah dihapus**',
      };
    });

    return new GetThread({
      ...thread,
      comments: modifiedComments,
    });
  }
}

module.exports = GetThreadUseCase;

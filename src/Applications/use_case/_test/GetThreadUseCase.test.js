const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetCommentsUseCase', () => {
  it('should orchestrating the get comments actions correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockGetThread = {
      id: 'thread-123',
      title: 'a thread',
      body: 'a thread body',
      date: '2021',
      username: 'dicoding',
    };

    const mockCommentByThreadId = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2021',
        content: 'a content',
        is_delete: false,
      },
      {
        id: 'comment-1234',
        username: 'dicoding',
        date: '2021',
        content: 'a content',
        is_delete: true,
      },
    ];

    // creating dependency of use case
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCommentByThreadId));
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockGetThread));

    // creating use case instance
    const getThreadUseCase = new GetThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const getThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(getThread).toStrictEqual(new GetThread({
      id: 'thread-123',
      title: 'a thread',
      body: 'a thread body',
      date: '2021',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2021',
          content: 'a content',
        },
        {
          id: 'comment-1234',
          username: 'dicoding',
          date: '2021',
          content: '**komentar telah dihapus**',
        },
      ],
    }));
    expect(getThread).toBeInstanceOf(GetThread);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.getThread).toBeCalledWith(useCasePayload.threadId);
  });
});

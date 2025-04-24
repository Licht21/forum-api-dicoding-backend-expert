const AddComment = require('../AddComment');

describe('AddComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      ownerId: 'user-123',
      ownerUsername: 'dicoding',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrow('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'comment content',
      ownerId: 123,
      ownerUsername: 'dicoding',
      threadId: 'thread-123',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrow('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'comment content',
      ownerId: 'user-123',
      ownerUsername: 'dicoding',
      threadId: 'threadId',
    };

    // Action
    const addComment = new AddComment(payload);

    // Assert
    expect(addComment.content).toEqual(payload.content);
    expect(addComment.ownerId).toEqual(payload.ownerId);
    expect(addComment.ownerUsername).toEqual(payload.ownerUsername);
    expect(addComment.threadId).toEqual(payload.threadId);
    expect(addComment).toBeInstanceOf(AddComment);
  });
});

const GetThread = require('../GetThread');

describe('GetThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'a thread',
    };

    // Action and Assert
    expect(() => new GetThread(payload)).toThrow('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'a thread',
      body: 'a thread body',
      date: '2021',
      username: 'dicoding',
      comments: 'a comment',
    };

    // Action and Assert
    expect(() => new GetThread(payload)).toThrow('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'a thread',
      body: 'a thread body',
      date: '2021',
      username: 'dicoding',
      comments: [],
    };

    // Action
    const getThread = new GetThread(payload);

    // Assert
    expect(getThread).toBeInstanceOf(GetThread);
    expect(getThread.id).toEqual(payload.id);
    expect(getThread.title).toEqual(payload.title);
    expect(getThread.body).toEqual(payload.body);
    expect(getThread.date).toEqual(payload.date);
    expect(getThread.username).toEqual(payload.username);
    expect(getThread.comments).toEqual(payload.comments);
  });
});

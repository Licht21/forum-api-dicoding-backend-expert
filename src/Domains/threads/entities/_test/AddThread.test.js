const AddThread = require('../AddThread');

describe('AddThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'thread title',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrow('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'thread title',
      body: 123,
      ownerId: 123,
      ownerUsername: 'aulia',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrow('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'thread title',
      body: 'thread body',
      ownerId: 'thread owner',
      ownerUsername: 'thread owner username',
    };

    // Action
    const addThread = new AddThread(payload);

    // Assert
    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
    expect(addThread.ownerId).toEqual(payload.ownerId);
    expect(addThread.ownerUsername).toEqual(payload.ownerUsername);
    expect(addThread).toBeInstanceOf(AddThread);
  });
});

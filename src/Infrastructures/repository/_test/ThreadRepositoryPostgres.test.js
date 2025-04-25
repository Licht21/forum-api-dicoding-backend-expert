const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const GetThread = require('../../../Domains/threads/entities/GetThread');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
        ownerId: 'user-123',
        ownerUsername: 'dicoding',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
        ownerId: 'user-123',
        ownerUsername: 'dicoding',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const thread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(thread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'thread title',
        owner: 'user-123',
      }));
    });
  });

  describe('isThreadExist function', () => {
    it('should not throw error when thread exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
        ownerId: 'user-123',
        ownerUsername: 'dicoding',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addThread(addThread);

      // Action and Assert
      await expect(threadRepositoryPostgres.isThreadExist('thread-123')).resolves.not.toThrow(NotFoundError);
    });

    it('should throw error when thread not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
        ownerId: 'user-123',
        ownerUsername: 'dicoding',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addThread(addThread);

      // Action and Assert
      await expect(threadRepositoryPostgres.isThreadExist('thread-1234')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getThread function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
        ownerId: 'user-123',
        ownerUsername: 'dicoding',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addThread(addThread);

      // Action and Assert
      await expect(threadRepositoryPostgres.isThreadExist('thread-1234')).rejects.toThrow(NotFoundError);
      await expect(threadRepositoryPostgres.getThread('thread-1234')).rejects.toThrow(NotFoundError);
    });

    it('should return thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
        ownerId: 'user-123',
        ownerUsername: 'dicoding',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // action
      const getThread = await threadRepositoryPostgres.getThread(addedThread.id);

      // Assert
      expect(getThread.id).toEqual('thread-123');
      expect(getThread.title).toEqual(addThread.title);
      expect(getThread.body).toEqual(addThread.body);
      expect(getThread.username).toEqual(addThread.ownerUsername);
    });
  });
});

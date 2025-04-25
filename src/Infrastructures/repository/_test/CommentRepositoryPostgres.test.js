/* eslint-disable max-len */
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange

      // Adding user so thread can be added

      await UsersTableTestHelper.addUser({});
      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
        ownerId: 'user-123',
        ownerUsername: 'dicoding',
      });

      // creating dependencies
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Adding thread so comment can be added to thread
      await threadRepositoryPostgres.addThread(addThread);

      const addComment = new AddComment({
        content: 'a content',
        ownerId: 'user-123',
        ownerUsername: 'dicoding',
        threadId: 'thread-123',
      });

      // Action
      const comment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      expect(comment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'a content',
        owner: 'user-123',
      }));
      await expect(commentRepositoryPostgres.findCommentById(comment.id)).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('findCommentById function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentId = 'dummy_id';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action and Assert
      await expect(commentRepositoryPostgres.findCommentById(commentId)).rejects.toThrow(NotFoundError);
    });

    it('should find comment action correctly', async () => {
      // Arrange

      // Adding user so thread can be added

      await UsersTableTestHelper.addUser({});
      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
        ownerId: 'user-123',
        ownerUsername: 'dicoding',
      });

      // creating dependencies
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Adding thread so comment can be added to thread
      await threadRepositoryPostgres.addThread(addThread);

      const addComment = new AddComment({
        content: 'a content',
        ownerId: 'user-123',
        ownerUsername: 'dicoding',
        threadId: 'thread-123',
      });

      const comment = await commentRepositoryPostgres.addComment(addComment);

      // Action
      await expect(commentRepositoryPostgres.findCommentById(comment.id)).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('deleteComment function', () => {
    it('should throw Authorization when ownerId not matches', async () => {
      // Arrange
      // Make sure to different this payload comment ownerId id to actual comment ownerId
      const payload = {
        commentId: 'comment-123',
        ownerId: 'user-1234',
      };
      // Adding user so thread can be added

      await UsersTableTestHelper.addUser({});
      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
        ownerId: 'user-123',
        ownerUsername: 'dicoding',
      });

      // creating dependencies
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Adding thread so comment can be added to thread
      await threadRepositoryPostgres.addThread(addThread);

      const addComment = new AddComment({
        content: 'a content',
        ownerId: 'user-123',
        ownerUsername: 'dicoding',
        threadId: 'thread-123',
      });

      await commentRepositoryPostgres.addComment(addComment);

      // Action and Assert
      await expect(commentRepositoryPostgres.deleteComment(payload)).rejects.toThrow(AuthorizationError);
    });

    it('should delete comment action correctly', async () => {
      // Arrange
      // Adding user so thread can be added

      await UsersTableTestHelper.addUser({});
      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
        ownerId: 'user-123',
        ownerUsername: 'dicoding',
      });

      // creating dependencies
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Adding thread so comment can be added to thread
      await threadRepositoryPostgres.addThread(addThread);

      const addComment = new AddComment({
        content: 'a content',
        ownerId: 'user-123',
        ownerUsername: 'dicoding',
        threadId: 'thread-123',
      });

      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Action and Assert
      const undeletedComment = await CommentsTableTestHelper.findCommentById(addedComment.id);
      expect(undeletedComment.is_delete).toEqual(false);
      await expect(commentRepositoryPostgres.deleteComment({
        ownerId: addedComment.owner,
        commentId: addedComment.id,
      })).resolves.not.toThrow(AuthorizationError);
      const deletedComment = await CommentsTableTestHelper.findCommentById(addedComment.id);
      expect(deletedComment.is_delete).toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments correctly', async () => {
      // Arrange
      // Adding user so thread can be added

      await UsersTableTestHelper.addUser({});
      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
        ownerId: 'user-123',
        ownerUsername: 'dicoding',
      });

      // creating dependencies
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Adding thread so comment can be added to thread
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Add comment to thread
      const addComment = new AddComment({
        content: 'a content',
        ownerId: 'user-123',
        ownerUsername: 'dicoding',
        threadId: 'thread-123',
      });

      await commentRepositoryPostgres.addComment(addComment);

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(addedThread.id);

      // Assert
      expect(comments.length).toEqual(1);
      expect(comments[0].id).toBeDefined();
      expect(comments[0].username).toBeDefined();
      expect(comments[0].date).toBeDefined();
      expect(comments[0].content).toBeDefined();
      expect(comments[0].content).toEqual(addComment.content);
      expect(comments[0].is_delete).toEqual(false);
    });

    it('should return comment with deleted content with **komentar telah dihapus**', async () => {
      // Arrange
      // Adding user so thread can be added

      await UsersTableTestHelper.addUser({});
      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
        ownerId: 'user-123',
        ownerUsername: 'dicoding',
      });

      // creating dependencies
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Adding thread so comment can be added to thread
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Add comment to thread
      const addComment = new AddComment({
        content: 'a content',
        ownerId: 'user-123',
        ownerUsername: 'dicoding',
        threadId: 'thread-123',
      });

      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Delete Comment
      commentRepositoryPostgres.deleteComment({
        ownerId: addedComment.owner,
        commentId: addedComment.id,
      });

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(addedThread.id);

      // Assert
      expect(comments.length).toEqual(1);
      expect(comments[0].id).toBeDefined();
      expect(comments[0].username).toBeDefined();
      expect(comments[0].date).toBeDefined();
      expect(comments[0].content).toBeDefined();
      expect(comments[0].is_delete).toEqual(true);
    });
  });
});

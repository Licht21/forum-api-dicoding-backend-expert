/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async cleanTable() {
    await pool.query('DELETE FROM comments');
  },

  async findCommentById(commentId) {
    const query = {
      text: 'select id, is_delete FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await pool.query(query);

    return result.rows[0];
  },
};

module.exports = CommentsTableTestHelper;

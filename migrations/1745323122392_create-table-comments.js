/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        date: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        owner_id: {
            type: 'VARCHAR(30)',
            notNull: true,
        },
        owner_username: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        thread_id: {
            type: 'VARCHAR(30)',
            notNull: true,
            references: 'threads',
            onDelete: 'CASCADE'
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('comments')
};

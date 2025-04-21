/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('threads', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        title: {
            type: 'VARCHAR(100)',
            notNull: true
        },
        body: {
            type: 'TEXT',
            notNull: true
        },
        date: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        owner_id: {
            type: 'VARCHAR(30)',
            notNull: true,
            references: 'users',
            onDelete: 'CASCADE'
        },
        owner_username: {
            type: 'VARCHAR(50)',
            notNull: true,
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('threads')
};

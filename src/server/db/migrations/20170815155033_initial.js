
exports.up = function (knex, Promise) {
  console.log('migration latest invoked');
  return Promise.all([
    knex.schema.createTable('folders', (table) => {
      table.increments('id').primary();
      table.string('name').unique();
      table.string('description');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('links', (table) => {
      table.increments('id').primary();
      table.integer('folder_id').unsigned();
      table.foreign('folder_id').references('folders.id');
      table.string('url');
      table.string('short_url');
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = function (knex, Promise) {
  console.log('migration rollback invoked');
  return Promise.all([
    knex.schema.dropTable('links'),
    knex.schema.dropTable('folders'),
  ]);
};

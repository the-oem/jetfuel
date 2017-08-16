
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('folders', (table) => {
      table.increments('id').primary();
      table.string('name');
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
  return Promise.all([
    knex.schema.dropTable('links'),
    knex.schema.dropTable('folders'),
  ]);
};

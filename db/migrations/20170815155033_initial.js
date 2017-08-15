
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('folder', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('description');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('link', (table) => {
      table.increments('id').primary();
      table.integer('folder_id').unsigned();
      table.foreign('folder_id').references('folder.id');
      table.string('url');
      table.string('short_url');
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('folder'),
    knex.schema.dropTable('link'),
  ]);
};

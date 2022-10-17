exports.up = knex => knex.schema.createTable('dishes', table => {
  table.increments('id');
  table.text('title');
  table.text('description');
  table.text('price');
  table.text('img');
}) 

exports.down = knex => knex.schema.dropTable('dishes')
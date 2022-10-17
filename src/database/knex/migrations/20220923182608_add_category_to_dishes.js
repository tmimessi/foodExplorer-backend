exports.up = function(knex) {
  return knex.schema.table('dishes', table => {
    table.text('category');
  })
};

exports.down = function(knex) {
  return knex.schema.table('dishes', table => {
    table.dropColumn('category');
  })
};
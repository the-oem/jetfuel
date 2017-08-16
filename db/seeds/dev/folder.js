exports.seed = function (knex, Promise) {
  return knex('links').del()
    .then(() => knex('folders').del())
    .then(() => {
      return Promise.all([
        knex('folders').insert({
          name: 'Recipes',
          description: 'My favorite recipes',
        }, 'id')
        .then((folder) => {
          return knex('links').insert([
            { folder_id: folder[0], url: 'http://www.recipe.com', short_url: 'http://www.jetfuel.com/asdf' },
            { folder_id: folder[0], url: 'http://www.bestrecipes.com', short_url: 'http://www.jetfuel.com/qwerty' },
          ]);
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`)),
      ]);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};

// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/jetfuel',
    migrations: {
      directory: __dirname + '/server/db/migrations',
    },
    seeds: {
      directory: __dirname + '/server/db/seeds/dev',
    },
    useNullAsDefault: true,
  },
  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/jetfueltest',
    useNullAsDefault: true,
    migrations: {
      directory: __dirname + '/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/server/db/seeds/test'
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + `?ssl=true`,
    migrations: {
      directory: __dirname + '/server/db/migrations'
    },
    useNullAsDefault: true
  }
};

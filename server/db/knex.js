// const environment = process.env.NODE_ENV;
// const config = require('../../../knexfile.js')[environment];


const environment = process.env.NODE_ENV || 'development';
// console.log('env', process.env.NODE_ENV);
const configuration = require('../../knexfile')[environment];
const knex = require('knex')(configuration);
// console.log(knex.client.);
// module.exports = require('knex')(configuration);
module.exports = knex;

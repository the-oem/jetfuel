const environment = process.env.NODE_ENV || 'development';
const express = require('express');
const bodyParser = require('body-parser');
const configuration = require('./knexfile')[environment];
const app = express();
const path = require('path');
const database = require('knex')(configuration);

app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Jet Fuel';

app.use(bodyParser.json());

app.get('/', (request, response) => {
  response.status(200).sendFile(path.join(__dirname, 'public/index.html'))
});

app.get('/api/v1/folders', () => {

})

app.use(function (req, res, next) {
  res.status(404).sendFile(path.join(__dirname, 'public/404.html'))
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on port ${app.get('port')}`);
})

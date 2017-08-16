const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

// DATABASE CONFIGURATION
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());

app.locals.title = 'Jet Fuel';

app.get('/', (request, response) => {
  response.status(200).sendFile(path.join(__dirname, 'public/index.html'))
});

app.get('/api/v1/folders', (request, response) => {
  database('folders').select()
    .then((folders) => response.status(200).json(folders))
    .catch((error) => response.status(500).json({ error }))
})

app.post('/api/v1/folders', (request, response) => {
  const { name, description } = request.body;

  if (!name) {
    return response.status(422).send({ error: `Expected format: { name: <String> (required), description: <String> (optional) }. You're missing a required property.` });
  }

  database('folders').insert(request.body, '*')
    .then(folder => response.status(201).json({
      status: 'success',
      message: 'New folder created',
      id: folder[0],
    }))
    .catch(error => response.status(500).json({ error }));
})

app.use(function (req, res, next) {
  res.status(404).sendFile(path.join(__dirname, 'public/404.html'))
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on port ${app.get('port')}`);
})

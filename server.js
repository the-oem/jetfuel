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

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public/index.html'))
});

app.get('/api/v1/folders', (req, res) => {
  database('folders').select().orderByRaw('UPPER(name) ASC NULLS LAST')
    .then((folders) => res.status(200).json(folders))
    .catch((error) => res.status(500).json({ error }))
})

app.post('/api/v1/folders', (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(422).send({ error: `Missing required parameter of 'name'` });
  }

  database('folders').insert(req.body, '*')
    .then(folder => res.status(201).json({
      status: 'success',
      message: 'New folder created',
      id: folder[0],
    }))
    .catch(error => res.status(500).json({ error }));
})

app.get('/api/v1/folders/:folder_id/links', (req, res) => {
  database('links').where('folder_id', req.params.folder_id).select()
    .then(links => links.length ? res.status(200).json(links) : res.status(404).json({ error: `No links have been added to this folder yet.` }))
    .catch(error => res.status(500).json({ error }));
})

app.get('/api/v1/links', (req, res) => {
  database('links').select().orderBy('id', 'DESC')
    .then((links) => res.status(200).json(links))
    .catch((error) => res.status(500).json({ error }))
})

app.post('/api/v1/links', (req, res) => {
  const newLink = req.body;
  console.log(req.body);
  for (let requiredParameter of ['url', 'short_url', 'folder_id']) {
    if (!newLink[requiredParameter]) {
      return res.status(422).json({ error: `Missing required parameter of ${requiredParameter}` })
    }
  }

  database('links').insert(req.body, '*')
    .then(link => res.status(201).json({
      status: 'success',
      message: 'New link created',
      id: link[0],
    }))
    .catch(error => res.status(500).json({ error }));
})

app.use(function (req, res, next) {
  res.status(404).sendFile(path.join(__dirname, 'public/404.html'))
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on port ${app.get('port')}`);
})

module.exports = app;

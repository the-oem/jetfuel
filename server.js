const express = require('express');
const bodyParser = require('body-parser');
const knex = require('./src/server/db/knex');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());

app.locals.title = 'Jet Fuel';

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public/index.html'))
});

app.get('/api/v1/folders', (req, res) => {
  knex('folders').select().orderByRaw('UPPER(name) ASC NULLS LAST')
    .then((folders) => res.status(200).json({
      status: 'success',
      data: folders
    }))
    .catch((error) => res.status(500).json({
      status: 'error',
      data: error
    }))
})

app.post('/api/v1/folders', (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(422).send({ error: `Missing required parameter of 'name'` });
  }

  knex('folders').insert(req.body, '*')
    .then(folder => res.status(201).json({
      status: 'success',
      message: 'New folder successfully created.',
      data: folder[0],
    }))
    .catch(error => res.status(500).json({
      status: 'error',
      data: error
    }));
})

app.get('/api/v1/folders/:id', (req, res) => {
  knex('folders').where('id', req.params.id).select()
  .then(folder => folder.length ? res.status(200).json({
    status: 'success',
    data: folder
  }) : res.status(404).json({
    error: `That folder does not exist.`
  }))
  .catch(error => res.status(500).json({
    status: 'error',
    data: error
  }));
})

app.get('/api/v1/folders/:folder_id/links', (req, res) => {
  knex('links').where('folder_id', req.params.folder_id).select().orderBy('id', 'DESC')
    .then(links => links.length ? res.status(200).json({
      status: 'success',
      data: links
    }) : res.status(404).json({
      error: `No links have been added to this folder yet.`
    }))
    .catch(error => res.status(500).json({
      status: 'error',
      data: error
    }));
})

app.get('/api/v1/links', (req, res) => {
  knex('links').select().orderBy('id', 'DESC')
    .then((links) => res.status(200).json({
      status: 'success',
      data: links
    }))
    .catch((error) => res.status(500).json({
      status: 'error',
      data: error
    }))
})

app.post('/api/v1/links', (req, res) => {
  const newLink = req.body;
  for (let requiredParameter of ['url', 'short_url', 'folder_id']) {
    if (!newLink[requiredParameter]) {
      return res.status(422).json({
        error: `Missing required parameter of ${requiredParameter}`
      })
    }
  }

  knex('links').insert(req.body, '*')
    .then(link => res.status(201).json({
      status: 'success',
      message: 'New link successfully created.',
      data: link[0],
    }))
    .catch(error => res.status(500).json({
      status: 'error',
      data: error
    }));
})

app.get('/:short_url', (req, res) => {
  knex('links').where('short_url', req.params.short_url).select('url')
  .then(link => link.length
    ? res.redirect(link[0].url)
    : res.status(404).json({
    error: `The short url '${req.params.short_url}' does not exist.`
  }))
  .catch(error => res.status(500).json({
    status: 'error',
    data: error
  }));
})

app.use(function (req, res, next) {
  res.status(404).sendFile(path.join(__dirname, 'public/404.html'))
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on port ${app.get('port')}`);
})

module.exports = app;

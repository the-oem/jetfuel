// Lines 1 - 4 are pulling in the required libraries
const express = require('express');
const bodyParser = require('body-parser');
const knex = require('./src/server/db/knex');
const path = require('path');

// Line 6 is setting up the Express app
const app = express();

// Line 10 is defining where the server should look for static assets (images/css/etc)
app.use(express.static(path.join(__dirname, 'public')));

// Line 15 is defining what port the server should run on. It is first looking
// for the PORT environment var, and if not found it will fall back to port 3000
app.set('port', process.env.PORT || 3000);

// Line 19 is setting up bodyParser as a middleware, meaning every request hitting
// the server will be run through that module and parsed into JSON data
app.use(bodyParser.json());

// Line 20 is setting the server title in app.locals
app.locals.title = 'Jet Fuel';

// Line 26 is serving the request for '/', which is the homepage.
// It will send public/index.html to the user, with a status of 200 (ok).
app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public/index.html'));
});

// Line 32 is handling the GET requests for 'getting all folders'. It is doing a raw ORDER BY on name (all uppercase),
// and returning either a 200 (ok) with data or a 500 (error).
app.get('/api/v1/folders', (req, res) => {
  knex('folders').select().orderByRaw('UPPER(name) ASC NULLS LAST')
    .then(folders => res.status(200).json({
      status: 'success',
      data: folders
    }))
    .catch(error => res.status(500).json({
      status: 'error',
      data: error
    }));
});

// Line 49 is handling POST requests for adding a new folder. It checks to see if the name was sent
// in the body of the request, and if not will return a 422 status and an error message. If the 'name'
// is present, it will perform an INSERT using the entire request body as the data payload, and it
// will return a 201 (created) status along with the newly created folder. If an error occurs, it will
// send a 500 status with an error message.
app.post('/api/v1/folders', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(422).send({ error: 'Missing required parameter of \'name\'' });
  }

  knex('folders').insert(req.body, '*')
    .then(folder => res.status(201).json({
      status: 'success',
      message: 'New folder successfully created.',
      data: folder[0]
    }))
    .catch(error => res.status(500).json({
      status: 'error',
      data: error
    }));
});

// Line 71 is handling GET requests for a folder with a specific ID (passed in the url as a dynamic routing param).
// If the folder exists, it will return a 200 along with the folder data. If the folder does not exist, it will
// return a 404 along with an error message. If an error occurs, it will send a 500 status with an error message.
app.get('/api/v1/folders/:id', (req, res) => {
  knex('folders').where('id', req.params.id).select()
    .then(folder => (folder.length ? res.status(200).json({
      status: 'success',
      data: folder
    }) : res.status(404).json({
      error: 'That folder does not exist.'
    })))
    .catch(error => res.status(500).json({
      status: 'error',
      data: error
    }));
});

// Line 89 is handling GET requests for all links for a specific folder, with the folder ID passed as a param in
// the url (dynamic routing). If records are found in the DB, they will be returned along with a 200 status.
// If no link records are found for that particular folder, a 404 will be returned with an appropriate message.
// If an error occurs, a 500 will be returned along with an error message.
app.get('/api/v1/folders/:folder_id/links', (req, res) => {
  knex('links').where('folder_id', req.params.folder_id).select().orderBy('id', 'ASC')
    .then(links => (links.length ? res.status(200).json({
      status: 'success',
      data: links
    }) : res.status(404).json({
      error: 'No links have been added to this folder yet.'
    })))
    .catch(error => res.status(500).json({
      status: 'error',
      data: error
    }));
});

// Line 106 is handling GET requests for all links (not currently used in the app, but will be useful for search, potentially).
// If link records are found in the DB, a 200 will be returned along with all the link records. If an error occurs,
// a 500 will be returned along with an error message.
app.get('/api/v1/links', (req, res) => {
  knex('links').select().orderBy('id', 'DESC')
    .then(links => res.status(200).json({
      status: 'success',
      data: links
    }))
    .catch(error => res.status(500).json({
      status: 'error',
      data: error
    }));
});

// Line 122 is handling POST requests to create new links. First it will loop through the required parameters checking for
// the existence of them in the request.body. If any are not found, a 422 status will be sent back along with an error
// message specifying which required parameter is missing. If the INSERT is successful, the new link will be returned
// to the user. If an error occurs, a 500 status will be sent along with an error message.
app.post('/api/v1/links', (req, res) => {
  const newLink = req.body;
  for (const requiredParameter of ['url', 'short_url', 'folder_id']) {
    if (!newLink[requiredParameter]) {
      return res.status(422).json({
        error: `Missing required parameter of ${requiredParameter}`
      });
    }
  }

  knex('links').insert(req.body, '*')
    .then(link => res.status(201).json({
      status: 'success',
      message: 'New link successfully created.',
      data: link[0]
    }))
    .catch(error => res.status(500).json({
      status: 'error',
      data: error
    }));
});

// Line 148 is hanlding GET requests for shortened URL's using dynamic routing. Anything after the / is
// considered the shortened URL. That specific URL will be queried for in the DB, and if found then a
// redirect will occur to the full url for that record. If no data is found, a 404 and appropriate
// message is returned to the user. If an error occurs, a 500 status and an appropriate error message will be returned.
app.get('/:short_url', (req, res) => {
  knex('links').where('short_url', req.params.short_url).select('url')
    .then(link => (link.length
      ? res.redirect(link[0].url)
      : res.status(404).json({
        error: `The short url '${req.params.short_url}' does not exist.`
      })))
    .catch(error => res.status(500).json({
      status: 'error',
      data: error
    }));
});

// Line 163 is handling anything to this point that hasn't been picked up by any of the other routes.
// This is essentially the catch all, where a 404 is returned because it is the last route in the file.
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public/404.html'));
});

// Line 168 is setting the server to listen on the port previously set earlier in the file, and logging to
// the console the title of the app and the port number being listened on.
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on port ${app.get('port')}`);
});

// Line 174 is exporting this entire module so that it can be used elsewhere, such as in the test files.
module.exports = app;

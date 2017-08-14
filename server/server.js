const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'app')));

app.get('/', (request, response) => {
  // We don't need to explicitly use this handler or send a response
  // because Express is using the default path of the static assets
  // to serve this content
  response.status(200).send('hello world');
});

app.use(function (req, res, next) {
  res.status(404).sendFile(path.join(__dirname, 'public/404.html'))
})

app.listen(3000, () => {
  console.log('Jet Fuel running on localhost:3000');
});

const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (request, response) => {

  response.status(200).sendFile(path.join(__dirname, 'public/index.html'))
});

app.use(function (req, res, next) {
  res.status(404).sendFile(path.join(__dirname, 'public/404.html'))
})

app.listen(3000, () => {
  console.log('Jet Fuel running on localhost:3000');
});

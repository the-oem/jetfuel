## Jet Fuel : A Turing M4 Project.
This project is essentially a clone of bit.ly. Users are able to create folders, add shortened links to folders, sort groups of links within folders by create date, and click on links to go to their destination URL.

## Motivation
This project is part of the Turing curriculum. This was a solo project and the requirements can be found [here](http://frontend.turing.io/projects/jet-fuel.html).

## Build status

[![CircleCI](https://circleci.com/gh/the-oem/jetfuel/tree/master.svg?style=svg)](https://circleci.com/gh/the-oem/jetfuel/tree/master)

## Tech/framework used

<b>Built with</b>
- [jQuery](https://jquery.com/)
- [NodeJS](https://nodejs.org/en/)
- [ExpressJS](https://expressjs.com/)
- [Mocha](https://mochajs.org/)
- [Chai](http://chaijs.com/)

## Features
This is a pretty straight-forward implementation of a URL shortening service, built as part of the curriculum at Turing.
* Create folders to store links
* Create links that are shortened
* Sort links within folders by date created (ASC or DESC)
* Click links and be taken to the full URL

## Installation
`npm install` to install all the dependencies needed for the project.

`npm start` to start the backend server.

Browse to `http://localhost:3000` to run the client.

## API Reference
All data will be returned in the following format:
```
GET requests:
[
  {
    status: 'status message',
    data: [array of data]
  }
]

POST requests:
[
  {
    status: 'status',
    message: 'friendly message',
    data: [array of data with object just created]
  }
]
```
`GET /api/v1/folders` returns all folders.

`POST /api/v1/folders` to create a folder.

`GET /api/v1/folders/:id` returns a folder with a specific ID.

`GET /api/v1/folders/:folder_id/links` returns all links for a specified folder.

`GET /api/v1/links` returns all links for all folders.

`POST /api/v1/links` to create a link.

## Tests
Tests are written using Mocha, Chai, and Chai-Http.

`npm test` to run all tests.

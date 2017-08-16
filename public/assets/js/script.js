'use strict';

var $addFolderBtn = $('.btn-add-folder');
var $folderFormContainer = $('.add-folder-container');
var $folderForm = $('.add-folder-form')

const pageSetup = () => {
  getFolders()
    .then((folders) => {
      for (let i = 0; i < folders.length; i++) {
        updateDomFolders($('.folder-container'), folders[i])
      }
    })
}

// Document setup
$(document).ready(pageSetup);

// Constructors
class Folder {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }
}

class Link {
  constructor(url) {
    this.url = url;
    this.shortUrl = url; // TODO add function to build out a unique short URL
  }
}

const show = () => {
  console.log('hide or show form');
}

const addFolder = () => {
  event.preventDefault();
  const newFolder = new Folder($('#inputFolderName').val(), $('#inputFolderDesc').val());

  fetch("/api/v1/folders", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newFolder),
  })
  .then(response => response.json())
  .then(response => updateDomFolders($('.folder-container'), response.id))
  .catch(error => error);
}

const updateDomFolders = (parent, item) => {
  parent.prepend(`
    <div class="folder">Folder name: ${item.name}, folder description: ${item.description}</div>
  `);
}

const getFolders = () => {
  return fetch("/api/v1/folders")
  .then(response => response.json())
  .catch(error => error);
}

$addFolderBtn.on('click', show);
$folderForm.on('submit', addFolder)

'use strict';

var $addFolderBtn = $('.btn-add-folder');
var $addLinkBtn = $('.btn-add-link');
var $addFolderContainer = $('.add-folder-container');
var $addLinkContainer = $('.add-link-container');
var $folderForm = $('.add-folder-form');
var $linkForm = $('.add-link-form');
let folderArray = [];

let addFolderVisible = false;
let addLinkVisible = false;

const pageSetup = () => {
  apiGetFolders()
    .then(folders => folderArray = folders)
    .then(folders => loadFolders(folderArray))
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
  constructor(url, folderId) {
    this.url = url;
    this.short_url = url; // TODO add function to build out a unique short URL
    this.folder_id = folderId
  }
}

const loadFolders = (folders) => {
  const sortedFolders = sortFolders(folders);
  buildFoldersInputSelect(sortedFolders);
  loadFoldersInDom(sortedFolders);
}

const sortFolders = (folders) => {
  return folders.sort((a, b) => {
    return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0);
  })
}

const buildFoldersInputSelect = (folders) => {
  var $selectInput = $('#inputLinkFolder').empty().html(' ');
  $selectInput.append($(`<option value="">--- Select Parent Folder ---</option>`))
  for (let i = 0; i < folders.length; i++) {
    $selectInput.append($(`<option value="${folders[i].id}">${folders[i].name}</option>`))
  }
}

const loadFoldersInDom = (folders) => {
  $('.folder-container').empty();
  for (let i = 0; i < folders.length; i++) {
    $('.folder-container').append(`<div class="folder">Folder name: ${folders[i].name}, folder description: ${folders[i].description}</div>`)
  }
}

const addLink = () => {
  event.preventDefault();
  const newLink = new Link($('.input-link-url').val(), $('.input-link-folder').val());
  apiAddLink(newLink);
  $linkForm[0].reset();
}

const addFolder = () => {
  event.preventDefault();
  const newFolder = new Folder($('#inputFolderName').val(), $('#inputFolderDesc').val());
  apiAddFolder(newFolder);
  $folderForm[0].reset();
}

const apiAddFolder = (folder) => {
  fetch("/api/v1/folders", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(folder),
  })
  .then(response => response.json())
  .then(response => {
    folderArray.push(response.id);
    loadFolders(folderArray);
  })
  .catch(error => console.log(error));
}

const apiAddLink = (link) => {
  // TODO Add link stuff here
  fetch("/api/v1/links", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(link),
  })
  .then(response => response.json())
  .catch(error => console.log(error));
}

const apiGetFolders = () => {
  return fetch("/api/v1/folders")
  .then(response => response.json())
  .catch(error => error);
}

const apiGetFolderLinks = (folderId) => {

}

$addFolderBtn.on('click', () => {
  if (!addFolderVisible) {
    addLinkVisible = false;
    $addLinkContainer.toggle(false);
    addFolderVisible = true;
    $addFolderContainer.toggle(300);
  } else {
    addFolderVisible = false;
    $addFolderContainer.toggle(300);
  }
});
$addLinkBtn.on('click', () => {
  if (!addLinkVisible) {
    addFolderVisible = false;
    $addFolderContainer.toggle(false);
    addLinkVisible = true;
    $addLinkContainer.toggle(300);
  } else {
    addLinkVisible = false;
    $addLinkContainer.toggle(300);
  }
});
$folderForm.on('submit', addFolder);
$linkForm.on('submit', addLink);

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
    .then(response => folderArray = response.data)
    .then(response => loadFolders(folderArray))
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
  $selectInput.append($(`<option value="">Select Folder</option>`))
  for (let i = 0; i < folders.length; i++) {
    $selectInput.append($(`<option value="${folders[i].id}">${folders[i].name}</option>`))
  }
}

const addFolderInDom = (folder) => {
  $('.folder-container').append(`
    <div class="folder" id="${folder.id}">
      <span class="folder-name">${folder.name}</span>
      <span class="folder-description">${folder.description}</span>
      <div class="folder-links" id="folderLinks"></div>
    </div>
  `)
}

const addLinkInDom = (folderId, link) => {
  $(`#${folderId}`).find('.folder-links').append(`
    <div class="link">
      <a href="${link.short_url}">${link.url}</a>
    </div>
  `)
}

const loadFoldersInDom = (folders) => {
  $('.folder-container').empty();
  for (let i = 0; i < folders.length; i++) {
    addFolderInDom(folders[i]);
  }
}

const loadLinksInDom = (folderId, links) => {
  console.log(folderId, links);
  $(`#${folderId}`).find('.folder-links').empty();
  if (links) {
    for (let i = 0; i < links.length; i++) {
      addLinkInDom(folderId, links[i]);
    }
  } else {
    $(`#${folderId}`).find('.folder-links').append(`
      <div class="link">
        No saved links in this folder.
      </div>
    `)
  }
  // $(`#${folderId}`).find('.folder-links').toggle();
}

const addLink = () => {
  event.preventDefault();
  const newLink = new Link(
    $('#inputLinkUrl').val(),
    $('#inputLinkFolder').val()
  );
  apiAddLink(newLink);
  $linkForm[0].reset();
}

const addFolder = () => {
  event.preventDefault();
  const newFolder = new Folder(
    $('#inputFolderName').val(),
    $('#inputFolderDesc').val()
  );
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
    folderArray.push(response.data);
    // addFolderInDom(response.data);
    loadFolders(folderArray);
  })
  .catch(error => console.log(error));
}

const apiAddLink = (link) => {
  fetch("/api/v1/links", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(link),
  })
  .then(response => response.json())
  .then(response => addLinkInDom(response.data.folder_id, response.data))
  .catch(error => console.log(error));
}

const apiGetFolders = () => {
  return fetch("/api/v1/folders")
  .then(response => response.json())
  .catch(error => console.log(error));
}

const apiGetFolderLinks = (folderId) => {
  return fetch(`/api/v1/folders/${folderId}/links`)
    .then(response => response.json())
    .catch(error => console.log(error));
}

const toggleLinks = () => {
  const currentFolder = $(event.target).parent();
  const folderId = currentFolder.attr('id');
  if(currentFolder.find('.folder-links').css('display') === 'none') {
    apiGetFolderLinks(folderId)
      .then(response => loadLinksInDom(folderId, response.data))
    currentFolder.find('.folder-links').fadeIn(1000);
  } else {
    currentFolder.find('.folder-links').hide();
  }
}

$addFolderBtn.on('click', () => {
  if (!addFolderVisible) {
    addLinkVisible = false;
    $addLinkContainer.toggle(false);
    addFolderVisible = true;
    $addFolderContainer.fadeIn(500);
  }
  // else {
  //   addFolderVisible = false;
  //   $addFolderContainer.fadeOut(500);
  // }
});
$addLinkBtn.on('click', () => {
  if (!addLinkVisible) {
    addFolderVisible = false;
    $addFolderContainer.toggle(false);
    addLinkVisible = true;
    $addLinkContainer.fadeIn(300);
  }
  // else {
  //   addLinkVisible = false;
  //   $addLinkContainer.fadeOut(300);
  // }
});
$folderForm.on('submit', addFolder);
$linkForm.on('submit', addLink);
$('.folder-container').on('click', '.folder-name', toggleLinks);

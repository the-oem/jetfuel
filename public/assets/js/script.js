/* global $ */
/* global moment */
/* global fetch */

const $addFolderBtn = $('.btn-add-folder');
const $addLinkBtn = $('.btn-add-link');
const $addFolderContainer = $('.add-folder-container');
const $addLinkContainer = $('.add-link-container');
const $folderForm = $('.add-folder-form');
const $linkForm = $('.add-link-form');

const errorMessageContainers = ['folderNameErrorMessage', 'urlErrorMessage', 'urlFolderErrorMessage'];
const urlChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
let folderArray = [];

let addFolderVisible = false;
let addLinkVisible = false;

const pageSetup = () => {
  apiGetFolders()
    .then(response => updateFolderArray(response.data))
    .then(response => loadFolders(folderArray));
};

// Document setup
$(document).ready(pageSetup);

// Constructors
class Folder {
  constructor (name, description) {
    this.name = name;
    this.description = description;
  }
}

class Link {
  constructor (url, folderId) {
    this.url = url;
    this.short_url = generateShortUrl();
    this.folder_id = folderId;
  }
}

const updateFolderArray = (data) => {
  folderArray = data;
};

const loadFolders = (folders) => {
  const sortedFolders = sortFolders(folders);
  buildFoldersInputSelect(sortedFolders);
  loadFoldersInDom(sortedFolders);
};

const sortFolders = folders => folders.sort((a, b) => ((a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0)));

const sortLinks = (event) => {
  const sortedDivs = $(event.target).parent().find('.link').sort(function (a, b) {
    return $(event.target).attr('id') === 'btn-sort-desc'
      ? $(b).attr('id') > $(a).attr('id')
      : $(a).attr('id') > $(b).attr('id');
  });
  $(event.target).parent().find('#folderLinksContainer').empty().append(sortedDivs);
};

const buildFoldersInputSelect = (folders) => {
  const $selectInput = $('#inputLinkFolder').empty().html(' ');
  $selectInput.append($('<option value="">Select Folder</option>'));
  for (let i = 0; i < folders.length; i++) {
    $selectInput.append($(`<option value="${folders[i].id}">${folders[i].name}</option>`));
  }
};

const addFolderInDom = (folder) => {
  $('.folder-container').prepend(`
    <div class="folder" id="${folder.id}">
      <span class="folder-name">${folder.name}</span>
      <span class="folder-description">${folder.description}</span>
      <div class="folder-links" id="folderLinks">
        <button id="btn-sort-desc"></button><button id="btn-sort-asc"></button>
        <div class="folder-links-container" id="folderLinksContainer"></div>
      </div>
    </div>
  `);
};

const addLinkInDom = (folderId, link) => {
  const dateAdded = moment(link.created_at).format('MM/DD/YYYY');
  $(`#${folderId}`).find('.folder-links-container').prepend(`
    <div class="link" id="${link.id}">
      <a href="${link.short_url}">http://www.fuelthejets.com/${link.short_url}</a><span>${dateAdded}</span>
    </div>
  `);
};

const loadFoldersInDom = (folders) => {
  $('.folder-container').empty();
  for (let i = 0; i < folders.length; i++) {
    addFolderInDom(folders[i]);
  }
};

const loadLinksInDom = (folderId, links) => {
  $(`#${folderId}`).find('.folder-links-container').empty();

  if (links) {
    for (let i = 0; i < links.length; i++) {
      addLinkInDom(folderId, links[i]);
    }
  } else {
    $(`#${folderId}`).find('.folder-links-container').append(`
      <div class="link">
        No saved links in this folder.
      </div>
    `);
  }
};

const addErrorMessage = (errorMessage, location) => {
  $(location).text(errorMessage);
};

const clearErrorMessages = () => {
  for (let i = 0; i < errorMessageContainers.length; i++) {
    $(`#${errorMessageContainers[i]}`).text('');
  }
};

const checkUrl = url => url.search(/(^|\s)((https?:\/\/){1}[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/i) !== -1;

const generateShortUrl = () => {
  let result = '';
  for (let i = 6; i > 0; --i) {
    result += urlChars[Math.floor(Math.random() * urlChars.length)];
  }
  return result;
};

const addLink = (event) => {
  event.preventDefault();
  const newLink = new Link($('#inputLinkUrl').val(), $('#inputLinkFolder').val());
  if (!checkUrl($('#inputLinkUrl').val())) return addErrorMessage('Must enter a valid URL (including http/https).', '#urlErrorMessage');
  if ($('#inputLinkFolder').val() === '') return addErrorMessage('A folder must be selected.', '#urlFolderErrorMessage');
  apiAddLink(newLink);
  $linkForm[0].reset();
  clearErrorMessages();
};

const addFolder = (event) => {
  event.preventDefault();
  const newFolder = new Folder($('#inputFolderName').val(), $('#inputFolderDesc').val());
  const exists = folderArray.find(folder => folder.name.toUpperCase() === $('#inputFolderName').val().toUpperCase());
  if (exists) return addErrorMessage('A folder with that name already exists.', '#folderNameErrorMessage');
  apiAddFolder(newFolder);
  $folderForm[0].reset();
  clearErrorMessages();
};

const apiAddFolder = (folder) => {
  fetch('/api/v1/folders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(folder)
  })
    .then(response => response.json())
    .then((response) => {
      folderArray.push(response.data);
      loadFolders(folderArray);
    })
    .catch(error => console.log(error));
};

const apiAddLink = (link) => {
  fetch('/api/v1/links', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(link)
  })
    .then(response => response.json())
    .then(response => addLinkInDom(response.data.folder_id, response.data))
    .catch(error => console.log(error));
};

const apiGetFolders = () => fetch('/api/v1/folders')
  .then(response => response.json())
  .catch(error => console.log(error));

const apiGetFolderLinks = folderId => fetch(`/api/v1/folders/${folderId}/links`)
  .then(response => response.json())
  .catch(error => console.log(error));

const toggleLinks = (event) => {
  const currentFolder = $(event.target).parent();
  const folderId = currentFolder.attr('id');
  if (currentFolder.find('.folder-links').css('display') === 'none') {
    apiGetFolderLinks(folderId)
      .then(response => loadLinksInDom(folderId, response.data));
    currentFolder.find('.folder-links').animate({
      height: 'toggle'
    }).fadeIn(2000);
  } else {
    currentFolder.find('.folder-links').animate({
      height: 'toggle'
    }).fadeOut(2000);
  }
};

$addFolderBtn.on('click', () => {
  if (!addFolderVisible) {
    addLinkVisible = false;
    $addLinkContainer.toggle(false);
    addFolderVisible = true;
    $addFolderContainer.fadeIn(500);
  }
});
$addLinkBtn.on('click', () => {
  if (!addLinkVisible) {
    addFolderVisible = false;
    $addFolderContainer.toggle(false);
    addLinkVisible = true;
    $addLinkContainer.fadeIn(300);
  }
});
$folderForm.on('submit', addFolder);
$linkForm.on('submit', addLink);
$('.folder-container').on('click', '.folder-name', toggleLinks);
$('.folder-container').on('click', '#btn-sort-asc', sortLinks);
$('.folder-container').on('click', '#btn-sort-desc', sortLinks);

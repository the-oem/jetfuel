// Document setup
$(document).ready(pageSetup);

var $addFolderBtn = $('.btn-add-folder');
var $folderForm = $('.add-folder-container');

$addFolderBtn.on('click', show);

function pageSetup() {
  console.log('here');
  console.log($folderForm);
  // folderForm.style.display = 'none';
  // launchContainer.style.display = 'none';
}

// Constructors

function Folder(title, description) {
	this.title = title;
	this.description = description;
}

function Bookmark(url) {
  this.fullURL = url;
  this.shortURL = ''; // TODO add function to build out a unique short URL
}


function show() {
  console.log($folderForm);

}

const fs = require("fs");
const sqlite3 = require("sqlite3");
const glob = require("glob");
const os = require("os");
const { open } = require("sqlite");
var Scraper = require('images-scraper');
const google = require('googlethis');
var gis = require('g-i-s');
const requireText = require('require-text');



const username = os.userInfo().username;
const ANNOTATION_DB_PATH = `/users/${username}/Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation/`;
const BOOK_DB_PATH = `/users/${username}/Library/Containers/com.apple.iBooksX/Data/Documents/BKLibrary/`;
const annotationsFiles = glob.sync(`${ANNOTATION_DB_PATH}/*.sqlite`);
const booksFiles = glob.sync(`${BOOK_DB_PATH}/*.sqlite`);

const APPLE_EPOCH_START = new Date("2001-01-01").getTime();

const SELECT_ALL_ANNOTATIONS_QUERY = `
select 
  ZANNOTATIONASSETID as assetId,
  ZANNOTATIONSELECTEDTEXT as quote,
  ZANNOTATIONNOTE as comment,
  ZFUTUREPROOFING5 as chapter,
  ZANNOTATIONSTYLE as colorCode,
  ZANNOTATIONMODIFICATIONDATE as modifiedAt,
  ZANNOTATIONCREATIONDATE as createdAt
from ZAEANNOTATION
where ZANNOTATIONDELETED = 0 
  and ZANNOTATIONSELECTEDTEXT is not null 
  and ZANNOTATIONSELECTEDTEXT <> ''
order by ZANNOTATIONASSETID, ZPLLOCATIONRANGESTART;`;
const SELECT_ALL_BOOKS_QUERY = `select ZASSETID as id, ZTITLE as title, ZAUTHOR as author from ZBKLIBRARYASSET`;

function convertAppleTime(appleTime) {
  return new Date(APPLE_EPOCH_START + appleTime * 1000).getTime();
}

function returnResults(error, results) {
  if (error) {
    console.log(error);
  }
  else {
    if(results.length > 1) {
      return results[0].url
    }
    //console.log(JSON.stringify(results, null, '  '));
  }
}

async function getImageFromSearch(searchString) {

  const options = {
    page: 0, 
    safe: false, // hide explicit results?
    additional_params: { 
      // add additional parameters here, see https://moz.com/blog/the-ultimate-guide-to-the-google-search-parameters and https://www.seoquake.com/blog/google-search-param/
      hl: 'en' 
    }
  }
  //const response = await google.image('TWKD', options)
  gis(searchString, returnResults);
}

async function createDB(filename) {
  return await open({
    filename: filename,
    driver: sqlite3.Database,
  });
}

async function getBooksFromDBFile(filename) {
  const db = await createDB(filename);
  return await db.all(SELECT_ALL_BOOKS_QUERY);
}

async function getBooks() {
  const books = await Promise.all(booksFiles.map(getBooksFromDBFile));
  let booksFlat = books.flat()
  bookswithImg = booksFlat.map(({ ...r }) => {
    const options = {
      page: 0, 
      safe: false, // hide explicit results?
      additional_params: { 
        // add additional parameters here, see https://moz.com/blog/the-ultimate-guide-to-the-google-search-parameters and https://www.seoquake.com/blog/google-search-param/
        hl: 'en' 
      }
    }
    if (r.author !== 'Unknown Author') {
      const bookCover = getBookCover(r.title)
      return {
        ...r,
        cover: getBookCover(r.title),
        favorite: null,
        ignore: getIgnoreBookFlag(r.title)
      };
    }
  })
  //return books.flat();
  return bookswithImg
}



async function getAnnotationsFromDBFile(filename) {
  const db = await createDB(filename);
  return await db.all(SELECT_ALL_ANNOTATIONS_QUERY);
}

async function getAnnotations() {
  const annotations = await Promise.all(
    annotationsFiles.map(getAnnotationsFromDBFile)
  );
  return annotations.flat();
}

async function getData() {
  const books = await getBooks();
  const annotations = await getAnnotations();

  const booksByAssetId = {};
  const output = annotations.map(({ assetId, ...r }) => {
    if (booksByAssetId[assetId] === undefined) {
      booksByAssetId[assetId] = books.find((b) => b.id === assetId);
    }
    const book = booksByAssetId[assetId];
    return {
      ...r,
      modifiedAt: convertAppleTime(r.modifiedAt),
      createdAt: convertAppleTime(r.createdAt),
      author: book ? (book.author) : "Unknown Author",
      title: book ? (book.title) : "Unknown Title",
      cover: book ? (book.cover) : null,
    };
  });
  fs.writeFileSync("./src/book-data/from-macOS/macOSBooks.json", JSON.stringify(output));
  console.log("Exported Data", output.length)
  return output
}


function getBookCover(title) {
  let file = requireText('./src/book-covers/book-cover-data.json', require);
  let existingBookCovers = JSON.parse(file)
  let coverIndex = existingBookCovers.findIndex((book) => {
    return book.title == title
  })

  return coverIndex === -1 ? null : existingBookCovers[coverIndex].cover 
}

function getIgnoreBookFlag(title) {
  let file = requireText('./src/ignore-books/ignore-books.json', require);
  let booksToIgnore = JSON.parse(file)
  let ignoreBook = false;
  let coverIndex = booksToIgnore.findIndex((book) => {
    return book.title == title
  })
  if (coverIndex !== -1) {
    ignoreBook = true
  }
  return ignoreBook
}

function getHasHiglightsFlag(title) {
}

module.exports = {
  getData, getBooks
}
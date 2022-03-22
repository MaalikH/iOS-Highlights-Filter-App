const http = require('http');
const fs = require('fs');
const express = require('express');
var _ = require('lodash');
const formidable = require('formidable');
const requireText = require('require-text');
const HTMLParser = require('node-html-parser');
const exportFromFile = require('./exportFromFile')
const exportFromMacOS = require('./exportFromMac');
const bodyParser = require('body-parser');

const res = require('express/lib/response');
var Scraper = require('images-scraper');
//var fotology = require("fotology");
const gse = require("general-search-engine")
const google = require('googlethis');
var gis = require('g-i-s');
const { filter } = require('lodash');



const app = express();
const port = 3000;

function logResults(error, results) {
  if (error) {
    console.log(error);
  }
  else {
    console.log('RESULTS PRINTED', JSON.stringify(results, null, '  '));
  }
}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
  bodyParser.json()
  next();
});

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse the raw data
app.use(bodyParser.raw());
// parse text
app.use(bodyParser.text());

// MANUAL INDEX BEFORE FILE UPLOAD
var index = requireText('./src/EML/48lawsofpower.html', require);
var root = HTMLParser.parse(index);

app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<form action="jsonFromFile" method="post" enctype="multipart/form-data">');
  res.write('<input type="file" name="filetoupload"><br>');
  res.write('<input type="submit" value="Get Books From File">');
  res.write('</form>');

  res.write('<form action="getAllHighlightsFromMacOS" method="get">');
  res.write('<input type="submit" value="Get Highlights From DB">');
  res.write('</form>');

  res.write('<form action="getAllBooksFromMacOS" method="get">');
  res.write('<input type="submit" value="Get Books From DB">');
  res.write('</form>');
  return res.end();
})


app.post('/jsonFromFile', function (req, res) {
  const form = formidable({});

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    //save file as index.html
    var oldpath = files.filetoupload.filepath;
    var newpath = './src/' + 'index.html';
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;

      //create json object for book
      //var jsonOutputHTMLUpload = convertBook('./src/index.html');
      var jsonOutputHTMLUpload = exportFromFile.convertBook('./src/index.html');
      console.log("CONVERTED BOOK", jsonOutputHTMLUpload)

      //save json object to file 
      const jsonString = JSON.stringify(jsonOutputHTMLUpload)
      fs.writeFile(`./src/book-data/from-file/${jsonOutputHTMLUpload.bookTitle.replace(/\s/g, '')}.json`, jsonString, err => {
        if (err) {
          console.log('Error writing file', err)
        } else {
          console.log('Successfully wrote file')
        }
      })
      //output json response
      res.write(JSON.stringify(jsonOutputHTMLUpload))
      res.end();
    });
  });
});

app.get('/getAllHighlightsFromMacOS', (req, res) => {
  const bookDataFromMacOS = exportFromMacOS.getData().then((value) => {
    if (value) {
      const jsonHighlightsFromMacOS = value
      res.json((jsonHighlightsFromMacOS))
    }  
  })
})

app.get('/getBooksHighlightsFromMacOS', (req, res) => {
  let books = JSON.parse(req.query.books)
  console.log("BOOKS TO FILTER", books)
  const bookDataFromMacOS = exportFromMacOS.getData().then((value) => {
    if (value) {
      let jsonHighlightsFromMacOS = value
      let filteredArray = jsonHighlightsFromMacOS.filter(
        (e) => books.includes(e.title)
      ); 
      console.log('GET BOOKS HIGHLIGHTS FROM MAC OS ', filteredArray)
      res.json(filteredArray)
    }  
  })
})

app.get('/getAllBooksFromMacOS', (req, res) => {
  const bookDataFromMacOS = exportFromMacOS.getBooks().then((value) => {
    if (value) {
      const jsonBooksFromMacOS = value
      console.log("BOOKS", jsonBooksFromMacOS);
      res.json(jsonBooksFromMacOS)
    }
  })
})

app.get('/getFavoriteHighlights', (req, res) => {
  let file = requireText('./src/favorites/favorites.json', require);
  let favorites = JSON.parse(file)
  res.json(favorites)
})

app.post('/toggleFavoriteHighlight', (req, res) => {
  let file = requireText('./src/favorites/favorites.json', require);
  let favorite = req.body
  let favorites = JSON.parse(file)
  let favoriteIndex = favorites.findIndex((x) => {
    return x.quote == favorite.quote
  })
  favoriteIndex === -1 ? favorites.push(favorite) : favorites.splice(favoriteIndex, 1)
  fs.writeFile('./src/favorites/favorites.json', JSON.stringify(favorites), err => {
    if (err) {
      console.log('Error writing file', err)
    } else {
      console.log('Successfully wrote file')
    }
  })
  res.send(favorites)
});

app.post('/saveBookCovers', (req, res) => {
  let file = requireText('./src/book-covers/book-cover-data.json', require);
  let bookCoversToAdd = req.body
  let existingBookCovers = JSON.parse(file)
  bookCoversToAdd.forEach((coverToAdd) => {
    //find index of exisiting book in covers file array
    let coverIndex = existingBookCovers.findIndex((book) => {
      return book.title == coverToAdd.title
    })
    coverIndex === -1 ? existingBookCovers.push(coverToAdd) : existingBookCovers[coverIndex].cover = coverToAdd.cover;
  })
  fs.writeFile('./src/book-covers/book-cover-data.json', JSON.stringify(existingBookCovers), err => {
    if (err) {
      console.log('Error writing file', err)
    } else {
      console.log('Successfully wrote file')
    }
  }) 
  res.send(existingBookCovers)
});

app.post('/saveIgnoredBooks', (req, res) => {
  console.log("SAVE IGNORE BOOKS")
  let file = requireText('./src/ignore-books/ignore-books.json', require);
  let booksToIgnore = req.body
  let booksIgnored = JSON.parse(file)
  booksToIgnore.forEach((bookToIgnore) => {
    //find index of exisiting book in covers file array
    let bookIndex = booksIgnored.findIndex((book) => {
      return book.title == bookToIgnore.title
    })
    bookIndex === -1 ? booksIgnored.push(bookToIgnore) : ''
  })
  fs.writeFile('./src/ignore-books/ignore-books.json', JSON.stringify(booksIgnored), err => {
    if (err) {
      console.log('Error writing file', err)
    } else {
      console.log('Successfully wrote file')
    }
  }) 
  res.send(booksIgnored)
});

app.get('/getBookCovers', (req, res) => {
  let file = requireText('./src/book-covers/book-covers.json', require);
  let bookCovers = JSON.parse(file)
  res.json(bookCovers)
})

app.post('/editBookCover', (req, res) => {
  let file = requireText('./src/book-covers/book-covers.json', require);
  let booksToAdd = req.body
  let bookCovers = JSON.parse(file)

  //for each book to add, check if exist in books covers, if so edit cover, else add new object to array
  //favoriteIndex === -1 ? favorites.push(favorite) : favorites.splice(favoriteIndex, 1)

  fs.writeFile('./src/book-covers/book-covers.json', JSON.stringify(bookCovers), err => {
    if (err) {
      console.log('Error writing file', err)
    } else {
      console.log('Successfully wrote file')
    }
  })
  res.send(bookCovers)
});

async function getImageFromSearch(searchString) {
  gis('TWKD', logResults)

   const options = {
    page: 0, 
    safe: false, // hide explicit results?
    additional_params: { 
      // add additional parameters here, see https://moz.com/blog/the-ultimate-guide-to-the-google-search-parameters and https://www.seoquake.com/blog/google-search-param/
      hl: 'en' 
    }
  }

  const response = await google.search("TWDG", options).catch(function(e) {
    console.log("ERROR WHILE GOOGLE THIS SARCH", e)
  })
  console.log('SEARCH', response); 
}


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  exportFromMacOS.getBooks().then(function (result) {
    // here you can use the result of promiseB
    console.log('Get Books', result)

  });
  //getImageFromSearch('TWKD')

  
  //Convert directly from file, used before file upload implementation
  //var outputManualFileLoad = exportFromFile.convertBook('./src/EML/48lawsofpower.html');
  //console.log("Output", outputManualFileLoad)
});
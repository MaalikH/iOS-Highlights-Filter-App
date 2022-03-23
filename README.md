# iOS-Highlights-Filter-App
Angular / Node.JS app that extracts MacOS highlights from Mac Database for display &amp; filtering.

## Installation

Install dependencies for Node & Angular applications

```bash
npm i
cd /client
npm i 
```

## Books
Select books by clicking on the preferred book cover. The multi-select feature will show, allowing the user to pick multiple books.   

By default, books come without the cover image file. To edit book covers the user must click the 'camera' button on the edit footer. Once saved, all user-edited book covers are sent to the server and saved to a local JSON file (server checks the JSON array for matching book objects when populating the book array sent to the front end)

A user can ignore a book by selecting the preferred book and clicking the ignore book. Similar to the book covers, the ignored books are saved in a local JSON file. This array is checked when loading the books, and determines the isIgnored flag that controls if the book is displayed. 

Currently the app only displays the books in a user's database with highlights (annotations). 

![Alt text](screenshots/home.jpg?raw=true "Home")


## Highlights
After books are selected the highlights array is fetched from the server. The array is populated with all highlights of corresponding books. If highlights page is accessed through navbar then all user highlights will be populated.

The highlights component has a dynamic border/bg that is controlled by the 'CardHighlightColorDirective'  

## Filters
Highlights can be filtered using the filters-panel to the left of the highlight cards.

Users can filter by the highlights by book title, highlight color, or book chapter. 

The filter chips used in Colors filter category make use of MAT-chips & ChipHighlightColorDirective

## Favorites
A user can favorite or un-favorite a highlight by selecting the star icon in the top right corner of the preferred highlight.
Favorites are saved to JSON file upon click. If the favorite doesn’t exist the server will add to the JSON file, if the favorite does exist the highlight will be purged from the JSON array. 
 
## Future
Future focuses will be on a mobile app using the Ionic framework. Future features may include a modal to import books from MacOS, the kindle app, or from an HTML file.
Will log known issues soon. 

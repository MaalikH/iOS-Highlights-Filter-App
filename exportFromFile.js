const requireText = require('require-text');
const HTMLParser = require('node-html-parser');

function cleanText(tempText) {
  return tempText.replace(/\n/g, '').trim()
}

function convertAnnotation(annotation) {
  //Annotation Info
  let header = annotation.querySelector('.annotationheader')
  let date = cleanText(annotation.querySelector('.annotationdate').childNodes[0]?._rawText)
  let chapter = cleanText(annotation.querySelector('.annotationchapter').childNodes[0]?._rawText)

  //Annotation Content
  let content = annotation.querySelector('.annotationcontent')
  let text = cleanText(annotation.querySelector(".annotationrepresentativetext")?.childNodes[0]?._rawText)
  
  //get Annotation Color
  let markerElement = content.querySelector('.annotationselectionMarker').classList._set
  var marker = [... markerElement]
  let markerColor = marker[1];

  convertedObject = {
    "date" : date,
    "chapter": chapter,
    "markerColor": markerColor,
    "text": text
  }
  return convertedObject
}

function convertAnnotations(annotations) {
  let annotationsJSON = []
  annotations.forEach(element => {  
    annotationsJSON.push(convertAnnotation(element))
  });
  return annotationsJSON
}

function convertBook(path) {
  let index = requireText(path, require);
  let root = HTMLParser.parse(index);

  //Book Info 
  var bookTItle = cleanText(root.querySelector('.booktitle').rawText)
  var bookAuthor = cleanText(root.getElementsByTagName('h2')[0].childNodes.toString())
  var annotations = root.querySelectorAll('.annotation')
  var seperators = root.querySelectorAll('.separator')
  convertedAnnotations = convertAnnotations(annotations)
  if (seperators.length === (convertedAnnotations.length + 1)) {
    console.log('ALL ANNOTATIONS CONVERTED')
  }
  var outputJSON = {
    "bookTitle": bookTItle,
    "bookAuthor": bookAuthor,
    "annotations": convertedAnnotations
  }

  return outputJSON
}

module.exports = {
    convertBook 
}

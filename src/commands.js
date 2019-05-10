import sketch from 'sketch'
var UI = require('sketch/ui')
var util = require('util')
var Settings = require('sketch/settings')
const timeToSaveArtboardHistory = 604800000 // in millis (week for now)



function sendErrorMessage(dataError) {
  UI.alert('Artboard History', String(dataError))
}

function sendMessageToBottom(dataBottom) {
  UI.message(String(dataBottom))
}
export function goToLastArtboard(context) {
  var lastArtboardSaved = getSavedSetting("lastArtboard")
  var artboardHistory = getSavedSetting("ArtboardHistory")
  if (lastArtboardSaved.indexOf(".") < 1) {
    lastArtboardSaved = lastArtboardSaved.substring(lastArtboardSaved.indexOf(".") + 1)
  }
  //setSetting("lastArtboard", getSavedSetting("actualArtboard"))
  //setSetting("actualArtboard", lastArtboardSaved)
  var lastArtboardSavedA = lastArtboardSaved.substring(lastArtboardSaved.indexOf(".") + 1)
  var lastArtboardSavedP = lastArtboardSaved.substring(0, lastArtboardSaved.indexOf("."))
  lastArtboardSavedA = lastArtboardSavedA.replace(".", "")
  lastArtboardSavedP = lastArtboardSavedP.replace(".", "")
  //lastArtboardSavedA = lastArtboardSavedA.substring(lastArtboardSavedA.indexOf(".") + 1)
  //actualArtboardSavedA = actualArtboardSavedA.substring(actualArtboardSavedA.indexOf(".") + 1)
  var document = require('sketch/dom').getSelectedDocument()
  var layerP = document.getLayerWithID(lastArtboardSavedP)
  var layerA = document.getLayerWithID(lastArtboardSavedA)
  document.selectedLayers.clear()
  layerP.selected = true
  layerA.selected = true
  document.centerOnLayer(layerA)
  // zoom
  if (true === artboardHistory.zoom) {
    document.sketchObject.eventHandlerManager().currentHandler().zoomToSelection()
  }
}

export function showSavedArtboardHistory(context) {
  var artboardHistory = getSavedSetting("ArtboardHistory")
  var string = ""
  for (var i = 0; i < artboardHistory.documents.length; i++) {
    string += i + 1 + ".\n" + "Document id: " + artboardHistory.documents[i].id + "\n" +
      "Last used: " + Date(artboardHistory.documents[i].timestamp) + "\n" +
      "Last index used: " + artboardHistory.documents[i].lastHistoryIndex + "\n\n" +
      "Artboard ids:" + "\n"
    for (var j = 0; j < artboardHistory.documents[i].storedHistory.length; j++) {
      string += artboardHistory.documents[i].storedHistory[j].artboard + "\n"
      if (j === artboardHistory.documents[i].storedHistory.length - 1) {
        string += "\n\n"
      }
    }
  }
  if(string.length<=1) {
    string = "No stored Artboard History available."
  }
  sendErrorMessage(
    "Zoom to Artboard: " + artboardHistory.zoom
    + "\n\n" +
    "previous Artboard id: " + getSavedSetting("lastArtboard")
    + "\n\n" +
    "current Artboard id: " + getSavedSetting("actualArtboard")
    + "\n\n" +
    string
    //+ "\n\n" +
    //objectToJson(artboardHistory)
  )

  // DEV
  //Settings.setSettingForKey("lastArtboard", "7D4CD49D-D6C2-44EE-9D1C-A8786CD96C68.279186E2-B68A-4D87-8ACE-AA0235421B7B")
}

export function showSelectedLayerInfo(context) {
  var selection = context.selection;
  var layer = selection.firstObject();
  //sendErrorMessage(layer.objectID() + " class: " + layer.class() + " name: " + layer.name())
  var getSelectedDocument = require('sketch/dom').getSelectedDocument
  const document = getSelectedDocument()
  //var completeDocumentInfoString = JSON.stringify(document.pages)
  //sendErrorMessage(completeDocumentInfoString)


  //if("Page" === document.pages[0].type) {
  //  sendErrorMessage(document.pages.length)
  //}

  /////////
  //var documentr = require('sketch/dom').getSelectedDocument()
  //var layerr = documentr.getLayerWithID("7D4CD49D-D6C2-44EE-9D1C-A8786CD96C68")
  //documentr.centerOnLayer(layerr)

  // Select all Artboards in current page
  selectLayersOfType_inContainer("MSArtboardGroup")
}

function getArtboardsPageByArtboardId(artboardStringToCheck) {
  var getSelectedDocument = require('sketch/dom').getSelectedDocument
  const document = getSelectedDocument()
  for (var i = 0; i < document.pages.length; i++) {
    for (var j = 0; j < document.pages[i].layers.length; j++) {
      if (artboardStringToCheck === document.pages[i].layers[j].id) {
        return document.pages[i].id
      }
    }
  }
  return false
}

function doesStringIncludeThat(stringToCheck, stringCheckingWith) {
  while (stringCheckingWith.length > 2) {
    var stringCheckingWithCutOut = stringCheckingWith.substring(0, stringCheckingWith.indexOf("."))
    stringCheckingWith = stringCheckingWith.substring(stringCheckingWith.indexOf(".") + 1)
    if (stringToCheck === stringCheckingWithCutOut) {
      return true
    }
  }
  return false
}

function setSetting(stringWhere, stringValue) {
  Settings.setGlobalSettingForKey(stringWhere, stringValue)
}

function getSavedSetting(stringWhere) {
  return Settings.globalSettingForKey(stringWhere)
}

export function resetAllSetSettings() {
  setSetting("lastArtboard", "")
  setSetting("actualArtboard", "")
  setSetting("ArtboardHistory", "")
  newArtboardHistoryObject()
  sendMessageToBottom("Artboard History is successfully reset.")
}

function getDocumentId() {
  var getSelectedDocument = require('sketch/dom').getSelectedDocument
  const document = getSelectedDocument()
  return document.id
}

function getDocumentsArtboardHistory(artboardHistory, documentId) {
  for (var i = 0; i < artboardHistory.documents.length; i++) {
    if (documentId === artboardHistory.documents[i].id) {
      return artboardHistory.documents[i].storedHistory
    }
  }
  return false
}

function getDocumentsIndexById(artboardHistory, documentId) {
  for (var i = 0; i < artboardHistory.documents.length; i++) {
    if (documentId === artboardHistory.documents[i].id) {
      return i
    }
  }
  return false
}

export function checkIfAllThisExists() {
  checkIfArtboardHistoryAlreadySaved()
}

function newArtboardHistoryObject() {
  var artboardHistory = {
    zoom: true,
    lifetime: 604800000,
    documents: []
  }
  setSetting("ArtboardHistory", artboardHistory)
}

function checkIfArtboardHistoryAlreadySaved() {
  var a = getSavedSetting("ArtboardHistory")
  if (typeof a != "object") {
    newArtboardHistoryObject()
  }
  //sendErrorMessage(objectToJson(getSavedSetting("ArtboardHistory")))
}

function objectToJson(obj) {
  var json = JSON.stringify(obj)
  return json
}

export function setZoomSetting() {
  var artboardHistory = getSavedSetting("ArtboardHistory")
  UI.getInputFromUser("Zoom to Artboard?", {
    description: "When using the Artboard History of this plugin.",
    type: UI.INPUT_TYPE.selection,
    possibleValues: [artboardHistory.zoom === true ? 'Yes' : 'No', artboardHistory.zoom === true ? 'No' : 'Yes']
  }, (err, value) => {
    if (err) {
      // most likely the user canceled the input
      return
    }
    if ("Yes" === value) {
      artboardHistory.zoom = true
    } else {
      artboardHistory.zoom = false
    }
    setSetting("ArtboardHistory", artboardHistory)
  })
}

function getMillisDateAsString(millis) {
  var date = new Date(millis);
  return date.toString()
}

export function setLifetimeSetting() {
  var possibleDates = {
    0: 0,             // refresh with every restart
    1: 86400000,      // 1 day
    2: 604800000,     // 1 week
    3: 2629746000,    // 1 month
    4: 15778476000,   // 0.5 year
    5: -1,            // infinity
  }
  
  var artboardHistory = getSavedSetting("ArtboardHistory")
  UI.getInputFromUser("How long do you want your Artboard History to be saved?", {
    description: "When using the Artboard History of this plugin.",
    type: UI.INPUT_TYPE.selection,
    possibleValues: [artboardHistory.lifetime === 604800000 ? 'Yes' : 'No', artboardHistory.lifetime === 0 ? 'No' : 'Yes']
  }, (err, value) => {
    if (err) {
      // most likely the user canceled the input
      return
    }
    if ("Yes" === value) {
      artboardHistory.lifetime = lifetime
    } else {
      artboardHistory.lifetime = 0
    }
    setSetting("ArtboardHistory", artboardHistory)
  })
}

function getCurrentTime() {
  return Date.now()
}

function getIfStillInIntervall(millisOutOfSavedTimestamp) {
  var t = getCurrentTime()
  t -= timeToSaveArtboardHistory
  if (t >= millisOutOfSavedTimestamp) {
    return false
  }
  return true
}

export function updateArtboardHistory(context) {
  // get + save last Artboard
  var strOldA = String(context.actionContext.oldArtboard)
  var strOldP = ""
  if ("<null>" === strOldA || "" === strOldA) {
    var strPreNewA = getSavedSetting("actualArtboard")
    if ("<null>" === strPreNewA || "" === strPreNewA || undefined === strPreNewA) {
      strOldA = "not defined"
    }
    else {
      strOldA = strPreNewA
    }
  }
  else {
    strOldA = strOldA.substring(strOldA.indexOf("(") + 1)
    strOldA = strOldA.substring(0, strOldA.indexOf(")"))
    strOldA = strOldA.replace(".", "")
    if ("<null>" === strOldA || "" === strOldA) {
      strOldA = getSavedSetting("lastArtboard")
      if ("<null>" === strOldA || "" === strOldA) {
        strOldA = ""
        strOldP = ""
      }
    }
    else {
      strOldA = strOldA.replace(".", "")
      strOldP = strOldP.replace(".", "")
      strOldP = getArtboardsPageByArtboardId(strOldA)
    }
  }
  var strOldSave = ""
  if ("" === strOldP || undefined === strOldP) {
    strOldSave = strOldA
  }
  else {
    strOldSave = strOldP + "." + strOldA
  }
  setSetting("lastArtboard", strOldSave)

  // get new Artboard
  var strNewA = String(context.actionContext.newArtboard)
  strNewA = strNewA.substring(strNewA.indexOf("(") + 1)
  strNewA = strNewA.substring(0, strNewA.indexOf(")"))
  strNewA = strNewA.replace(".", "")
  var strNewP = ""
  if ("<null>" === strNewA || "" === strNewA) {
    strNewA = getSavedSetting("actualArtboard")
    if ("<null>" === strNewA || "" === strNewA) {
      strNewA = ""
      strNewP = ""
    }
  }
  else {
    strNewA = strNewA.replace(".", "")
    strNewP = getArtboardsPageByArtboardId(strNewA)
  }
  var strNewSave = ""
  if ("" === strNewP || undefined === strNewP) {
    strNewSave = strNewA
  }
  else {
    strNewSave = strNewP + "." + strNewA
  }
  //if(strNewSave) {

  //}
  setSetting("actualArtboard", strNewSave)






  /////////////////////////
  // DEVELOPMENT SECTION //
  /////////////////////////

  // get new Artboard out of Action API function call
  var newA = String(context.actionContext.newArtboard)
  newA = newA.substring(newA.indexOf("(") + 1)
  newA = newA.substring(0, newA.indexOf(")"))
  newA = newA.replace(".", "")
  var newP = ""
  if ("<null>" === newA || "" === newA) {
    newA = getSavedSetting("actualArtboard")
    if ("<null>" === newA || "" === newA) {
      newA = ""
      newP = ""
    }
  }
  else {
    newA = newA.replace(".", "")
    newP = getArtboardsPageByArtboardId(newA)
  }

  // organize ArtboardHistory
  var artboardHistory = getSavedSetting("ArtboardHistory")
  var documentId = getDocumentId()
  var documentIndex = 0
  var newHistoryIndex = 0
  var previousHistoryinDoc = getDocumentsArtboardHistory(artboardHistory, documentId)
  if (false === previousHistoryinDoc) {
    documentIndex = artboardHistory.documents.length
    artboardHistory.documents.push({
      id: documentId,
      timestamp: getCurrentTime(),
      lastHistoryIndex: -1,
      storedHistory: [{ id: 0, page: "pageIdOfArtboard1", artboard: "ArtboardId1" }]
    })
    artboardHistory.documents[documentIndex].id = documentId
    //sendErrorMessage(objectToJson(artboardHistory))
    //storedHistory: [{ id: 0, page: "pageIdOfArtboard1", artboard: "ArtboardId1" }]
  } else {
    documentIndex = getDocumentsIndexById(artboardHistory, documentId)
    newHistoryIndex = artboardHistory.documents[documentIndex].storedHistory.length
    artboardHistory.documents[documentIndex].storedHistory.push({ id: newHistoryIndex, page: "pageIdOfArtboard1", artboard: "ArtboardId1" })
  }

  // save into Settings
  //sendErrorMessage(documentId + documentIndex + newHistoryIndex)
  //sendErrorMessage(newHistoryIndex)
  artboardHistory.documents[documentIndex].storedHistory[newHistoryIndex].id = newHistoryIndex
  artboardHistory.documents[documentIndex].timestamp = getCurrentTime()
  artboardHistory.documents[documentIndex].storedHistory[newHistoryIndex].page = newP
  artboardHistory.documents[documentIndex].storedHistory[newHistoryIndex].artboard = newA
  setSetting("ArtboardHistory", artboardHistory)

  //sendErrorMessage(strOldSave)
  //sendErrorMessage(artboardHistory)
  //sendErrorMessage(context)
}
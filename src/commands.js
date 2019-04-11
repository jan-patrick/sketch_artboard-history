import sketch from 'sketch'
var UI = require('sketch/ui')
var util = require('util')
var Settings = require('sketch/settings')



function sendErrorMessage(dataError) {
  UI.alert('what I got:', String(dataError))
}

function sendMessageToBottom(dataBottom) {
  UI.message(String(dataBottom))
}
export function goToLastArtboard(context) {
  var lastArtboardSaved = getSavedSetting("lastArtboard")
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
}

export function showSavedArtboardHistory(context) {
  sendErrorMessage(getSavedSetting("lastArtboard") + "\n+++\n" + getSavedSetting("actualArtboard") + "\n###\n" + objectToJson(getSavedSetting("ArtboardHistory")))

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

function cleanupArtboardHistory(context) {
  setSetting("lastArtboard", "")
  setSetting("actualArtboard", "")
  setSetting("ArtboardHistory", )
  //setSetting("ArtboardHistoryZoom", "")
}

function checkIfZoomSettingSet() {
  var z = getSavedSetting("ArtboardHistoryZoom")
  if(typeof z != "boolean") {
    setSetting("ArtboardHistoryZoom", true)
  }
}

function checkIfSameDocument() {
  var getSelectedDocument = require('sketch/dom').getSelectedDocument
  const document = getSelectedDocument()
  sendErrorMessage(document.id)
  checkIfArtboardHistoryAlreadySaved()
}

export function checkIfAllThisExists() {
  checkIfZoomSettingSet()
  checkIfArtboardHistoryAlreadySaved()
}

function checkIfArtboardHistoryAlreadySaved() {
  var a = getSavedSetting("ArtboardHistory")
  if(typeof a != "object") {
    var artboardHistory = {
      document: "not defined",
      id : "001",
      storedHistory : []
    }
    setSetting("ArtboardHistory", artboardHistory)
  }
  sendErrorMessage(objectToJson(getSavedSetting("ArtboardHistory")))
}

function objectToJson(obj) {
  var json = JSON.stringify(obj)
  return json
}

export function setZoomSetting() {
  var artboardZoomVar = getSavedSetting("ArtboardHistoryZoom")
  UI.getInputFromUser("Zoom to Artboard when using this plugin?", {
    type: UI.INPUT_TYPE.selection,
    possibleValues: [artboardZoomVar === true ? 'Yes' : 'No', artboardZoomVar === true ? 'No' : 'Yes']
  }, (err, value) => {
    if (err) {
      // most likely the user canceled the input
      return
    }
    artboardZoomVar
    if("Yes" === value) {
      artboardZoomVar = true
    } else {
      artboardZoomVar = false
    }
    setSetting("ArtboardHistoryZoom", artboardZoomVar)
    //sendMessageToBottom(getSavedSetting("ArtboardHistoryZoom"))
    checkIfSameDocument()
  })
}

export function updateArtboardHistory(context) {
  // get + save last Artboard
  var strOldA = String(context.actionContext.oldArtboard)
  var strOldP = ""
  if ("<null>" === strOldA || "" === strOldA) {
    var strPreNewA = getSavedSetting("actualArtboard")
    if("<null>" === strPreNewA || "" === strPreNewA|| undefined === strPreNewA) {
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

  var artboardHistory = getSavedSetting("ArtboardHistory")
  artboardHistory.storedHistory.push("Hola");
  setSetting("ArtboardHistory", artboardHistory)

  //sendErrorMessage(strOld)
  //sendErrorMessage(context)
}
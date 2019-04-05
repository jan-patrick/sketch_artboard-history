import sketch from 'sketch'
var UI = require('sketch/ui')
var util = require('util')
var Settings = require('sketch/settings')



function sendErrorMessage(dataError) {
  UI.alert('what I got:', String(dataError))
}

function sendMessageToBottom(dataBottom) {
  context.actionContext.document.showMessage(String(dataBottom))
}

export function goToLastArtboard(context) {
  var lastArtboardSavedA = Settings.settingForKey("lastArtboard")
  //lastArtboardSavedA = lastArtboardSavedA.substring(lastArtboardSavedA.indexOf(".") + 1)
  var actualArtboardSavedA = Settings.settingForKey("actualArtboard")
  //actualArtboardSavedA = actualArtboardSavedA.substring(actualArtboardSavedA.indexOf(".") + 1)
  var documentA = require('sketch/dom').getSelectedDocument()
  var layerA = documentA.getLayerWithID(lastArtboardSavedA)
  documentA.centerOnLayer(layerA)
  Settings.setSettingForKey("lastArtboard", actualArtboardSavedA)
  Settings.setSettingForKey("", lastArtboardSavedA)
  documentA.selectedLayers.clear()
  layerA.selected = true
  sendErrorMessage("good")
}

// DEV
export function goToLastArtboardDEV(context) {
  var lastSaved = Settings.settingForKey("lastArtboard")
  Settings.setSettingForKey("lastArtboard", lastSaved.substring(lastSaved.indexOf(".") + 1))
  var lastArtboardSaved = lastSaved.substring(0, lastSaved.indexOf("."))

  var strNew = Settings.settingForKey("actualArtboard")
  strNew = lastArtboardSaved + "." + strNew
  Settings.setSettingForKey("actualArtboard", strNew)
  var document = require('sketch/dom').getSelectedDocument()
  var layer = document.getLayerWithID(lastArtboardSaved)
  document.centerOnLayer(layer)
  //sendErrorMessage(lastArtboardSaved)
}

// DEV
export function goToNextArtboardDEV(context) {
  var lastSaved = Settings.settingForKey("lastArtboard")
  Settings.setSettingForKey("lastArtboard", lastSaved.substring(lastSaved.indexOf(".") + 1))
  var lastArtboardSaved = lastSaved.substring(0, lastSaved.indexOf("."))

  var strNew = Settings.settingForKey("actualArtboard")
  strNew = lastArtboardSaved + "." + strNew
  Settings.setSettingForKey("actualArtboard", strNew)
  var document = require('sketch/dom').getSelectedDocument()
  var layer = document.getLayerWithID(lastArtboardSaved)
  document.centerOnLayer(layer)
  //sendErrorMessage(lastArtboardSaved)
}

export function showSavedArtboardHistory(context) {
  sendErrorMessage(Settings.settingForKey("lastArtboard") + "\n+++\n" + Settings.settingForKey("actualArtboard"))
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

function getArtboardsPageByArtboardId (artboardStringToCheck) {
  var getSelectedDocument = require('sketch/dom').getSelectedDocument
  const document = getSelectedDocument()
  for (var i = 0; i < document.pages.length; i++) {
    for (var j = 0; j < document.pages[i].layers.length; j++) {
      if(artboardStringToCheck === document.pages[i].layers[j].id) {
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

export function cleanupArtboardHistory(context) {

  //DEV
  Settings.setSettingForKey("lastArtboard", "")
  Settings.setSettingForKey("actualArtboard", "")
}

export function updateArtboardHistory(context) {
  // get last Artboard
  var strOldA = String(context.actionContext.oldArtboard)
  var strOldArtboardA = strOldA.substring(strOldA.indexOf("(") + 1)
  strOldArtboardA = strOldArtboardA.substring(0, strOldArtboardA.indexOf(")"))

  // get last document
  var strOldDocumentA = strOldA.substring(strOldA.indexOf(" ") + 1)
  strOldDocumentA = strOldDocumentA.substring(0, strOldDocumentA.indexOf(">"))

  // save document + Artboard
  strOldA = strOldDocumentA + "." + strOldArtboardA
  Settings.setSettingForKey("lastArtboard", strOldArtboardA)


  // get new Artboard
  var strNewA = String(context.actionContext.newArtboard)
  var strNewArtboardA = strNewA.substring(strNewA.indexOf("(") + 1)
  strNewArtboardA = strNewArtboardA.substring(0, strNewArtboardA.indexOf(")"))

  // get last document
  var strNewDocumentA = strNewA.substring(strNewA.indexOf(" ") + 1)
  strNewDocumentA = strNewDocumentA.substring(0, strNewDocumentA.indexOf(">"))

  // save document + Artboard
  strNewA = strNewDocumentA + "." + strNewArtboardA
  Settings.setSettingForKey("actualArtboard", strNewArtboardA)






  /////////////////////////
  // DEVELOPMENT SECTION //
  /////////////////////////

  // get last Artboard
  //sendErrorMessage(getArtboardsPageByArtboardId(strNewArtboardA))

  //sendErrorMessage(strOld)
  //sendErrorMessage(context)
}
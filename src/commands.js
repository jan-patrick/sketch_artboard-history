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
  var lastArtboardSavedA = Settings.settingForKey("lastArtboardA")
  //lastArtboardSavedA = lastArtboardSavedA.substring(lastArtboardSavedA.indexOf(".") + 1)
  var actualArtboardSavedA = Settings.settingForKey("actualArtboardA")
  //actualArtboardSavedA = actualArtboardSavedA.substring(actualArtboardSavedA.indexOf(".") + 1)
  var documentA = require('sketch/dom').getSelectedDocument()
  var layerA = documentA.getLayerWithID(lastArtboardSavedA)
  documentA.centerOnLayer(layerA)
  Settings.setSettingForKey("lastArtboardA", actualArtboardSavedA)
  Settings.setSettingForKey("actualArtboardA", lastArtboardSavedA)
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
  sendErrorMessage(layer.objectID() + " class: " + layer.class() + " name: " + layer.name())

  /////////
  var document = require('sketch/dom').getSelectedDocument()
  var layer = document.getLayerWithID(layer.objectID())
  //sendErrorMessage(JSON.stringify(layer))
  document.centerOnLayer(layer)
}

function doesStringIncludeThat(stringToCheck, stringCheckingWith) {
  while (stringCheckingWith.length>2) {
    var stringCheckingWithCutOut = stringCheckingWith.substring(0, stringCheckingWith.indexOf("."))
    stringCheckingWith = stringCheckingWith.substring(stringCheckingWith.indexOf(".") + 1)
    if (stringToCheck === stringCheckingWithCutOut) {
      return true
    }
  }
  return false
}

export function cleanupArtboardHistory(context) {
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
Settings.setSettingForKey("lastArtboardA", strOldArtboardA)


// get new Artboard
var strNewA = String(context.actionContext.newArtboard)
var strNewArtboardA = strNewA.substring(strNewA.indexOf("(") + 1)
strNewArtboardA = strNewArtboardA.substring(0, strNewArtboardA.indexOf(")"))

// get last document
var strNewDocumentA = strNewA.substring(strNewA.indexOf(" ") + 1)
strNewDocument = strNewDocument.substring(0, strNewDocumentA.indexOf(">"))

// save document + Artboard
strNewA = strNewDocumentA + "." + strNewArtboardA
Settings.setSettingForKey("actualArtboardA", strOldArtboardA)







  /////////////////////////
  // DEVELOPMENT SECTION //
  /////////////////////////

  // get last Artboard
  var strOldArtboard = String(context.actionContext.oldArtboard)
  strOldArtboard = strOldArtboard.substring(strOldArtboard.indexOf("(") + 1)
  strOldArtboard = strOldArtboard.substring(0, strOldArtboard.indexOf(")"))

  // save last
  var strOld = Settings.settingForKey("lastArtboard")
  strOld = strOldArtboard + "." + strOld
  Settings.setSettingForKey("lastArtboard", strOld)

  sendMessageToBottom(String(doesStringIncludeThat(String(strOldArtboard), String(strOld))))

  // get actual Artboard
  var strNewArtboard = String(context.actionContext.newArtboard)
  strNewArtboard = strNewArtboard.substring(strNewArtboard.indexOf("(") + 1)
  strNewArtboard = strNewArtboard.substring(0, strNewArtboard.indexOf(")"))

  Settings.setSettingForKey("actualArtboard", strNewArtboard)

  //sendErrorMessage(strOld)
  //sendErrorMessage(context)
}
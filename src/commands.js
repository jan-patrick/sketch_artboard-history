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
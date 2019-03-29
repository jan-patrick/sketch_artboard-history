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
    //sketch.UI.message('Hi.')
    
    //var lastArtboardSaved = Settings.settingForKey('lastArtboard')
    //sendErrorMessage(lastArtboardSaved)
    
    //<MSArtboardGroup: 0x7fa9dd758120> goBackinArtboardHistory (4DC34C6A-77BD-4123-9EBD-543025331025)
    //var layer = document.getLayerWithID("4DC34C6A-77BD-4123-9EBD-543025331025")
    //context.actionContext.document.showMessage(String(layer))
    //sendErrorMessage(layer)
    //document.centerOnLayer(layer)

    //////
    var lastArtboardSaved = Settings.settingForKey("lastArtboard")
    lastArtboardSaved = lastArtboardSaved.substring(lastArtboardSaved.indexOf(".") + 1)
    var actualArtboardSaved = Settings.settingForKey("actualArtboard")
    var document = require('sketch/dom').getSelectedDocument()
    var layer = document.getLayerWithID(lastArtboardSaved)
    //sendErrorMessage(JSON.stringify(layer))
    document.centerOnLayer(layer)
    Settings.setSettingForKey("lastArtboard", actualArtboardSaved)
    Settings.setSettingForKey("actualArtboard", lastArtboardSaved)
}

export function showSelectedLayerInfo(context) {
  var selection = context.selection;
  var layer = selection.firstObject();
  sendErrorMessage(layer.objectID() +" class: "+layer.class() +" name: "+layer.name())

  /////////
  var document = require('sketch/dom').getSelectedDocument()
  var layer = document.getLayerWithID(layer.objectID())
  //sendErrorMessage(JSON.stringify(layer))
  document.centerOnLayer(layer)

}

export function updateArtboardHistory(context) {
  // get last Artboard
  var strOld = String(context.actionContext.oldArtboard)
  var strOldArtboard = strOld.substring(strOld.indexOf("(") + 1)
  strOldArtboard = strOldArtboard.substring(0, strOldArtboard.indexOf(")"))
  
  // get last document
  //var strOldDocument = String(context.actionContext.document)
  strOldDocument = strOld.substring(strOld.indexOf(" ") + 1)
  var strOldDocument = strOldDocument.substring(0, strOldDocument.indexOf(">"))

  // save document + Artboard
  strOld = strOldDocument + "." + strOldArtboard
  Settings.setSettingForKey("lastArtboard", strOld)

  // save new Artboard
  var strNew = String(context.actionContext.newArtboard)
  strNew = strNew.substring(strNew.indexOf("(") + 1)
  strNew = strNew.substring(0, strNew.indexOf(")"))
  Settings.setSettingForKey("actualArtboard", strNew)
  sendMessageToBottom(strOld)
  sendErrorMessage(context)
}
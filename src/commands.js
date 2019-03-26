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
    var idArtboardSaved = Settings.settingForKey("idArtboard")
    sendErrorMessage(String(idArtboardSaved))
    //var layer = document.getLayerWithID(idArtboardSaved)
    //sendErrorMessage(idArtboardSaved)
}

export function showSelectedLayerInfo(context) {
  var selection = context.selection;
  var layer = selection.firstObject();
  sendErrorMessage(layer.objectID() +" class: "+layer.class() +" name: "+layer.name())

  /////////
  Settings.setSettingForKey('idArtboard', layer.objectID())
}

export function updateLastArtboard(context) {
  var t = String(context.actionContext.oldArtboard)
  Settings.setSettingForKey("lastArtboard", t)
  sendMessageToBottom("you clicked another artboard")
  //sendErrorMessage(context)
}
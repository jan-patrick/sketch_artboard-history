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
    var lastArtboardSaved = Settings.sessionVariable('lastArtboard')
    sendErrorMessage(lastArtboardSaved)
}

export function updateLastArtboard(context) {
  var t = String(context.actionContext.oldArtboard)
  Settings.setSessionVariable('lastArtboard', t)
  sendMessageToBottom("you clicked another artboard")
  //sendErrorMessage(context)
}
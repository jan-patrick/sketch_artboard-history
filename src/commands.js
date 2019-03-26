import sketch from 'sketch'
var UI = require('sketch/ui')
var util = require('util')
var artboardHistory = new Map()
var whereWeAreInHistory = 0
var Settings = require('sketch/settings')



function sendErrorMessage(dataError) {
  UI.alert('what I got:', String(dataError))
}

function sendMessageToBottom(dataBottom) {
  context.actionContext.document.showMessage(String(dataBottom))
}

export function onSupplyKeyNeeded(context) {
  var key = context.data.key
  var items = util.toArray(context.data.items).map(sketch.fromNative)

  items.forEach((item, i) => {
    // item is either a Layer or a DataOverride
    DataSupplier.supplyDataAtIndex(key, 'foo', i)
  })
}

export function goToLastArtboard(context) {
    sketch.UI.message('Hi.')
}

export function updateLastArtboard(context) {
  
  var document = require('sketch/dom').getSelectedDocument()
  //context.actionContext.document.showMessage(document)

  //var ter = String(context.oldArtboard)
  //context.actionContext.document.showMessage(ter)
  whereWeAreInHistory++
  var t = String("old: " + context.actionContext.oldArtboard + "\n new: "+ context.actionContext.newArtboard)
  artboardHistory.set(whereWeAreInHistory, context.actionContext.newArtboard)
  var stringtoprint = ""
  artboardHistory.forEach(function(value, key) {
    stringtoprint += (key + ' = ' + value+"\n");
    Settings.setSessionVariable('myVar', stringtoprint)
  });
  var myVar = Settings.sessionVariable('myVar')
  sendMessageToBottom(myVar)
  sendErrorMessage(context)

  //document.centerOnLayer(document)
}
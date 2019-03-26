import sketch from 'sketch'
var UI = require('sketch/ui')

function sendErrorMessage(dataError) {
  UI.alert('what I got:', String(dataError))
}

function sendMessageToBottom(dataBottom) {
  context.actionContext.document.showMessage(String(dataBottom))
}

export function goToLastArtboard(context) {
  const doc = sketch.getSelectedDocument()
  const selectedLayers = doc.selectedLayers
  const selectedCount = selectedLayers.length

  if (selectedCount === 0) {
    sketch.UI.message('No layers are selected.')
  } else {
    sketch.UI.message(`${selectedCount} layers selected.`)
  }
}

export function updateLastArtboard(context) {
  //context.actionContext.document.showMessage('artboard changed')
  
  //var document = require('sketch/dom').getSelectedDocument()
  //context.actionContext.document.showMessage(document)

  //var ter = String(context.oldArtboard)
  //context.actionContext.document.showMessage(ter)

  var t = String("old: " + context.actionContext.oldArtboard + "\n new: "+ context.actionContext.newArtboard)
  sendMessageToBottom(t)
  sendErrorMessage(context)
}
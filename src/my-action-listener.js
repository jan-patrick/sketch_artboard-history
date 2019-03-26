var UI = require('sketch/ui')

export function updateLastArtboard(context) {
  //context.actionContext.document.showMessage('artboard changed')
  
  //var document = require('sketch/dom').getSelectedDocument()
  //context.actionContext.document.showMessage(document)

  //var ter = String(context.oldArtboard)
  //context.actionContext.document.showMessage(ter)

  var t = String("old: " + context.actionContext.oldArtboard + "\n new: "+ context.actionContext.newArtboard)
  context.actionContext.document.showMessage(t)
  UI.alert('my title', String(context))
}
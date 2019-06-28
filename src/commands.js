const possibleDates = [
  { millis: 0, description: "refresh with every restart" },
  { millis: 86400000, description: "1 day" },
  { millis: 604800000, description: "1 week" },
  { millis: 2629746000, description: "1 month" },
  { millis: 15778476000, description: "1/2 year" },
  { millis: 31556952000, description: "1 year" },
  { millis: -1, description: "infinity" },
]

function sendErrorMessage(dataHeader, dataError) {
  var UI = require('sketch/ui')
  dataHeader = String(dataHeader)
  if (0 >= dataHeader.length) {
    dataHeader = "Artboard History"
  }
  UI.alert(dataHeader, String(dataError))
}

function sendMessageToBottom(dataBottom) {
  var UI = require('sketch/ui')
  UI.message(String(dataBottom))
}

function setSetting(stringWhere, stringValue) {
  var Settings = require('sketch/settings')
  Settings.setGlobalSettingForKey(stringWhere, stringValue)
}

function getSavedSetting(stringWhere) {
  var Settings = require('sketch/settings')
  return Settings.globalSettingForKey(stringWhere)
}

function getYearFromDate(date) {
  return returnNumberAsStringWithSpecificLength(date.getFullYear(), 4)
}

function getMonthFromDate(date) {
  return returnNumberAsStringWithSpecificLength(date.getMonth() + 1, 2)
}

function getDayFromDate(date) {
  return returnNumberAsStringWithSpecificLength(date.getDate(), 2)
}

function getHoursFromDate(date) {
  return returnNumberAsStringWithSpecificLength(date.getHours(), 2)
}

function getMinutesFromDate(date) {
  return returnNumberAsStringWithSpecificLength(date.getMinutes(), 2)
}

function getSecondsFromDate(date) {
  return returnNumberAsStringWithSpecificLength(date.getSeconds(), 2)
}

function getDateAsString(date) {
  return getYearFromDate(date) + "." + getMonthFromDate(date) + "." + getDayFromDate(date) + " at " + getHoursFromDate(date) + ":" + getMinutesFromDate(date) + ":" + getSecondsFromDate(date)
}

function returnNumberAsStringWithSpecificLength(int, length) {
  var string = int + ""
  while (length > string.length) {
    string = "0" + string
  }
  return string
}

function getDocumentId() {
  var getSelectedDocument = require('sketch/dom').getSelectedDocument
  const document = getSelectedDocument()
  return document.id
}

function getDocumentsArtboardHistory(artboardHistory, documentId) {
  for (var i = 0; i < artboardHistory.documents.length; i++) {
    if (documentId === artboardHistory.documents[i].id) {
      return artboardHistory.documents[i].storedHistory
    }
  }
  return false
}

function getDocumentsIndexById(artboardHistory, documentId) {
  for (var i = 0; i < artboardHistory.documents.length; i++) {
    if (documentId === artboardHistory.documents[i].id) {
      return i
    }
  }
  return false
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

function checkIfInLifeTimeSpan() {
  var artboardHistory = getSavedSetting("ArtboardHistory")
  if (-1 != artboardHistory.lifetime) {
    var timeForComparison = getCurrentTime()
    for (var i = 0; i < artboardHistory.documents.length; i++) {
      if (timeForComparison >= artboardHistory.lifetime + artboardHistory.documents[i].timestamp) {
        artboardHistory.documents.splice(i, 1)
      }
    }
    setSetting("ArtboardHistory", artboardHistory)
  }
}

function newArtboardHistoryObject() {
  var artboardHistory = {
    zoom: true,
    lifetime: 2629746000, // 1 month as standard
    documents: []
  }
  setSetting("ArtboardHistory", artboardHistory)
}

function openUrlInBrowser(url) {
  NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url));
}

function checkIfArtboardHistoryAlreadySaved() {
  var artboardHistory = getSavedSetting("ArtboardHistory")
  if (typeof artboardHistory != "object") {
    newArtboardHistoryObject()
  }
}

function objectToJson(obj) {
  var json = JSON.stringify(obj)
  return json
}

function getCurrentTime() {
  return Date.now()
}

function endOfArtboardHistoryReached(string) {
  sendMessageToBottom("End reached. " + string)
}

function isLayerSelected() {
  var document = require('sketch/dom').getSelectedDocument()
  var selection = document.selectedLayers
  return !selection.isEmpty
}

////////////////////////////////
// FUNCTIONS VISIBLE FOR USER //
////////////////////////////////

export function switchBetweenTwoLatestArtboards(context) {
  var artboardHistory = getSavedSetting("ArtboardHistory")
  var lastArtboardSaved = getSavedSetting("lastArtboard")
  var artboardHistory = getSavedSetting("ArtboardHistory")
  if (lastArtboardSaved.indexOf(".") < 1) {
    lastArtboardSaved = lastArtboardSaved.substring(lastArtboardSaved.indexOf(".") + 1)
  }
  var lastArtboardSavedA = lastArtboardSaved.substring(lastArtboardSaved.indexOf(".") + 1)
  var lastArtboardSavedP = lastArtboardSaved.substring(0, lastArtboardSaved.indexOf("."))
  lastArtboardSavedA = lastArtboardSavedA.replace(".", "")
  lastArtboardSavedP = lastArtboardSavedP.replace(".", "")
  var document = require('sketch/dom').getSelectedDocument()
  var layerP = document.getLayerWithID(lastArtboardSavedP)
  var layerA = document.getLayerWithID(lastArtboardSavedA)
  // check if valid layers
  if (typeof layerA === "object" && typeof layerP === "object") {
    document.selectedLayers.clear()
    layerP.selected = true
    layerA.selected = true
    document.centerOnLayer(layerA)
    // zoom
    if (true === artboardHistory.zoom) {
      document.sketchObject.eventHandlerManager().currentHandler().zoomToSelection()
    }
  } else {
    endOfArtboardHistoryReached()
  }
}

export function goToLastArtboard() {
  var artboardHistory = getSavedSetting("ArtboardHistory")
  var documentId = getDocumentId()
  var lastArtboardSavedP = ""
  var lastArtboardSavedA = ""
  var j = 0
  var b = 0
  var done = false
  while (!done) {
    if (0 < artboardHistory.documents.length) {
      var documentFound = false
      for (var l = 0; l < artboardHistory.documents.length; l++) {
        var selectedLayerTry = false
        var countRuntimeO = 0
        if (documentId === artboardHistory.documents[l].id) {
          documentFound = true
          if(isLayerSelected() && !selectedLayerTry) {
          if (-1 === artboardHistory.documents[l].lastHistoryIndex) {
            var firstStoredHistoryId = -2
            for (var m = 0; m < artboardHistory.documents[l].storedHistory.length; m++) {
              if (firstStoredHistoryId <= artboardHistory.documents[l].storedHistory[m].id) {
                firstStoredHistoryId = artboardHistory.documents[l].storedHistory[m].id
              }
            }
            artboardHistory.documents[l].lastHistoryIndex = firstStoredHistoryId
          }
          var previousArtboardTime = 0
          //sendErrorMessage(artboardHistory.documents[l].lastMoveByUser)
          for (var o = 0; o < artboardHistory.documents[l].storedHistory.length; o++) {
            //sendErrorMessage("checks",previousArtboardTime +" < " + artboardHistory.documents[l].storedHistory[o].id + "\n\n" + artboardHistory.documents[l].lastHistoryIndex +" > "+ artboardHistory.documents[l].storedHistory[o].id)
            if (previousArtboardTime < artboardHistory.documents[l].storedHistory[o].id &&
              artboardHistory.documents[l].lastHistoryIndex > artboardHistory.documents[l].storedHistory[o].id) {
              previousArtboardTime = artboardHistory.documents[l].storedHistory[o].id
              lastArtboardSavedP = artboardHistory.documents[l].storedHistory[o].page
              lastArtboardSavedA = artboardHistory.documents[l].storedHistory[o].artboard
              j = o
              b = l
              countRuntimeO++
              //sendMessageToBottom("found")
              //sendErrorMessage("E countRuntimeO",countRuntimeO)
            }

          if (0 <= countRuntimeO) {
            artboardHistory.documents[l].lastMoveByUser = false
          } else {
            artboardHistory.documents[l].lastMoveByUser = true
            //sendErrorMessage(artboardHistory.documents[l].lastMoveByUser)
          }
          }
          //sendErrorMessage("E lastArtboardSavedP",lastArtboardSavedP)
          artboardHistory.documents[l].lastHistoryIndex = previousArtboardTime
        } else {
          selectedLayerTry = true
          for (var k = 0; k < artboardHistory.documents[l].storedHistory.length; k++) {
            //sendErrorMessage("checks",previousArtboardTime +" < " + artboardHistory.documents[l].storedHistory[o].id + "\n\n" + artboardHistory.documents[l].lastHistoryIndex +" > "+ artboardHistory.documents[l].storedHistory[o].id)
            if (artboardHistory.documents[l].timestamp === artboardHistory.documents[l].storedHistory[k].id ) {
              lastArtboardSavedP = artboardHistory.documents[l].storedHistory[k].page
              lastArtboardSavedA = artboardHistory.documents[l].storedHistory[k].artboard
              sendErrorMessage("found")
              j = k
              b = l
              countRuntimeO++
              //sendMessageToBottom("found")
              //sendErrorMessage("E countRuntimeO",countRuntimeO)
            }
          }
          sendMessageToBottom("selectedLayerTry")
        }
        }
      }
      if(!documentFound) {
        sendMessageToBottom("No History for this Document available.")
        return
      }
    } else {
      sendMessageToBottom("No History available")
      return
    }
    var document = require('sketch/dom').getSelectedDocument()
    var layerP = document.getLayerWithID(lastArtboardSavedP)
    var layerA = document.getLayerWithID(lastArtboardSavedA)
    if (typeof layerA === "object" && typeof layerP === "object") {
      document.selectedLayers.clear()
      layerP.selected = true
      layerA.selected = true
      document.centerOnLayer(layerA)
      // zoom
      if (true === artboardHistory.zoom) {
        document.sketchObject.eventHandlerManager().currentHandler().zoomToSelection()
      }
      done = true
    } else {
      if (j >= 1) {
        artboardHistory.documents[b].storedHistory.splice(j, 1)
      } else {
        artboardHistory.documents[b].lastMoveByUser = true
        done = true
        //sendMessageToBottom("Only one Artboard in History")
      }
    }
  }
  //sendMessageToBottom("done")
  setSetting("ArtboardHistory", artboardHistory)
}

export function goToNextArtboard() {
  var artboardHistory = getSavedSetting("ArtboardHistory")
  var documentId = getDocumentId()
  var lastArtboardSavedP = ""
  var lastArtboardSavedA = ""
  var j = 0
  var b = 0
  var done = false
  while (!done) {
    if (0 < artboardHistory.documents.length) {
      var documentFound = false
      for (var l = 0; l < artboardHistory.documents.length; l++) {
        if (documentId === artboardHistory.documents[l].id) {
          documentFound = true
          if (-1 === artboardHistory.documents[l].lastHistoryIndex) {
            sendMessageToBottom("You have to go back first.")
          }
          var previousArtboardTime = 0

          for (var o = 0; o < artboardHistory.documents[l].storedHistory.length; o++) {
            var countRuntimeO = 0
            if (previousArtboardTime < artboardHistory.documents[l].storedHistory[o].id &&
              artboardHistory.documents[l].lastHistoryIndex > artboardHistory.documents[l].storedHistory[o].id) {
              previousArtboardTime = artboardHistory.documents[l].storedHistory[o].id
              lastArtboardSavedP = artboardHistory.documents[l].storedHistory[o].page
              lastArtboardSavedA = artboardHistory.documents[l].storedHistory[o].artboard
              j = o
              b = l
              countRuntimeO++
            }
          }
          artboardHistory.documents[l].lastHistoryIndex = previousArtboardTime
          if (0 <= countRuntimeO) {
            artboardHistory.documents[l].lastMoveByUser = false
          } else {
            artboardHistory.documents[l].lastMoveByUser = true
          }
        }
      }
      if(!documentFound) {
        sendMessageToBottom("No History for this Document available.")
        return
      }
    } else {
      sendMessageToBottom("No History available")
      return
    }
    var document = require('sketch/dom').getSelectedDocument()
    var layerP = document.getLayerWithID(lastArtboardSavedP)
    var layerA = document.getLayerWithID(lastArtboardSavedA)
    if (typeof layerA === "object" && typeof layerP === "object") {
      document.selectedLayers.clear()
      layerP.selected = true
      layerA.selected = true
      document.centerOnLayer(layerA)
      // zoom
      if (true === artboardHistory.zoom) {
        document.sketchObject.eventHandlerManager().currentHandler().zoomToSelection()
      }
      done = true
    } else {
      if (j >= 1) {
        artboardHistory.documents[b].storedHistory.splice(j, 1)
      } else {
        artboardHistory.documents[b].lastMoveByUser = true
        done = true
        //sendMessageToBottom("Only one Artboard in History")
      }
    }
  }
  setSetting("ArtboardHistory", artboardHistory)
}

export function showGeneralSavedData() {
  var artboardHistory = getSavedSetting("ArtboardHistory")
  var stringLifetime = ""
  for (var t = 0; t < possibleDates.length; t++) {
    if (artboardHistory.lifetime === possibleDates[t].millis) {
      stringLifetime = possibleDates[t].description
    }
  }
  sendErrorMessage("General Artboard History Settings",
    "Zoom to Artboard: " + artboardHistory.zoom
    + "\n\n" +
    "Saving History for " + stringLifetime + "."
  )
}

export function showCompleteObject() {
  var artboardHistory = getSavedSetting("ArtboardHistory")
  var string = objectToJson(artboardHistory)
  sendErrorMessage("Complete stored Artboard History (unformatted)", string)
}

export function showSavedDocumentArtboardHistory() {
  var artboardHistory = getSavedSetting("ArtboardHistory")
  var string = ""
  var document = require('sketch/dom').getSelectedDocument()
  var documentName = document.path
  var messageCounter = 1
  while (documentName.includes("/")) {
    documentName = documentName.substring(documentName.indexOf("/") + 1)
  }
  documentName = documentName.substring(0, documentName.indexOf(".sketch"))
  for (var i = 0; i < artboardHistory.documents.length; i++) {
    if (document.id === artboardHistory.documents[i].id) {
      var previousArtboardDate = new Date(artboardHistory.documents[i].timestamp)

      string += "Last updated: " + getDateAsString(previousArtboardDate)
        + "\n\n" +
        "Artboards (ordered by time, ascending ⇧):" + "\n\n"
      var count = 0
      var lastTime = getCurrentTime()
      for (var j = 0; j < artboardHistory.documents[i].storedHistory.length; j++) {
        var timedifference = lastTime
        for (var m = 0; m < artboardHistory.documents[i].storedHistory.length; m++) {
          if (artboardHistory.documents[i].storedHistory[j].id - lastTime >= timedifference)
            timedifference = artboardHistory.documents[i].storedHistory[j].id - lastTime
          lastTime = artboardHistory.documents[i].storedHistory[j].id
          var k = j
        }
        var layerA = document.getLayerWithID(artboardHistory.documents[i].storedHistory[k].artboard)
        if (typeof layerA === "object") {
          count++
          var date = new Date(artboardHistory.documents[i].storedHistory[k].id)
          var nameToPrint = layerA.name//.replace(/\\/g, '/')
          if (9 >= count) {
            string += count + ".   " + nameToPrint + "\n" + "      " + getDateAsString(date) + "\n"
          } else if (99 >= count) {
            string += count + ".  " + nameToPrint + "\n" + "       " + getDateAsString(date) + "\n"
          } else {
            string += count + ". " + nameToPrint + "\n" + "        " + getDateAsString(date) + "\n"
          }
        } else {
          artboardHistory.documents[i].storedHistory.splice(j, 1)
        }
        if (j === artboardHistory.documents[i].storedHistory.length - 1) {
          string += "\n\n"
        }
      }
    }

  }
  setSetting("ArtboardHistory", artboardHistory)
  if (70 >= string.length) {
    string = "There is no Artboard History available for this document."
  } else {
    messageCounter = Math.ceil(count / 20)
  }
  if (1 >= messageCounter) {
    sendErrorMessage("Artboard History of " + documentName, string)
  } else {
    var substring = ""
    for (var h = 0; h < messageCounter; h++) {
      if (0 === h) {
        substring = string.substring(0, string.indexOf(String((h + 1) * 20 + 1)))
      } else {
        if (count < (h + 1) * 20 + 1) {
          substring = string.substring(string.indexOf(String(h * 20 + 1)), string.length)
        } else {
          substring = string.substring(string.indexOf(String(h * 20 + 1)), string.indexOf(String((h + 1) * 20 + 1)))
        }
      }
      sendErrorMessage("Artboard History of " + documentName + " (" + (h + 1) + "/" + messageCounter + ")", substring)
    }
  }
}

export function showSavedLastTwoArtboardHistory() {
  sendErrorMessage("Last Two Used Artboards",
    "\nPrevious Artboard id: \n\n" + getSavedSetting("lastArtboard")
    + "\n\n\n" +
    "Current Artboard id: \n\n" + getSavedSetting("actualArtboard")
  )
}

export function exportArtboardHistory() {
  var sketch = require('sketch/dom')

  var artboardHistory = getSavedSetting("ArtboardHistory")
  var json = objectToJson(artboardHistory)
  var Text = require('sketch/dom').Text
  var now = new Date
  var year = getYearFromDate(now)
  var month = getMonthFromDate(now)
  var day = getDayFromDate(now)
  var hours = getHoursFromDate(now)
  var minutes = getMinutesFromDate(now)
  var seconds = getSecondsFromDate(now)

  var textstring = "AH_" + year + month + day + "_" + hours + ":" + minutes + ":" + seconds
  var text = new Text({
    text: textstring + json,
    locked: true,
    hidden: true
  })

  sketch.export(text, {
    formats: 'json',
    overwriting: true
  })

  text.remove()
  sendMessageToBottom(textstring + ".json successfully exported to \"~/Documents/Sketch Exports\"")
}

export function userResetAllSetSettings() {
  var UI = require('sketch/ui')
  UI.getInputFromUser(
    "Are you sure you want to reset your Artboard History?",
    {
      description: "This will reset your Artboard History including all saved data to standard and delete the stored history.\n\n Click \"Ok\" if you want to proceed and \"Cancel\" if not.",
      initialValue: '-',
    },
    (err, value) => {
      if (err) {
        // most likely the user canceled the input
        return
      }
      // if clicked ok reset
      resetAllSetSettings()
    })
}

export function resetAllSetSettings() {
  setSetting("lastArtboard", "")
  setSetting("actualArtboard", "")
  setSetting("ArtboardHistory", "")
  newArtboardHistoryObject()
  sendMessageToBottom("Artboard History is successfully reset.")
}

export function checkIfAllThisExists() {
  checkIfArtboardHistoryAlreadySaved()
  checkIfInLifeTimeSpan()
}

export function setZoomSetting() {
  var artboardHistory = getSavedSetting("ArtboardHistory")
  var UI = require('sketch/ui')
  UI.getInputFromUser("Zoom to Artboard?", {
    description: "When using the Artboard History plugin.",
    type: UI.INPUT_TYPE.selection,
    possibleValues: [artboardHistory.zoom === true ? 'Yes' : 'No', artboardHistory.zoom === true ? 'No' : 'Yes']
  }, (err, value) => {
    if (err) {
      // most likely the user canceled the input
      return
    }
    if ("Yes" === value) {
      artboardHistory.zoom = true
    } else {
      artboardHistory.zoom = false
    }
    setSetting("ArtboardHistory", artboardHistory)
    sendMessageToBottom("Artboard History Zoom successfully set to " + artboardHistory.zoom + ".")
  })
}

export function setLifetimeSetting() {
  var artboardHistory = getSavedSetting("ArtboardHistory")
  var UI = require('sketch/ui')
  var c = 42
  for (var i = 0; i < possibleDates.length; i++) {
    if (artboardHistory.lifetime === possibleDates[i].millis) {
      c = i
    }
  }
  if (42 === c) {
    c = 0
  }
  var datesInOrderToPrint = []
  while (datesInOrderToPrint.length <= possibleDates.length - 1) {
    if (c >= possibleDates.length) {
      c = 0
    }
    datesInOrderToPrint.push(possibleDates[c].description)
    c++
  }
  UI.getInputFromUser("How long do you want your Artboard History to be saved?", {
    description: "The time span the History is saved after using a document.",
    type: UI.INPUT_TYPE.selection,
    possibleValues: datesInOrderToPrint
  }, (err, value) => {
    if (err) {
      // most likely the user canceled the input
      return
    }
    for (var i = 0; i < possibleDates.length; i++) {
      if (value === possibleDates[i].description) {
        artboardHistory.lifetime = possibleDates[i].millis
      }
    }
    setSetting("ArtboardHistory", artboardHistory)
    sendMessageToBottom("Saving Artboard History for " + value + ".")
  })
}

export function showWebsite() {
  openUrlInBrowser("https://github.com/jan-patrick/sketch_artboard-history");
}

export function showIssues() {
  openUrlInBrowser("https://github.com/jan-patrick/sketch_artboard-history/issues");
}

export function updateArtboardHistory(context) {
  // get + save last Artboard
  var strOldA = String(context.actionContext.oldArtboard)
  var strOldP = ""
  if ("<null>" === strOldA || "" === strOldA) {
    var strPreNewA = getSavedSetting("actualArtboard")
    if ("<null>" === strPreNewA || "" === strPreNewA || undefined === strPreNewA) {
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

  // get new Artboard out of Action API function call
  var newA = String(context.actionContext.newArtboard)
  newA = newA.substring(newA.indexOf("(") + 1)
  newA = newA.substring(0, newA.indexOf(")"))
  newA = newA.replace(".", "")
  var newP = ""
  if ("<null>" === newA || "" === newA) {
    newA = getSavedSetting("actualArtboard")
    if ("<null>" === newA || "" === newA) {
      newA = ""
      newP = ""
    }
  }
  else {
    newA = newA.replace(".", "")
    newP = getArtboardsPageByArtboardId(newA)
  }

  // organize ArtboardHistory
  var artboardHistory = getSavedSetting("ArtboardHistory")
  var documentId = getDocumentId()
  var documentIndex = 0
  var newHistoryIndex = 0
  var previousHistoryinDoc = getDocumentsArtboardHistory(artboardHistory, documentId)
  var sameArtboardAgain = false
  var currrentTime = getCurrentTime()
  if (!previousHistoryinDoc) {
    documentIndex = artboardHistory.documents.length
    artboardHistory.documents.push({
      id: documentId,
      timestamp: currrentTime,
      lastHistoryIndex: -1,
      lastMoveByUser: true,
      storedHistory: [{ id: 0, page: "pageIdOfArtboard1", artboard: "ArtboardId1" }]
    })
    artboardHistory.documents[documentIndex].id = documentId
  } else {
    documentIndex = getDocumentsIndexById(artboardHistory, documentId)
    newHistoryIndex = artboardHistory.documents[documentIndex].storedHistory.length
    for (var i = 0; i < newHistoryIndex; i++) {
      if (newP === artboardHistory.documents[documentIndex].storedHistory[i].page) {
        if (newA === artboardHistory.documents[documentIndex].storedHistory[i].artboard) {
          var previousArtboardTime = currrentTime
          var previousArtboardTimeDifference = previousArtboardTime
          var previousArtboard = ""
          for (var o = 0; o < artboardHistory.documents[documentIndex].storedHistory.length; o++) {
            if (previousArtboardTimeDifference > previousArtboardTime - artboardHistory.documents[documentIndex].storedHistory[o].id) {
              previousArtboardTimeDifference = previousArtboardTime - artboardHistory.documents[documentIndex].storedHistory[o].id
              previousArtboard = artboardHistory.documents[documentIndex].storedHistory[o].artboard
            }
          }
          if (previousArtboard === newA) {
            sameArtboardAgain = true
            artboardHistory.documents[documentIndex].lastMoveByUser = true
          }
          artboardHistory.documents[documentIndex].storedHistory.splice(i, 1)
          newHistoryIndex--
        }
      }
    }
    artboardHistory.documents[documentIndex].storedHistory.push({ id: 0, page: "pageIdOfArtboard1", artboard: "ArtboardId1" })
  }


  // save into Settings
  artboardHistory.documents[documentIndex].storedHistory[newHistoryIndex].id = currrentTime
  artboardHistory.documents[documentIndex].timestamp = currrentTime
  artboardHistory.documents[documentIndex].storedHistory[newHistoryIndex].page = newP
  artboardHistory.documents[documentIndex].storedHistory[newHistoryIndex].artboard = newA
  //sendMessageToBottom(artboardHistory.documents[documentIndex].lastMoveByUser)
  if (artboardHistory.documents[documentIndex].lastMoveByUser && !sameArtboardAgain) {
    artboardHistory.documents[documentIndex].lastHistoryIndex = currrentTime
    //sendMessageToBottom("same")
  } else {
    artboardHistory.documents[documentIndex].lastMoveByUser = true
  }
  setSetting("ArtboardHistory", artboardHistory)
  // USE THIS TO SEE BUG PART
  //sendMessageToBottom(artboardHistory.documents[documentIndex].lastMoveByUser + " - " + artboardHistory.documents[documentIndex].lastHistoryIndex)

  //sendErrorMessage("", strOldSave)
  //sendErrorMessage("", objectToJson(artboardHistory))
  //sendErrorMessage("", context)
}
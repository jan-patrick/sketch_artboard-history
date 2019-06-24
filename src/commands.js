import sketch from 'sketch'
var UI = require('sketch/ui')
var util = require('util')
var Settings = require('sketch/settings')
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
  dataHeader = String(dataHeader)
  if (1 >= dataHeader.length) {
    dataHeader = "Artboard History"
  }
  UI.alert(dataHeader, String(dataError))
}

function sendMessageToBottom(dataBottom) {
  UI.message(String(dataBottom))
}

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
    sendMessageToBottom("No valid Artboard History available.")
  }
}

export function goToLastArtboard() {

  var artboardHistory = getSavedSetting("ArtboardHistory")
  var documentId = getDocumentId()
  var lastArtboardSavedP = ""
  var lastArtboardSavedA = ""
  var j = 0
  var b = 0
  for (var l = 0; l < artboardHistory.documents.length; l++) {
    if (documentId === artboardHistory.documents[l].id) {
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

      for (var o = 0; o < artboardHistory.documents[l].storedHistory.length; o++) {
        var countRuntimeO = 0
        if (previousArtboardTime < artboardHistory.documents[l].storedHistory[o].id &&
          artboardHistory.documents[l].lastHistoryIndex > artboardHistory.documents[l].storedHistory[o].id) {
          previousArtboardTime = artboardHistory.documents[l].storedHistory[o].id
          lastArtboardSavedP = artboardHistory.documents[l].storedHistory[o].page
          lastArtboardSavedA = artboardHistory.documents[l].storedHistory[o].artboard
          j = o
          b = m
          countRuntimeO ++
          //sendErrorMessage("",previousArtboardTime)
        }
      }
      artboardHistory.documents[l].lastHistoryIndex = previousArtboardTime
      if(0 <= countRuntimeO) {
      artboardHistory.documents[l].lastMoveByUser = false
      } else {
      artboardHistory.documents[l].lastMoveByUser = true
      }
    }
  }
  // dev start
  //var previousArtboardDate = new Date(previousArtboardTime)
  //sendErrorMessage("previousArtboardTime",getHoursFromDate(previousArtboardDate)+":"+getMinutesFromDate(previousArtboardDate)+":"+getSecondsFromDate(previousArtboardDate))
  // dev end
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
  } else {
    if(j >= 1) {
      artboardHistory.documents[b].storedHistory.splice(j, 1)
    } else {
      sendMessageToBottom("No valid Artboard History available.")
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
          string += count + ".  " + layerA.name + "\n" + "     " + getDateAsString(date) + "\n"
        } else {
          artboardHistory.documents[i].storedHistory.splice(j, 1)
        }
        if (j === artboardHistory.documents[i].storedHistory.length - 1) {
          string += "\n\n"
        }
      }
    }

  }
  if (1 >= string.length) {
    string = "No stored Artboard History available."
  }
  sendErrorMessage("Artboard History of " + documentName,
    "previous Artboard id: " + getSavedSetting("lastArtboard")
    + "\n\n" +
    "current Artboard id: " + getSavedSetting("actualArtboard")
    + "\n\n" +
    string
    //+ "\n\n" +
    //objectToJson(artboardHistory)
  )
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

function setSetting(stringWhere, stringValue) {
  Settings.setGlobalSettingForKey(stringWhere, stringValue)
}

function getSavedSetting(stringWhere) {
  return Settings.globalSettingForKey(stringWhere)
}

function getYearFromDate(date) {
  var year = date.getFullYear()
  year = "" + year
  if (year.length <= 1) {
    year = "000" + year
  } else if (year.length <= 2) {
    year = "00" + year
  } else if (year.length <= 3) {
    year = "0" + year
  }
  return year
}

function getMonthFromDate(date) {
  var month = date.getMonth() + 1
  month = "" + month
  if (month.length <= 1) {
    month = "0" + month
  }
  return month
}

function getDayFromDate(date) {
  var day = date.getDate()
  day = "" + day
  if (day.length <= 1) {
    day = "0" + day
  }
  return day
}

function getHoursFromDate(date) {
  var hours = date.getHours()
  hours = "" + hours
  if (hours.length <= 1) {
    hours = "0" + hours
  }
  return hours
}

function getMinutesFromDate(date) {
  var minutes = date.getMinutes()
  minutes = "" + minutes
  if (minutes.length <= 1) {
    minutes = "0" + minutes
  }
  return minutes
}

function getSecondsFromDate(date) {
  var seconds = date.getSeconds()
  seconds = "" + seconds
  if (seconds.length <= 1) {
    seconds = "0" + seconds
  }
  return seconds
}

function getDateAsString(date) {
  return getYearFromDate(date) + "." + getMonthFromDate(date) + "." + getDayFromDate(date) + " at " + getHoursFromDate(date) + ":" + getMinutesFromDate(date) + ":" + getSecondsFromDate(date)
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

export function checkIfAllThisExists() {
  checkIfArtboardHistoryAlreadySaved()
  checkIfInLifeTimeSpan()
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
  var a = getSavedSetting("ArtboardHistory")
  if (typeof a != "object") {
    newArtboardHistoryObject()
  }
  //sendErrorMessage("",objectToJson(getSavedSetting("ArtboardHistory")))
}

function objectToJson(obj) {
  var json = JSON.stringify(obj)
  return json
}

export function setZoomSetting() {
  var artboardHistory = getSavedSetting("ArtboardHistory")
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

function getMillisDateAsString(millis) {
  var date = new Date(millis);
  return date.toString()
}

export function setLifetimeSetting() {
  var artboardHistory = getSavedSetting("ArtboardHistory")
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

function getCurrentTime() {
  return Date.now()
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
  if (false === previousHistoryinDoc) {
    documentIndex = artboardHistory.documents.length
    artboardHistory.documents.push({
      id: documentId,
      timestamp: getCurrentTime(),
      lastHistoryIndex: -1,
      lastMoveByUser: true,
      storedHistory: [{ id: 0, page: "pageIdOfArtboard1", artboard: "ArtboardId1" }]
    })
    artboardHistory.documents[documentIndex].id = documentId
    //sendErrorMessage("",objectToJson(artboardHistory))
    //storedHistory: [{ id: 0, page: "pageIdOfArtboard1", artboard: "ArtboardId1" }]
  } else {
    documentIndex = getDocumentsIndexById(artboardHistory, documentId)
    newHistoryIndex = artboardHistory.documents[documentIndex].storedHistory.length
    for (var i = 0; i < newHistoryIndex; i++) {
      if (newP === artboardHistory.documents[documentIndex].storedHistory[i].page) {
        if (newA === artboardHistory.documents[documentIndex].storedHistory[i].artboard) {
          artboardHistory.documents[documentIndex].storedHistory.splice(i, 1)
          newHistoryIndex--
        }
      }
    }
    artboardHistory.documents[documentIndex].storedHistory.push({ id: newHistoryIndex, page: "pageIdOfArtboard1", artboard: "ArtboardId1" })
  }

  // save into Settings
  //sendErrorMessage("",documentId + documentIndex + newHistoryIndex)
  //sendErrorMessage("",newHistoryIndex)
  artboardHistory.documents[documentIndex].storedHistory[newHistoryIndex].id = getCurrentTime()
  artboardHistory.documents[documentIndex].timestamp = artboardHistory.documents[documentIndex].storedHistory[newHistoryIndex].id
  artboardHistory.documents[documentIndex].storedHistory[newHistoryIndex].page = newP
  artboardHistory.documents[documentIndex].storedHistory[newHistoryIndex].artboard = newA
  if(true === artboardHistory.documents[documentIndex].lastMoveByUser) {
    artboardHistory.documents[documentIndex].lastHistoryIndex = artboardHistory.documents[documentIndex].storedHistory[newHistoryIndex].id
    artboardHistory.documents[documentIndex].lastMoveByUser = false
  } else {
    artboardHistory.documents[documentIndex].lastMoveByUser = true
  }
  setSetting("ArtboardHistory", artboardHistory)

  //sendErrorMessage("",strOldSave)
  //sendErrorMessage("",objectToJson(artboardHistory))
  //sendErrorMessage("",context)
}
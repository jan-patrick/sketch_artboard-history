<p align="center">
  <img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icon.png">
</p>
<h1 align="center"> Artboard History - Sketch plugin </h1>

<h3 align="center"> Switch faster between your latest used Artboards inside Sketch.</h3>

<p align="center">
  <a href="https://www.sketch.com/updates/">
    <img src="https://img.shields.io/badge/compatible%20Sketch%20version-54.1-brightgreen.svg">
  </a>
  <a href="https://github.com/jan-patrick/sketch_artboard-history/releases/latest/download/artboard-history.sketchplugin.zip">
    <img src="https://img.shields.io/github/downloads/jan-patrick/sketch_artboard-history/total.svg?color=brightgreen">
    <img src="https://img.shields.io/github/release/jan-patrick/sketch_artboard-history.svg?color=0279FF">
    <img src="https://img.shields.io/github/release-date/jan-patrick/sketch_artboard-history.svg">
  </a>
  <a href="https://github.com/jan-patrick/sketch_artboard-history/issues">
    <img src="https://img.shields.io/github/issues/jan-patrick/sketch_artboard-history.svg">
  </a>
  <a href="https://sketchrunner.com/">
    <img src="https://img.shields.io/badge/Runner%20Pro%20compatible-Yes-brightgreen.svg">
  </a>
</p>

<p align="center">
  <a href="https://github.com/jan-patrick/sketch_artboard-history/releases/latest/download/artboard-history.sketchplugin.zip">
    <img src="https://img.shields.io/badge/download-0279FF.svg" width="125">
  </a>

## Functions
<table style="width:100%">
  <tr>
    <th></th>
    <th>Go Back</th>
    <th>Go Forward</th> 
    <th>Show saved History</th>
    <th>Zoom On / Off</th>
    <th>Reset complete History</th>
  </tr>
  <tr>
    <td>Status</td>
    <td>✅*</td>
    <td>❌</td>
    <td>✅</td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td>Runner icon</td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/goBackinArtboardHistory.png"></p></td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/goForeinArtboardHistory.png"></p></td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/showArtboardHistory.png"></p></td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/setZoomArtboardHistory.png"></p></td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/resetArtboardHistory.png"></p></td>
  </tr>
  <tr style="background-color: #000000">
    <td>Runner icon dark</td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/goBackinArtboardHistoryDark.png"></p></td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/goForeinArtboardHistoryDark.png"></p></td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/showArtboardHistoryDark.png"></p></td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/setZoomArtboardHistoryDark.png"></p></td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/resetArtboardHistoryDark.png"></p></td>
  </tr>
  <tr>
    <td>Shortcut</td>
    <td>⌥ + ⇧ + A</td>
    <td>-</td>
    <td>⌥ + ⇧ + P</td>
    <td>⌥ + ⇧ + M</td>
    <td>⌥ + ⇧ + R</td>
  </tr>
</table>

## ‼️*Limitations (for now):
- Switch between two Artboards (opt + cmd + a), can be done infinitely.
- only works within one document (the history is overwritten when opening another document / works with the current used document only).

Feel free to create an [issue](https://github.com/jan-patrick/sketch_artboard-history/issues) if something does not work probably or if you have a feature request.

Shortcut:
opt (⌥) + cmd (⇧) + a (A)

## :arrow_down: Install
1. Download the [latest release](https://github.com/jan-patrick/sketch_artboard-history/releases/latest/download/artboard-history.sketchplugin.zip).
2. Unzip the file
3. Double click on the file


## Install with Sketch Runner
With Sketch Runner, just go to the `install` command and search for `Artboard History`. Runner allows you to manage plugins and do much more to speed up your workflow in Sketch. [Download Runner here](http://www.sketchrunner.com).
<br/><br/><a href="http://bit.ly/SketchRunnerWebsite"><img src="http://bit.ly/RunnerBadgeBlue" width=140></a>

## :construction: History Structure 
```javascript
var artboardHistory = {
  zoom: true,
  documents: [{
    id: "documentId",
    timestamp: Date.now(),
    lastHistoryIndex: -1,
    storedHistory: [{ id: 0, page: "pageIdOfArtboard1", artboard: "artboardId1" },
                    { id: 1, page: "pageIdOfArtboard2", artboard: "artboardId2" }] 
  }]
}
```

#### :computer: skpm

_This plugin was created using `skpm`. For a detailed explanation on how things work, checkout the [skpm Readme](https://github.com/skpm/skpm/blob/master/README.md)._

<p align="center">
  <img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/GithubSocialPreview.jpg" width=400>
</p>
<h1 align="center"> Artboard History - Sketch plugin </h1>

<h3 align="center"> Switch faster between your latest used Artboards inside Sketch.</h3>

<p align="center">
  <a href="https://www.sketch.com/updates/">
    <img src="https://img.shields.io/badge/latest%20tested%20compatible%20Sketch%20version-57.1-brightgreen.svg">
  </a>
  <a href="https://github.com/jan-patrick/sketch_artboard-history/releases/latest/download/artboard-history.sketchplugin.zip">
    <img src="https://img.shields.io/github/downloads/jan-patrick/sketch_artboard-history/total.svg?color=brightgreen">
  </a>
  <a href="https://sketchrunner.com/">
    <img src="https://img.shields.io/badge/Runner%20Pro%20compatible-Yes-brightgreen.svg">
  </a>
</p>

<p align="center">
  <a href="https://github.com/jan-patrick/sketch_artboard-history/releases/latest/download/artboard-history.sketchplugin.zip">
    <img src="https://img.shields.io/badge/download-0279FF.svg" width="125">
  </a>
  </p>

## Functions
<table style="width:100%">
  <tr>
    <th></th>
    <th>Switch between two Artboards</th>
    <th>Go Backwards</th>
    <th>Go Forwards</th> 
    <th>Show saved History</th>
    <th>Zoom On / Off</th>
    <th>Set History lifetime</th>
    <th>Reset History</th>
  </tr>
  <tr>
    <td>Status</td>
    <td>✅*</td>
    <td>🚧*</td>
    <td>❌*</td>
    <td>✅</td>
    <td>✅</td>
    <td>✅*</td>
    <td>✅</td>
  </tr>
  <tr>
    <td>Runner icon</td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/switchArtboard.png"></p></td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/goBackinArtboardHistory.png"></p></td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/goForeinArtboardHistory.png"></p></td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/showArtboardHistory.png"></p></td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/setZoomArtboardHistory.png"></p></td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/setLifetimeHistory.png"></p></td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/resetArtboardHistory.png"></p></td>
  </tr>
  <tr style="background-color: #000000">
    <td>Runner icon dark</td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/switchArtboardDark.png"></p></td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/goBackinArtboardHistoryDark.png"></p></td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/goForeinArtboardHistoryDark.png"></p></td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/showArtboardHistoryDark.png"></p></td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/setZoomArtboardHistoryDark.png"></p></td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/setLifetimeHistoryDark.png"></p></td>
    <td><p align="center"><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/resetArtboardHistoryDark.png"></p></td>
  </tr>
  <tr>
    <td>Shortcut</td>
    <td>alt + cmd + A</td>
    <td>ctrl + A</td>
    <td>ctrl + cmd + A</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
  </tr>
</table>

#### * Limitations (for now):

###### Switch between two Artboards
- Switch between two Artboards (opt + cmd + a), can be done infinitely.
- only works within one document (the history is overwritten when opening another document / works with the current used document only).

###### Go Backwards
- Works, but the opposite way is currently not possible.
- only works within one document at the moment due to a bug. On any additionally opened there is a small bug but the caommand mostly works.

Feel free to create an [issue](https://github.com/jan-patrick/sketch_artboard-history/issues) if something does not work probably or if you have a feature request.

## Install
1. Download the [latest release](https://github.com/jan-patrick/sketch_artboard-history/releases/latest/download/artboard-history.sketchplugin.zip).
2. Unzip the file
3. Double click on the file


## Install with Sketch Runner (Pro) or Sketchpacks
With Sketch Runner, just go to the `install` command and search for `Artboard History`. Runner allows you to manage plugins and do much more to speed up your workflow in Sketch. [Download Runner here](http://www.sketchrunner.com).
<br/><br/><a href="http://bit.ly/SketchRunnerWebsite"><img src="http://bit.ly/RunnerBadgeBlue" width=140></a>
<a href="https://sketchpacks.com/jan-patrick/sketch_artboard-history/install">
  <img width="140" src="http://sketchpacks-com.s3.amazonaws.com/assets/badges/sketchpacks-badge-install.png" >
</a>

## further information

#### privacy 

This plugin stores your personal Artboard History on your local machine only. You can access this data by using the `Show` command. No data is stored outside your computer and no backup is made. If you reset / delete the stored history via the `Reset` command all data will be overwritten.

#### warranty
The software is provided "as is", without warranty of any kind.


## development

#### History Structure 
```javascript
var artboardHistory = {
  zoom: true,
  lifetime: 2629746000, // in millis (1 month as standard)
  documents: [{
    id: "documentId",
    timestamp: Date.now(),
    lastHistoryIndex: -1,
    lastMoveByUser: true,
    storedHistory: ["artboardId1", "artboardId2"] 
  }]
}
```

#### skpm

This plugin was created using `skpm`. For a detailed explanation on how things work, checkout the [skpm Readme](https://github.com/skpm/skpm/blob/master/README.md).

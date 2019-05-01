<p align="center">
  <img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icon.png">
</p>
<h1 align="center"> Artboard History - Sketch plugin </h1>

<h6 align="center"> Switch faster between your latest used Artboards inside Sketch.</h6>

## Functions
<table style="width:100%">
  <tr>
	  <th></th>
    <th>Go Back in Artboard History</th>
    <th>Go Forward in Artboard History</th> 
    <th>Show saved History</th>
    <th>Zoom On / Off</th>
    <th>Reset complete History</th>
  </tr>
  <tr>
    <td>Runner icon</td>
    <td><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/goBackinArtboardHistory.png"></td>
    <td><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/goForeinArtboardHistory.png"></td>
    <td><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/showArtboardHistory.png"></td>
    <td><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/setZoomArtboardHistory.png"></td>
    <td><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/resetArtboardHistory.png"></td>
  </tr>
  <tr>
    <td>Runner icon dark</td>
    <td><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/goBackinArtboardHistoryDark.png"></td>
    <td><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/goForeinArtboardHistoryDark.png"></td>
    <td><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/showArtboardHistoryDark.png"></td>
    <td><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/setZoomArtboardHistoryDark.png"></td>
    <td><img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icons/resetArtboardHistoryDark.png"></td>
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

## Limitations (for now):
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

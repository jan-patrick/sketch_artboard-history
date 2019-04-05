<img src="https://raw.githubusercontent.com/jan-patrick/sketch_artboard-history/master/assets/icon.png" width=100>

# artboard-history

Switch faster between your latest used Artboards inside Sketch

Limitations (for now):
- Switch between two Artboards (cmd + alt + z)
- only works on one page (no switching between Artboards on different pages for now). There will be a History for every page itself.

Shortcut:
alt + cmd + z / opt + cmd + z

## Install
1. Download the [latest release](https://github.com/jan-patrick/sketch_artboard-history/releases/latest/download/artboard-history.sketchplugin.zip).
2. Unzip the file
3. Double click on the file


## Install with Sketch Runner
With Sketch Runner, just go to the `install` command and search for `Artboard History`. Runner allows you to manage plugins and do much more to speed up your workflow in Sketch. [Download Runner here](http://www.sketchrunner.com).
<br/><br/><a href="http://bit.ly/SketchRunnerWebsite"><img src="http://bit.ly/RunnerBadgeBlue" width=140></a>


## skpm (for development)

_This plugin was created using `skpm`. For a detailed explanation on how things work, checkout the [skpm Readme](https://github.com/skpm/skpm/blob/master/README.md)._

### Usage for development

Install the dependencies

```bash
npm install
```

Once the installation is done, you can run some commands inside the project folder:

```bash
npm run build
```

To watch for changes:

```bash
npm run watch
```

Additionally, if you wish to run the plugin every time it is built:

```bash
npm run start
```

Publishing the plugin:

```bash
skpm publish <bump>
```

(where `bump` can be `patch`, `minor` or `major`)

`skpm publish` will create a new release on the GitHub repository and create an appcast file in order for Sketch users to be notified of the update.
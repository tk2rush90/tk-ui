# TK UI

UI kits for Angular2+.

# Install

## Clone repository

```
git clone https://github.com/tk2rush90/tk-ui.git
```

## Copy UI kit

Copy `src/app/tk-ui` directory to your Angular project.

## Settings

### angular.json

Add followings to `angular.json`.

```json
...
"stylePreprocessorOptions": {
  "includePaths": [
    "src/app/tk-ui/styles"
  ]
},
...
```

### tsconfig.json

Add followings to `tsconfig.json`.

```json
...
"paths": {
  "@tk-ui/*": [
    "src/app/tk-ui/*"
  ]
},
...
```

# Charts

To use chart components, install [d3.js](https://d3js.org/) to your project.

```
npm i d3 && npm i -D @types/d3
```

If you don't want to use chart components, remove `src/app/tk-ui/charts` directory from your project.

# IndexedDB

There are utilities for using IndexedDB.

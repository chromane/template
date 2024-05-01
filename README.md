# Chrome Extension Template

This is a template for a chrome extensions with most of it's UI code hosted outside of the chrome extension package, in a page that is included in the extension via an iFrame. Listed below are some benefits of this approach.

- Chrome extension package has smaller size and loads faster on first install.
- Less actual chrome extension code in the package which makes review process easier.
- Avoid the review process of changes unrelated to the actuall chrome extension code.
- Google-recommended config approach out of the box.
- Reduce reliance on the host website, changes to which may break our extension.
- Ability to use JS libraries and frameworks that require `eval`
- Enables a simple way of packaging web apps developed in a different place

## Installation

```bash
$ npm i
```

## Build Extensions to the `/temp_ext_build` repo

```bash
$ npm install
$ npm run build
```

## Launch Dev process that watches for changes and generates the `/temp_ext_install` folder with an installable extension

```bash
$ npm run dev
```

## Installing developer versions on Chrome

1. Go to your [Chrome Extension Tab](chrome://extensions/)

2. Make sure developer mode is enabled

3. Click "Load unpacked extension..." Be sure to select the entire folder containing the `manifest.json` file from `/temp_ext_install` or `/temp_ext_build` ( not `/prj_ext` )

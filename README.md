# travelvideo

[![Build Status](https://travis-ci.org/stoman/travelvideo.svg?branch=master)](https://travis-ci.org/stoman/travelvideo)

This is the code for the website located at [https://travel.stoman.de](https://travel.stoman.de). This repository contains all the code, but due to file sizes not the actual videos. You can view the website at the URL given above or build the website yourself as described below.

## Prerequisites

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with npm)
- [Ember CLI](https://cli.emberjs.com/release/)
- [Google Chrome](https://google.com/chrome/)

## Installation

<<<<<<< HEAD
* `git clone https://github.com/stoman/travelvideo` this repository
* `cd travelvideo`
* `npm install`
=======
- `git clone <repository-url>` this repository
- `cd travelvideo`
- `npm install`
>>>>>>> 3fa7630 (v4.12.3...v5.12.0)

## Running / Development

- `npm run start`
- Visit your app at [http://localhost:4200](http://localhost:4200).
- Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Running Tests

- `npm run test`
- `npm run test:ember -- --server`

### Linting

- `npm run lint`
- `npm run lint:fix`

### Building

- `npm exec ember build` (development)
- `npm run build` (production)

### Building a Docker container

* `docker build -t registry.stoman.de/travel:latest .`

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

- [ember.js](https://emberjs.com/)
- [ember-cli](https://cli.emberjs.com/release/)
- Development Browser Extensions
  - [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  - [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

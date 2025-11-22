# travelvideo

This is the code for the website located at [https://travel.stoman.de](https://travel.stoman.de). This repository contains all the code, but due to file sizes not the actual videos. You can view the website at the URL given above or build the website yourself as described below.

The website is a log of some of the places we visited together. In most of those places we created a short video holding a sign with the name of the city. The videos are concatenated in a way such that each video starts with the same people visible as the last one ended with.

## Prerequisites

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with npm)
- [Ember CLI](https://cli.emberjs.com/release/)
- [Google Chrome](https://google.com/chrome/)

## Installation

- `git clone https://github.com/stoman/travelvideo` this repository
- `cd travelvideo`
- `npm install`

## Running / Development

- `npm run start`
- Visit your app at [http://localhost:4200](http://localhost:4200).
- Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Running Tests

- `npm run test`
- `npm run test`
- `npm run test:ember -- --server`

### Running Tests in Docker

If you don't have Node.js installed locally, you can run the tests in a Docker container:

- `docker build -f Dockerfile.test -t travelvideo-test .`
- `docker run --rm travelvideo-test npm test`

### Linting

- `npm run lint`
- `npm run lint:fix`

### Building

- `npm exec ember build` (development)
- `npm run build` (production)

### Building a Docker container

- `docker build -t registry.stoman.de/travel:latest .`

### Deploying

Build the Docker container and push it to the registry as listed above. Then connect to the server and pull the container. Videos are not part of the container, so you need to upload them to the server if changed or added.

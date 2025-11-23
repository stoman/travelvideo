# travelvideo

This is the code for the website located at [https://travel.stoman.de](https://travel.stoman.de). This repository contains all the code, but due to file sizes not the actual videos. You can view the website at the URL given above or build the website yourself as described below.

The website is a log of some of the places we visited together. In most of those places we created a short video holding a sign with the name of the city. The videos are concatenated in a way such that each video starts with the same people visible as the last one ended with.

## Prerequisites

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with npm)
- [Ember CLI](https://cli.emberjs.com/release/)
- [Google Chrome](https://google.com/chrome/)

## Setup

- `git clone https://github.com/stoman/travelvideo` this repository
- `cd travelvideo`
- `npm install` (unless running in Docker)

## Running

- `npm run start`
- Visit your app at [http://localhost:4200](http://localhost:4200).
- Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Running with Docker Locally

- `docker build -f Dockerfile -t travelvideo .`
- `docker run -p 8080:80 -v <absolute_path_to_videos_local>:/usr/local/apache2/htdocs/assets/videos:ro travelvideo`

## Testing / Linting

### Running Tests Locally

- `npm run test`
- `npm run test:ember -- --server`
- `npm run lint`
- `npm run lint:fix`

### Running Tests in Docker (Recommended)

Using Docker Compose with volume mounting for faster iteration:

```bash
# Run all tests (linting + tests)
docker compose -f docker-compose.test.yml run --rm test

# Fix formatting issues with Prettier
docker compose -f docker-compose.test.yml run --rm test npm run lint:fix

# Run only linting (no tests)
docker compose -f docker-compose.test.yml run --rm test npm run lint

# Run only Ember tests (skip linting)
docker compose -f docker-compose.test.yml run --rm test npm run test:ember

# Interactive shell in container
docker compose -f docker-compose.test.yml run --rm test bash

# Build/rebuild the test image
docker compose -f docker-compose.test.yml build
```

**Note**: Files are mounted from your local directory, so changes made by Prettier in the container apply directly to your working files. No need to rebuild the Docker image for code changes!

#### Alternative: Docker without volume mounting

If you prefer to run tests without volume mounting:

```bash
docker build -f Dockerfile.test -t travelvideo-test .
docker run --rm travelvideo-test npm test
```

## Deploying

Deployments are run automatically by GitHub Actions. The workflow is defined in `.github/workflows/deploy.yml`.

### Manual Deployment

Build the Docker container and push it to the registry:

```bash
docker build -t registry.stoman.de/travel:latest .
```

Then connect to the server and pull the container. Videos are not part of the container, so you need to upload them to the server if changed or added.

### Development Build

- `npm exec ember build`

### Production Build

- `npm run build`

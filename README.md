# travelvideo

This is the code for the website located at [https://travel.stoman.de](https://travel.stoman.de). This repository is the complete site, videos included — clone it, build it, and it's ready to deploy. You can view the website at the URL given above or build the website yourself as described below.

The website is a log of some of the places we visited together. In most of those places we created a short video holding a sign with the name of the city. The videos are concatenated in a way such that each video starts with the same people visible as the last one ended with.

## Prerequisites

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with npm)

## Setup

- `git clone https://github.com/stoman/travelvideo` this repository
- `cd travelvideo`
- `npm install` (unless running in Docker)

## Running

- `npm run dev`
- Visit your app at [http://localhost:5173](http://localhost:5173).

### Running with Docker Locally

The video archive is committed to the repo and baked into the image, so no separate volume is
needed:

- `docker build -f Dockerfile -t travelvideo .`
- `docker run -p 8080:80 travelvideo`
- Visit [http://localhost:8080](http://localhost:8080).

## Testing / Linting

### Running Tests Locally

- `npm run test`
- `npm run lint`
- `npm run lint:fix`

### Running Tests in Docker (Recommended)

Using Docker Compose with volume mounting for faster iteration:

```bash
# Run all tests (tsc --noEmit + node --test)
docker compose -f docker-compose.test.yml run --rm test

# Fix formatting issues with Prettier
docker compose -f docker-compose.test.yml run --rm test npm run lint:fix

# Run only linting
docker compose -f docker-compose.test.yml run --rm test npm run lint

# Interactive shell in container
docker compose -f docker-compose.test.yml run --rm test sh

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

Deployments are run automatically by GitHub Actions on every push to `main`. The workflow is
defined in `.github/workflows/deploy.yml`: it runs the test suite, then (only if that passes and
the push is to `main`) builds the Docker image, pushes it to `registry.stoman.de`, and SSHes into
the server to pull and restart it via `docker compose`.

### Manual Deployment

Build the Docker container and push it to the registry:

```bash
docker build -t registry.stoman.de/travel:latest .
docker push registry.stoman.de/travel:latest
```

Then connect to the server and run `docker compose pull && docker compose up -d` in the deploy
directory. The video archive is committed to the repo and built into the image — there is
nothing separate to upload.

### Production Build

- `npm run build`
- Emits static files to `dist/`, which the Dockerfile copies into the image verbatim.

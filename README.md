# Travel Video

[![Deploy to Production](https://github.com/stoman/travelvideo/actions/workflows/deploy.yml/badge.svg)](https://github.com/stoman/travelvideo/actions/workflows/deploy.yml)

This repository contains the source code for the website [travel.stoman.de](https://travel.stoman.de), a collection of travel videos from various adventures.

## About the Project

The website serves as a visual travel log, showcasing short videos from different cities and countries. A unique feature of this project is the way the videos are concatenated: each video begins with the same people visible as the previous one ended, creating a seamless and continuous journey.

This project is built with [Ember.js](https://emberjs.com/) and uses [Docker](https://www.docker.com/) for containerization, making the development and deployment processes consistent and reliable.

## Getting Started

To get started, you'll need to have [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/) (version >= 20.11) installed on your machine.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/stoman/travelvideo.git
    cd travelvideo
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Local Development

For local development, you can run the Ember.js development server directly. This provides features like live reloading and a dedicated testing environment.

-   **Start the development server:**
    ```bash
    npm start
    ```
    -   Your application will be available at [http://localhost:4200](http://localhost:4200).
    -   You can run the tests at [http://localhost:4200/tests](http://localhost:4200/tests).

-   **Run tests from the command line:**
    ```bash
    npm test
    ```

## Docker-based Development

For a more isolated and reproducible environment, you can use Docker and Docker Compose.

### Running the Application

1.  **Place video files:**
    -   Create a `videos` directory in the project root.
    -   Place all your video files inside this directory.

2.  **Build and run the container:**
    ```bash
    docker-compose up --build
    ```
    -   The website will be available at [http://localhost:8080](http://localhost:8080).

### Running Tests

Testing in a Docker container is the recommended approach as it ensures a consistent environment. The test setup is defined in `docker-compose.test.yml`.

-   **Run all tests (linting and browser tests):**
    ```bash
    docker-compose -f docker-compose.test.yml up --build --exit-code-from test
    ```

-   **Run only linting:**
    ```bash
    docker-compose -f docker-compose.test.yml run --rm test npm run lint
    ```

-   **Fix linting and formatting issues:**
    ```bash
    docker-compose -f docker-compose.test.yml run --rm test npm run lint:fix
    ```

-   **Run only the browser-based tests:**
    ```bash
    docker-compose -f docker-compose.test.yml run --rm test npm run test:ember
    ```

-   **Open an interactive shell in the test container:**
    ```bash
    docker-compose -f docker-compose.test.yml run --rm test bash
    ```

## Linting and Formatting

The project uses ESLint for JavaScript, Stylelint for CSS, and Prettier for code formatting.

-   **Run all linters:**
    ```bash
    npm run lint
    ```

-   **Fix all linting and formatting issues:**
    ```bash
    npm run lint:fix
    ```

## Deployment

Deployments are automated using GitHub Actions and are triggered on every push to the `main` branch. The workflow is defined in `.github/workflows/deploy.yml`.

### Manual Deployment

To deploy manually, you'll need to build and push the Docker image to the container registry.

1.  **Build the Docker image:**
    ```bash
    docker build -t registry.stoman.de/travel:latest .
    ```

2.  **Push the image to the registry:**
    ```bash
    docker push registry.stoman.de/travel:latest
    ```

Once the image is pushed, you can connect to the server and redeploy the application by pulling the latest image.

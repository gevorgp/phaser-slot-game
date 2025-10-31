# Phaser 3 Slot Game (TypeScript)

A simple 3-reel, 1-row slot game built with Phaser 3, TypeScript, and GSAP.

## Features

- Preload and loading screens with a progress bar
- 3 reels, 1 row
- 3 different symbols
- Spin button
- Mock server response for random spin results
- Win detection (3 matching symbols), play win sound, and animation
- Spine-animated object reacting to win/lose states (requires Spine runtime/plugin)
- Background loop sound and sound toggle
- GSAP used for UI animations
- Webpack + TypeScript for development and build

## Requirements

- Node.js 16+ (recommended)
- npm

## Installation

1. Clone the repository:

    ```bash
    git clone <your-repo-url>
    ```

2. Navigate to the project directory:

    ```bash
    cd phaser-slot-game
    ```

3. Install the required dependencies:

    ```bash
    npm install
    ```

## Docker Setup

If you prefer to run the project in a Docker container, you can do so using Docker Compose.

1. Run the project in detached mode:

    ```bash
    docker compose up -d
    ```

## Run the Project

To start the project locally, use the following command:

```bash
npm run start
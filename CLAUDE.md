# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal laboratory for experimenting with HTML canvas and JavaScript, containing interactive games and visual demonstrations. All projects are self-contained HTML files with embedded CSS and JavaScript.

## Project Structure

The repository contains standalone HTML files, each implementing a complete interactive experience:

- `bubble-navigator.html` - Basic bubble floating game with arrow key controls
- `bubble-navigator-controls.html` - Enhanced bubble game with collision detection and runtime controls (bubble count, speed, size)
- `pendulum-gauntlet.html` - 3D pendulum obstacle course using Three.js
- `pendulum-wave.html` - 2D pendulum wave navigation game with physics simulation

## Architecture Patterns

### Game Structure
All games follow a consistent pattern:
- Single HTML file with embedded styles and scripts
- Game loop using `requestAnimationFrame()`
- Object-oriented approach with classes for game entities
- Arrow key controls with event listeners tracking key state
- Game over/restart functionality with overlay messaging

### Physics Implementation
- Pendulum games use realistic physics calculations with gravity and angular acceleration
- Collision detection using distance calculations between circular objects
- Boundary checking for canvas edges

### Visual Design
- Dark themed backgrounds with neon/glowing elements
- CSS box-shadows and canvas shadow effects for visual appeal
- HSL color cycling for dynamic, rainbow-like color schemes
- Responsive canvas sizing (some games use full window, others fixed dimensions)

### Dependencies
- `pendulum-gauntlet.html` uses Three.js from CDN (r128)
- All other games use vanilla JavaScript and HTML5 Canvas API
- No build process or package management required

## Development Workflow

### Testing Games
Open HTML files directly in a web browser - no server required. Each file is completely self-contained.

### Common Modifications
- Adjust physics constants (gravity, speed, angular velocity) in the game loop functions
- Modify visual properties in CSS styles or canvas rendering code
- Change game parameters (number of objects, sizes, colors) in initialization functions
- Add new controls by extending the `keys` object and movement functions

### Code Conventions
- Use ES6 class syntax for game entities
- Consistent naming: `player`, `gameLoop()`, `keys` object for input
- Physics updates in dedicated functions (e.g., `updatePendulums()`)
- Collision detection in separate functions
- Game state management with `gameOver` boolean
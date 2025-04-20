# Flappy Wife - Pregnancy Announcement Game

A customized Flappy Bird-style game designed as a pregnancy announcement.

## Description

This game features a character resembling the wife as the "flappy" character. When the player reaches a score of 10, the game reveals a special pregnancy announcement message in Hebrew. The game is designed for mobile devices and uses pixel art style graphics.

## Features

- Simple one-tap gameplay
- Pixel art graphics
- Hebrew interface
- Special announcement reveal
- Mobile-friendly design

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open in a browser at http://localhost:8080

## Deployment

To create a deployable bundle:

1. Build the project:
   ```
   npm run build
   ```
2. The bundled game will be in the `dist` directory
3. Upload the contents of the `dist` directory to any web hosting service

You can deploy this game to services like:
- GitHub Pages
- Netlify
- Vercel
- Any basic web hosting that supports static files

## Customization

To customize the game:

1. Replace the default assets in the `assets/images` folder with your own pixel art
2. Edit the announcement message in `js/scenes/AnnouncementScene.js`
3. Adjust the target score in `js/scenes/GameScene.js` by changing the `targetScore` variable

## Assets Required

Before running the game, you need to create or add the following assets:

### Images
- player.png - Your wife's character in pixel art style
- pipe.png - Obstacle pipe
- ground.png - Ground image
- background.png - Game background
- announcement.png - Envelope or letter image for the reveal
- pixel.png - 1x1 white pixel for particle effects

### Audio
- flap.mp3 - Sound when player jumps
- score.mp3 - Sound when scoring a point
- hit.mp3 - Sound when hitting an obstacle
- reveal.mp3 - Sound for the announcement reveal

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Phaser 3
 
// js/main.js — starts the game.
// It tells Phaser: how big the game is, how to scale it, and which scenes exist.
// A "scene" = one screen of the game (menu, quiz, level 1, ...).

import { W, H } from "./config.js";
import { BootScene } from "./scenes/BootScene.js";
import { MenuScene } from "./scenes/MenuScene.js";
import { QuizScene } from "./scenes/QuizScene.js";
import { Level1Crossing } from "./scenes/Level1Crossing.js";
import { Level2Driver } from "./scenes/Level2Driver.js";
import { Level3TeachBhai } from "./scenes/Level3TeachBhai.js";
import { LevelCompleteScene } from "./scenes/LevelCompleteScene.js";
import { TeacherScene } from "./scenes/TeacherScene.js";

const config = {
    type: Phaser.AUTO,           // WebGL if possible, otherwise Canvas
    parent: "game",              // the <div id="game"> in index.html
    width: W,
    height: H,
    backgroundColor: "#bde0fe",
    scale: {
        mode: Phaser.Scale.FIT,               // fit any screen, keep the shape
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    input: { activePointers: 3 },            // allow multi-touch (hold GO + tap)
    // The FIRST scene in this list starts automatically
    scene: [
        BootScene, MenuScene, QuizScene,
        Level1Crossing, Level2Driver, Level3TeachBhai,
        LevelCompleteScene, TeacherScene,
    ],
};

window.game = new Phaser.Game(config);

// Offline support: register the service worker, but NOT while developing on
// localhost (otherwise you would keep seeing old code after every change).
const isLocal = ["localhost", "127.0.0.1"].includes(location.hostname);
if ("serviceWorker" in navigator && !isLocal) {
    navigator.serviceWorker.register("sw.js").catch((e) => console.warn("SW failed", e));
}

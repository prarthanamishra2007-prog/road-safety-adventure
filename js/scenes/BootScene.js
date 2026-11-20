// BootScene — runs once at the start. It prepares all pictures, then opens the menu.

import { createTextures } from "../textures.js";

export class BootScene extends Phaser.Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        // LATER (optional): load real images here. Use the SAME key as the drawn one,
        // and the real image replaces the drawn one everywhere. Example:
        //   this.load.image("sita", "images/sita.png");
        //   this.load.image("microbus", "images/microbus.png");
    }

    create() {
        createTextures(this);   // draws any picture that was not loaded from a file
        // Some browsers load voices late; asking once here wakes them up.
        if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
        this.scene.start("Menu");
    }
}

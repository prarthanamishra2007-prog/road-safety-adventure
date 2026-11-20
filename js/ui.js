// js/ui.js — big, child-friendly buttons and message banners used by every scene.

import { FONT, COLORS, TEXT, W } from "./config.js";
import { Sound } from "./sound.js";

function darker(color, amount = 0.8) {
    const c = Phaser.Display.Color.IntegerToColor(color);
    return Phaser.Display.Color.GetColor(c.red * amount, c.green * amount, c.blue * amount);
}

// makeButton(scene, x, y, "Play", () => {...}, { w, h, color, fontSize, onDown, onUp })
// - onClick: runs when the button is tapped
// - onDown / onUp: for HOLD buttons (like GO in level 2)
export function makeButton(scene, x, y, label, onClick, opts = {}) {
    const w = opts.w || 220;
    const h = opts.h || 64;
    const color = opts.color ?? COLORS.green;
    const fontSize = opts.fontSize || 26;

    const shadow = scene.add.graphics();
    shadow.fillStyle(darker(color, 0.7));
    shadow.fillRoundedRect(-w / 2, -h / 2 + 5, w, h, 20);

    const bg = scene.add.graphics();
    const draw = (c) => {
        bg.clear();
        bg.fillStyle(c);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 20);
    };
    draw(color);

    const text = scene.add.text(0, 0, label, {
        fontFamily: FONT, fontSize: fontSize + "px", color: opts.textColor || TEXT.white,
        fontStyle: "bold", align: "center", wordWrap: { width: w - 16 },
    }).setOrigin(0.5);

    const btn = scene.add.container(x, y, [shadow, bg, text]);
    btn.setSize(w, h);
    btn.setInteractive({ useHandCursor: true });
    btn.label = text;

    let enabled = true;
    btn.setEnabled = (on) => {
        enabled = on;
        btn.setAlpha(on ? 1 : 0.45);
        return btn;
    };

    btn.on("pointerover", () => enabled && draw(darker(color, 0.9)));
    btn.on("pointerout", () => {
        draw(color);
        bg.y = 0; text.y = 0;
        if (enabled && opts.onUp) opts.onUp();
    });
    btn.on("pointerdown", () => {
        if (!enabled) return;
        bg.y = 4; text.y = 4;               // "pressed" look
        Sound.unlock();
        if (opts.onDown) opts.onDown();
    });
    btn.on("pointerup", () => {
        bg.y = 0; text.y = 0;
        if (!enabled) return;
        if (opts.onUp) opts.onUp();
        if (onClick) { Sound.click(); onClick(); }
    });
    return btn;
}

// A message banner at the top of the screen. kind: "info" | "good" | "bad"
export function showMessage(scene, message, kind = "info", duration = 3500) {
    if (scene._banner) scene._banner.destroy();
    const colors = { info: COLORS.white, good: 0xd8f3dc, bad: 0xffe5e5 };
    const border = { info: COLORS.blue, good: COLORS.green, bad: COLORS.red };

    const text = scene.add.text(0, 0, message, {
        fontFamily: FONT, fontSize: "22px", color: TEXT.dark, align: "center",
        wordWrap: { width: W - 140 },
    }).setOrigin(0.5);
    const pw = Math.min(W - 80, text.width + 60);
    const ph = text.height + 30;
    const bg = scene.add.graphics();
    bg.fillStyle(colors[kind]); bg.fillRoundedRect(-pw / 2, -ph / 2, pw, ph, 16);
    bg.lineStyle(4, border[kind]); bg.strokeRoundedRect(-pw / 2, -ph / 2, pw, ph, 16);

    const banner = scene.add.container(W / 2, 62 + ph / 2, [bg, text]).setDepth(1000);
    banner.setScale(0.8);
    scene.tweens.add({ targets: banner, scale: 1, duration: 200, ease: "Back.out" });
    scene._banner = banner;

    if (duration > 0) {
        scene.time.delayedCall(duration, () => {
            if (scene._banner === banner) {
                scene.tweens.add({
                    targets: banner, alpha: 0, duration: 300,
                    onComplete: () => { banner.destroy(); if (scene._banner === banner) scene._banner = null; },
                });
            }
        });
    }
    return banner;
}

// Small round icon button (used for mute and back)
export function iconButton(scene, x, y, label, onClick) {
    return makeButton(scene, x, y, label, onClick, { w: 56, h: 56, color: COLORS.dark, fontSize: 24 });
}

// Home + sound buttons in the top-right corner of every level
export function cornerButtons(scene) {
    const home = iconButton(scene, W - 40, 40, "⌂", () => {
        scene.scene.start("Menu");
    }).setDepth(950);
    const mute = iconButton(scene, W - 106, 40, Sound.isMuted() ? "×" : "♪", () => {
        const m = Sound.toggleMute();
        mute.label.setText(m ? "×" : "♪");
    }).setDepth(950);
    return { home, mute };
}

// Score line at the top-left of a level
export function makeHud(scene, title) {
    const t = scene.add.text(16, 12, title, {
        fontFamily: FONT, fontSize: "20px", color: TEXT.white, fontStyle: "bold",
        backgroundColor: "#1f2d3dcc", padding: { x: 10, y: 6 },
    }).setDepth(900);
    return t;
}

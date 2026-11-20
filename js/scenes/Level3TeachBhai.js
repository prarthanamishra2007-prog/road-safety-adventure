// Level3TeachBhai — "Teach Bhai" (our second unique idea: the child becomes the TEACHER)
// Bhai (little brother) walks to school. In each situation he says what he wants to do.
// The child decides: "STOP, Bhai!" or "Go ahead". Teaching someone else helps children
// remember rules better (the "protégé effect").
//
// If the child does not answer in time, it counts as "Go ahead".
// Situations come from js/data/scenarios.js.

import { W, H, FONT, COLORS, TEXT } from "../config.js";
import { t, tx } from "../i18n.js";
import { SCENARIOS } from "../data/scenarios.js";
import { makeButton, showMessage, makeHud, cornerButtons } from "../ui.js";
import { Sound, narrate, stopNarration } from "../sound.js";

const PAVE_TOP = 250, ROAD_TOP = 320, ROAD_MID = 395, ROAD_BOTTOM = 470;
const BHAI_STOP_X = 330;       // where Bhai stops to "think"
const DECIDE_TIME = 9000;      // ms the child has to decide (narration needs time)

export class Level3TeachBhai extends Phaser.Scene {
    constructor() {
        super("Level3");
    }

    create() {
        this.mistakes = 0;
        this.index = 0;
        this.deciding = false;

        this.bg = this.add.graphics();
        this.props = this.add.container(0, 0);
        this.bhai = this.add.image(-40, ROAD_TOP - 2, "bhai").setOrigin(0.5, 1).setDepth(20);

        this.hud = makeHud(this, "");
        this.updateHud();
        cornerButtons(this);

        // the thought bubble
        this.bubbleBg = this.add.graphics().setDepth(30);
        this.bubbleText = this.add.text(W / 2, 150, "", {
            fontFamily: FONT, fontSize: "24px", color: TEXT.dark, align: "center",
            wordWrap: { width: 700 }, fontStyle: "bold",
        }).setOrigin(0.5).setDepth(31);

        // decision buttons
        this.btnStop = makeButton(this, W / 2 - 150, 505, t("stopBhai"), () => this.decide(true), {
            w: 250, h: 62, color: COLORS.red, fontSize: 26,
        }).setDepth(40);
        this.btnGo = makeButton(this, W / 2 + 150, 505, t("goAhead"), () => this.decide(false), {
            w: 250, h: 62, color: COLORS.green, fontSize: 26,
        }).setDepth(40);
        this.btnNext = makeButton(this, W - 110, 505, t("next") + " →", () => this.nextScenario(), {
            w: 170, h: 62, color: COLORS.blue, fontSize: 24,
        }).setDepth(40).setVisible(false);

        this.timerBar = this.add.graphics().setDepth(35);

        showMessage(this, t("l3Goal"), "info", 5000);
        narrate("l3Goal", t("l3Goal"));
        this.time.delayedCall(5200, () => this.startScenario());
        this.showButtons(false);
    }

    updateHud() {
        this.hud.setText(`${t("level3")}   ·   ${this.index + 1}/${SCENARIOS.length}   ·   ${t("mistakes")}: ${this.mistakes}`);
    }

    showButtons(on) {
        this.btnStop.setVisible(on);
        this.btnGo.setVisible(on);
    }

    // ===================== street + props =====================
    drawStreet(noFootpath) {
        const g = this.bg;
        g.clear();
        g.fillStyle(COLORS.sky); g.fillRect(0, 0, W, PAVE_TOP);
        g.fillStyle(noFootpath ? 0xc8a165 : COLORS.pavement); g.fillRect(0, PAVE_TOP, W, ROAD_TOP - PAVE_TOP);
        g.fillStyle(COLORS.road); g.fillRect(0, ROAD_TOP, W, ROAD_BOTTOM - ROAD_TOP);
        if (!noFootpath) { g.fillStyle(COLORS.kerb); g.fillRect(0, ROAD_TOP - 4, W, 4); }
        g.fillStyle(COLORS.laneMark);
        for (let x = 0; x < W; x += 60) g.fillRect(x, ROAD_MID - 2, 32, 4);
        g.fillStyle(COLORS.grass); g.fillRect(0, ROAD_BOTTOM, W, H - ROAD_BOTTOM);
    }

    drawProps(kind) {
        this.props.removeAll(true);
        const add = (o) => { this.props.add(o); return o; };
        add(this.add.image(80, PAVE_TOP, "house").setOrigin(0.5, 1).setScale(0.8));
        add(this.add.image(880, PAVE_TOP, "tree").setOrigin(0.5, 1));

        if (kind === "busGap") {
            add(this.add.image(250, 357, "microbus"));
            add(this.add.image(470, 357, "microbus"));
        }
        if (kind === "zebraGreen") {
            const g = add(this.add.graphics());
            g.fillStyle(COLORS.zebra);
            for (let y = ROAD_TOP + 6; y < ROAD_BOTTOM - 6; y += 26) g.fillRect(372, y, 76, 14);
            g.fillStyle(0x555555); g.fillRect(470, PAVE_TOP - 40, 6, 70);
            g.fillStyle(0x222222); g.fillRoundedRect(455, PAVE_TOP - 100, 36, 62, 6);
            g.fillStyle(0x552222); g.fillCircle(473, PAVE_TOP - 84, 11);
            g.fillStyle(COLORS.green); g.fillCircle(473, PAVE_TOP - 55, 11);   // GREEN man on
            add(this.add.image(290, 357, "car"));                                 // car waiting before the zebra
        }
        if (kind === "ball") {
            this.ballImg = add(this.add.image(380, ROAD_TOP + 30, "ball"));
            this.tweens.add({ targets: this.ballImg, x: 520, y: ROAD_MID + 20, angle: 360, duration: 1500 });
        }
        if (kind === "noFootpath") {
            add(this.add.text(700, 285, t("l3FaceTraffic"), {
                fontFamily: FONT, fontSize: "18px", color: TEXT.dark, backgroundColor: "#ffffffcc", padding: { x: 8, y: 4 },
            }).setOrigin(0.5));
        }
        if (kind === "police") {
            const g = add(this.add.graphics());
            g.fillStyle(0xffffff); g.fillCircle(450, ROAD_MID, 26);            // police stand
            g.lineStyle(4, COLORS.red); g.strokeCircle(450, ROAD_MID, 26);
            add(this.add.image(450, ROAD_MID + 6, "police").setOrigin(0.5, 1));
            add(this.add.text(450, ROAD_MID - 72, "STOP", {
                fontFamily: FONT, fontSize: "18px", color: "#ffffff", fontStyle: "bold",
                backgroundColor: "#e74c3c", padding: { x: 6, y: 3 },
            }).setOrigin(0.5));
        }
        if (kind === "bridge") {
            const g = add(this.add.graphics());
            g.fillStyle(0x6c757d); g.fillRect(380, 150, 240, 22);              // bridge deck over the road
            g.fillRect(380, 172, 14, ROAD_BOTTOM - 172); g.fillRect(606, 172, 14, ROAD_BOTTOM - 172); // pillars
            g.fillStyle(0x495057);
            for (let i = 0; i < 6; i++) g.fillRect(380 - (i + 1) * 14, 150 + i * 17, 16, 8);           // stairs
            // busy traffic
            ["car", "taxi", "bike", "car2"].forEach((k, i) => {
                const c = add(this.add.image(-100 - i * 220, 357, k));
                this.tweens.add({ targets: c, x: W + 200, duration: 3200, delay: i * 400, repeat: -1 });
            });
        }
        if (kind === "phone") {
            const g = add(this.add.graphics());
            g.fillStyle(0x222222); g.fillRoundedRect(BHAI_STOP_X + 12, ROAD_TOP - 40, 12, 20, 3); // phone in hand
            g.fillStyle(0x9ad1ff); g.fillRect(BHAI_STOP_X + 14, ROAD_TOP - 37, 8, 13);           // screen
            add(this.add.image(640, 357, "car"));
        }
        if (kind === "jumpOff") {
            const bus = add(this.add.image(BHAI_STOP_X + 40, 357, "microbus"));
            this.tweens.add({ targets: bus, x: BHAI_STOP_X + 120, duration: 2500 }); // still moving!
        }
    }

    // ===================== one situation =====================
    startScenario() {
        const s = SCENARIOS[this.index];
        this.updateHud();
        this.btnNext.setVisible(false);
        this.drawStreet(s.props === "noFootpath");
        this.drawProps(s.props);
        this.setBubble("");

        this.bhai.setPosition(-40, ROAD_TOP - 2).setAlpha(1);
        this.tweens.add({
            targets: this.bhai, x: BHAI_STOP_X, duration: 1800,
            onComplete: () => this.askChild(s),
        });
    }

    setBubble(text, color = 0xffffff) {
        this.bubbleBg.clear();
        this.bubbleText.setText(text);
        if (!text) return;
        const w = this.bubbleText.width + 50, h = this.bubbleText.height + 34;
        const x = W / 2 - w / 2, y = 150 - h / 2;
        this.bubbleBg.fillStyle(color); this.bubbleBg.fillRoundedRect(x, y, w, h, 18);
        this.bubbleBg.lineStyle(3, COLORS.dark); this.bubbleBg.strokeRoundedRect(x, y, w, h, 18);
        // little tail pointing at Bhai
        this.bubbleBg.fillStyle(color);
        this.bubbleBg.fillTriangle(BHAI_STOP_X - 10, y + h - 2, BHAI_STOP_X + 20, y + h - 2, BHAI_STOP_X, ROAD_TOP - 60);
    }

    askChild(s) {
        this.setBubble(tx(s.intent));
        narrate("l3_" + s.id, tx(s.intent));
        this.showButtons(true);
        this.deciding = true;
        this.decideStart = this.time.now;
        this.decideEvent = this.time.delayedCall(DECIDE_TIME, () => this.decide(false)); // no answer = go
    }

    decide(stop) {
        if (!this.deciding) return;
        this.deciding = false;
        this.decideEvent?.remove();
        this.timerBar.clear();
        this.showButtons(false);
        stopNarration();

        const s = SCENARIOS[this.index];
        const correct = stop === s.unsafe;
        if (!correct) { this.mistakes++; this.updateHud(); }

        if (stop) {
            // Bhai stops and thanks the child
            this.tweens.add({ targets: this.bhai, y: this.bhai.y - 14, yoyo: true, duration: 160, repeat: 1 });
            this.afterAction(s, correct);
        } else if (s.unsafe) {
            // Bhai steps into the road -> a vehicle has to brake hard (gentle, no crash)
            this.tweens.add({ targets: this.bhai, y: ROAD_TOP + 50, duration: 600 });
            const car = this.add.image(-120, 357, "car").setDepth(15);
            this.props.add(car);
            this.tweens.add({
                targets: car, x: BHAI_STOP_X - 110, duration: 900, delay: 300, ease: "Cubic.out",
                onStart: () => Sound.horn(-0.7),
                onComplete: () => {
                    this.cameras.main.shake(200, 0.006);
                    this.tweens.add({ targets: this.bhai, y: ROAD_TOP - 2, duration: 400 });
                    this.afterAction(s, correct);
                },
            });
        } else {
            // a safe choice: Bhai does it
            this.tweens.add({
                targets: this.bhai, x: W + 40, duration: 2200,
                onComplete: () => this.afterAction(s, correct),
            });
        }
    }

    afterAction(s, correct) {
        if (correct) Sound.good(); else Sound.oops();
        const head = correct ? "✓ " : "✗ ";
        this.setBubble(head + tx(s.explain), correct ? 0xd8f3dc : 0xffe5e5);
        narrate("l3_" + s.id + "_explain", tx(s.explain));
        this.btnNext.setVisible(true);
    }

    nextScenario() {
        if (this.deciding) return;
        stopNarration();
        this.index++;
        if (this.index >= SCENARIOS.length) {
            this.scene.start("LevelComplete", { level: 3, mistakes: this.mistakes });
        } else {
            this.startScenario();
        }
    }

    update() {
        // shrinking bar = time left to decide
        if (!this.deciding) return;
        const left = 1 - (this.time.now - this.decideStart) / DECIDE_TIME;
        this.timerBar.clear();
        this.timerBar.fillStyle(0x1f2d3d, 0.6); this.timerBar.fillRect(W / 2 - 200, 455, 400, 10);
        this.timerBar.fillStyle(left > 0.3 ? COLORS.yellow : COLORS.red);
        this.timerBar.fillRect(W / 2 - 200, 455, 400 * Math.max(0, left), 10);
    }
}

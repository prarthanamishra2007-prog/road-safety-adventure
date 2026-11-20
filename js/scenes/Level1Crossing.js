// Level1Crossing — "Cross to School"
// The child walks Sita from the bottom pavement to the school at the top.
// Rules taught:
//   1. Cross only on the zebra crossing
//   2. Press the button and wait for the GREEN man
//   3. Stop at the kerb and look RIGHT, LEFT, RIGHT (Nepal drives on the left!)
// Breaking a rule never "kills" Sita: the game stops her, explains, and lets her try again.
//
// Controls: arrow keys / WASD, or TAP where Sita should walk.
//           SPACE = push the crossing button. Q = look left, E = look right.

import { W, H, FONT, COLORS, TEXT, ROAD, starsFor } from "../config.js";
import { t } from "../i18n.js";
import { makeButton, showMessage, makeHud, cornerButtons } from "../ui.js";
import { Sound, narrate } from "../sound.js";

const SPEED = 150;                 // how fast Sita walks (pixels per second)
const START = { x: 120, y: 450 };  // where Sita starts (her feet)
const KERB_RESET = { x: 480, y: 440 }; // where she goes back to after a mistake
const POLE = { x: 575, y: 455 };   // the crossing button (under the light, right of the zebra)
const LANE_UP_Y = 275;             // upper lane: vehicles drive RIGHT
const LANE_DOWN_Y = 365;           // lower lane: vehicles drive LEFT (they come from Sita's right)

export class Level1Crossing extends Phaser.Scene {
    constructor() {
        super("Level1");
    }

    create() {
        // ----- state -----
        this.mistakes = 0;
        this.signal = "carsGo";      // carsGo -> carsStop -> pedGreen -> pedFlash -> carsGo
        this.requested = false;      // has someone pressed the button?
        this.lookSeq = [];           // e.g. ["R","L","R"]
        this.lookDone = false;
        this.onRoad = false;
        this.finished = false;
        this.frozen = false;         // true while we show a "Stop!" moment
        this.target = null;          // where the player tapped
        this.cars = [];

        this.drawWorld();
        this.signalGfx = this.add.graphics().setDepth(5);
        this.drawSignal();

        // bouncing arrow over the crossing button until the child presses it
        this.hint = this.add.text(POLE.x, POLE.y - 40, "▼", {
            fontFamily: FONT, fontSize: "32px", color: "#e74c3c",
        }).setOrigin(0.5).setDepth(50);
        this.tweens.add({ targets: this.hint, y: POLE.y - 28, yoyo: true, repeat: -1, duration: 400 });

        // ----- Sita -----
        this.player = this.add.image(START.x, START.y, "sita").setOrigin(0.5, 1).setDepth(20);
        this.lookText = this.add.text(0, 0, "", {
            fontFamily: FONT, fontSize: "30px", color: TEXT.dark, fontStyle: "bold",
            backgroundColor: "#ffffff", padding: { x: 6, y: 0 },
        }).setOrigin(0.5).setDepth(30).setVisible(false);

        // ----- HUD + buttons -----
        this.hud = makeHud(this, "");
        this.updateHud();
        cornerButtons(this);

        this.btnPush = makeButton(this, 300, 505, t("pushButton"), () => this.pushButton(), {
            w: 190, h: 54, color: COLORS.yellow, textColor: TEXT.dark, fontSize: 22,
        }).setDepth(40);
        this.btnLeft = makeButton(this, 560, 505, "← " + t("lookLeft"), () => this.look("L"), {
            w: 190, h: 54, color: COLORS.blue, fontSize: 22,
        }).setDepth(40);
        this.btnRight = makeButton(this, 770, 505, t("lookRight") + " →", () => this.look("R"), {
            w: 190, h: 54, color: COLORS.blue, fontSize: 22,
        }).setDepth(40);

        // ----- keyboard -----
        this.keys = this.input.keyboard.addKeys("UP,DOWN,LEFT,RIGHT,W,A,S,D,SPACE,Q,E");
        this.keys.SPACE.on("down", () => this.pushButton());
        this.keys.Q.on("down", () => this.look("L"));
        this.keys.E.on("down", () => this.look("R"));

        // ----- tap to walk (ignore taps on buttons) -----
        this.input.on("pointerdown", (pointer, over) => {
            if (over.length > 0 || this.finished) return;
            this.target = { x: pointer.worldX, y: pointer.worldY };
        });

        // ----- traffic -----
        this.time.addEvent({ delay: 2300, loop: true, callback: () => this.spawnCar("down") });
        this.time.addEvent({ delay: 2900, loop: true, callback: () => this.spawnCar("up"), startAt: 1200 });
        this.spawnCar("down");

        // ----- intro -----
        showMessage(this, t("l1Goal"), "info", 4500);
        narrate("l1Goal", t("l1Goal"));
        this.time.delayedCall(4800, () => {
            if (!this.finished) { showMessage(this, t("l1Press"), "info", 5000); narrate("l1Press", t("l1Press")); }
        });
    }

    // ===================== drawing =====================
    drawWorld() {
        const g = this.add.graphics();
        // grass + pavements + road
        g.fillStyle(COLORS.grass); g.fillRect(0, 0, W, H);
        g.fillStyle(COLORS.pavement); g.fillRect(0, 180, W, ROAD.top - 180);       // top pavement
        g.fillStyle(COLORS.pavement); g.fillRect(0, ROAD.bottom, W, 60);           // bottom pavement
        g.fillStyle(COLORS.road); g.fillRect(0, ROAD.top, W, ROAD.bottom - ROAD.top);
        g.fillStyle(COLORS.kerb); g.fillRect(0, ROAD.top - 4, W, 4); g.fillRect(0, ROAD.bottom, W, 4);
        // centre line (dashed)
        g.fillStyle(COLORS.laneMark);
        for (let x = 0; x < W; x += 60) g.fillRect(x, ROAD.middle - 2, 32, 4);
        // zebra crossing
        g.fillStyle(COLORS.road); g.fillRect(ROAD.zebraLeft, ROAD.top, ROAD.zebraRight - ROAD.zebraLeft, ROAD.bottom - ROAD.top);
        g.fillStyle(COLORS.zebra);
        for (let y = ROAD.top + 6; y < ROAD.bottom - 6; y += 26) g.fillRect(ROAD.zebraLeft + 4, y, ROAD.zebraRight - ROAD.zebraLeft - 8, 14);
        // stop lines for vehicles
        g.fillStyle(COLORS.white);
        g.fillRect(ROAD.zebraLeft - 14, ROAD.top, 5, ROAD.middle - ROAD.top);      // upper lane stops LEFT of zebra
        g.fillRect(ROAD.zebraRight + 9, ROAD.middle, 5, ROAD.bottom - ROAD.middle); // lower lane stops RIGHT of zebra

        // school at the top, trees
        this.add.image(480, 178, "school").setOrigin(0.5, 1);
        this.add.text(480, 52, "SCHOOL / विद्यालय", {
            fontFamily: FONT, fontSize: "14px", color: "#ffffff", fontStyle: "bold",
        }).setOrigin(0.5);
        [70, 200, 760, 890].forEach((x) => this.add.image(x, 120, "tree"));
        this.add.image(40, 500, "tree").setScale(0.8);

        // the crossing-button box under the near-side light
        g.fillStyle(0x555555); g.fillRoundedRect(ROAD.zebraRight + 44, ROAD.bottom + 44, 22, 16, 4);
    }

    drawSignal() {
        const g = this.signalGfx;
        g.clear();
        const redOn = this.signal === "carsGo" || this.signal === "carsStop";
        const greenOn = this.signal === "pedGreen" || (this.signal === "pedFlash" && this.flashOn);
        // one light box on each pavement: near side (y=420) and far side (y=188)
        [ROAD.bottom + 10, 188].forEach((y) => {
            const x = ROAD.zebraRight + 22;
            g.fillStyle(0x222222); g.fillRoundedRect(x, y, 66, 34, 8);
            g.fillStyle(redOn ? COLORS.red : 0x552222); g.fillCircle(x + 17, y + 17, 11);     // RED man
            g.fillStyle(greenOn ? COLORS.green : 0x224422); g.fillCircle(x + 49, y + 17, 11); // GREEN man
        });
        // little "waiting" light on the button box when the button was pressed
        g.fillStyle(this.requested ? COLORS.yellow : 0x444444); g.fillCircle(ROAD.zebraRight + 55, ROAD.bottom + 52, 5);
    }

    updateHud() {
        this.hud.setText(`${t("level1")}   ·   ${t("mistakes")}: ${this.mistakes}`);
    }

    // ===================== the crossing signal =====================
    pushButton() {
        if (this.finished) return;
        const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, POLE.x, POLE.y);
        if (d > 110) {
            showMessage(this, t("l1Press"), "info");
            return;
        }
        if (this.requested || this.signal !== "carsGo") return;
        this.requested = true;
        this.hint.setVisible(false);
        this.drawSignal();
        // after 1.5 s vehicles must stop; after 3 s the green man appears
        this.time.delayedCall(1500, () => { this.signal = "carsStop"; this.drawSignal(); });
        this.time.delayedCall(3000, () => {
            this.signal = "pedGreen"; this.requested = false; this.drawSignal();
            showMessage(this, this.lookDone ? t("l1LookOk") : t("l1Look"), "good", 3000);
            this.tick = this.time.addEvent({ delay: 500, loop: true, callback: () => Sound.beepCrossing() });
        });
        this.time.delayedCall(12000, () => {
            this.signal = "pedFlash"; this.drawSignal();
            this.flasher = this.time.addEvent({
                delay: 300, repeat: 7, callback: () => { this.flashOn = !this.flashOn; this.drawSignal(); },
            });
        });
        this.time.delayedCall(14500, () => {
            this.signal = "carsGo"; this.flashOn = false;
            if (this.tick) this.tick.remove();
            this.drawSignal();
        });
    }

    vehiclesMustStop() {
        return this.signal !== "carsGo" || this.onRoad;
    }

    // ===================== looking =====================
    nearKerbAtZebra() {
        const p = this.player;
        return p.x > ROAD.zebraLeft - 30 && p.x < ROAD.zebraRight + 30 && p.y >= ROAD.bottom && p.y < ROAD.bottom + 55;
    }

    look(dir) {
        if (this.finished || this.onRoad) return;
        this.lookText.setText(dir === "R" ? "→" : "←").setVisible(true);
        this.time.delayedCall(700, () => this.lookText.setVisible(false));
        Sound.click();
        if (!this.nearKerbAtZebra()) return; // looking elsewhere is fine, it just doesn't count

        this.lookSeq.push(dir);
        if (this.lookSeq[0] !== "R") {
            this.lookSeq = [];
            showMessage(this, t("l1WrongOrder"), "bad");
            narrate("l1WrongOrder", t("l1WrongOrder"));
            return;
        }
        const goal = ["R", "L", "R"];
        for (let i = 0; i < this.lookSeq.length; i++) {
            if (this.lookSeq[i] !== goal[i]) {
                this.lookSeq = [];
                showMessage(this, t("l1Look"), "bad");
                return;
            }
        }
        if (this.lookSeq.length === 3) {
            this.lookDone = true;
            Sound.good();
            showMessage(this, t("l1LookOk"), "good");
            narrate("l1LookOk", t("l1LookOk"));
        }
    }

    // ===================== mistakes =====================
    mistake(messageKey, hornPan = null) {
        if (this.frozen) return;
        this.frozen = true;
        this.mistakes++;
        this.updateHud();
        if (hornPan !== null) Sound.horn(hornPan); else Sound.oops();
        showMessage(this, t(messageKey), "bad", 4000);
        narrate(messageKey, t(messageKey));
        this.target = null;
        this.onRoad = false;
        this.lookSeq = [];
        this.lookDone = false;
        this.cameras.main.shake(150, 0.004);
        // gently walk Sita back to the kerb
        this.tweens.add({
            targets: this.player, x: KERB_RESET.x, y: KERB_RESET.y, duration: 600, ease: "Sine.out",
            onComplete: () => { this.frozen = false; },
        });
    }

    // ===================== traffic =====================
    spawnCar(lane) {
        if (this.finished) return;
        const types = ["car", "car2", "taxi", "microbus", "bike", "bike", "tempo"];
        const key = Phaser.Utils.Array.GetRandom(types);
        const goingLeft = lane === "down";
        const img = this.add.image(goingLeft ? W + 80 : -80, goingLeft ? LANE_DOWN_Y : LANE_UP_Y, key).setDepth(10);
        if (goingLeft) img.setFlipX(true);
        const car = { img, lane, w: img.width, h: img.height, speed: Phaser.Math.Between(150, 210) };
        // don't spawn on top of another car
        const blocked = this.cars.some((c) => c.lane === lane && (goingLeft ? c.img.x > W - c.w : c.img.x < c.w));
        if (blocked) { img.destroy(); return; }
        this.cars.push(car);
    }

    moveCars(dt) {
        const stopForCrossing = this.vehiclesMustStop();
        for (const lane of ["up", "down"]) {
            const goingLeft = lane === "down";
            // order cars front-first
            const list = this.cars.filter((c) => c.lane === lane)
                .sort((a, b) => (goingLeft ? a.img.x - b.img.x : b.img.x - a.img.x));
            list.forEach((car, i) => {
                const x = car.img.x;
                let nx = goingLeft ? x - car.speed * dt : x + car.speed * dt;
                // 1) stop line
                if (stopForCrossing) {
                    if (goingLeft) {
                        const line = ROAD.zebraRight + 16 + car.w / 2;
                        if (x >= line - 1) nx = Math.max(nx, line);
                    } else {
                        const line = ROAD.zebraLeft - 16 - car.w / 2;
                        if (x <= line + 1) nx = Math.min(nx, line);
                    }
                }
                // 2) keep a gap behind the car in front
                const ahead = list[i - 1];
                if (ahead) {
                    const gap = 18;
                    if (goingLeft) nx = Math.max(nx, ahead.img.x + ahead.w / 2 + gap + car.w / 2);
                    else nx = Math.min(nx, ahead.img.x - ahead.w / 2 - gap - car.w / 2);
                }
                car.img.x = nx;
            });
        }
        // remove cars that left the screen
        this.cars = this.cars.filter((c) => {
            const gone = c.img.x < -150 || c.img.x > W + 150;
            if (gone) c.img.destroy();
            return !gone;
        });
    }

    checkHitByCar() {
        const p = this.player;
        const feet = new Phaser.Geom.Rectangle(p.x - 12, p.y - 16, 24, 16);
        for (const c of this.cars) {
            const r = new Phaser.Geom.Rectangle(c.img.x - c.w / 2, c.img.y - c.h / 2, c.w, c.h);
            if (Phaser.Geom.Intersects.RectangleToRectangle(feet, r)) {
                this.mistake("l1Hit", c.img.x > p.x ? 0.8 : -0.8);
                return;
            }
        }
    }

    // ===================== every frame =====================
    update(time, delta) {
        const dt = delta / 1000;
        this.moveCars(dt);
        if (this.finished || this.frozen) return;

        // ----- which way does the player want to walk? -----
        const k = this.keys;
        let vx = 0, vy = 0;
        if (k.LEFT.isDown || k.A.isDown) vx = -1;
        if (k.RIGHT.isDown || k.D.isDown) vx = 1;
        if (k.UP.isDown || k.W.isDown) vy = -1;
        if (k.DOWN.isDown || k.S.isDown) vy = 1;
        if (vx || vy) {
            this.target = null;
        } else if (this.target) {
            const dx = this.target.x - this.player.x;
            const dy = this.target.y - this.player.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 4) this.target = null;
            else { vx = dx / dist; vy = dy / dist; }
        }
        const len = Math.hypot(vx, vy) || 1;
        let nx = this.player.x + (vx / len) * SPEED * dt;
        let ny = this.player.y + (vy / len) * SPEED * dt;
        nx = Phaser.Math.Clamp(nx, 20, W - 20);
        ny = Phaser.Math.Clamp(ny, 196, 470);

        // ----- RULES: stepping from the bottom pavement onto the road -----
        const wasOnPavement = this.player.y >= ROAD.bottom;
        const goingOntoRoad = wasOnPavement && ny < ROAD.bottom;
        if (goingOntoRoad && !this.onRoad) {
            const onZebra = nx >= ROAD.zebraLeft && nx <= ROAD.zebraRight;
            if (!onZebra) return this.mistake("l1NotZebra");
            if (!this.lookDone) return this.mistake("l1NoLook");
            if (this.signal !== "pedGreen") return this.mistake("l1WaitGreen");
            this.onRoad = true;      // all rules followed: Sita may cross
        }

        // while on the road, stay on the zebra
        if (this.onRoad) nx = Phaser.Math.Clamp(nx, ROAD.zebraLeft + 8, ROAD.zebraRight - 8);

        this.player.x = nx;
        this.player.y = ny;
        // small left-right wobble while walking, so she looks alive
        const moving = vx !== 0 || vy !== 0;
        this.player.setAngle(moving ? Math.sin(time / 70) * 5 : 0);
        this.lookText.setPosition(nx, ny - 66);

        if (this.onRoad) this.checkHitByCar();

        // ----- reached the other side? -----
        if (this.onRoad && this.player.y <= ROAD.top) {
            this.onRoad = false;
            this.win();
        }
    }

    win() {
        this.finished = true;
        Sound.good();
        showMessage(this, t("levelDone"), "good", 2000);
        this.tweens.add({
            targets: this.player, x: 480, y: 196, duration: 900,
            onComplete: () => this.scene.start("LevelComplete", { level: 1, mistakes: this.mistakes }),
        });
    }
}

// Level2Driver — "Be the Driver" (our unique idea: the child SWITCHES SIDES)
// The child drives a microbus to school and sees the road from the driver's seat:
//   1. Children crossing at a zebra crossing   -> drivers must stop
//   2. A child steps out from BEHIND a parked bus -> the driver could not see her
//   3. A ball rolls out, and a child runs after it
// The lesson: "This is why YOU must never cross from behind a bus / run after a ball."
//
// Controls: hold GO (or RIGHT / UP / D) to drive, BRAKE (or SPACE / LEFT / DOWN / S) to stop.

import { W, H, FONT, COLORS, TEXT, starsFor } from "../config.js";
import { t } from "../i18n.js";
import { makeButton, showMessage, makeHud, cornerButtons } from "../ui.js";
import { Sound, narrate } from "../sound.js";

const PX = 230;            // where the microbus is drawn on screen (x)
const PY = 245;            // microbus lane (upper lane = driving RIGHT, Nepal drives on the left)
const ROAD_TOP = 200, ROAD_MID = 290, ROAD_BOTTOM = 380;
const WORLD_LEN = 4500;    // length of the street in pixels
const FINISH = 4150;       // school drop-off point
const MAX_SPEED = 280, ACCEL = 160, BRAKE = 520, COAST = 40;
const SAFE_SPEED = 140;    // "slow" speed for the school zone
const SCHOOL_ZONE_START = 800;

export class Level2Driver extends Phaser.Scene {
    constructor() {
        super("Level2");
    }

    create() {
        this.mistakes = 0;
        this.wx = 300;           // world position of the microbus centre
        this.speed = 0;
        this.going = false;
        this.braking = false;
        this.finished = false;
        this.fastTimer = 0;
        this.warnedSlow = false;
        this.oncoming = [];

        // everything that belongs to the street lives in this container,
        // we move the container left to make the street "scroll"
        this.world = this.add.container(0, 0);
        this.drawStreet();
        this.createHazards();

        this.bus = this.add.image(PX, PY, "microbus").setDepth(20);
        this.busHalf = this.bus.width / 2;

        // ----- HUD -----
        this.hud = makeHud(this, "");
        this.updateHud();
        cornerButtons(this);
        this.speedBar = this.add.graphics().setDepth(900);
        this.add.text(30, 470, t("speed"), {
            fontFamily: FONT, fontSize: "18px", color: TEXT.dark, fontStyle: "bold",
        }).setDepth(900);

        // ----- buttons (hold) -----
        makeButton(this, 610, 495, t("brake"), null, {
            w: 200, h: 70, color: COLORS.red, fontSize: 28,
            onDown: () => { this.braking = true; }, onUp: () => { this.braking = false; },
        }).setDepth(40);
        makeButton(this, 840, 495, t("go"), null, {
            w: 200, h: 70, color: COLORS.green, fontSize: 28,
            onDown: () => { this.going = true; }, onUp: () => { this.going = false; },
        }).setDepth(40);

        this.keys = this.input.keyboard.addKeys("UP,DOWN,LEFT,RIGHT,W,S,A,D,SPACE");

        this.time.addEvent({ delay: 2600, loop: true, callback: () => this.spawnOncoming() });

        showMessage(this, t("l2Goal"), "info", 4500);
        narrate("l2Goal", t("l2Goal"));
        this.time.delayedCall(4700, () => {
            if (!this.finished) { showMessage(this, t("l2Controls"), "info", 4000); narrate("l2Controls", t("l2Controls")); }
        });
    }

    // ===================== street =====================
    drawStreet() {
        const g = this.add.graphics();
        this.world.add(g);
        g.fillStyle(COLORS.grass); g.fillRect(0, 0, WORLD_LEN, H);
        g.fillStyle(COLORS.pavement); g.fillRect(0, 120, WORLD_LEN, ROAD_TOP - 120);
        g.fillStyle(COLORS.pavement); g.fillRect(0, ROAD_BOTTOM, WORLD_LEN, 60);
        g.fillStyle(COLORS.road); g.fillRect(0, ROAD_TOP, WORLD_LEN, ROAD_BOTTOM - ROAD_TOP);
        g.fillStyle(COLORS.kerb); g.fillRect(0, ROAD_TOP - 4, WORLD_LEN, 4); g.fillRect(0, ROAD_BOTTOM, WORLD_LEN, 4);
        g.fillStyle(COLORS.laneMark);
        for (let x = 0; x < WORLD_LEN; x += 60) g.fillRect(x, ROAD_MID - 2, 32, 4);

        // zebra crossing at x = 1400..1480
        g.fillStyle(COLORS.zebra);
        for (let y = ROAD_TOP + 6; y < ROAD_BOTTOM - 6; y += 26) g.fillRect(1404, y, 72, 14);
        g.fillStyle(COLORS.white); g.fillRect(1380, ROAD_TOP, 5, ROAD_MID - ROAD_TOP); // stop line

        // drop-off box at the school
        g.lineStyle(4, COLORS.yellow); g.strokeRect(FINISH, ROAD_TOP + 8, 160, ROAD_MID - ROAD_TOP - 16);

        // trees, houses, school
        for (let x = 150; x < WORLD_LEN - 300; x += 330) this.world.add(this.add.image(x, 70, "tree"));
        this.world.add(this.add.image(600, 118, "house").setOrigin(0.5, 1));
        this.world.add(this.add.image(2800, 118, "house").setOrigin(0.5, 1));
        this.world.add(this.add.image(FINISH + 80, 118, "school").setOrigin(0.5, 1).setScale(0.75));

        // school-zone sign
        const sign = this.add.text(SCHOOL_ZONE_START, 150, t("l2SchoolZone"), {
            fontFamily: FONT, fontSize: "16px", color: TEXT.dark, fontStyle: "bold",
            backgroundColor: "#ffd60a", padding: { x: 8, y: 6 },
        }).setOrigin(0.5);
        this.world.add(sign);
    }

    // a pedestrian = a child sprite inside the world + which hazard it belongs to
    addChild(x, y, key, hazard) {
        const img = this.add.image(x, y, key).setOrigin(0.5, 1);
        this.world.add(img);
        return { img, hazard };
    }

    createHazards() {
        this.peds = [];
        this.hazards = {
            zebra: { trigger: 1000, started: false, done: false, mistake: false, msg: "l2Zebra" },
            bus: { trigger: 2180, started: false, done: false, mistake: false, msg: "l2Bus" },
            ball: { trigger: 3040, started: false, done: false, mistake: false, msg: "l2Ball" },
        };

        // 1) three children waiting at the zebra crossing
        ["child", "child2", "child"].forEach((key, i) => {
            this.peds.push(this.addChild(1420 + i * 20, 190, key, "zebra"));
        });

        // 2) parked bus, with a child hidden behind it (drawn BEFORE the bus, so the bus covers her)
        this.peds.push(this.addChild(2372, 186, "child2", "bus"));
        this.world.add(this.add.image(2300, 180, "bus"));

        // 3) a ball and a child
        this.ball = this.add.image(3300, 180, "ball");
        this.world.add(this.ball);
        this.peds.push(this.addChild(3290, 175, "child", "ball"));
    }

    startHazard(name) {
        const hz = this.hazards[name];
        hz.started = true;
        const peds = this.peds.filter((p) => p.hazard === name);

        if (name === "zebra") {
            peds.forEach((p, i) => this.tweens.add({
                targets: p.img, y: 430, duration: 5500, delay: i * 350,
            }));
        }
        if (name === "bus") {
            const p = peds[0];
            this.tweens.chain({
                targets: p.img,
                tweens: [
                    { y: 300, duration: 1600 },        // steps out from behind the bus
                    { y: 300, duration: 500 },         // stops, frightened
                    { y: 430, duration: 1600 },        // finishes crossing
                ],
            });
        }
        if (name === "ball") {
            this.tweens.add({ targets: this.ball, y: 430, angle: 360, duration: 1200 });
            this.tweens.add({ targets: peds[0].img, y: 430, duration: 2600, delay: 700 });
        }
    }

    // a pedestrian is "in my lane" when her body overlaps the upper lane
    inMyLane(p) {
        const feet = p.img.y;
        const head = feet - p.img.height;
        return feet > ROAD_TOP + 18 && head < ROAD_MID;
    }

    // ===================== oncoming traffic (decoration) =====================
    spawnOncoming() {
        if (this.finished) return;
        const key = Phaser.Utils.Array.GetRandom(["car", "taxi", "bike", "car2"]);
        const img = this.add.image(W + 80, 335, key).setFlipX(true).setDepth(15);
        this.oncoming.push(img);
    }

    updateHud() {
        this.hud.setText(`${t("level2")}   ·   ${t("mistakes")}: ${this.mistakes}`);
    }

    drawSpeed() {
        const g = this.speedBar;
        g.clear();
        const x = 30, y = 500, w = 240, h = 18;
        g.fillStyle(0x1f2d3d, 0.8); g.fillRoundedRect(x - 4, y - 4, w + 8, h + 8, 6);
        const fast = this.speed > SAFE_SPEED;
        g.fillStyle(fast ? COLORS.red : COLORS.green);
        g.fillRect(x, y, (this.speed / MAX_SPEED) * w, h);
        g.fillStyle(COLORS.white); g.fillRect(x + (SAFE_SPEED / MAX_SPEED) * w, y - 4, 3, h + 8); // "slow" mark
    }

    // ===================== every frame =====================
    update(time, delta) {
        const dt = delta / 1000;
        if (this.finished) return;

        // ----- input -----
        const k = this.keys;
        const go = this.going || k.RIGHT.isDown || k.UP.isDown || k.D.isDown || k.W.isDown;
        const brake = this.braking || k.SPACE.isDown || k.LEFT.isDown || k.DOWN.isDown || k.S.isDown;

        if (brake) this.speed -= BRAKE * dt;
        else if (go) this.speed += ACCEL * dt;
        else this.speed -= COAST * dt;
        this.speed = Phaser.Math.Clamp(this.speed, 0, MAX_SPEED);
        // red tint while braking = brake lights
        if (brake) this.bus.setTint(0xffb3b3); else this.bus.clearTint();

        let nextWx = this.wx + this.speed * dt;
        const front = () => nextWx + this.busHalf;

        // ----- start hazards when we get close -----
        for (const [name, hz] of Object.entries(this.hazards)) {
            if (!hz.started && front() > hz.trigger) this.startHazard(name);
        }

        // ----- zebra crossing: must stop at the line while children are on the road -----
        const zebraKids = this.peds.filter((p) => p.hazard === "zebra");
        const kidsOnRoad = zebraKids.some((p) => p.img.y > ROAD_TOP + 5 && p.img.y < ROAD_BOTTOM + 30);
        const stopLine = 1380;
        if (kidsOnRoad && this.wx + this.busHalf <= stopLine + 2 && front() > stopLine) {
            if (this.speed > 40) this.hazardMistake("zebra");
            nextWx = stopLine - this.busHalf;
            this.speed = 0;
        }

        // ----- a child in my lane right in front of me -----
        for (const p of this.peds) {
            if (p.hazard === "zebra" || !this.inMyLane(p)) continue;
            const childLeft = p.img.x - 14;
            if (this.wx + this.busHalf <= childLeft + 4 && front() > childLeft - 6) {
                if (this.speed > 40) this.hazardMistake(p.hazard);
                nextWx = childLeft - 8 - this.busHalf;
                this.speed = 0;
            }
        }

        this.wx = nextWx;
        this.world.x = PX - this.wx;

        // ----- hazards finished? show the lesson -----
        for (const [name, hz] of Object.entries(this.hazards)) {
            if (!hz.started || hz.done) continue;
            const peds = this.peds.filter((p) => p.hazard === name);
            if (peds.every((p) => p.img.y >= 425)) {
                hz.done = true;
                if (!hz.mistake) {
                    Sound.good();
                    showMessage(this, t("l2Good") + " " + t(hz.msg), "good", 5500);
                    narrate(hz.msg, t(hz.msg));
                }
            }
        }

        // ----- too fast in the school zone? friendly warning (not a mistake) -----
        if (this.wx > SCHOOL_ZONE_START && this.speed > SAFE_SPEED + 20) this.fastTimer += dt;
        else this.fastTimer = 0;
        if (this.fastTimer > 1.5 && !this.warnedSlow) {
            this.warnedSlow = true;
            showMessage(this, t("l2Slow"), "info", 3500);
            narrate("l2Slow", t("l2Slow"));
        }

        // ----- oncoming cars -----
        this.oncoming.forEach((c) => { c.x -= (170 + this.speed) * dt; });
        this.oncoming = this.oncoming.filter((c) => {
            if (c.x < -150) { c.destroy(); return false; }
            return true;
        });

        this.drawSpeed();

        // ----- arrived at school -----
        if (this.wx + this.busHalf >= FINISH + 60) this.win();
    }

    hazardMistake(name) {
        const hz = this.hazards[name];
        if (hz.mistake) return;     // one mistake per hazard
        hz.mistake = true;
        this.mistakes++;
        this.updateHud();
        Sound.oops();
        this.cameras.main.shake(200, 0.006);
        showMessage(this, t(hz.msg), "bad", 6500);
        narrate(hz.msg, t(hz.msg));
    }

    win() {
        this.finished = true;
        this.speed = 0;
        Sound.good();
        showMessage(this, t("levelDone"), "good", 2000);
        this.time.delayedCall(1500, () =>
            this.scene.start("LevelComplete", { level: 2, mistakes: this.mistakes }));
    }
}

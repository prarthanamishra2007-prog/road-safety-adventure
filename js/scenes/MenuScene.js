// MenuScene — the home screen: title, language, levels, badges, teacher button.

import { W, H, FONT, COLORS, TEXT } from "../config.js";
import { t } from "../i18n.js";
import { Store } from "../storage.js";
import { makeButton, iconButton } from "../ui.js";
import { Sound, narrate, stopNarration } from "../sound.js";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super("Menu");
    }

    create() {
        stopNarration();
        this.drawBackground();

        // ----- title -----
        this.add.text(W / 2, 62, t("title"), {
            fontFamily: FONT, fontSize: "46px", color: TEXT.dark, fontStyle: "bold",
            stroke: "#ffffff", strokeThickness: 8,
        }).setOrigin(0.5);
        this.add.text(W / 2, 112, t("subtitle"), {
            fontFamily: FONT, fontSize: "22px", color: TEXT.dark,
        }).setOrigin(0.5);

        // ----- language + sound -----
        makeButton(this, W - 90, 40, t("language"), () => {
            Store.setLang(Store.getLang() === "en" ? "ne" : "en");
            this.scene.restart();        // redraw everything in the new language
        }, { w: 140, h: 50, color: COLORS.yellow, textColor: TEXT.dark, fontSize: 20 });

        const mute = iconButton(this, W - 196, 40, Sound.isMuted() ? "×" : "♪", () => {
            mute.label.setText(Sound.toggleMute() ? "×" : "♪");
        });

        // ----- current player state -----
        const session = Store.currentSession();
        const preDone = !!(session && session.pre);
        const progress = Store.getProgress();

        // ----- level cards -----
        const levels = [
            { n: 1, key: "level1", scene: "Level1" },
            { n: 2, key: "level2", scene: "Level2" },
            { n: 3, key: "level3", scene: "Level3" },
        ];
        levels.forEach((lv, i) => {
            const x = 200 + i * 280;
            const open = preDone && Store.isUnlocked(lv.n);
            const label = open ? t(lv.key) : t(lv.key) + "\n(" + t("locked") + ")";
            const btn = makeButton(this, x, 225, label, () => this.scene.start(lv.scene), {
                w: 250, h: 100, color: COLORS.blue, fontSize: 22,
            });
            btn.setEnabled(open);

            const stars = progress["l" + lv.n] ? progress["l" + lv.n].stars : 0;
            for (let s = 0; s < 3; s++) {
                this.add.image(x - 40 + s * 40, 302, s < stars ? "star" : "starEmpty").setScale(0.7);
            }
        });

        // ----- main buttons -----
        makeButton(this, W / 2 - 150, 395, t("newPlayer"), () => {
            Store.startSession();
            this.scene.start("Quiz", { kind: "pre" });
        }, { w: 260, h: 70, color: COLORS.green, fontSize: 28 });

        if (session && !preDone) {
            makeButton(this, W / 2 + 150, 395, t("continue"), () => {
                this.scene.start("Quiz", { kind: "pre" });
            }, { w: 260, h: 70, color: COLORS.yellow, textColor: TEXT.dark });
        } else if (session && progress.l3 && !session.post) {
            makeButton(this, W / 2 + 150, 395, t("finalQuiz"), () => {
                this.scene.start("Quiz", { kind: "post" });
            }, { w: 260, h: 70, color: COLORS.yellow, textColor: TEXT.dark });
        }

        if (!session) {
            this.add.text(W / 2 + 150, 395, t("startHint"), {
                fontFamily: FONT, fontSize: "18px", color: TEXT.grey, align: "center",
                wordWrap: { width: 250 },
            }).setOrigin(0.5);
        }

        // ----- badges -----
        const earned = ["l1", "l2", "l3"].filter((k) => progress[k]);
        earned.forEach((k, i) => {
            const bx = W / 2 - (earned.length - 1) * 85 + i * 170;
            this.add.image(bx - 50, 458, "badge").setScale(0.55);
            this.add.text(bx - 26, 458, t("badge_" + k), {
                fontFamily: FONT, fontSize: "16px", color: TEXT.dark, fontStyle: "bold",
            }).setOrigin(0, 0.5);
        });

        // ----- teacher + player number -----
        makeButton(this, 90, H - 32, t("teacher"), () => this.scene.start("Teacher"), {
            w: 140, h: 44, color: COLORS.dark, fontSize: 18,
        });
        if (session) {
            this.add.text(W - 20, H - 12, `${t("player")} #${session.id}`, {
                fontFamily: FONT, fontSize: "18px", color: TEXT.white, fontStyle: "bold",
            }).setOrigin(1, 1);
        }

        narrate("menu", t("title") + ". " + t("subtitle"));
    }

    drawBackground() {
        const g = this.add.graphics();
        g.fillStyle(COLORS.sky); g.fillRect(0, 0, W, H);
        g.fillStyle(COLORS.grass); g.fillRect(0, 340, W, H - 340);
        g.fillStyle(COLORS.road); g.fillRect(0, 498, W, 42);
        g.fillStyle(COLORS.zebra);
        for (let i = 0; i < 6; i++) g.fillRect(W / 2 - 110 + i * 40, 502, 22, 34);
        this.add.image(70, 330, "tree").setScale(1.2);
        this.add.image(W - 70, 330, "tree").setScale(1.2);
    }
}

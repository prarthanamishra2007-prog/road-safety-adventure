// LevelCompleteScene — stars, badge, and what to do next.

import { W, H, FONT, COLORS, TEXT, starsFor } from "../config.js";
import { t } from "../i18n.js";
import { Store } from "../storage.js";
import { makeButton } from "../ui.js";
import { Sound, narrate } from "../sound.js";

export class LevelCompleteScene extends Phaser.Scene {
    constructor() {
        super("LevelComplete");
    }

    init(data) {
        this.level = data.level;
        this.mistakes = data.mistakes;
    }

    create() {
        const stars = starsFor(this.mistakes);
        const firstTime = Store.saveLevel(this.level, stars, this.mistakes);

        this.add.graphics().fillStyle(0xe8f6ff).fillRect(0, 0, W, H);
        this.add.text(W / 2, 70, t("levelDone"), {
            fontFamily: FONT, fontSize: "48px", color: TEXT.green, fontStyle: "bold",
        }).setOrigin(0.5);
        narrate("levelDone", t("levelDone"));

        // stars pop in one by one
        for (let i = 0; i < 3; i++) {
            const img = this.add.image(W / 2 - 90 + i * 90, 170, i < stars ? "star" : "starEmpty").setScale(0);
            this.tweens.add({ targets: img, scale: 1.6, duration: 350, delay: 300 + i * 250, ease: "Back.out" });
            if (i < stars) Sound.star(i);
        }

        this.add.text(W / 2, 245, `${t("mistakes")}: ${this.mistakes}`, {
            fontFamily: FONT, fontSize: "24px", color: TEXT.dark,
        }).setOrigin(0.5);

        if (firstTime) {
            const badge = this.add.image(W / 2 - 120, 315, "badge").setScale(0);
            this.tweens.add({ targets: badge, scale: 1, duration: 400, delay: 1100, ease: "Back.out" });
            this.add.text(W / 2 - 75, 315, `${t("badgeNew")} ${t("badge_l" + this.level)}`, {
                fontFamily: FONT, fontSize: "26px", color: TEXT.dark, fontStyle: "bold",
            }).setOrigin(0, 0.5);
        }

        // buttons
        makeButton(this, W / 2 - 250, 440, t("replay"), () => this.scene.start("Level" + this.level), {
            w: 200, color: COLORS.yellow, textColor: TEXT.dark,
        });
        makeButton(this, W / 2, 440, t("menu"), () => this.scene.start("Menu"), { w: 200, color: COLORS.blue });

        if (this.level < 3) {
            makeButton(this, W / 2 + 250, 440, t("next") + " →", () => this.scene.start("Level" + (this.level + 1)), { w: 200 });
        } else {
            const s = Store.currentSession();
            if (s && !s.post) {
                makeButton(this, W / 2 + 250, 440, t("finalQuiz"), () => this.scene.start("Quiz", { kind: "post" }), { w: 200 });
            }
        }
    }
}

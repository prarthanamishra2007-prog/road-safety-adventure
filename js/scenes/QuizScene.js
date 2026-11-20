// QuizScene — 5 questions BEFORE playing ("pre") and AFTER playing ("post").
// We do NOT show right/wrong during the quiz, so the "before" score is honest.
// Scores are saved on the device; the Teacher Dashboard compares them.

import { W, H, FONT, COLORS, TEXT } from "../config.js";
import { t, tx } from "../i18n.js";
import { Store } from "../storage.js";
import { QUIZ } from "../data/quiz.js";
import { makeButton } from "../ui.js";
import { Sound, narrate } from "../sound.js";

export class QuizScene extends Phaser.Scene {
    constructor() {
        super("Quiz");
    }

    init(data) {
        this.kind = data.kind || "pre";   // "pre" or "post"
        this.index = 0;
        this.answers = [];               // 1 = correct, 0 = wrong, for each question
    }

    create() {
        this.add.graphics().fillStyle(0xe8f6ff).fillRect(0, 0, W, H);
        this.add.text(W / 2, 40, this.kind === "pre" ? t("preQuizTitle") : t("postQuizTitle"), {
            fontFamily: FONT, fontSize: "26px", color: TEXT.dark, fontStyle: "bold",
        }).setOrigin(0.5);
        this.layer = this.add.container(0, 0);
        this.showQuestion();
    }

    showQuestion() {
        this.layer.removeAll(true);
        const q = QUIZ[this.index];

        const counter = this.add.text(W / 2, 82, `${this.index + 1} / ${QUIZ.length}`, {
            fontFamily: FONT, fontSize: "20px", color: TEXT.grey,
        }).setOrigin(0.5);

        const question = this.add.text(W / 2, 150, tx(q.q), {
            fontFamily: FONT, fontSize: "30px", color: TEXT.dark, fontStyle: "bold",
            align: "center", wordWrap: { width: 820 },
        }).setOrigin(0.5);
        this.layer.add([counter, question]);

        q.options.forEach((opt, i) => {
            const btn = makeButton(this, W / 2, 260 + i * 90, tx(opt), () => this.answer(i), {
                w: 640, h: 72, color: COLORS.blue, fontSize: 24,
            });
            this.layer.add(btn);
        });

        const spoken = tx(q.q) + " " + q.options.map((o) => tx(o)).join(". ");
        narrate(`quiz_${q.id}`, spoken);
    }

    answer(choice) {
        const q = QUIZ[this.index];
        this.answers.push(choice === q.correct ? 1 : 0);
        this.index++;
        if (this.index < QUIZ.length) {
            this.showQuestion();
        } else {
            this.finish();
        }
    }

    finish() {
        const score = this.answers.reduce((a, b) => a + b, 0);
        Store.saveQuiz(this.kind, score, this.answers);
        this.layer.removeAll(true);
        Sound.good();

        this.layer.add(this.add.text(W / 2, 170, t("quizDone"), {
            fontFamily: FONT, fontSize: "48px", color: TEXT.green, fontStyle: "bold",
        }).setOrigin(0.5));

        if (this.kind === "pre") {
            // straight on to the levels
            this.time.delayedCall(1200, () => this.scene.start("Menu"));
            return;
        }

        // post quiz: show before vs after, and the home mission
        const s = Store.currentSession();
        const before = s && s.pre ? s.pre.score : "-";
        this.layer.add(this.add.text(W / 2, 260, `${before} / 5   →   ${score} / 5`, {
            fontFamily: FONT, fontSize: "40px", color: TEXT.dark, fontStyle: "bold",
        }).setOrigin(0.5));
        this.layer.add(this.add.text(W / 2, 340, t("mission"), {
            fontFamily: FONT, fontSize: "24px", color: TEXT.dark, align: "center",
            wordWrap: { width: 760 },
        }).setOrigin(0.5));
        narrate("mission", t("mission"));
        this.layer.add(makeButton(this, W / 2, 450, t("menu"), () => this.scene.start("Menu")));
    }
}

// TeacherScene — results for the pilot test (our KPIs).
// Shows: number of players, average score before vs after, improvement %,
// and which questions children got wrong most often (the "danger map" idea).
// "Download CSV" gives a spreadsheet file for the report. No names are stored.

import { W, H, FONT, COLORS, TEXT } from "../config.js";
import { t } from "../i18n.js";
import { Store } from "../storage.js";
import { QUIZ } from "../data/quiz.js";
import { makeButton } from "../ui.js";

export function computeStats(sessions) {
    const withPre = sessions.filter((s) => s.pre);
    const paired = sessions.filter((s) => s.pre && s.post);
    const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

    const avgPre = avg(withPre.map((s) => s.pre.score));
    const pairedPre = avg(paired.map((s) => s.pre.score));
    const pairedPost = avg(paired.map((s) => s.post.score));
    const improvement = paired.length && pairedPre > 0 ? ((pairedPost - pairedPre) / pairedPre) * 100 : null;

    // % of children who got each question WRONG before playing
    const missed = QUIZ.map((q, i) => {
        const wrong = withPre.filter((s) => s.pre.answers[i] === 0).length;
        return { q, pct: withPre.length ? (wrong / withPre.length) * 100 : 0 };
    }).sort((a, b) => b.pct - a.pct);

    return { players: sessions.length, preCount: withPre.length, pairedCount: paired.length, avgPre, pairedPre, pairedPost, improvement, missed };
}

export function toCSV(sessions) {
    const head = ["player", "start", "pre_score", "post_score", "l1_stars", "l2_stars", "l3_stars",
        ...QUIZ.map((q) => "pre_" + q.id), ...QUIZ.map((q) => "post_" + q.id)];
    const rows = sessions.map((s) => [
        s.id, s.start,
        s.pre ? s.pre.score : "", s.post ? s.post.score : "",
        s.levels.l1 ? s.levels.l1.stars : "", s.levels.l2 ? s.levels.l2.stars : "", s.levels.l3 ? s.levels.l3.stars : "",
        ...QUIZ.map((q, i) => (s.pre ? s.pre.answers[i] : "")),
        ...QUIZ.map((q, i) => (s.post ? s.post.answers[i] : "")),
    ]);
    return [head, ...rows].map((r) => r.join(",")).join("\n");
}

export class TeacherScene extends Phaser.Scene {
    constructor() {
        super("Teacher");
    }

    create() {
        const sessions = Store.allSessions();
        const st = computeStats(sessions);
        const style = (size, color = TEXT.dark, bold = false) => ({
            fontFamily: FONT, fontSize: size + "px", color, fontStyle: bold ? "bold" : "normal",
        });

        this.add.graphics().fillStyle(0xf4f6f8).fillRect(0, 0, W, H);
        this.add.text(W / 2, 36, t("teacherTitle"), style(32, TEXT.dark, true)).setOrigin(0.5);

        const lines = [
            [t("players"), `${st.players}`],
            [t("avgPre"), `${st.avgPre.toFixed(1)} / 5`],
            [t("avgPost"), st.pairedCount ? `${st.pairedPost.toFixed(1)} / 5  (n=${st.pairedCount})` : "-"],
            [t("improvement"), !st.pairedCount ? "-" :
                `${st.pairedPost - st.pairedPre >= 0 ? "+" : ""}${(st.pairedPost - st.pairedPre).toFixed(1)} ${t("points")}` +
                (st.improvement === null ? "" : `  (${st.improvement >= 0 ? "+" : ""}${st.improvement.toFixed(0)}%)`)],
        ];
        lines.forEach(([label, value], i) => {
            this.add.text(60, 90 + i * 38, label, style(20));
            this.add.text(560, 90 + i * 38, value, style(22, TEXT.dark, true));
        });

        this.add.text(60, 255, t("hardest"), style(20, TEXT.dark, true));
        st.missed.slice(0, 3).forEach((m, i) => {
            const y = 292 + i * 34;
            const g = this.add.graphics();
            g.fillStyle(0xdee2e6); g.fillRect(60, y, 300, 22);
            g.fillStyle(COLORS.red); g.fillRect(60, y, 3 * m.pct, 22);
            this.add.text(370, y + 11, `${m.pct.toFixed(0)}%  ·  ${m.q.topic}`, style(18)).setOrigin(0, 0.5);
        });

        // buttons
        makeButton(this, 160, 480, t("back"), () => this.scene.start("Menu"), { w: 200, color: COLORS.blue });
        makeButton(this, W / 2, 480, t("download"), () => this.download(sessions), { w: 240 });
        const clear = makeButton(this, W - 170, 480, t("clear"), () => {
            if (!this.confirmClear) {
                this.confirmClear = true;
                clear.label.setText(t("clearConfirm"));
                return;
            }
            Store.clearAll();
            this.scene.restart();
        }, { w: 260, color: COLORS.red, fontSize: 20 });
        this.confirmClear = false;
    }

    download(sessions) {
        const blob = new Blob([toCSV(sessions)], { type: "text/csv" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `road-safety-results-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
}

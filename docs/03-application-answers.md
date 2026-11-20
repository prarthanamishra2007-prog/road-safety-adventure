# 03 — Application answers (updated copy)

Clean copy of the improved **Q10, Q11 and Q13** from `GUIDE.md` (Task B8). The wording below is the guide wording — edit to your own voice only if you want, but keep the facts.

---

## Q10 — Solution

> We built an interactive, web-based road-safety game for children aged 5–12 in Nepal. Children guide Sita across a real-looking Nepali street using the crossing button, the green pedestrian signal and the "look right–left–right" habit (Nepal drives on the left). They then switch sides and drive a microbus, discovering why drivers cannot see a child behind a parked bus. Finally, they become the teacher, deciding whether "Bhai" is about to do something safe or dangerous. Mistakes never end in a crash: the vehicle brakes, and the game explains the rule. A short quiz before and after playing measures learning, and a teacher dashboard shows results without collecting any names.

## Q11 — Technology

> The game is built with the Phaser 3 HTML5 game engine (WebGL/Canvas) and runs in any modern browser. It is a Progressive Web App: after the first visit, it installs on a phone, tablet or school computer and works fully offline, which is important for schools with unreliable internet. Sounds use the Web Audio API with stereo panning, so a vehicle from the right is heard on the right. Narration plays recorded Nepali voice files, with browser speech synthesis as a fallback. Learning data (quiz scores, stars) is stored only on the device and exported by teachers as anonymous CSV files.

## Q13 — What is different

> (1) It is designed for Nepal: left-hand traffic, microbuses, tempos, traffic police signals, overhead bridges and roads without footpaths, in Nepali with voice. (2) Children switch perspective: they also play as the driver, building empathy for why the rules exist. (3) Children teach a younger sibling character, which strengthens memory (the protégé effect). (4) Learning is measured inside the game with a pre/post quiz and an anonymous teacher dashboard, so every school pilot produces evidence.

---

## KPI / pilot numbers — FILL AFTER THE PILOT

> **Do not submit this table with placeholders.** These cells are intentionally empty: the pilot has **not** happened yet. Replace each `___` with the real value from the CSV analysis (GUIDE.md, Task B8). Columns in the CSV: `pre_score` = C, `post_score` = D.

| KPI | Value (replace `___`) | How to get it |
|---|---|---|
| **N** (number of children with both quizzes) | `___` | `=COUNT(C2:C16)` on paired rows |
| **Average before** (out of 5) | `___` | `=AVERAGE(C2:C16)` |
| **Average after** (out of 5) | `___` | `=AVERAGE(D2:D16)` |
| **Improvement %** | `___` | `=(AVERAGE(D2:D16)-AVERAGE(C2:C16))/AVERAGE(C2:C16)` |
| **Children who improved** | `___` | `=SUMPRODUCT(--(D2:D16>C2:C16))` |
| **Paired t-test p-value** | `___` | `=T.TEST(C2:C16,D2:D16,2,1)` |

**Honest reporting sentence (fill in):** *"In a pilot with N = `___` children, the average quiz score rose from `___` to `___` out of 5 (an improvement of `___`%)."*

**Limitation — state this explicitly in the application and the pitch:**

> This measures **immediate recall only** — the post-quiz is taken straight after play. It does not prove that the children will remember or apply the rules weeks later. If possible, repeat the same quiz after one week and report that result too.

**Privacy reminder:** report only group numbers. Never put a child's name, grade-plus-name, photo, or player number in the application.

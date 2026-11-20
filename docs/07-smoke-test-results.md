# 07 — Smoke test results (desktop browser)

Run on **2026-11-20** in the in-app Chromium browser against `http://localhost:8000` (Phaser **3.90.0**). These checks drove the real Phaser scenes through JavaScript; they are **not** a substitute for the phone, offline, child or teacher pilot tests in `GUIDE.md`.

## Result summary

| Check | Result | Evidence |
|---|---|---|
| Game loads and reaches Menu | PASS | Active scene `Menu`; `Phaser.VERSION = 3.90.0`; no console errors |
| No red Console errors after all edits | PASS | `browser.console(level: "error")` returned `[]` |
| 5 quiz questions loaded | PASS | `QUIZ.length = 5` |
| Pre-quiz saves score and answers | PASS | Answered with the 5 correct indexes → `pre.score = 5`, answers `[1,1,1,1,1]` |
| Levels unlock progressively | PASS | Before Level 1 completion: Level 2 locked. After saving Level 1 with 3 stars: `isUnlocked(2) = true` |
| 3 stars for 0 mistakes | PASS | `saveLevel(1, 3, 0)` → `{ stars: 3, mistakes: 0 }` |
| Level 1 hint arrow visible, then hides on button press | PASS | `hint.visible = true` at start; `false` after `pushButton()` near the pole |
| Tempo texture exists | PASS | `textures.exists("tempo") = true` |
| Looking LEFT first gives a hint, not a mistake | PASS | Message: "In Nepal, vehicles come from the RIGHT first…", `mistakes = 0` |
| Correct RIGHT–LEFT–RIGHT look sequence | PASS | `lookDone = true`, message: "Good looking! Now cross when the man is GREEN." |
| Level 1 rule messages | PASS | Off-zebra → "Cross only on the ZEBRA CROSSING."; no look → "Stop! First look RIGHT, LEFT, RIGHT."; red man → "Wait! The man is RED…" Each added exactly 1 mistake |
| Level 1 correct crossing | PASS | With `lookDone = true` and green signal, stepping onto the zebra added 0 mistakes |
| Level 2 brake lights | PASS | While braking, `bus.tintTopLeft = 0xffb3b3` and `isTinted = true`; tint cleared when braking stops |
| Level 2_Zebra hazard logic | PASS | Driving too fast at the stop line with children on the road added 1 mistake, stopped the bus (`speed = 0`) and showed the lesson |
| Level 3 has 8 situations | PASS | IDs in order: busGap, zebraGreen, ball, noFootpath, phone, police, bridge, jumpOff |
| 5 unsafe / 3 safe balance | PASS | `unsafeCount = 5` |
| All 8 Level 3 decisions work | PASS | Choosing the correct STOP/Go action for each situation produced 0 total mistakes |
| New `phone` and `jumpOff` drawings appear | PASS | Their `props` containers held 4 and 3 objects respectively (house + tree + situation props) |
| Nepali language switch | PASS | `t("title")` = "सडक सुरक्षा साहसिक यात्रा"; scenario `phone` intent displays in Nepali; Menu restarts cleanly |
| Teacher Dashboard statistics | PASS | 3 test sessions → players 3, avg before 4.0, paired after 4.67, improvement 16.7% |
| CSV header | PASS | 17 columns exactly as documented in `docs/05-teacher-dashboard-test.md`, 3 data rows |
| Test data cleared | PASS | `Store.clearAll()` → 0 sessions before finishing |

## Service worker file list

`sw.js` uses `road-safety-v2` and all **23** cached paths exist on disk.

## Still required before submission

- Real phone/tablet, touch, landscape and airplane-mode tests (A5).
- Nepali teacher review (B2) and traffic-police conversation (B1).
- Voice MP3 recording and registration in `sound.js` + `sw.js` (B4).
- Child-friendliness observation with real children (B6).
- 15-child pilot, CSV analysis, application update and demo video (Parts 6–7).

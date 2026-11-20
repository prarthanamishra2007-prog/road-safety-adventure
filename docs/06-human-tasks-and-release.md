# 06 — Human tasks and release checklist

Status checked against the workspace on **2026-11-20**. Nothing here claims the pilot, the voice recording, or a real-device test has happened.

## A. Only a human can do these (all still OPEN)

### Setup and publishing
- [x] Create the public GitHub repository `road-safety-adventure` and upload all files — <https://github.com/prarthanamishra2007-prog/road-safety-adventure>.
- [x] Enable **GitHub Pages**: main branch, `/(root)` — live at <https://prarthanamishra.com.np/road-safety-adventure/> and <https://prarthanamishra2007-prog.github.io/road-safety-adventure/>.
- [ ] Add the teammate as a **collaborator** and accept the invite (guide §1.4).
- [ ] Before release, bump `CACHE_NAME` in `sw.js` again after the final change (it is currently `"road-safety-v2"`) and create a GitHub release tagged `v1.0-pilot`.

### Content review — needs real people
- [ ] **Nepali review by a teacher**: check every line in `js/i18n.js` (`ne:`), `js/data/quiz.js` and `js/data/scenarios.js` for grade 1–5 reading level; put corrected lines back and play the whole game in Nepali (guide B2). Current text is still marked "first draft" in `js/i18n.js`.
- [ ] **Conversation with a traffic police officer**: confirm the five open items in `docs/01-rules-verification.md` (look-right-first wording, ball, police signal, overhead bridge, phone) and ask for a quote for the pitch (guide B1).
- [ ] **Get school permission and parent consent** using `docs/02-pilot-kit.md`; ask the school whether written consent is required.

### Voice (not recorded yet)
- [ ] Record friendly, slow **MP3s** in a quiet room (Audacity), one voice, short files, 64–96 kbps (guide B4).
- [ ] Save as `audio/<lang>/<key>.mp3` with the exact keys from the B4 table.
- [ ] Add each recorded key to `RECORDED` in `js/sound.js` — both `en: []` and `ne: []` are currently **empty**.
- [ ] Add every MP3 path to `FILES` in `sw.js` so it works offline, **then bump `CACHE_NAME`**.

### Testing and pilot
- [ ] Phone/tablet/offline testing: touch controls, landscape, Install app, airplane mode, slowest device (guide A5).
- [ ] Run the Child-friendliness **device + children** checks in `docs/04-child-friendliness-review.md`.
- [ ] **Clear all test data** on every device (two taps) before the pilot — see `docs/05-teacher-dashboard-test.md`.
- [ ] **Pilot with at least 15 children** (guide Part 6): New Player → pre-quiz → Levels 1–3 → post-quiz → 3 smiley questions, 30–40 minutes per group; download the CSV and the teacher feedback forms.
- [ ] **Analyse the CSV** in Excel/Sheets (guide B8); fill the real numbers into `docs/03-application-answers.md` and the application PDF's KPI "Current result" column. Report the **immediate-recall limitation** honestly.

### Demo and submission
- [ ] Update the **application PDF** with the new Q10/Q11/Q13 wording (from `docs/03-application-answers.md`) and the real KPI table.
- [ ] Record the **2-minute demo video** (guide Part 7) using **real pilot results** on the dashboard.
- [ ] **Rehearse the pitch** and prepare answers to the likely judge questions (guide Part 7).

## B. Code work already done in this workspace (verified in the files)

| Item | Status | Evidence |
|---|---|---|
| Starter kit extracted / working project | **Done** | `index.html`, `js/`, `lib/phaser.min.js`, `sw.js`, `manifest.webmanifest` all present. |
| Level 1 polish: walking wobble, tempo traffic, bouncing button arrow | **Done** | `js/scenes/Level1Crossing.js` lines 46–50, 162, 248, 354–356; `js/textures.js` line 75 (`tempo`). |
| Level 2 brake lights | **Done** | `js/scenes/Level2Driver.js` lines 214–215 (`setTint(0xffb3b3)` while braking). |
| Level 3 new drawings (`phone`, `jumpOff`) | **Done** | `js/scenes/Level3TeachBhai.js` → `drawProps()` lines 136–145. |
| Level 3 new **situations/text** | **Done** | `js/data/scenarios.js` has **8** situations in the guide's order: busGap, zebraGreen, ball, noFootpath, phone, police, bridge, jumpOff. The HUD counts 1/8 → 8/8. |
| Nepali / short-text pass | **Done, but human review required** | Long English/Nepali lines were shortened in `js/i18n.js` and `js/data/scenarios.js`. The original comment in `js/i18n.js` still correctly says the Nepali is a first draft until a teacher checks it. |
| Service worker cache version bump | **Done (v2)** | `sw.js` now has `const CACHE_NAME = "road-safety-v2";` and a comment to bump it on every publish. Remember to bump again after any final change. |
| Documentation | **Done (this folder)** | `docs/01`–`docs/06`, created 2026-11-20. |

## C. Definition of done for release

- [ ] Every A item ticked (or explicitly accepted as out of scope with a reason in the pitch).
- [ ] A final `CACHE_NAME` bump after the last code/content change, then a live-link check on a phone.
- [ ] Dashboard shows **0 players** on release devices; the live link works on a phone in airplane mode.
- [ ] Git branch merged to `main`, Pages updated, release tag created.

> Be honest in the pitch: say what was tested and what was not. Do not say "piloted with 15 children" or "voice recorded in Nepali" until those checkboxes are actually ticked.

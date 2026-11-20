# 04 — Child-friendliness review (guide task B6)

Code review completed **2026-11-20** by reading the current workspace files. This is a **desk review, not a child test**. Real phone/tablet testing with children is **still required** before the pilot (see the note at the end).

| Check | Result | Reason (file references) |
|---|---|---|
| Buttons are big enough for small fingers (about 1 cm on a phone) | **NEEDS CHECK** | `js/ui.js` → `makeButton()` defaults to **220 × 64 px**; the corner icons are only **56 × 56 px** (`iconButton()`). Level 1 uses 190 × 54 px buttons (`js/scenes/Level1Crossing.js`), Level 2 uses 200 × 70 px GO/BRAKE (`js/scenes/Level2Driver.js`), quiz options are 640 × 72 px (`js/scenes/QuizScene.js`). The game is a fixed **960 × 540** canvas (`js/config.js`) scaled to the screen, so the physical size on a real phone may be well under 1 cm. Measure on a device. |
| Text is readable from a normal distance; no sentence longer than about 20 words | **NEEDS CHECK** | A short-text pass has been applied: `l2Bus` is now ~17 words, `l2Ball` ~15, `l3Goal` ~13 (`js/i18n.js`), and scenario explanations are about 12–18 words (`js/data/scenarios.js`). Text wraps in `showMessage()` (`js/ui.js`, `wordWrap: W - 140`) and in the Level 3 bubble (700 px). Still needs a real-screen check, especially for Nepali Devanagari line height. |
| Red and green are **not** the only clue | **PASS** | `js/scenes/Level1Crossing.js` → `drawSignal()` puts the **red circle on the left (x + 17)** and the **green circle on the right (x + 49)**, so position differs as well as colour. The words "RED" and "GREEN" appear in the messages (`js/i18n.js`: `l1WaitGreen`, `l1LookOk`, `l1Press`) and in Level 3's `zebraGreen` intent (`js/data/scenarios.js`). The police situation adds a drawn raised hand and a **"STOP"** text label (`js/scenes/Level3TeachBhai.js` → `drawProps("police")`). |
| Nothing is scary: no crashes, no injuries, only braking and a horn | **PASS** | `js/scenes/Level1Crossing.js` → `mistake()` gently walks Sita back to the kerb with a 150 ms 0.004 camera shake and a beep/horn; `js/scenes/Level2Driver.js` → `hazardMistake()` stops the microbus before the child, no impact animation; `js/scenes/Level3TeachBhai.js` → wrong answers make a car brake and Bhai step back safely. `js/sound.js` only makes soft tones, beeps and a short horn — no crash sound. |
| Every wrong answer explains **why**, in a kind voice | **PASS** | `js/i18n.js` → `l1Hit` ("Beep beep! A vehicle stopped for you. Always wait and look."), `l1WrongOrder` ("In Nepal, vehicles come from the RIGHT first"), `l2Bus`, `l2Ball`, `l2Zebra`; `js/data/scenarios.js` has an `explain` line for all eight situations. Looking left first at Level 1 gives a hint with **no mistake** (`Level1Crossing.js` → `look()`). Note: the ✗ marker and `Sound.oops()` in Level 3 are mild but a teacher should check how children react. |
| The game can be played with sound off (all instructions also as text) | **PASS** | All instructions live in `js/i18n.js` and are drawn as text by `showMessage()` (`js/ui.js`) and the thought bubble (`js/scenes/Level3TeachBhai.js`). `js/sound.js` → `Sound.toggleMute()` silences tones and cancels speech, and `narrate()` falls back silently when no voice is available (comment: "text is on screen"). The ♪/× button is available in every level via `cornerButtons()` in `js/ui.js`. |

## Still to do before we can call this PASS in the application

1. **Test on a real low-end phone and tablet**, with touch only, in both English and Nepali (guide task A5).
2. **Watch at least 5–8 children play**, with sound off for one of them, and record where they hesitate (guide Part 6).
3. **Ask the Nepali teacher** (task B2) to check the already-shortened English/Nepali lines for grade 1–5 reading level and natural phrasing; shorten further on a real screen if any banner overflows.
4. Re-check the 56 × 56 px corner icons with small fingers; enlarge in `js/ui.js` if children miss them.
5. Log any remaining problems on the shared bug list and assign to the file owner (`GUIDE.md` §1.9).

> **Do not claim this was tested with children.** It has not been — this document is a code-based review only.

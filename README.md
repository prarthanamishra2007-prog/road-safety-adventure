# Road Safety Adventure 🚸

An interactive road-safety game for children aged 5–12 in Nepal, built with **Phaser 3**. It runs in any modern browser, on computers, tablets and phones, and works **offline** after the first visit.

## What makes it different

1. **Made for Nepal:** traffic keeps to the left, so children learn to **look RIGHT first**. Streets include microbuses, tempos, traffic police, overhead bridges and roads without footpaths.
2. **Switch sides (Level 2):** the child *drives* the microbus and sees why drivers cannot see a child behind a parked bus.
3. **Teach Bhai (Level 3):** the child *teaches* a little brother, which strengthens memory.
4. **Built-in measurement:** a 5-question quiz before and after playing, plus a teacher dashboard with an anonymous CSV export.
5. **Privacy first:** no names, no accounts, and nothing leaves the device.

## Quick start

The game must be served by a web server (opening `index.html` directly does not work because browsers block JavaScript modules on `file://`).

```bash
python -m http.server 8000
```

Then open <http://localhost:8000> in Chrome. Stop the server with **Ctrl + C**.

On Windows, if `python` is not recognised, use `py -3 -m http.server 8000`.

## Controls

| Level | Keyboard | Touch |
|---|---|---|
| 1 Cross to School | Arrows/WASD to walk, SPACE = crossing button, Q = look left, E = look right | Tap where Sita should walk, then use the on-screen buttons |
| 2 Be the Driver | → / ↑ = go, SPACE / ← / ↓ = brake | Hold GO / BRAKE |
| 3 Teach Bhai | none | STOP or Go ahead |

## What has been built in this workspace

- Starter kit extracted and verified: loads with no console errors.
- Level 1: walking wobble, bouncing button hint, green "Safa Tempo" traffic.
- Level 2: red brake-light tint while braking.
- Level 3: eight Teach Bhai situations, including **phone** and **jumpOff**, with drawings.
- English/Nepali text, voice-narration fallback, pre/post quiz, stars, badges, teacher dashboard and CSV export.
- Offline PWA support with cache version `v2`.

To share the game with others, use [`road-safety-adventure-ready.zip`](road-safety-adventure-ready.zip) and follow [`docs/08-share-the-game.md`](docs/08-share-the-game.md) for GitHub Pages, Netlify Drop or itch.io.

Desktop-browser smoke-test results are in [`docs/07-smoke-test-results.md`](docs/07-smoke-test-results.md). Tasks that still need real people (GitHub Pages, Nepali teacher review, voice recordings, child pilot, demo video, application PDF) are listed in [`docs/06-human-tasks-and-release.md`](docs/06-human-tasks-and-release.md).

## Files

```text
index.html            page that loads Phaser + our game
sw.js                 offline support (bump CACHE_NAME on every release!)
lib/phaser.min.js     Phaser 3.90 local copy for offline use
js/main.js            game config + list of scenes
js/config.js          sizes, colours, road layout, star rules
js/i18n.js            all English + Nepali text
js/storage.js         saves progress and quiz scores on the device
js/sound.js           code-made sounds + voice narration
js/textures.js        all pictures, drawn with code
js/ui.js              buttons, messages, HUD
js/data/quiz.js       the 5 pre/post questions
js/data/scenarios.js  8 Teach Bhai situations
js/scenes/*.js        one file per screen
docs/                 rules table, pilot kit, application answers, checklists
```

See [`GUIDE.md`](GUIDE.md) for the full 15-day team plan.

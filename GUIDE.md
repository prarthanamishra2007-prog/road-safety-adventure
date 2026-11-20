# Road Safety Adventure: Team Build Guide (2 members)

This guide takes you from zero to a tested prototype, ready for a pilot in schools and a judges' demo. Follow it in order. Every step says **who** does it, **what** to do, and **how to check** it worked.

---

## 0. Read this first

### 0.1 What we are building
A browser game for children aged 5–12 in Nepal, with three levels:

| Level | Name | What the child does | Rule learned |
|---|---|---|---|
| 1 | Cross to School | Walks Sita to school: presses the crossing button, looks RIGHT–LEFT–RIGHT, crosses on the zebra when the man is green | Zebra crossing, signals, *look right first* (Nepal drives on the left) |
| 2 | Be the Driver | Drives a microbus to school and must stop for children | Why drivers can't see you behind a bus; balls and children; stopping at zebras |
| 3 | Teach Bhai | Watches little brother and decides "STOP!" or "Go ahead" | Parked vehicles, ball on the road, no footpath, traffic police, overhead bridge |

Around the levels:
- a **5-question quiz before and after** playing, to measure learning (our KPI)
- **stars and badges** for motivation
- a **Teacher Dashboard** with averages, improvement %, most-missed questions and a CSV download
- **English and Nepali**, with voice narration
- **offline mode**: after the first visit, it works without internet

### 0.2 Technology and why
| Part | Choice | Why |
|---|---|---|
| Game engine | **Phaser 3.90** (JavaScript) | Built for 2D games: movement, timers, animations, touch. Free and well documented. |
| Pages | Plain HTML + CSS | No build tools needed, so it's easy for beginners. |
| Offline | Service worker + web app manifest (a "PWA") | Schools have weak internet; the game installs like an app. |
| Data | `localStorage` on the device | No accounts or names, which protects children's privacy. |
| Hosting | **GitHub Pages** (free) | One link to share with judges and schools. |

> **Change from earlier plans:** we are **not** using Django or React for the prototype. React is not a game engine, and a server is not needed when all data stays on the device. Update the application answers too (Task B8 has the new text).

### 0.3 The starter kit
You received **road-safety-adventure.zip**. It is a complete, working game that has already been tested in Chrome. You are not starting from an empty folder. Your job is to **set it up, understand it, improve it, add content, test it with children, and present it**.

### 0.4 Who is who
- **Member A, Game Developer:** engine, Levels 1 and 2, graphics, offline mode, publishing.
- **Member B, Learning & Content Lead:** rules accuracy, Nepali text, quiz, Level 3, voice recording, teacher dashboard, pilot testing, application and pitch.

Both members code. Member B's tasks are more about *content inside code files*.

### 0.5 Timeline (15 working days, about 2–3 hours a day)
If your deadline is shorter, do only the tasks marked **MUST**.

| Day | Member A | Member B |
|---|---|---|
| 1 | Shared setup (Part 1) | Shared setup (Part 1) |
| 2 | Understand the code (Part 2) | Understand the code (Part 2) |
| 3 | A1 Publish on GitHub Pages **MUST** | B1 Check rules are correct **MUST** |
| 4 | A2 Level 1 polish **MUST** | B2 Nepali review **MUST** |
| 5 | A3 Level 2 tuning **MUST** | B3 Two new Teach Bhai situations **SHOULD** |
| 6–7 | A4 Real graphics **SHOULD** | B4 Voice recording **SHOULD** |
| 8 | A5 Phones, tablets and offline **MUST** | B5 Pilot kit **MUST** |
| 9 | A6 Help B: drawings for new situations **SHOULD** | B6 Child-friendliness review **MUST** |
| 10 | **Integration day together** (Part 5) **MUST** | same |
| 11–12 | A7 Bug fixing + release **MUST** | B7 Teacher test + fixes **MUST** |
| 13 | **Pilot test with children** (Part 6) **MUST** | same |
| 14 | Help with charts | B8 Results + application update **MUST** |
| 15 | **Demo video + pitch rehearsal** (Part 7) **MUST** | same |

---

## Part 1. Shared setup (Day 1, both members, each on their own computer)

### Step 1.1 Install the tools
1. **Google Chrome:** google.com/chrome. We test in Chrome.
2. **VS Code:** code.visualstudio.com. Install it, open it, go to the Extensions tab (four-squares icon) and install:
   - *Live Server* (by Ritwick Dey), optional but handy
   - *Prettier* (code formatter), optional
3. **Git:** git-scm.com. Install with the default options.
4. **Python 3:** python.org (only used to run a tiny local web server). On Windows, tick **"Add python.exe to PATH"**.

✅ **Check:** open a terminal (VS Code → Terminal → New Terminal) and run:
```bash
git --version
python --version
```
Both should print a version number.
*Windows tip: if you have two Pythons installed, use `py -3.12` instead of `python` everywhere in this guide.*

### Step 1.2 Create a GitHub account
github.com → Sign up (if you don't have one). Tell your teammate your username.

### Step 1.3 Tell Git who you are (once per computer)
```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

### Step 1.4 Member A creates the shared repository
1. On github.com, click **+ → New repository**.
2. Name: `road-safety-adventure`, set it to **Public** (needed for free GitHub Pages), and **do not** add a README.
3. Click **Create repository**.
4. **Settings → Collaborators → Add people** → add Member B's username. Member B accepts the email invitation.

### Step 1.5 Member A uploads the starter kit
1. Unzip `road-safety-adventure.zip` to your Desktop. You should see `index.html` directly inside the `road-safety-adventure` folder.
2. In VS Code: **File → Open Folder** → choose that folder.
3. In the VS Code terminal:
```bash
git init
git add .
git commit -m "Starter kit: working prototype"
git branch -M main
git remote add origin https://github.com/<A-username>/road-safety-adventure.git
git push -u origin main
```
(Replace `<A-username>`. If asked to sign in, sign in through the browser window that opens.)

✅ **Check:** refresh the repository page on GitHub. You should see all the files.

### Step 1.6 Member B downloads (clones) the repository
```bash
cd Desktop
git clone https://github.com/<A-username>/road-safety-adventure.git
cd road-safety-adventure
code .
```

### Step 1.7 Run the game (both)
In the VS Code terminal, inside the project folder:
```bash
python -m http.server 8000
```
Open Chrome and go to **http://localhost:8000**.

✅ **Check:** you see "Road Safety Adventure" with three locked level buttons and a green **New Player** button.

- Stop the server with **Ctrl + C**.
- ⚠️ Double-clicking `index.html` **will not work**: browsers block our code on `file://`. Always use the server (or VS Code: right-click `index.html` → *Open with Live Server*).

### Step 1.8 Play the whole game once (both)
New Player → answer 5 questions → Level 1 → Level 2 → Level 3 → Final Quiz → Menu → Teacher. Write down anything confusing; this is your first bug list.

**Chrome DevTools** is your best friend: press **F12**, then open the **Console** tab. Red text means an error. Always look there first when something breaks.

### Step 1.9 The team Git routine (use it every time you work)
Each task happens on its own **branch**, so you never overwrite each other's work.

```bash
# 1. get the latest version
git checkout main
git pull

# 2. make a branch for your task (A = member A, B = member B)
git checkout -b A2-level1-polish

# 3. ... edit files, test in the browser ...

# 4. save your work
git add .
git commit -m "Level 1: walking wobble + tempo + button hint"
git push -u origin A2-level1-polish
```
5. On GitHub, click **Compare & pull request → Create pull request**.
6. Your teammate opens it, reads the changes, and clicks **Merge pull request**.
7. Both run `git checkout main` then `git pull`.

**File ownership.** To avoid conflicts, only edit the files you own. If you need to change the other person's file, ask first.

| Member A owns | Member B owns |
|---|---|
| `index.html`, `sw.js`, `manifest.webmanifest` | `js/i18n.js` |
| `js/main.js`, `js/config.js`, `js/ui.js` | `js/data/quiz.js`, `js/data/scenarios.js` |
| `js/textures.js`, `js/sound.js` (except the `RECORDED` list) | `js/scenes/Level3TeachBhai.js` |
| `js/scenes/BootScene.js` | `js/scenes/QuizScene.js`, `TeacherScene.js` |
| `js/scenes/Level1Crossing.js`, `Level2Driver.js` | `js/scenes/MenuScene.js`, `LevelCompleteScene.js` |
| `images/` | `audio/`, and the `RECORDED` list in `sound.js` |

---

## Part 2. Understand the code (Day 2, both)

Spend 2 hours here. Don't skip it: everything after this is easier once you know the map.

### 2.1 How a Phaser game works, in 6 words
- **Game:** created once in `js/main.js` (size 960×540, list of scenes).
- **Scene:** one screen (Menu, Quiz, Level 1 …). Each is a class with:
  - `create()` runs **once** when the screen opens: draw things, make buttons.
  - `update(time, delta)` runs **about 60 times per second**: move things, check rules. `delta` is the milliseconds since the last frame; we use `dt = delta / 1000` (seconds), so speed is "pixels per second" on every computer.
- **Texture:** a picture. We draw ours with code in `js/textures.js`, so no image files are needed.
- **Tween:** a smooth animation: `this.tweens.add({ targets: thing, x: 500, duration: 1000 })`.
- **Container:** a group of objects you can move together (Level 2 moves the whole street).
- **Switching screens:** `this.scene.start("Level2")`.

### 2.2 File map: open each file and read the comments at the top
```
index.html          loads lib/phaser.min.js, then js/main.js
js/main.js          Phaser settings + list of scenes + offline registration
js/config.js        sizes, colours, road positions, stars rule (0 mistakes = 3 stars)
js/i18n.js          every on-screen sentence in English + Nepali, t("key") returns the text
js/storage.js       saves sessions: quiz scores, stars; no names
js/sound.js         beeps/horns made with code, plus narrate(key, text) for voice
js/textures.js      draws Sita, Bhai, cars, microbus, bus, school, stars ...
js/ui.js            makeButton(), showMessage(), cornerButtons(), makeHud()
js/data/quiz.js     the 5 questions
js/data/scenarios.js the Teach Bhai situations
js/scenes/          one file per screen
```

### 2.3 Follow one flow through the code
1. `MenuScene` → "New Player" → `Store.startSession()` → `this.scene.start("Quiz", { kind: "pre" })`
2. `QuizScene.finish()` → `Store.saveQuiz("pre", score, answers)` → back to Menu, where Level 1 is now unlocked
3. `Level1Crossing.win()` → `scene.start("LevelComplete", { level: 1, mistakes })`
4. `LevelCompleteScene` → `Store.saveLevel(1, stars, mistakes)` → badge → Next
5. After Level 3 → "Final Quiz" → `QuizScene` with `kind: "post"` → shows *before → after*

### 2.4 Three warm-up exercises (do them, then undo them)
1. **Colour:** in `js/textures.js` find `make(scene, "sita"` and change `shirt: 0x3a86ff` to `shirt: 0xff006e`. Refresh the browser (**Ctrl + Shift + R**). Sita now wears pink.
2. **Speed:** in `Level1Crossing.js` change `const SPEED = 150;` to `300`. Sita walks twice as fast.
3. **Words:** in `js/i18n.js` change `subtitle` (English). The menu text changes.

Then undo all three: `git checkout .` throws away uncommitted changes.

✅ **Check:** both members can explain in their own words what `create()` and `update()` do, and where the words of the game live.

---

## Part 3. Member A tasks (Game Developer)

### A1. Publish on GitHub Pages (Day 3) **MUST**
1. On GitHub: repository → **Settings → Pages**.
2. Under *Build and deployment*: Source = **Deploy from a branch**, Branch = **main**, folder **/(root)** → **Save**.
3. Wait 1–2 minutes and refresh. You'll see: *Your site is live at* `https://<A-username>.github.io/road-safety-adventure/`.
4. Open the link on your phone.

✅ **Check:** the game opens from the link on a phone and on a laptop. Share the link with Member B.

> Every time you merge to `main`, the website updates by itself within about 2 minutes.

### A2. Level 1 polish (Day 4) **MUST**
Branch: `A2-level1-polish`. File: `js/scenes/Level1Crossing.js` (and `textures.js`).

**Step 1: make Sita wobble while walking.** In `update(time, delta)`, find these two lines:
```js
        this.player.x = nx;
        this.player.y = ny;
```
Directly **after** them, add:
```js
        // small left-right wobble while walking, so she looks alive
        const moving = vx !== 0 || vy !== 0;
        this.player.setAngle(moving ? Math.sin(time / 70) * 5 : 0);
```
✅ Sita rocks gently when she moves and stands straight when she stops.

**Step 2: add a Nepali "Safa Tempo" (electric three-wheeler).** In `js/textures.js`, inside `createTextures`, just after the line that makes `"bike"`, add:
```js
    make(scene, "tempo", 80, 40, (g) => vehicle(g, 80, 40, 0x2a9d8f, 0x1f7a6f, 0xffffff));
```
In `Level1Crossing.js`, inside `spawnCar`, change:
```js
        const types = ["car", "car2", "taxi", "microbus", "bike", "bike"];
```
to:
```js
        const types = ["car", "car2", "taxi", "microbus", "bike", "bike", "tempo"];
```
✅ Green tempos now appear in traffic.

**Step 3: a bouncing arrow that shows where the crossing button is.** In `create()`, find these two lines (near the top of `create()`):
```js
        this.signalGfx = this.add.graphics().setDepth(5);
        this.drawSignal();
```
and add **after** them:
```js
        // bouncing arrow over the crossing button until the child presses it
        this.hint = this.add.text(POLE.x, POLE.y - 40, "▼", {
            fontFamily: FONT, fontSize: "32px", color: "#e74c3c",
        }).setOrigin(0.5).setDepth(50);
        this.tweens.add({ targets: this.hint, y: POLE.y - 28, yoyo: true, repeat: -1, duration: 400 });
```
In `pushButton()`, find `this.requested = true;` and add right **after** it:
```js
        this.hint.setVisible(false);
```
✅ A red arrow bounces over the button and disappears once the button is pressed.

**Step 4: test every rule.** Play Level 1 and deliberately break each rule. Each one must give the right message and **+1 mistake**:
| Try this | Expected message |
|---|---|
| Walk onto the road away from the zebra | "Cross only on the ZEBRA CROSSING." |
| Step onto the zebra without looking | "Stop! First look RIGHT, LEFT, RIGHT." |
| Look LEFT first at the kerb | "In Nepal, vehicles come from the RIGHT first…" (no mistake, just a hint) |
| Look correctly, but step on while the man is red | "Wait! The man is RED…" |
| Do everything right | Level complete, 3 stars if there were no mistakes |

Commit, push, and open a pull request.

### A3. Level 2 tuning (Day 5) **MUST**
Branch: `A3-level2-tuning`. File: `js/scenes/Level2Driver.js`.

The difficulty knobs are at the top of the file:
```js
const MAX_SPEED = 280, ACCEL = 160, BRAKE = 520, COAST = 40;
const SAFE_SPEED = 140;    // "slow" speed for the school zone
```
And in `createHazards()` each hazard has a `trigger`: how close (in world pixels) the microbus must get before the danger begins.

**Step 1: test with "real players".** Ask 2–3 children (siblings, cousins, neighbours) aged 7–12 to play Level 2. Watch silently and write down:
- Do they understand GO and BRAKE without help?
- Do they always crash into the bus child? If **everyone** fails, it's too hard: make `BRAKE = 650` or move the bus `trigger` from `2180` to `2100` (the child appears earlier).
- Does nobody ever fail? Then it's too easy: make `MAX_SPEED = 320`.

**Step 2: brake lights.** In `update()`, right after the line `this.speed = Phaser.Math.Clamp(this.speed, 0, MAX_SPEED);`, add:
```js
        // red tint while braking = brake lights
        if (brake) this.bus.setTint(0xffb3b3); else this.bus.clearTint();
```
✅ The microbus turns reddish while braking.

**Step 3: confirm the lesson appears every time.** For each hazard (zebra, bus, ball), play once carefully (expect a green "Well driven!" message) and once too fast (expect a red message + 1 mistake). A careful driver must be able to finish with **0 mistakes**.

### A4. Real graphics (Days 6–7) **SHOULD**
The drawn graphics work fine. Real art makes the demo look professional.

1. Get free art with a licence that allows any use: **kenney.nl** assets are CC0 (public domain). Look for top-down car/vehicle packs and simple character packs. Or draw your own in a free editor such as Piskel (piskelapp.com) or Canva.
2. Make a folder `images/` in the project.
3. Resize each image to **about the same size** as the drawn one, because the game uses the picture size for collisions:

| key | size (w × h) | faces |
|---|---|---|
| sita | 36 × 53 | front |
| bhai, child, child2 | 31 × 46 | front |
| police | 36 × 53 | front |
| car, car2 | 90 × 46 | **right** |
| taxi | 86 × 44 | right |
| microbus | 124 × 54 | right |
| bus | 180 × 62 | right |
| bike | 62 × 26 | right |
| school | 230 × 150 | front |
| tree | 64 × 64 | top |

4. In `js/scenes/BootScene.js`, inside `preload()`, add one line per image, using **the same key**:
```js
        this.load.image("microbus", "images/microbus.png");
        this.load.image("sita", "images/sita.png");
```
`createTextures` skips any key that already exists, so your real image wins automatically.
5. Add each image to the `FILES` list in `sw.js`, e.g. `"./images/microbus.png",`.

✅ **Check:** the real pictures appear, and collisions still feel right in Levels 1 and 2.

### A5. Phones, tablets and offline (Day 8) **MUST**
1. **Phone test:** open the GitHub Pages link on an Android phone in Chrome. Turn the phone sideways. Play all levels using touch only.
2. **Install as an app:** Chrome menu (⋮) → **Add to Home screen / Install app**. Open it from the home screen; it runs full-screen.
3. **Offline test:** after opening the game once with internet, turn on **Airplane mode** and open the app again. It must still work.
   - On a laptop: F12 → **Application** tab → *Service workers* → tick **Offline** → refresh.
4. **Updating rule (important):** every time you publish a change, open `sw.js` and increase the version:
```js
const CACHE_NAME = "road-safety-v2";   // was v1
```
   Otherwise installed copies keep the old version.
5. Test on the **slowest** device you can find (an old phone, a school computer). If it stutters, tell Member B and note it for the pitch ("tested on low-end devices").

✅ **Check:** the installed app works in airplane mode, and touch controls work in all three levels.

### A6. Help Member B: pictures for new situations (Day 9) **SHOULD**
After Member B adds the situations `phone` and `jumpOff` (Task B3), add their drawings in `Level3TeachBhai.js` → `drawProps(kind)`. Add before the closing `}` of `drawProps`:
```js
        if (kind === "phone") {
            const g = add(this.add.graphics());
            g.fillStyle(0x222222); g.fillRoundedRect(BHAI_STOP_X + 12, ROAD_TOP - 40, 12, 20, 3); // phone in hand
            g.fillStyle(0x9ad1ff); g.fillRect(BHAI_STOP_X + 14, ROAD_TOP - 37, 8, 13);           // screen
            add(this.add.image(640, 357, "car"));
        }
        if (kind === "jumpOff") {
            const bus = add(this.add.image(BHAI_STOP_X + 40, 357, "microbus"));
            this.tweens.add({ targets: bus, x: BHAI_STOP_X + 120, duration: 2500 }); // still moving!
        }
```
✅ Both new situations show their pictures.

### A7. Bug fixing + release (Days 11–12) **MUST**
1. Fix everything on the shared bug list from Integration Day (Part 5).
2. Bump `CACHE_NAME` in `sw.js`.
3. Merge to `main`, wait 2 minutes, and test the live link on a phone.
4. Create a release: GitHub → **Releases → Draft a new release** → tag `v1.0-pilot` → Publish. This freezes the exact version used in the pilot.

---

## Part 4. Member B tasks (Learning & Content Lead)

### How to edit text files safely (read before B1)
Text lives inside quotes in lines like:
```js
        l1Goal: "Help Sita reach school. Use the ZEBRA CROSSING.",
```
Rules: keep the **quotes**, keep the **comma** at the end, and don't use a plain `"` inside the text (use `'` instead). After every edit, refresh the game and check the **Console (F12)** for red errors. A red error usually means a missing comma or quote on the line you just changed.

### B1. Check every rule is correct (Day 3) **MUST**
Children will learn exactly what we teach, so it must be right for Nepal.

1. Make a table (in a doc or sheet) with these columns: *Rule | Where in game | Source that confirms it | OK?*
2. Rules to verify:
   - Traffic keeps to the **left** in Nepal, so children look **right** first.
   - Cross only at zebra crossings; wait for the green pedestrian signal.
   - Don't cross from behind or between parked vehicles.
   - Never run onto the road after a ball; ask an adult.
   - Where there is no footpath, walk on the **right** side **facing** oncoming traffic.
   - Obey traffic police hand signals.
   - Use overhead pedestrian bridges where available.
   - Don't use a phone while crossing; don't get off a vehicle before it stops (for B3).
3. Sources: Nepal Traffic Police / Metropolitan Traffic Police Division public awareness materials, school road-safety textbooks, the UNICEF Nepal report cited in our application, and **ideally a short conversation with a traffic police officer** (also a great quote for the pitch).
4. If anything is wrong, fix the text in `js/i18n.js`, `js/data/quiz.js` or `js/data/scenarios.js`.

✅ **Check:** every rule has a source in your table. Keep the table; judges like it.

### B2. Nepali language review (Day 4) **MUST**
The Nepali text in the starter kit is a **first draft**.
1. Open `js/i18n.js` (section `ne:`), `js/data/quiz.js` and `js/data/scenarios.js` (the `ne:` lines).
2. Copy all Nepali lines into a document and ask a Nepali teacher to check them for **grade 1–5 reading level**: short words and simple sentences.
3. Put the corrected lines back, keeping quotes and commas.
4. In the game, press **नेपाली** on the menu and play everything in Nepali. Check that no text runs off the screen. If a sentence is too long, shorten it.

✅ **Check:** the whole game reads naturally in Nepali, and no text is cut off.

### B3. Two new Teach Bhai situations (Day 5) **SHOULD**
File: `js/data/scenarios.js`. Add these two blocks **inside** the `[ ... ]` list, after the `bridge` block (mind the commas between blocks):
```js
    {
        id: "phone",
        props: "phone",
        unsafe: true,
        intent: {
            en: "I'll watch a cartoon on my phone while I cross the road.",
            ne: "म फोनमा कार्टुन हेर्दै बाटो काट्छु।",
        },
        explain: {
            en: "Put the phone away while crossing. Your eyes and ears must be on the road.",
            ne: "बाटो काट्दा फोन राख्नुहोस्। आँखा र कान सडकमा हुनुपर्छ।",
        },
    },
    {
        id: "jumpOff",
        props: "jumpOff",
        unsafe: true,
        intent: {
            en: "My stop! I'll jump off the microbus before it stops. I'm in a hurry!",
            ne: "मेरो स्टप! माइक्रोबस नरोकिँदै म हामफाल्छु। मलाई हतार छ!",
        },
        explain: {
            en: "Always wait until the vehicle stops fully, then get off on the footpath side.",
            ne: "गाडी पूरा नरोकिञ्जेल पर्खनुहोस्, अनि फुटपाथतिरबाट ओर्लनुहोस्।",
        },
    },
```
The game works immediately (with the plain street). Then ask Member A for task A6 so the pictures appear.

**Balance check:** you now have 8 situations: 5 unsafe and 3 safe. That's fine, but **mix the order** so "safe" isn't predictable. A good order: busGap, zebraGreen, ball, noFootpath, phone, police, bridge, jumpOff. Rearrange the blocks to match.

✅ **Check:** Level 3 shows "1/8 … 8/8", and both new situations work.

### B4. Voice recording (Days 6–7) **SHOULD**
Many 5–7 year olds can't read yet, so voice matters. The game already reads text aloud with the browser voice where one exists (usually English only). Nepali needs **your** recordings.

1. Tools: a phone voice recorder in a quiet room, then **Audacity** (free, audacityteam.org) to trim silence and export **MP3**.
2. Use one friendly, slow, clear voice for everything.
3. Record each line from `js/i18n.js` (or the quiz/scenario files) and save it with **exactly** this file name in `audio/ne/` (and `audio/en/` if you also record English):

| File name (key + .mp3) | Text it must say (from) |
|---|---|
| menu.mp3 | `title` + `subtitle` |
| quiz_q1.mp3 … quiz_q5.mp3 | the question + its 3 options (`quiz.js`) |
| l1Goal, l1Press, l1Look, l1LookOk, l1WrongOrder, l1NotZebra, l1NoLook, l1WaitGreen, l1Hit | same keys in `i18n.js` |
| l2Goal, l2Controls, l2Zebra, l2Bus, l2Ball, l2Slow | same keys in `i18n.js` |
| l3Goal | `i18n.js` |
| l3_busGap, l3_zebraGreen, l3_ball, l3_noFootpath, l3_police, l3_bridge (+ l3_phone, l3_jumpOff) | the `intent` of each situation |
| l3_busGap_explain … (one per situation) | the `explain` of each situation |
| levelDone, mission | `i18n.js` |

4. For each recorded file:
   - In `js/sound.js`, add its key to the list:
```js
export const RECORDED = {
    en: [],
    ne: ["menu", "l1Goal", "l1Press"],   // add every key you recorded
};
```
   - Tell Member A to add `"./audio/ne/l1Goal.mp3",` etc. to `FILES` in `sw.js` (so it works offline).
5. Keep each file short (under about 10 seconds) and small (MP3 at 64–96 kbps is plenty).

✅ **Check:** switch to Nepali, start Level 1, and you hear your recorded voice.

### B5. Pilot kit (Day 8) **MUST**
Prepare these documents before going to a school:

1. **Permission letter to the principal** (1 page): who you are, what the game is, 30–40 minutes per group, no personal data collected, results shared with the school.
2. **Parent information note:** same points in simple Nepali. Ask the school whether written consent is needed.
3. **Observation sheet** (one row per child; use the player number from the game, never names):

| Player # | Age | Grade | Needed help? (Y/N, where) | Enjoyment 1–5 (smiley faces) | Funny/confusing moments |
|---|---|---|---|---|---|

4. **Three questions to ask after playing** (show smiley faces 😀 😐 🙁):
   - Did you like the game?
   - Was anything hard?
   - Which level was your favourite, and why?
5. **Teacher feedback form:** Would you use this in class? What is missing? What would you change?

### B6. Child-friendliness review (Day 9) **MUST**
Play every screen and tick each item:
- [ ] Buttons are big enough for small fingers (at least about 1 cm on a phone).
- [ ] Text is readable from a normal distance; no sentence is longer than about 20 words.
- [ ] Red and green are never the **only** clue: the pedestrian lights also differ by **position** (red left, green right), and messages say the word "RED" or "GREEN".
- [ ] Nothing is scary: no crashes, no injuries, only braking and a horn.
- [ ] Every wrong answer explains **why**, in a kind voice.
- [ ] The game can be played with sound off (all instructions also appear as text).

Write down problems and send them to Member A (for Levels 1 and 2) or fix them yourself (Level 3 and text).

### B7. Teacher Dashboard test (Days 11–12) **MUST**
1. Play the full game 3 times as 3 different "New Players", giving different quiz answers each time.
2. Open **Teacher**. Check that the numbers make sense: players = 3; the before/after averages match what you answered.
3. Click **Download CSV**, open it in Excel or Google Sheets, and check the columns (`pre_score`, `post_score`, `l1_stars` …).
4. Practise **Clear all data** (it needs two taps). Before the pilot, always clear test data.

### B8. Results + application update (Day 14) **MUST**
**Analyse the pilot CSV in Excel.** Put the data in rows 2 to 16 for 15 children, then:
```
Average before:      =AVERAGE(C2:C16)
Average after:       =AVERAGE(D2:D16)
Improvement %:       =(AVERAGE(D2:D16)-AVERAGE(C2:C16))/AVERAGE(C2:C16)
Children who improved: =SUMPRODUCT(--(D2:D16>C2:C16))
Paired t-test p-value: =T.TEST(C2:C16,D2:D16,2,1)
```
(Columns: C = pre_score, D = post_score.) A p-value below 0.05 suggests the improvement is unlikely to be chance. Report honestly: *"In a pilot with N children, average quiz scores rose from X to Y (Z%)."* Also state that this measures **immediate** recall. If possible, repeat the quiz one week later and report that too, because judges respect this honesty.

**Replace these application answers** (edit to your own voice):

> **Q10 (solution):** We built an interactive, web-based road-safety game for children aged 5–12 in Nepal. Children guide Sita across a real-looking Nepali street using the crossing button, the green pedestrian signal and the "look right–left–right" habit (Nepal drives on the left). They then switch sides and drive a microbus, discovering why drivers cannot see a child behind a parked bus. Finally, they become the teacher, deciding whether "Bhai" is about to do something safe or dangerous. Mistakes never end in a crash: the vehicle brakes, and the game explains the rule. A short quiz before and after playing measures learning, and a teacher dashboard shows results without collecting any names.

> **Q11 (technology):** The game is built with the Phaser 3 HTML5 game engine (WebGL/Canvas) and runs in any modern browser. It is a Progressive Web App: after the first visit, it installs on a phone, tablet or school computer and works fully offline, which is important for schools with unreliable internet. Sounds use the Web Audio API with stereo panning, so a vehicle from the right is heard on the right. Narration plays recorded Nepali voice files, with browser speech synthesis as a fallback. Learning data (quiz scores, stars) is stored only on the device and exported by teachers as anonymous CSV files.

> **Q13 (what's different):** (1) It is designed for Nepal: left-hand traffic, microbuses, tempos, traffic police signals, overhead bridges and roads without footpaths, in Nepali with voice. (2) Children switch perspective: they also play as the driver, building empathy for why the rules exist. (3) Children teach a younger sibling character, which strengthens memory (the protégé effect). (4) Learning is measured inside the game with a pre/post quiz and an anonymous teacher dashboard, so every school pilot produces evidence.

Also update the KPI table "Current result" column with your real pilot numbers.

---

## Part 5. Integration Day (Day 10, both together) **MUST**
1. Both run `git checkout main` then `git pull`, and start the server.
2. Play the full flow on **one laptop and one phone**, in **English and Nepali**.
3. Run this checklist and note every failure in a shared "Bug list" (GitHub → **Issues → New issue**, one issue per bug):

| # | Test | Pass? |
|---|---|---|
| 1 | Menu: levels are locked before the quiz and unlock one by one | |
| 2 | Pre-quiz: 5 questions, no right/wrong shown, returns to the menu | |
| 3 | Level 1: every rule message (see A2 step 4) | |
| 4 | Level 1: 0 mistakes = 3 stars, 1–2 = 2 stars, 3+ = 1 star | |
| 5 | Level 2: careful driving = 0 mistakes; fast driving = red lesson messages | |
| 6 | Level 3: all situations; a timeout counts as "Go ahead" | |
| 7 | Badges appear on the menu after each level | |
| 8 | Final quiz shows "before → after" and the home mission | |
| 9 | Teacher Dashboard numbers are correct; the CSV downloads | |
| 10 | Language switch works on every screen | |
| 11 | Home (⌂) and sound (♪) buttons work in every level | |
| 12 | Installed app works in airplane mode | |
| 13 | No red errors in the Console (F12) | |

4. Assign each bug to its file owner (see the table in 1.9).

---

## Part 6. Pilot test day (Day 13, both) **MUST**
**Before:** permission obtained (B5), devices charged, game installed and opened once (so it's cached), headphones if possible, and Teacher → Clear all data.

**For each child (about 20–25 minutes):**
1. Teacher or you tap **New Player** (the player number appears bottom-right; write it on the observation sheet).
2. **Pre-quiz:** for small children, read the questions aloud **without hinting**.
3. The child plays Levels 1–3. **Don't help unless they're stuck for more than 1 minute**, and write down where they got stuck. That is your most valuable data.
4. **Final quiz.**
5. The 3 smiley questions (B5).

**Roles:** Member A watches the screen and notes bugs and stuck points. Member B runs the session and talks with the child.

**After:** Teacher → **Download CSV**. Collect the teacher feedback form. Take photos only with permission and never of children's faces unless the school has consented.

Target: at least **15 children** (our KPI). Two schools or two grades are even better.

---

## Part 7. Demo video + pitch (Day 15, both) **MUST**
**Demo video (2 minutes)**, recorded with OBS Studio (free) or a phone:
1. 0:00–0:15 The problem: one UNICEF Nepal statistic.
2. 0:15–0:45 Level 1: show "look right first" and a gentle mistake.
3. 0:45–1:10 Level 2: the child behind the bus. Say this line: *"Now the child understands why."*
4. 1:10–1:30 Level 3: Teach Bhai.
5. 1:30–1:50 Teacher Dashboard with **real pilot results**.
6. 1:50–2:00 Offline + Nepali + next steps.

**Pitch line:**
> *"The first road-safety game where Nepali children don't just cross the road — they drive it, teach it, and take it home."*

**Likely judge questions. Prepare an answer for each:**
- How do you know children learned? → the pre/post numbers, and the honest limit that it measures immediate recall.
- What about children's privacy? → no names or accounts; data stays on the device.
- What about schools without internet? → offline PWA.
- How will you scale? → teacher partnerships, more levels, other countries' traffic rules (the text and rules are in data files).
- Why not just a video or a poster? → children practise decisions and see the consequences safely.

---

## Part 8. Troubleshooting
| Problem | Fix |
|---|---|
| Blank page when double-clicking `index.html` | Use `python -m http.server 8000` and open http://localhost:8000 |
| `python` is not recognized (Windows) | Reinstall Python with "Add to PATH" ticked, or use `py` instead of `python` |
| Changes don't show | Hard refresh with **Ctrl + Shift + R**. On the live site, bump `CACHE_NAME` in `sw.js` |
| Red error "Unexpected token" in the Console | A missing comma or quote on the line you just edited; the Console shows the file and line number |
| Red error "… is not defined" | A typo in a name, or a missing `import` at the top of the file |
| Nepali shows as boxes | The device lacks a Devanagari font; install "Noto Sans Devanagari" or test on another device (most phones are fine) |
| No sound | Tap the screen first (browsers block sound until a tap); check the ♪ button; check the device volume |
| `git push` rejected | Run `git pull` first, then push again |
| Merge conflict | Open the file, keep the right lines, delete the `<<<<<<<`, `=======` and `>>>>>>>` markers, then `git add .`, `git commit`, `git push`. Ask your teammate if unsure |
| The live site still shows the old version on a phone | Bump `CACHE_NAME`, then close and reopen the app twice |

---

## Part 9. After the prototype (roadmap; mention it in the pitch, don't build it yet)
1. **Build your own street:** teachers recreate the road outside their own school.
2. **Danger map:** anonymous school-level summaries of which rules children miss most, for road-safety organisations.
3. **Listen Level:** cross using only stereo sound cues.
4. **Seasons of Nepal:** monsoon roads, Terai fog, festival rush.
5. **Real-world missions:** parents tick off "spotted 3 road signs" for a badge.
6. **More languages:** Maithili, Bhojpuri, Newari, by adding sections to `i18n.js`.

Good luck, team! Build it, test it with children, and let the results speak. 🚸

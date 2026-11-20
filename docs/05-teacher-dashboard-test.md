# 05 — Teacher Dashboard test (guide task B7)

Goal: prove the dashboard numbers and the CSV are correct **before** the pilot. Run this on the local server (`python -m http.server 8000` → <http://localhost:8000>) or on the live link.

> ⚠️ This is a **test with made-up answers**. It is not pilot data. You **must** clear this test data before any child plays (step 6).

## Step 1 — Prepare

1. Open **Teacher** → **Clear all data**. Tap twice (first tap changes the label to *"Tap again to confirm"*, second tap clears and restarts). Confirm **Players = 0**.
2. Note the correct quiz answers from `js/data/quiz.js`: **q1 = Right (index 1)**, **q2 = Wait for the green man (2)**, **q3 = Zebra crossing (0)**, **q4 = Ask an adult (1)**, **q5 = Right, facing traffic (2)**.

## Step 2 — Play three full "New Player" sessions

Use **New Player** each time and give deliberately different answers. Worked example (option indexes chosen):

| Session | Pre-quiz choices | Pre score | Post-quiz choices | Post score |
|---|---|---|---|---|
| 1 | 1, 2, 0, 1, 2 | **5 / 5** | 1, 2, 0, 1, 2 | **5 / 5** |
| 2 | 0, 2, 0, 1, 2 | **4 / 5** | 1, 2, 0, 1, 2 | **5 / 5** |
| 3 | 0, 1, 0, 1, 2 | **3 / 5** | 0, 2, 0, 1, 2 | **4 / 5** |

Play through Levels 1–3 each time (a session without a post quiz is excluded from the after-average).

## Step 3 — Check the Teacher screen

Open **Teacher** and tick each check:

- [ ] **Players = 3** (`computeStats()` counts all saved sessions).
- [ ] **Average score BEFORE playing = 4.0 / 5** — `(5 + 4 + 3) / 3`. This row uses every session with a pre quiz (`avgPre`).
- [ ] **Average score AFTER playing = 4.7 / 5 (n=3)** — `(5 + 5 + 4) / 3`. This row uses only sessions with **both** quizzes (`pairedPost`), which is why it shows `n=`.
- [ ] **Improvement = +0.7 points (17%)** — `(4.67 − 4.0) / 4.0 × 100`, rounded.
- [ ] **Most missed questions (before playing)** is sorted by the % who answered `0` (wrong) before play. With the example above, q1 and q2 should be at the top (2 of 3 wrong each).
- [ ] Numbers do not change when you go Back and reopen Teacher.

> The dashboard code is in `js/scenes/TeacherScene.js` → `computeStats()`. If a number differs, check that all three sessions finished the post quiz and that you did not leave an extra half-finished session.

## Step 4 — Check the CSV columns

Click **Download CSV**, open the file in Excel / Google Sheets / a text editor. The **exact expected header line** from `toCSV()` in `js/scenes/TeacherScene.js` is:

```csv
player,start,pre_score,post_score,l1_stars,l2_stars,l3_stars,pre_q1,pre_q2,pre_q3,pre_q4,pre_q5,post_q1,post_q2,post_q3,post_q4,post_q5
```

Checks:

- [ ] The header matches **exactly** — 17 columns, in this order.
- [ ] There are **3 data rows** (4 lines including the header).
- [ ] `pre_score` / `post_score` values are 5/5, 4/5, 3/5 and 5/5, 5/5, 4/5 as in the table above.
- [ ] `pre_q1 … pre_q5` and `post_q1 … post_q5` are `1` (correct) or `0` (wrong), matching your chosen answers.
- [ ] `l1_stars`, `l2_stars`, `l3_stars` are filled for each finished level (0 mistakes = 3 stars; see `js/config.js` → `starsFor()`).
- [ ] There is **no name, no account, no email** column — only an anonymous `player` id and a `start` timestamp.
- [ ] The filename is `road-safety-results-YYYY-MM-DD.csv`.

## Step 5 — Practise **Clear all data** (two taps)

1. On Teacher, tap **Clear all data** once → the label must change to **"Tap again to confirm"** and nothing is deleted yet.
2. Tap a second time → the screen restarts and **Players = 0**.
3. Reopen Teacher and confirm the CSV would now have only the header row.

Note: the single tap is intentional protection against deleting pilot results by accident (`TeacherScene.js` → `this.confirmClear`).

## Step 6 — Before the pilot

- [ ] **Clear all test data** (two taps) on **every device** that will be used — school tablets, your phone, the demo laptop.
- [ ] Confirm **Players = 0** on each device.
- [ ] Check that the device has opened the game once **with internet** (so the offline cache is ready), then test airplane mode.
- [ ] Record in the pilot log: date, device, and "test data cleared ✅".

If any check above fails, log it as a bug and assign it to the Teacher Dashboard owner before pilot day.

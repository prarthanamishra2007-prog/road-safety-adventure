# 08 — How to share the game with a link

`http://localhost:8000` only works on **your** computer. To send a link that works for judges, teachers and pupils, publish the project online. The game is a set of static files, so hosting is free.

Two easy options are below. **GitHub Pages** is recommended because the guide uses it. **Netlify Drop** is faster if you do not want to install Git.

---

## Option A — GitHub Pages (recommended, free)

You need a GitHub account. Git does **not** need to be installed if you upload files through the website.

1. Go to <https://github.com> and sign in.
2. Click **+ → New repository**.
3. Settings:
   - **Repository name:** `road-safety-adventure`
   - **Public** (required for free GitHub Pages)
   - **Do not** add a README, `.gitignore` or licence yet
   - Click **Create repository**
4. On the repository page, click **uploading an existing file**.
5. Unzip `road-safety-adventure-ready.zip`. Drag **all the files inside** the `road-safety-adventure` folder into the upload box (not the empty folder itself). Commit the changes.
6. Go to **Settings → Pages** (left menu).
7. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (or `master` if that is your default branch)
   - **Folder:** `/(root)`
   - Click **Save**
8. Wait 1–2 minutes and refresh. You will see:

   > Your site is live at `https://<your-username>.github.io/road-safety-adventure/`

9. Copy that link and send it to anyone. It works on phones, tablets and laptops.

### Updating the live site

Re-upload the changed files, then **increase `CACHE_NAME` in `sw.js`** (for example `road-safety-v2` → `road-safety-v3`). Otherwise people who opened the game before will keep seeing the old version. After uploading, ask testers to close and reopen the app twice, or hard-refresh with **Ctrl + Shift + R**.

---

## Option B — Netlify Drop (fastest, no Git, no account needed to start)

1. Unzip `road-safety-adventure-ready.zip` so you have a `road-safety-adventure` folder.
2. Open <https://app.netlify.com/drop> in Chrome.
3. Drag the **whole `road-safety-adventure` folder** onto the page.
4. Netlify publishes it immediately and gives you a link such as
   `https://random-name-123456.netlify.app/`.
5. Optional: create a free account and rename the site to something like `road-safety-adventure-nepal`.
6. Send the link.

The offline service worker works here too because Netlify uses HTTPS. When you update the site, drag the new folder again and bump `CACHE_NAME` in `sw.js`.

---

## Option C — itch.io (if you want a game-store style page)

1. Create a free account at <https://itch.io>.
2. Click **Upload new project**, choose **HTML5 game**, and upload `road-safety-adventure-ready.zip`.
3. Set the title, description and cover image, then publish.
4. Send the itch.io project link.

---

## Quick checks after publishing

Open the live link and confirm:

- [ ] Menu shows **Road Safety Adventure** with three level cards.
- [ ] **New Player** starts the pre-quiz.
- [ ] Language button switches English ⇄ नेपाली.
- [ ] Press **F12 → Console** — there should be no red errors.
- [ ] On a phone: Chrome menu → **Add to Home screen**, then open the installed app.
- [ ] Turn on airplane mode and reopen the app — it should still work.

If the live page is blank, check that `index.html` is at the **root** of the published folder, not inside an extra nested folder.

---

## Privacy reminder

The game stores quiz scores and stars only on each device. No names or accounts are collected. When you share the link, also tell teachers to use **Teacher → Clear all data** before a real pilot.

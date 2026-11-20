// sw.js — the "service worker".
// It saves every game file on the device the first time the game is opened,
// so the game keeps working later WITHOUT internet (important for schools).
//
// IMPORTANT: every time you change any game file and publish again,
// increase the number in CACHE_NAME (v1 -> v2 -> v3 ...).
// Otherwise phones and tablets keep showing the old version.

// Road Safety Adventure prototype — cache version 2.
// Bump this to v3, v4, ... whenever you change any game file and publish again.
// If you add recorded voice MP3s, add each file to FILES below and bump this too.
const CACHE_NAME = "road-safety-v2";

const FILES = [
    "./",
    "./index.html",
    "./manifest.webmanifest",
    "./css/style.css",
    "./lib/phaser.min.js",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./js/main.js",
    "./js/config.js",
    "./js/i18n.js",
    "./js/storage.js",
    "./js/sound.js",
    "./js/textures.js",
    "./js/ui.js",
    "./js/data/quiz.js",
    "./js/data/scenarios.js",
    "./js/scenes/BootScene.js",
    "./js/scenes/MenuScene.js",
    "./js/scenes/QuizScene.js",
    "./js/scenes/Level1Crossing.js",
    "./js/scenes/Level2Driver.js",
    "./js/scenes/Level3TeachBhai.js",
    "./js/scenes/LevelCompleteScene.js",
    "./js/scenes/TeacherScene.js"
];

// 1) Install: download and store all files
self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES)));
    self.skipWaiting();
});

// 2) Activate: delete caches from older versions
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// 3) Fetch: answer from the saved copy first, the internet second
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((saved) => saved || fetch(event.request))
    );
});

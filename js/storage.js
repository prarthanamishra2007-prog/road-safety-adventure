// js/storage.js — saves progress on THIS device only (localStorage).
// No names, no accounts, nothing sent to the internet. This protects children's privacy.
//
// What we save:
//   lang      : "en" or "ne"
//   progress  : stars and badges per level
//   sessions  : one row per child: { id, start, pre:{score, answers}, post:{score, answers}, levels:{...} }

const KEY = "roadSafety.v1";

function load() {
    try {
        const raw = localStorage.getItem(KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {
        // localStorage can be blocked (private mode). The game still works, it just forgets.
    }
    return { lang: "en", progress: {}, sessions: [], current: null };
}

let data = load();

function save() {
    try {
        localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) { /* ignore */ }
}

export const Store = {
    getLang() { return data.lang || "en"; },
    setLang(l) { data.lang = l; save(); },

    // ----- progress (stars + badges) for the current child -----
    getProgress() {
        const s = this.currentSession();
        return s ? s.levels : {};
    },
    isUnlocked(levelNum) {
        if (levelNum === 1) return true;
        const p = this.getProgress();
        return !!p["l" + (levelNum - 1)];
    },

    // ----- sessions: one per child -----
    startSession() {
        const id = data.sessions.length + 1;
        const session = { id, start: new Date().toISOString(), pre: null, post: null, levels: {} };
        data.sessions.push(session);
        data.current = id;
        save();
        return session;
    },
    currentSession() {
        if (!data.current) return null;
        return data.sessions.find((s) => s.id === data.current) || null;
    },
    saveQuiz(kind, score, answers) {
        const s = this.currentSession();
        if (!s) return;
        s[kind] = { score, answers, time: new Date().toISOString() };
        save();
    },
    saveLevel(levelNum, stars, mistakes) {
        const s = this.currentSession();
        if (!s) return false;
        const key = "l" + levelNum;
        const old = s.levels[key];
        const isNew = !old;
        if (!old || stars > old.stars) s.levels[key] = { stars, mistakes };
        save();
        return isNew; // true = badge earned for the first time
    },

    allSessions() { return data.sessions; },
    clearAll() {
        data.sessions = [];
        data.current = null;
        save();
    },
};

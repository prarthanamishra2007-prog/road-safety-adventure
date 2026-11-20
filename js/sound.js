// js/sound.js — sounds made with code (no sound files needed) + voice narration.
//
// Sounds: we use the browser's Web Audio API to make beeps and horns.
// "pan" = stereo position: -1 = left speaker, 0 = middle, +1 = right speaker.
// So a car coming from the right really SOUNDS like it is on the right.
//
// Voice: narrate("l1Goal") first tries to play audio/<lang>/l1Goal.mp3
// (recorded by Member B). If that file does not exist, it uses the
// browser's built-in voice (speechSynthesis) if one is available.

import { lang } from "./i18n.js";

// MEMBER B — voice key checklist (record these exact keys in BOTH folders):
// audio/en/<key>.mp3:
//   menu, quiz_q1, quiz_q2, quiz_q3, quiz_q4, quiz_q5,
//   l1Goal, l1Press, l1Look, l1LookOk, l1WrongOrder, l1NotZebra,
//   l1NoLook, l1WaitGreen, l1Hit,
//   l2Goal, l2Controls, l2Zebra, l2Bus, l2Ball, l2Slow,
//   l3Goal,
//   l3_busGap, l3_zebraGreen, l3_ball, l3_noFootpath,
//   l3_phone, l3_police, l3_bridge, l3_jumpOff,
//   l3_busGap_explain, l3_zebraGreen_explain, l3_ball_explain,
//   l3_noFootpath_explain, l3_phone_explain, l3_police_explain,
//   l3_bridge_explain, l3_jumpOff_explain,
//   levelDone, mission
// audio/ne/<key>.mp3:
//   menu, quiz_q1, quiz_q2, quiz_q3, quiz_q4, quiz_q5,
//   l1Goal, l1Press, l1Look, l1LookOk, l1WrongOrder, l1NotZebra,
//   l1NoLook, l1WaitGreen, l1Hit,
//   l2Goal, l2Controls, l2Zebra, l2Bus, l2Ball, l2Slow,
//   l3Goal,
//   l3_busGap, l3_zebraGreen, l3_ball, l3_noFootpath,
//   l3_phone, l3_police, l3_bridge, l3_jumpOff,
//   l3_busGap_explain, l3_zebraGreen_explain, l3_ball_explain,
//   l3_noFootpath_explain, l3_phone_explain, l3_police_explain,
//   l3_bridge_explain, l3_jumpOff_explain,
//   levelDone, mission
// WARNING: never add a key to RECORDED until its MP3 file really exists.
// A key with no file makes narrate() fall back to the browser voice
// (speechSynthesis). Both arrays stay empty until recordings are added.
// Also add each new file to FILES in sw.js and bump CACHE_NAME.
export const RECORDED = {
    en: [],
    ne: [],
};

let ctx = null;
let muted = false;

function audio() {
    if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
}

function tone(freq, duration, { type = "sine", volume = 0.2, pan = 0, delay = 0 } = {}) {
    if (muted) return;
    const a = audio();
    if (!a) return;
    const start = a.currentTime + delay;
    const osc = a.createOscillator();
    const gain = a.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    let node = osc.connect(gain);
    if (a.createStereoPanner) {
        const p = a.createStereoPanner();
        p.pan.value = pan;
        node = gain.connect(p);
        p.connect(a.destination);
    } else {
        gain.connect(a.destination);
    }
    osc.start(start);
    osc.stop(start + duration + 0.05);
}

export const Sound = {
    unlock() { audio(); },                 // call on the first tap (browsers need a tap before sound)
    toggleMute() { muted = !muted; if (muted) window.speechSynthesis?.cancel(); return muted; },
    isMuted() { return muted; },

    click() { tone(660, 0.08, { type: "square", volume: 0.08 }); },
    good() {
        tone(523, 0.12, { volume: 0.15 });
        tone(659, 0.12, { volume: 0.15, delay: 0.12 });
        tone(784, 0.25, { volume: 0.15, delay: 0.24 });
    },
    oops() {
        tone(330, 0.15, { type: "triangle", volume: 0.2 });
        tone(247, 0.3, { type: "triangle", volume: 0.2, delay: 0.15 });
    },
    horn(pan = 0) {
        tone(392, 0.25, { type: "sawtooth", volume: 0.12, pan });
        tone(392, 0.35, { type: "sawtooth", volume: 0.12, pan, delay: 0.3 });
    },
    beepCrossing() { tone(1200, 0.06, { type: "square", volume: 0.05 }); }, // "tick" of the green man
    star(i) { tone(700 + i * 150, 0.2, { volume: 0.15, delay: i * 0.25 }); },
};

// ---------- voice narration ----------
let currentAudio = null;

function speakWithBrowser(text) {
    if (!("speechSynthesis" in window)) return;
    const l = lang();
    const voices = window.speechSynthesis.getVoices();
    const want = l === "ne" ? "ne" : "en";
    const voice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(want));
    if (!voice) return; // no Nepali voice on this device: stay silent, text is on screen
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
}

export function narrate(key, text) {
    if (muted) return;
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    window.speechSynthesis?.cancel();
    if (!RECORDED[lang()].includes(key)) {   // no recording for this line yet
        speakWithBrowser(text);
        return;
    }
    const file = `audio/${lang()}/${key}.mp3`;
    const a = new Audio(file);
    currentAudio = a;
    let usedFallback = false;
    const fallback = () => {          // no recording yet -> browser voice (only once)
        if (usedFallback || currentAudio !== a) return;
        usedFallback = true;
        speakWithBrowser(text);
    };
    a.onerror = fallback;
    a.play().catch(fallback);
}

export function stopNarration() {
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    window.speechSynthesis?.cancel();
}

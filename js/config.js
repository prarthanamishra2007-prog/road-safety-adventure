// js/config.js — numbers and colours shared by the whole game.
// Change a value here and it changes everywhere.

export const W = 960;   // game width in pixels
export const H = 540;   // game height in pixels

export const FONT = '"Trebuchet MS", "Nirmala UI", "Noto Sans Devanagari", Arial, sans-serif';

export const COLORS = {
    sky: 0xbde0fe,
    grass: 0x8bc34a,
    pavement: 0xd6d3c4,
    kerb: 0x9e9e9e,
    road: 0x4a4e57,
    laneMark: 0xffffff,
    zebra: 0xffffff,
    yellow: 0xffb703,
    green: 0x2ecc71,
    red: 0xe74c3c,
    dark: 0x1f2d3d,
    white: 0xffffff,
    panel: 0xffffff,
    blue: 0x3a86ff,
};

// Text colours are written as CSS strings
export const TEXT = {
    dark: "#1f2d3d",
    white: "#ffffff",
    red: "#e74c3c",
    green: "#1e9e55",
    grey: "#5a6b7b",
};

// ---------- Level 1 road layout (top-down view) ----------
// Nepal drives on the LEFT.
// Seen from above with the child on the bottom pavement:
//   upper lane  = vehicles going RIGHT  (far lane)
//   lower lane  = vehicles going LEFT   (near lane — they come from the child's RIGHT)
// That is why the child must LOOK RIGHT FIRST.
export const ROAD = {
    top: 230,        // top edge of the road
    middle: 320,     // centre line
    bottom: 410,     // bottom edge of the road
    zebraLeft: 440,  // zebra crossing x-start
    zebraRight: 520, // zebra crossing x-end
};

// Stars: how many mistakes are allowed for 3, 2 or 1 star
export function starsFor(mistakes) {
    if (mistakes === 0) return 3;
    if (mistakes <= 2) return 2;
    return 1;
}

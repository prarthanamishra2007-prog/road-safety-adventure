// js/textures.js — draws every picture in the game with code.
// The game runs immediately, without downloading any image files.
// Later (Phase "Graphics"), Member A can replace any texture with a real image
// by loading an image with the SAME key in BootScene (see the guide).

function make(scene, key, w, h, drawFn) {
    if (scene.textures.exists(key)) return;
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    drawFn(g);
    g.generateTexture(key, w, h);
    g.destroy();
}

// A standing child seen from the front (cartoon style)
function child(g, { shirt, bottom, bag, hair = 0x222222, skin = 0xc68642, scale = 1 }) {
    const s = scale;
    if (bag) { g.fillStyle(bag); g.fillRoundedRect(4 * s, 18 * s, 28 * s, 22 * s, 5 * s); }
    g.fillStyle(shirt); g.fillRoundedRect(8 * s, 18 * s, 20 * s, 18 * s, 5 * s);       // body
    g.fillStyle(bottom); g.fillRect(9 * s, 34 * s, 18 * s, 8 * s);                      // shorts/skirt
    g.fillStyle(skin); g.fillRect(11 * s, 42 * s, 5 * s, 9 * s); g.fillRect(20 * s, 42 * s, 5 * s, 9 * s); // legs
    g.fillStyle(0x222222); g.fillRect(10 * s, 49 * s, 7 * s, 3 * s); g.fillRect(19 * s, 49 * s, 7 * s, 3 * s); // shoes
    g.fillStyle(skin); g.fillCircle(18 * s, 11 * s, 10 * s);                             // head
    g.fillStyle(hair); g.fillRect(8 * s, 1 * s, 20 * s, 6 * s);                          // hair
    g.fillStyle(0x000000); g.fillCircle(14 * s, 11 * s, 1.6 * s); g.fillCircle(22 * s, 11 * s, 1.6 * s); // eyes
    g.lineStyle(1.5 * s, 0x000000); g.beginPath(); g.arc(18 * s, 13 * s, 4 * s, 0.2, Math.PI - 0.2); g.strokePath(); // smile
}

// A vehicle seen from above, facing RIGHT
function vehicle(g, w, h, body, roof, stripe) {
    g.fillStyle(0x111111);                                    // wheels
    g.fillRect(w * 0.15, 0, w * 0.18, 5); g.fillRect(w * 0.67, 0, w * 0.18, 5);
    g.fillRect(w * 0.15, h - 5, w * 0.18, 5); g.fillRect(w * 0.67, h - 5, w * 0.18, 5);
    g.fillStyle(body); g.fillRoundedRect(0, 3, w, h - 6, 10);  // body
    if (stripe) { g.fillStyle(stripe); g.fillRect(4, h / 2 - 3, w - 8, 6); }
    g.fillStyle(roof); g.fillRoundedRect(w * 0.2, 9, w * 0.55, h - 18, 6); // roof
    g.fillStyle(0x9ad1ff); g.fillRoundedRect(w * 0.72, 8, w * 0.14, h - 16, 4); // windscreen (front = right)
    g.fillStyle(0xfff3a0); g.fillRect(w - 4, 6, 4, 6); g.fillRect(w - 4, h - 12, 4, 6); // headlights
}

function star(g, cx, cy, outer, inner, color) {
    const pts = [];
    for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    }
    g.fillStyle(color);
    g.fillPoints(pts, true);
}

export function createTextures(scene) {
    // children
    make(scene, "sita", 36, 53, (g) => child(g, { shirt: 0x3a86ff, bottom: 0x34495e, bag: 0xe74c3c }));
    make(scene, "bhai", 31, 46, (g) => child(g, { shirt: 0xf1f1f1, bottom: 0x1f3a93, bag: 0xff9f1c, scale: 0.86 }));
    make(scene, "child", 31, 46, (g) => child(g, { shirt: 0x2ecc71, bottom: 0x6d4c41, bag: 0x8e44ad, scale: 0.86 }));
    make(scene, "child2", 31, 46, (g) => child(g, { shirt: 0xff006e, bottom: 0x34495e, bag: 0x3a86ff, scale: 0.86 }));
    make(scene, "police", 36, 53, (g) => {
        child(g, { shirt: 0x1d3557, bottom: 0x1d3557, skin: 0xb5763c });
        g.fillStyle(0xffffff); g.fillRect(8, 0, 20, 5);    // white cap
        g.fillStyle(0xffffff); g.fillRect(0, 18, 8, 5);    // white glove / raised hand
    });

    // vehicles (all facing right)
    make(scene, "car", 90, 46, (g) => vehicle(g, 90, 46, 0xe63946, 0xb32630));
    make(scene, "car2", 90, 46, (g) => vehicle(g, 90, 46, 0x3a86ff, 0x2b62c0));
    make(scene, "taxi", 86, 44, (g) => vehicle(g, 86, 44, 0xffffff, 0xdddddd, 0x111111)); // Nepal taxis: white/black
    make(scene, "microbus", 124, 54, (g) => vehicle(g, 124, 54, 0xf4f4f4, 0xe0e0e0, 0x2a9d8f));
    make(scene, "bus", 180, 62, (g) => vehicle(g, 180, 62, 0x2a9d8f, 0x21867a, 0xffb703));
    make(scene, "bike", 62, 26, (g) => {
        g.fillStyle(0x111111); g.fillCircle(10, 13, 9); g.fillCircle(52, 13, 9);    // wheels
        g.fillStyle(0xd62828); g.fillRoundedRect(12, 7, 38, 12, 5);                // body
        g.fillStyle(0x333333); g.fillCircle(30, 13, 8);                            // rider helmet
        g.fillStyle(0xffd166); g.fillCircle(30, 13, 4);
    });
    make(scene, "tempo", 80, 40, (g) => vehicle(g, 80, 40, 0x2a9d8f, 0x1f7a6f, 0xffffff));

    // things
    make(scene, "ball", 20, 20, (g) => {
        g.fillStyle(0xffffff); g.fillCircle(10, 10, 9);
        g.fillStyle(0xe63946); g.fillCircle(10, 10, 4);
        g.lineStyle(2, 0x222222); g.strokeCircle(10, 10, 9);
    });
    make(scene, "tree", 64, 64, (g) => {
        g.fillStyle(0x2d6a4f); g.fillCircle(32, 32, 30);
        g.fillStyle(0x40916c); g.fillCircle(24, 24, 16);
    });
    make(scene, "school", 230, 150, (g) => {
        g.fillStyle(0xf4a261); g.fillRect(0, 40, 230, 110);
        g.fillStyle(0xe76f51); g.fillTriangle(0, 40, 115, 0, 230, 40);
        g.fillStyle(0xffffff);
        for (let i = 0; i < 4; i++) g.fillRect(14 + i * 55, 60, 34, 28);
        g.fillStyle(0x6d4c41); g.fillRect(95, 100, 40, 50);  // door
        g.fillStyle(0x2a9d8f); g.fillRect(50, 44, 130, 12);  // sign board
    });
    make(scene, "house", 120, 100, (g) => {
        g.fillStyle(0xe9c46a); g.fillRect(0, 35, 120, 65);
        g.fillStyle(0xbc4749); g.fillTriangle(0, 35, 60, 0, 120, 35);
        g.fillStyle(0x6d4c41); g.fillRect(48, 60, 24, 40);
        g.fillStyle(0xffffff); g.fillRect(12, 50, 22, 18); g.fillRect(86, 50, 22, 18);
    });
    make(scene, "star", 44, 44, (g) => star(g, 22, 22, 20, 9, 0xffd60a));
    make(scene, "starEmpty", 44, 44, (g) => star(g, 22, 22, 20, 9, 0xcfd8dc));
    make(scene, "badge", 64, 64, (g) => {
        g.fillStyle(0xffb703); g.fillCircle(32, 32, 30);
        g.fillStyle(0xfb8500); g.fillCircle(32, 32, 24);
        star(g, 32, 32, 16, 7, 0xffffff);
    });
}

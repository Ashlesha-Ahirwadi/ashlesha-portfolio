// Kiki: Ashlesha's 3D bear agent.
// - Arrives with a random entrance (drop, parachute, rope, pop out of the photo) and gives a short intro.
// - Tours each section as the visitor scrolls: several stops per section, with props and emotes.
// - Lives on the page: walks, hops onto cards, sits and swings her legs, kicks tags, peeks from the edges,
//   slides down cards, chases the cursor, stretches, sneezes, trips, reads, naps.
// - Reacts to visitors: head pats, pokes (gets grumpy), hovering cards / resume / contact, leaving the tab.
// - Answers questions (voice, typing or tap a thought bubble) and walks to the right spot.
// Needs: three.js r128 (global THREE), kiki/brain.js, kiki/kiki.css
(function () {
    var CONFIG = {
        voiceDir: 'kiki/voice/',   // <line-id>.mp3, made by kiki/tools/make_voice.py
        walkSpeed: 240,            // px per second
        roamEvery: [6000, 11000],  // ms between idle activities
        sleepAfter: 45000          // ms of no activity before she naps
    };

    var brain = window.KikiBrain;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var store = {
        get: function (k) { try { return localStorage.getItem('kiki.' + k); } catch (e) { return null; } },
        set: function (k, v) { try { localStorage.setItem('kiki.' + k, v); } catch (e) {} }
    };
    function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }
    function rand(a, b) { return a + Math.random() * (b - a); }
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function later(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

    /* ================================================================== */
    /* DOM                                                                 */
    /* ================================================================== */
    var box = el('div', 'kiki-body');
    box.setAttribute('role', 'button'); box.tabIndex = 0;
    box.setAttribute('aria-label', 'Kiki, Ashlesha\'s AI agent. Tap her to ask a question, pat her head, or drag her around.');
    box.appendChild(el('span', 'kiki-zzz', '<i>z</i><i>z</i><i>z</i>'));

    var emoteEl = el('div', 'kiki-emote'); emoteEl.setAttribute('aria-hidden', 'true');
    var chute = el('div', 'kiki-chute',
        '<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M6 46 Q60 -26 114 46 Q100 38 87 46 Q74 38 60 46 Q46 38 33 46 Q20 38 6 46Z" fill="#4C5BD4"/>' +
        '<path d="M33 46 Q46 38 60 46 Q60 4 52 2 Q40 12 33 46Z" fill="#fff" opacity=".85"/><path d="M87 46 Q74 38 60 46 Q60 4 68 2 Q80 12 87 46Z" fill="#fff" opacity=".35"/>' +
        '<path d="M8 46 L48 88 M33 46 L52 88 M87 46 L68 88 M112 46 L72 88" stroke="#1C2130" stroke-width="1.5" opacity=".5"/></svg>');
    var rope = el('div', 'kiki-rope');

    var bubble = el('div', 'kiki-bubble', '<p class="kiki-say"></p><div class="kiki-links"></div>');
    bubble.setAttribute('aria-live', 'polite');
    var sayEl = bubble.querySelector('.kiki-say'), linksEl = bubble.querySelector('.kiki-links');
    var hint = el('button', 'kiki-hint', '<i class="fas fa-volume-high"></i> Tap anywhere to hear me');
    hint.type = 'button';

    var ask = el('div', 'kiki-ask',
        '<div class="kiki-ask-top"><strong>Ask me anything about Ashlesha!</strong>' +
        '<button type="button" class="kiki-x" aria-label="Close"><i class="fas fa-xmark"></i></button></div>' +
        '<div class="kiki-thoughts"></div>' +
        '<p class="kiki-ears" aria-live="polite"></p>' +
        '<form class="kiki-type">' +
            '<button type="button" class="kiki-mic" aria-label="Talk to Kiki"><i class="fas fa-microphone"></i></button>' +
            '<input type="text" placeholder="or type here..." aria-label="Type a question for Kiki">' +
            '<button type="submit" class="kiki-send" aria-label="Ask"><i class="fas fa-paper-plane"></i></button>' +
        '</form>');
    ask.setAttribute('role', 'dialog'); ask.setAttribute('aria-label', 'Ask Kiki');
    var input = ask.querySelector('input'), micBtn = ask.querySelector('.kiki-mic'), thoughts = ask.querySelector('.kiki-thoughts');
    var ears = ask.querySelector('.kiki-ears');
    function earsSay(t) { ears.textContent = t || ''; }

    [rope, chute, box, emoteEl, bubble, hint, ask].forEach(function (n) { document.body.appendChild(n); });

    /* ================================================================== */
    /* 3D bear                                                             */
    /* ================================================================== */
    // Phone mode ("compact"): small screens or touch-only devices. Kiki stays docked in the
    // bottom-right corner instead of walking over content, and the card in the middle of the
    // screen stands in for hover.
    var small, compact, BW, BH;
    function measure() {
        compact = window.innerWidth < 760 || !window.matchMedia('(hover: hover)').matches;
        small = compact;
        BW = compact ? 118 : 250; BH = compact ? 134 : 282;
        box.style.width = BW + 'px'; box.style.height = BH + 'px';
        document.body.classList.toggle('kiki-compact', compact);
    }
    measure();
    var bear = makeBear(box, BW, BH);

    function makeBear(host, W, H) {
        var canvas = el('canvas'); host.appendChild(canvas);
        var R;
        try { R = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); }
        catch (e) {
            canvas.remove(); host.appendChild(el('div', 'kiki-fallback', '\u{1F43B}'));
            var noop = function () {};
            return { foot: .9, head: .1, mode: noop, act: noop, talk: noop, face: noop, look: noop, resize: noop, prop: noop, getMode: function () { return 'idle'; } };
        }
        R.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
        R.setSize(W, H, false);
        R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap; R.outputEncoding = THREE.sRGBEncoding;

        var sc = new THREE.Scene();
        var cam = new THREE.PerspectiveCamera(27, W / H, .1, 100);
        cam.position.set(0, 2.05, 12.2); cam.lookAt(0, 1.85, 0);
        sc.add(new THREE.HemisphereLight(0xffffff, 0xf8d5de, .95));
        var dl = new THREE.DirectionalLight(0xffffff, .8);
        dl.position.set(3, 7, 6); dl.castShadow = true; dl.shadow.mapSize.set(512, 512); dl.shadow.radius = 6;
        var shc = dl.shadow.camera; shc.left = -3; shc.right = 3; shc.top = 5; shc.bottom = -2; sc.add(dl);
        var rim = new THREE.DirectionalLight(0xffd6e4, .55); rim.position.set(-5, 3, -4); sc.add(rim);
        var ground = new THREE.Mesh(new THREE.CircleGeometry(2.2, 32), new THREE.ShadowMaterial({ opacity: .14 }));
        ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; sc.add(ground);

        function M(c, r, o) {
            var m = new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: 0 });
            if (o) { m.transparent = true; m.opacity = o; } return m;
        }
        var fur = M(0xfffdfa, .85), pink = M(0xf9b8c6, .6), blush = M(0xf7a0b4, .9, .8), dark = M(0x24160f, .15),
            cream = M(0xf7ede3, .85), bowM = M(0xf48aab, .55), knotM = M(0xe86f95, .5), mouthM = M(0xd2577a, .5);
        var white = new THREE.MeshBasicMaterial({ color: 0xffffff });
        function sph(r, mat, p, sx, sy, sz) {
            var m = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 28), mat);
            m.position.set(p[0], p[1], p[2]); m.scale.set(sx || 1, sy || 1, sz || 1); m.castShadow = true; return m;
        }
        function boxM(w, h, d, mat, p) {
            var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
            m.position.set(p[0], p[1], p[2]); m.castShadow = true; return m;
        }
        function cyl(r, h, mat, p) {
            var m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 24), mat);
            m.position.set(p[0], p[1], p[2]); m.castShadow = true; return m;
        }
        function arc(r, t, mat, p, rotZ) {
            var m = new THREE.Mesh(new THREE.TorusGeometry(r, t, 10, 24, Math.PI), mat);
            m.position.set(p[0], p[1], p[2]); if (rotZ) m.rotation.z = rotZ; return m;
        }

        var kiki = new THREE.Group(); sc.add(kiki);
        var bodyG = new THREE.Group(); kiki.add(bodyG);
        bodyG.add(sph(.85, fur, [0, 1.0, 0], 1, 1, .9));
        bodyG.add(sph(.5, cream, [0, .9, .47], 1, 1.05, .55));
        var legs = [-1, 1].map(function (k) {
            var p = new THREE.Group(); p.position.set(k * .38, .5, .12);
            p.add(sph(.32, fur, [0, -.23, .06], 1, .8, 1.15));
            p.add(sph(.14, pink, [0, -.25, .4], 1.1, 1, .35));
            bodyG.add(p); return p;
        });
        function arm(k) {
            var p = new THREE.Group(); p.position.set(k * .68, 1.42, .08);
            p.add(sph(.25, fur, [0, -.34, 0], .88, 1.35, .88));
            p.add(sph(.1, pink, [0, -.62, .16], 1, 1, .4));
            p.rotation.z = k * .5; bodyG.add(p); return p;
        }
        var armL = arm(-1), armR = arm(1);
        var hand = new THREE.Group(); hand.position.set(0, -.66, .14); armR.add(hand);

        var head = new THREE.Group(); head.position.set(0, 2.45, 0); kiki.add(head);
        head.add(sph(1.2, fur, [0, 0, 0], 1.25, 1, 1));
        var ears = [-1, 1].map(function (k) {
            var e = new THREE.Group(); e.position.set(k * 1.02, .9, -.05);
            e.add(sph(.36, fur, [0, 0, 0])); e.add(sph(.21, pink, [0, -.02, .27], 1, 1, .35));
            head.add(e); return e;
        });
        var bow = new THREE.Group(); bow.position.set(.62, 1.08, .5); bow.rotation.z = -.35;
        bow.add(sph(.2, bowM, [-.2, 0, 0], 1.25, .8, .5)); bow.add(sph(.2, bowM, [.2, 0, 0], 1.25, .8, .5));
        bow.add(sph(.09, knotM, [0, 0, .03])); head.add(bow);
        head.add(sph(.32, cream, [0, -.36, 1.06], 1.2, .8, .55));
        head.add(sph(.095, dark, [0, -.26, 1.24], 1.45, .9, .8));

        var eyes = new THREE.Group(), happyEyes = new THREE.Group(), sleepEyes = new THREE.Group();
        head.add(eyes); head.add(happyEyes); head.add(sleepEyes);
        var blushes = [];
        [-1, 1].forEach(function (k) {
            eyes.add(sph(.19, dark, [k * .4, -.05, 1.12], 1, 1.12, .55));
            var h = new THREE.Mesh(new THREE.SphereGeometry(.07, 16, 12), white); h.position.set(k * .4 + .06, .05, 1.22); eyes.add(h);
            var h2 = new THREE.Mesh(new THREE.SphereGeometry(.032, 12, 8), white); h2.position.set(k * .4 - .05, -.12, 1.21); eyes.add(h2);
            happyEyes.add(arc(.14, .04, dark, [k * .4, -.08, 1.13]));
            sleepEyes.add(arc(.13, .035, dark, [k * .4, -.02, 1.13], Math.PI));
            var b = sph(.24, blush, [k * .82, -.3, .93], 1.35, .75, .3); b.rotation.y = k * .6; b.castShadow = false; head.add(b); blushes.push(b);
        });
        var smile = new THREE.Group(); head.add(smile);
        [-1, 1].forEach(function (k) { smile.add(arc(.06, .02, dark, [k * .06, -.4, 1.225], Math.PI)); });
        var mouth = sph(.1, mouthM, [0, -.48, 1.2], 1, .15, .4); mouth.castShadow = false; head.add(mouth);

        /* ---------- props ---------- */
        var ink = M(0x1c2130, .5), indigo = M(0x4c5bd4, .45), gold = M(0xd9a83a, .35), silver = M(0xcfd3dd, .3),
            paper = M(0xfbf7ee, .8), leather = M(0x8a5a3c, .6), glass = M(0xbfe3ff, .1, .45), heartM = M(0xe8566c, .4);
        var props = {};
        // graduation cap (on her head)
        props.cap = new THREE.Group();
        props.cap.add(cyl(.55, .28, ink, [0, -.12, 0]));
        var board = boxM(1.45, .07, 1.45, ink, [0, .05, 0]); board.rotation.y = .25; props.cap.add(board);
        props.cap.add(sph(.07, gold, [0, .1, 0]));
        var tassel = cyl(.025, .5, gold, [.62, -.18, .3]); props.cap.add(tassel); props.cap.add(sph(.07, gold, [.62, -.45, .3]));
        props.cap.position.set(0, 1.12, .05); props.cap.rotation.x = -.12; head.add(props.cap);
        // briefcase (in her hand)
        props.briefcase = new THREE.Group();
        props.briefcase.add(boxM(.6, .44, .18, leather, [0, -.36, 0]));
        props.briefcase.add(arc(.11, .03, ink, [0, -.13, 0]));
        props.briefcase.add(boxM(.6, .05, .19, gold, [0, -.3, 0]));
        hand.add(props.briefcase);
        // magnifying glass (in her hand)
        props.magnifier = new THREE.Group();
        var handle = cyl(.05, .45, leather, [0, -.15, 0]); props.magnifier.add(handle);
        var ring = new THREE.Mesh(new THREE.TorusGeometry(.24, .05, 12, 32), gold); ring.position.set(0, -.62, 0); props.magnifier.add(ring);
        var lens = new THREE.Mesh(new THREE.CircleGeometry(.22, 32), glass); lens.position.set(0, -.62, .01); props.magnifier.add(lens);
        props.magnifier.rotation.z = Math.PI; props.magnifier.position.set(0, .2, .1);
        hand.add(props.magnifier);
        // envelope (in her hand)
        props.envelope = new THREE.Group();
        props.envelope.add(boxM(.62, .42, .04, paper, [0, -.26, .05]));
        var flapShape = new THREE.Shape(); flapShape.moveTo(-.31, 0); flapShape.lineTo(.31, 0); flapShape.lineTo(0, -.22); flapShape.lineTo(-.31, 0);
        var flap = new THREE.Mesh(new THREE.ShapeGeometry(flapShape), M(0xeee3cf, .8)); flap.position.set(0, -.05, .075); props.envelope.add(flap);
        props.envelope.add(sph(.06, heartM, [0, -.26, .09], 1, 1, .5));
        hand.add(props.envelope);
        // laptop (on her lap, both hands typing)
        props.laptop = new THREE.Group();
        props.laptop.add(boxM(1.0, .05, .64, silver, [0, 0, 0]));
        var lid = new THREE.Group(); lid.position.set(0, .03, -.3); lid.rotation.x = -.25;
        lid.add(boxM(1.0, .66, .04, silver, [0, .33, 0])); lid.add(sph(.06, heartM, [0, .36, -.03], 1, 1, .4));
        props.laptop.add(lid);
        props.laptop.position.set(0, .66, 1.0); bodyG.add(props.laptop);
        // book (held in both hands)
        props.book = new THREE.Group();
        props.book.add(boxM(.76, .54, .1, indigo, [0, 0, 0]));
        props.book.add(boxM(.7, .5, .11, paper, [0, 0, .01]));
        props.book.position.set(0, 1.05, .98); props.book.rotation.x = -.5; bodyG.add(props.book);
        Object.keys(props).forEach(function (k) { props[k].visible = false; });
        var held = null;

        // where her feet and the top of her head land on the canvas (0..1 from the top)
        function frac(y) { cam.updateMatrixWorld(); var v = new THREE.Vector3(0, y, 0).project(cam); return (1 - v.y) / 2; }
        var api = { foot: frac(0), head: frac(3.75) };
        api.resize = function (w, h) {
            R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
            api.foot = frac(0); api.head = frac(3.75);
        };

        var mode = 'idle', act = null, actT = 0, actDir = 1, face = 0, talking = false;
        var lookX = 0, lookY = 0, walkPhase = 0, nextBlink = 2, clock = new THREE.Clock(), tripZ = 0;
        function lerp(a, b, t) { return a + (b - a) * t; }

        api.mode = function (m) { mode = m; };
        api.getMode = function () { return mode; };
        api.act = function (a, dir) { act = a; actT = 0; actDir = dir || 1; };
        api.talk = function (on) { talking = on; };
        api.face = function (d) { face = d; };
        api.look = function (x, y) { lookX = x; lookY = y; };
        api.prop = function (name) {
            if (held) props[held].visible = false;
            held = name && props[name] ? name : null;
            if (held) props[held].visible = true;
        };

        (function frame() {
            var dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime; actT += dt;
            var y = 0, rArm = .5, lArm = -.5, rArmX = 0, lArmX = 0, legL = 0, legR = 0,
                headY = lookX * .5, headX = lookY * .3, headZ = Math.sin(t * 1.3) * .05, bodyZ = 0, bodyX = 0,
                eyeMode = 'open', eyeScale = 1, eyeSquint = 1, squash = 1, perk = 0, spin = 0, blushK = 1, tripTarget = 0, stretchY = 0;
            var breathe = Math.sin(t * 2.4);

            // what she's holding shapes her arms
            if (held === 'briefcase' || held === 'magnifier' || held === 'envelope') { rArm = .35; rArmX = -.55; }
            if (held === 'laptop') { rArm = .22; lArm = -.22; rArmX = -1.05 + Math.sin(t * 22) * .08; lArmX = -1.05 + Math.cos(t * 22) * .08; headX = .22; headY = 0; }
            if (held === 'book') { rArm = .25; lArm = -.25; rArmX = -.95; lArmX = -.95; headX = .25; headY = Math.sin(t * .9) * .15; }

            if (mode === 'walk') {
                walkPhase += dt * 11;
                var s = Math.sin(walkPhase);
                legL = s * .7; legR = -s * .7; if (!held) { lArmX = -s * .6; rArmX = s * .6; }
                y = Math.abs(Math.cos(walkPhase)) * .12; bodyZ = s * .06; headY = 0;
            } else if (mode === 'sleep') {
                eyeMode = 'sleep'; headX = .28; headZ = .18 + Math.sin(t * .8) * .03; breathe = Math.sin(t * 1.2) * 2;
                rArm = .3; lArm = -.3; headY = 0;
            } else if (mode === 'listen') {
                perk = 1; headZ += .22; headX = -.08; rArm = .9; lArm = -.9;
            } else if (mode === 'flail') {
                rArm = 2 + Math.sin(t * 22) * .7; lArm = -2 - Math.cos(t * 22) * .7;
                legL = Math.sin(t * 18) * .6; legR = -legL; eyeScale = 1.25; headZ = Math.sin(t * 9) * .15; headY = 0;
            } else if (mode === 'hang') {   // holding a parachute or a rope
                rArm = 2.85; lArm = -2.85; legL = -.25 + Math.sin(t * 3) * .15; legR = -.25 - Math.sin(t * 3) * .15;
                bodyZ = Math.sin(t * 2) * .08; eyeMode = 'happy';
            } else if (mode === 'slide') {
                rArm = 2.7; lArm = -2.7; legL = legR = -.5; eyeMode = 'happy';
            } else if (mode === 'sit') {     // sitting on a card edge, swinging her legs
                y = -.42; legL = -1.35 + Math.sin(t * 4) * .35; legR = -1.35 - Math.sin(t * 4) * .35;
                rArm = .25; lArm = -.25; bodyX = -.08;
            } else if (mode === 'grumpy') {  // arms crossed, cheeks puffed, looking away
                rArm = -.35; lArm = .35; rArmX = -1.25; lArmX = -1.25; headY = .55 * (lookX > 0 ? -1 : 1); headX = -.1;
                eyeSquint = .55; blushK = 1.5;
            }

            if (act === 'wave') { rArm = 2.5 + .35 * Math.sin(actT * 12); rArmX = 0; headZ -= .14; if (actT > 2.2) act = null; }
            else if (act === 'happy') { y += Math.abs(Math.sin(actT * 6)) * .45; rArm = 2.3; lArm = -2.3; rArmX = lArmX = 0; eyeMode = 'happy'; if (actT > 1.6) act = null; }
            else if (act === 'shy') {         // head pat: eyes closed, cheeks pink, paws to cheeks
                eyeMode = 'happy'; headZ += .25 * Math.sin(actT * 6); blushK = 1.45; rArm = 2.3; lArm = -2.3; rArmX = lArmX = -.6;
                headX = -.15; if (actT > 1.8) act = null;
            }
            else if (act === 'think') { headZ += .3; headX -= .25; lArm = -1.3; if (actT > 2.6) act = null; }
            else if (act === 'point') {
                if (actDir > 0) { rArm = 1.55 + .08 * Math.sin(actT * 8); rArmX = 0; } else { lArm = -1.55 - .08 * Math.sin(actT * 8); lArmX = 0; }
                headY = actDir * .4; if (actT > 2.6) act = null;
            }
            else if (act === 'present') { rArm = 1.25; lArm = -1.25; rArmX = lArmX = 0; eyeMode = 'happy'; y += Math.abs(Math.sin(actT * 5)) * .15; if (actT > 1.8) act = null; }
            else if (act === 'dance') {
                bodyZ = Math.sin(actT * 8) * .22; headZ = -bodyZ * 1.2; y += Math.abs(Math.sin(actT * 8)) * .2;
                rArm = 2.2 + Math.sin(actT * 8) * .5; lArm = -2.2 + Math.sin(actT * 8) * .5; eyeMode = 'happy';
                legL = Math.max(0, Math.sin(actT * 8)) * .5; legR = Math.max(0, -Math.sin(actT * 8)) * .5;
                if (actT > 3.2) act = null;
            }
            else if (act === 'spin') { spin = Math.min(1, actT / .9) * Math.PI * 2; y += Math.sin(Math.min(1, actT / .9) * Math.PI) * .5; rArm = 1.6; lArm = -1.6; if (actT > 1) act = null; }
            else if (act === 'jump') { var k = Math.min(1, actT / .7); y += Math.sin(k * Math.PI) * .9; rArm = 2.4; lArm = -2.4; legL = legR = -.4 * Math.sin(k * Math.PI); if (actT > .8) { act = 'land'; actT = 0; } }
            else if (act === 'land') { squash = 1 - .2 * Math.exp(-actT * 9) * Math.cos(actT * 22); if (actT > .5) act = null; }
            else if (act === 'look') { headY = Math.sin(actT * 2.2) * .9; headX = -.1; if (actT > 2.9) act = null; }
            else if (act === 'yawn') { headX = -.3; rArm = 2.6; lArm = -2.6; talking = true; if (actT > 1.6) { act = null; talking = false; } }
            else if (act === 'stretch') {
                var sk = Math.sin(Math.min(1, actT / 1.8) * Math.PI);
                rArm = .5 + 2.4 * sk; lArm = -.5 - 2.4 * sk; stretchY = .1 * sk; eyeMode = sk > .5 ? 'happy' : 'open'; headX = -.2 * sk;
                if (actT > 1.9) act = null;
            }
            else if (act === 'sneeze') {
                if (actT < .7) { headX = -.35 * (actT / .7); eyeSquint = 1 - .5 * (actT / .7); }
                else if (actT < .9) { headX = .45; bodyX = .15; eyeMode = 'happy'; y += .1; }
                else { headX = lerp(.45, 0, Math.min(1, (actT - .9) / .5)); }
                if (actT > 1.5) act = null;
            }
            else if (act === 'trip') {     // falls over, wobbles, gets back up
                tripTarget = actT < 1.3 ? 1.35 * actDir : 0;
                if (actT < 1.3) { eyeMode = 'sleep'; rArm = 2.6; lArm = -2.6; legL = -.6; }
                if (actT > 2) act = null;
            }
            else if (act === 'kick') { legR = actT < .25 ? -1.4 * (actT / .25) : -1.4 * Math.max(0, 1 - (actT - .25) / .3); lArm = -1.2; bodyX = -.1; if (actT > .7) act = null; }
            else if (act === 'lean') { bodyZ = -.35 * actDir; headZ = -.4 * actDir; rArm = 2.5 + .35 * Math.sin(actT * 12); if (actT > 2.6) act = null; }
            else if (act === 'peekup') { headX = -.3; eyeMode = 'happy'; perk = 1; if (actT > 1) act = null; }
            else if (act === 'poked') { y += .25 * Math.exp(-actT * 6); eyeScale = 1.3; headZ = .2 * Math.sin(actT * 20) * Math.exp(-actT * 4); if (actT > .6) act = null; }

            tripZ = lerp(tripZ, tripTarget, .14);
            kiki.position.y = y;
            kiki.rotation.z = tripZ;
            bodyG.scale.set(1 + .012 * breathe + (1 - squash) * .6, (1 + .02 * breathe + stretchY) * squash, 1);
            head.position.y = 2.45 - (1 - squash) * 1.6 + stretchY * 2 + (mode === 'sit' ? 0 : 0);
            bodyG.rotation.z = bodyZ; bodyG.rotation.x = bodyX;
            armR.rotation.z = lerp(armR.rotation.z, rArm, .2); armL.rotation.z = lerp(armL.rotation.z, lArm, .2);
            armR.rotation.x = lerp(armR.rotation.x, rArmX, .3); armL.rotation.x = lerp(armL.rotation.x, lArmX, .3);
            legs[0].rotation.x = lerp(legs[0].rotation.x, legL, .35); legs[1].rotation.x = lerp(legs[1].rotation.x, legR, .35);
            head.rotation.y = lerp(head.rotation.y, headY, .1);
            head.rotation.x = lerp(head.rotation.x, headX, .12);
            head.rotation.z = lerp(head.rotation.z, headZ, .12);
            kiki.rotation.y = spin ? face * .85 + spin : lerp(kiki.rotation.y, face * .85 + (mode === 'walk' ? 0 : lookX * .2), .12);

            eyes.visible = eyeMode === 'open'; happyEyes.visible = eyeMode === 'happy'; sleepEyes.visible = eyeMode === 'sleep';
            var blink = 1;
            if (t > nextBlink) {
                var bt = t - nextBlink;
                blink = bt < .07 ? 1 - bt / .07 * .9 : bt < .14 ? .1 + (bt - .07) / .07 * .9 : 1;
                if (bt > .14) nextBlink = t + 2 + Math.random() * 3;
            }
            eyes.scale.set(eyeScale, eyeScale * blink * eyeSquint, 1);
            blushes.forEach(function (b) { var s = lerp(b.scale.x / 1.35, blushK, .15); b.scale.set(1.35 * s, .75 * s, .3); });
            ears.forEach(function (e, i) {
                var twitch = Math.sin(t * .9 + i * 2) > .97 ? .25 : 0;
                e.rotation.z = lerp(e.rotation.z, (i ? -1 : 1) * Math.max(twitch, perk * .22), .2);
            });
            var open = talking || mode === 'flail';
            mouth.scale.y = open ? (.35 + .5 * Math.abs(Math.sin(t * 15))) : lerp(mouth.scale.y, .15, .3);
            smile.visible = !open && mode !== 'grumpy';
            R.render(sc, cam);
            requestAnimationFrame(frame);
        })();
        return api;
    }

    /* ================================================================== */
    /* Voice                                                               */
    /* ================================================================== */
    var muted = store.get('muted') === '1';
    var unlocked = false;           // browsers allow sound only after the first click / tap / key
    var line = null;                // what she's saying right now
    var lineToken = 0, clip = null;
    var soundBtn = document.getElementById('kikiSound');
    var audioCache = {};
    // Shared memory between the tour and hover, so she never explains the same thing twice.
    var spoken = new Map();       // line id -> when she last said it
    var explained = new Set();    // elements she has already described (tour or hover)

    function clipFor(id) {
        if (!audioCache[id]) { audioCache[id] = new Audio(CONFIG.voiceDir + id + '.mp3'); audioCache[id].preload = 'auto'; }
        return audioCache[id];
    }
    clipFor(store.get('met') === '1' ? 'intro_return' : 'intro');

    function stopAudio() { if (clip) { clip.pause(); clip = null; } }

    // Say a line: speech bubble right away, voice if allowed. Resolves when she's done
    // (or when a newer line interrupts her).
    function lineText(id) { return brain.lines[id] || (brain.intent(id) || {}).say || ''; }
    function say(id, text, opts) {
        opts = opts || {};
        text = text || lineText(id);
        if (line && !line.finished) line.finish();
        stopAudio();
        var token = ++lineToken;
        var L = line = { id: id, text: text, start: performance.now(), est: Math.max(1600, text.length * 62), finished: false };
        var p = new Promise(function (res) { L.resolve = res; });
        L.promise = p;
        spoken.set(id, performance.now());
        L.finish = function () {
            if (L.finished) return;
            L.finished = true; clearTimeout(L.timer);
            if (token === lineToken) { bear.talk(false); updateHint(); }
            L.resolve();
        };
        showBubble(text, opts.links, opts.card);
        bear.talk(true);
        if (!muted && unlocked) playClip(L, 0); else L.timer = setTimeout(L.finish, L.est);
        updateHint();
        return p;
    }

    function playClip(L, offsetMs) {
        var a = clipFor(L.id);
        clip = a;
        var fallback = function () { if (clip === a) clip = null; L.timer = setTimeout(L.finish, Math.max(400, L.est - offsetMs)); };
        var go = function () {
            if (L !== line || L.finished) return;
            try { a.currentTime = Math.min(offsetMs / 1000, Math.max(0, (a.duration || 99) - .2)); } catch (e) {}
            a.onended = function () { if (clip === a) clip = null; L.finish(); };
            a.play().catch(fallback);
        };
        a.onerror = fallback;
        if (a.readyState >= 1) go(); else { a.onloadedmetadata = go; a.load(); }
    }

    function unlock() {
        if (unlocked) return;
        unlocked = true;
        // Her voice joins mid-sentence if she's still talking.
        if (line && !line.finished && !muted) {
            var elapsed = performance.now() - line.start;
            if (elapsed < line.est - 400) { clearTimeout(line.timer); playClip(line, elapsed); }
        }
        updateHint();
    }
    ['pointerdown', 'keydown', 'touchend'].forEach(function (ev) { window.addEventListener(ev, unlock, { capture: true }); });

    function setMuted(m) {
        muted = m; store.set('muted', m ? '1' : '0');
        if (m && clip) { stopAudio(); if (line && !line.finished) line.timer = setTimeout(line.finish, 600); }
        if (soundBtn) {
            soundBtn.innerHTML = m ? '<i class="fas fa-volume-xmark"></i>' : '<i class="fas fa-volume-high"></i>';
            soundBtn.setAttribute('aria-label', m ? 'Turn Kiki\'s voice on' : 'Turn Kiki\'s voice off');
        }
        updateHint();
    }
    // The speaker button and Kiki's nap are one switch: muted = asleep in the corner.
    if (soundBtn) soundBtn.addEventListener('click', function () {
        if (!muted) { setMuted(true); deepSleep(true); }
        else { setMuted(false); if (deepNap) wakeFromNap(); }
    });
    setMuted(muted);

    function updateHint() { hint.classList.toggle('on', !unlocked && !muted && !!line && !line.finished); }
    hint.addEventListener('click', unlock);

    /* ================================================================== */
    /* Speech bubble + emotes                                              */
    /* ================================================================== */
    var typeTimer, hideTimer;
    function showBubble(text, links, card) {
        clearInterval(typeTimer); clearTimeout(hideTimer);
        linksEl.innerHTML = '';
        bubble.classList.add('on');
        var i = 0; sayEl.textContent = '';
        typeTimer = setInterval(function () {
            i += 2; sayEl.textContent = text.slice(0, i);
            if (i >= text.length) { clearInterval(typeTimer); addLinks(links, card); }
        }, reduced ? 1 : 30);
        var stay = Math.max(4000, text.length * 70) + (links || card ? 7000 : 0);
        hideTimer = setTimeout(hideBubble, stay);
    }
    function hideBubble() { if (!askOpen) bubble.classList.remove('on'); }
    function addLinks(keys, card) {
        if (card && window.openProject) {
            var b = el('button', '', '<i class="fas fa-up-right-and-down-left-from-center"></i> See details'); b.type = 'button';
            b.onclick = function () { window.openProject(card); };
            linksEl.appendChild(b);
        }
        (keys || []).forEach(function (k) {
            var L = brain.links[k]; if (!L) return;
            var a = el('a', '', '<i class="' + L.icon + '"></i> ' + L.label); a.href = L.href;
            if (L.download) a.setAttribute('download', '');
            else if (/^https?:/.test(L.href)) { a.target = '_blank'; a.rel = 'noopener'; }
            linksEl.appendChild(a);
        });
    }

    var EMOTES = {
        heart: ['fa-heart', 'fa-heart', 'fa-heart'], sparkle: ['fa-star', 'fa-wand-magic-sparkles', 'fa-star'],
        star: ['fa-star'], question: ['fa-question'], excl: ['fa-exclamation'], bulb: ['fa-lightbulb'],
        music: ['fa-music', 'fa-music'], grr: ['fa-burst'], dizzy: ['fa-star', 'fa-star', 'fa-star']
    };
    var emoteTimer;
    function emote(name) {
        var icons = EMOTES[name]; if (!icons) return;
        clearTimeout(emoteTimer);
        emoteEl.className = 'kiki-emote on e-' + name;
        emoteEl.innerHTML = icons.map(function (c, i) { return '<i class="fas ' + c + '" style="--i:' + i + '"></i>'; }).join('');
        emoteTimer = setTimeout(function () { emoteEl.className = 'kiki-emote'; }, 1900);
    }

    /* ================================================================== */
    /* Movement                                                            */
    /* ================================================================== */
    var pos = { x: window.innerWidth * .7, y: -BH };   // her feet, in viewport pixels
    var perch = null;      // { el, fx } she's standing on, or null for the floor
    var walk = null;       // { dest(), done, sx, sy, dist }
    var fall = null;       // { vy, done, maxV, sway }
    var drag = null, offEdge = false;
    var busy = false;      // answering a question / being dragged; roaming waits
    var touring = null;    // id of the section she's touring
    var mx = window.innerWidth / 2, my = window.innerHeight / 2, lastActive = performance.now();

    function floorY() { return window.innerHeight - (small ? 6 : 10); }
    function topLimit() { var n = document.getElementById('nav'); return (n ? n.getBoundingClientRect().bottom : 70) + 40; }
    function perchPoint(p) {
        var r = p.el.getBoundingClientRect();
        return { x: clamp(r.left + p.fx * r.width, BW / 2, window.innerWidth - BW / 2), y: r.top + 6, r: r };
    }
    function perchVisible(elm) {
        var r = elm.getBoundingClientRect();
        return r.width > 110 && r.top > topLimit() + BH * .45 && r.top < window.innerHeight - 40 && r.left < window.innerWidth && r.right > 0 && elm.offsetParent !== null;
    }
    function visiblePerches(filter) {
        return Array.prototype.filter.call(document.querySelectorAll(filter || '[data-perch]'), function (n) {
            return (!perch || n !== perch.el) && perchVisible(n);
        });
    }

    function walkTo(dest, opts) {
        opts = opts || {};
        return new Promise(function (resolve) {
            perch = null; fall = null; offEdge = !!opts.offEdge;
            if (bear.getMode() === 'sit') bear.mode('idle');
            if (compact) { arrive(); return; }
            var d = dest();
            if (reduced) { pos.x = d.x; pos.y = d.y; arrive(); return; }
            walk = { dest: dest, sx: pos.x, sy: pos.y, dist: Math.hypot(d.x - pos.x, d.y - pos.y) || 1, done: arrive, fast: opts.fast, until: opts.until };
            bear.mode('walk');
            function arrive() {
                walk = null; bear.mode('idle'); bear.face(0);
                if (opts.perch && !compact) perch = opts.perch;
                if (!compact) bear.act('land');
                resolve();
            }
        });
    }
    function walkToPerch(elm, fx) {
        var p = { el: elm, fx: fx == null ? rand(.2, .8) : fx };
        return walkTo(function () { return perchPoint(p); }, { perch: p });
    }
    function walkToFloor(x, opts) {
        opts = opts || {};
        return walkTo(function () {
            return { x: opts.offEdge ? x : clamp(x, BW / 2, window.innerWidth - BW / 2), y: floorY() };
        }, opts);
    }
    function dockPoint() { return { x: window.innerWidth - BW / 2 - 4, y: floorY() }; }
    function dropFrom(x, y, onLand, opts) {
        opts = opts || {};
        if (compact) { perch = null; walk = null; fall = null; setTimeout(function () { onLand && onLand(); }, 0); return; }
        perch = null; walk = null;
        pos.x = x; pos.y = y;
        fall = { vy: opts.vy || 0, done: onLand, maxV: opts.maxV || 4000, sway: opts.sway || 0, x0: x, t: 0, skip: opts.skip };
        bear.mode(opts.pose || 'flail');
    }
    // where she'd land if dropped at x: the highest visible card top below her, else the floor
    function landingFor(x, y, skip) {
        var best = null, bestY = floorY();
        document.querySelectorAll('[data-perch]').forEach(function (elm) {
            if (elm === skip) return;
            var r = elm.getBoundingClientRect();
            if (x > r.left + 20 && x < r.right - 20 && r.top >= y - 4 && r.top < bestY && r.top > topLimit() + BH * .45) {
                best = elm; bestY = r.top;
            }
        });
        return best ? { el: best, fx: (x - best.getBoundingClientRect().left) / best.getBoundingClientRect().width } : null;
    }

    var lastT = performance.now();
    (function tick(now) {
        var dt = Math.min((now - lastT) / 1000, .05); lastT = now;
        if (compact) {
            var dk = dockPoint(); pos.x = dk.x; pos.y = dk.y; perch = null; fall = null;
        } else if (drag) {
            pos.x = drag.x; pos.y = drag.y + BH * (bear.foot - .25);
        } else if (fall) {
            fall.t += dt;
            fall.vy = Math.min(fall.maxV, fall.vy + 2600 * dt); pos.y += fall.vy * dt;
            if (fall.sway) pos.x = fall.x0 + Math.sin(fall.t * 1.6) * fall.sway;
            var land = landingFor(pos.x, pos.y - fall.vy * dt, fall.skip);
            var ly = land ? perchPoint(land).y : floorY();
            if (pos.y >= ly) {
                pos.y = ly; perch = land; var cb = fall.done; fall = null;
                bear.mode('idle'); bear.act('land'); cb && cb();
            }
        } else if (walk) {
            var d = walk.dest(), dx = d.x - pos.x, dy = d.y - pos.y, dist = Math.hypot(dx, dy);
            var speed = (walk.fast || dist > 700 ? 2.4 : 1) * CONFIG.walkSpeed;
            if (Math.abs(dx) > 4) bear.face(dx > 0 ? 1 : -1);
            if (dist <= speed * dt || (walk.until && walk.until())) { if (!walk.until || dist <= speed * dt) { pos.x = d.x; pos.y = d.y; } walk.done(); }
            else {
                pos.x += dx / dist * speed * dt; pos.y += dy / dist * speed * dt;
                walk.dist = Math.max(walk.dist, dist);
            }
        } else if (perch) {
            var pp = perchPoint(perch);
            if (!perch.el.isConnected || pp.r.top < topLimit() + BH * .35 || pp.r.top > window.innerHeight - 6 || pp.r.bottom < 0 || perch.el.offsetParent === null) {
                // the card scrolled away under her feet: tumble down
                dropFrom(pos.x, clamp(pos.y, topLimit(), floorY() - 2), function () { if (!perch) { bear.act('look'); emote('dizzy'); } });
            } else { pos.x = pp.x; pos.y = pp.y; }
        } else {
            pos.y = floorY();
            if (!offEdge) pos.x = clamp(pos.x, BW / 2, window.innerWidth - BW / 2);
        }

        // hop arc while walking between heights
        var hop = 0;
        if (walk && !reduced && !compact) {
            var d2 = walk.dest(), left = Math.hypot(d2.x - pos.x, d2.y - pos.y), prog = 1 - left / walk.dist;
            if (Math.abs(d2.y - walk.sy) > 30) hop = Math.sin(clamp(prog, 0, 1) * Math.PI) * Math.min(140, 50 + Math.abs(d2.y - walk.sy) * .4);
        }
        var bx = pos.x - BW / 2, by = pos.y - hop - BH * bear.foot;
        box.style.transform = 'translate3d(' + bx.toFixed(1) + 'px,' + by.toFixed(1) + 'px,0)';
        var headTop = by + BH * bear.head;
        emoteEl.style.transform = 'translate3d(' + (pos.x + BW * .12).toFixed(0) + 'px,' + (headTop - 6).toFixed(0) + 'px,0)';
        if (chute.classList.contains('on')) chute.style.transform = 'translate3d(' + (pos.x - 75).toFixed(0) + 'px,' + (headTop - 120).toFixed(0) + 'px,0)';
        if (rope.classList.contains('on')) { rope.style.left = pos.x.toFixed(0) + 'px'; rope.style.height = Math.max(0, headTop + BH * .08).toFixed(0) + 'px'; }

        // look at the cursor
        var hx = pos.x, hy = headTop + BH * .12;
        bear.look(clamp((mx - hx) / 500, -1, 1), clamp((my - hy) / 500, -1, 1));

        placeBubble(bx, by);
        if (askOpen) placeAsk(bx, by);
        requestAnimationFrame(tick);
    })(lastT);

    function placeBubble(bx, by) {
        if (!bubble.classList.contains('on') && !hint.classList.contains('on')) return;
        var w = bubble.offsetWidth, h = bubble.offsetHeight, vw = window.innerWidth;
        var headTop = by + BH * bear.head, x, y, side = '';
        x = clamp(pos.x - w / 2, 10, vw - w - 10); y = headTop - h - 8;
        if (compact) x = vw - w - 10;
        if (askOpen) y = Math.min(y, askBox.top - h - 10);
        if (y < topLimit() - 30 && !compact) {
            // no room above her: talk from the side
            y = clamp(headTop + 4, topLimit() - 30, window.innerHeight - h - 10);
            x = bx + BW * .12 - w; side = 'side-left';
            if (x < 10) { x = bx + BW * .88; side = 'side-right'; }
            x = clamp(x, 10, vw - w - 10);
        }
        bubble.style.transform = 'translate3d(' + x.toFixed(0) + 'px,' + y.toFixed(0) + 'px,0)';
        bubble.classList.toggle('side-left', side === 'side-left');
        bubble.classList.toggle('side-right', side === 'side-right');
        bubble.style.setProperty('--tail', clamp(pos.x - x, 24, w - 24) + 'px');
        var hw = hint.offsetWidth;
        hint.style.transform = 'translate3d(' + clamp(side ? x + 12 : pos.x - hw / 2, 10, vw - hw - 10).toFixed(0) + 'px,' +
            (side ? y + h + 8 : y - 38).toFixed(0) + 'px,0)';
    }

    /* ================================================================== */
    /* Ask: tap Kiki -> she listens (mic) / type / tap a thought bubble    */
    /* ================================================================== */
    var askOpen = false, askBox = { top: 0 };
    function placeAsk(bx, by) {
        var w = ask.offsetWidth, h = ask.offsetHeight, vw = window.innerWidth, vh = window.innerHeight;
        if (small) { askBox.top = vh - h - BH - 10; return; }
        var x = clamp(pos.x - w / 2, 10, vw - w - 10);
        var y = by + BH * bear.head - h - 6;
        if (y < topLimit() - 20) y = Math.min(pos.y + 10, vh - h - 10);
        askBox.top = y;
        ask.style.transform = 'translate3d(' + x.toFixed(0) + 'px,' + y.toFixed(0) + 'px,0)';
    }
    function fillThoughts() {
        var pool = brain.chips.concat(["Is she open to work?", "Where is she based?", "Her skills?", "GitHub", "LinkedIn"]);
        pool.sort(function () { return Math.random() - .5; });
        thoughts.innerHTML = '';
        pool.slice(0, 4).forEach(function (q, i) {
            var b = el('button', 'kiki-thought'); b.type = 'button'; b.textContent = q;
            b.style.animationDelay = (i * -1.1) + 's';
            b.onclick = function () { askQuestion(q); };
            thoughts.appendChild(b);
        });
    }
    function openAsk(withMic) {
        lastActive = performance.now();
        if (askOpen) return;
        stopTour();
        askOpen = true; busy = true; walk = null;
        if (fall) fall = null;
        bear.prop(null); bear.mode('listen'); bear.face(0);
        fillThoughts();
        ask.classList.add('on');
        box.classList.add('listening');
        emote('question');
        if (withMic && SR) {
            // Start listening right away, inside the tap, so the browser allows the mic
            // and nothing the visitor says is missed. She stays quiet so she doesn't hear herself.
            stopAudio(); bear.talk(false);
            showBubble("I'm listening! Ask me anything about Ash...");
            toggleMic();
        } else {
            say('listen');
            setTimeout(function () { if (askOpen && !small) input.focus({ preventScroll: true }); }, 200);
        }
    }
    function closeAsk() {
        if (!askOpen) return;
        askOpen = false; busy = false; micRetried = false; earsSay('');
        ask.classList.remove('on'); box.classList.remove('listening');
        if (recActive) rec.abort();
        bear.mode('idle');
    }
    ask.querySelector('.kiki-x').addEventListener('click', closeAsk);
    ask.querySelector('.kiki-type').addEventListener('submit', function (e) {
        e.preventDefault(); var q = input.value; input.value = ''; askQuestion(q);
    });
    input.addEventListener('focus', function () { if (recActive) rec.abort(); });
    var askBtn = document.getElementById('askKiki');
    if (askBtn) askBtn.addEventListener('click', function () { if (deepNap) wakeFromNap(); else openAsk(true); });

    // voice input
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    var rec = null, recActive = false;
    if (!SR) micBtn.style.display = 'none';
    micBtn.addEventListener('click', toggleMic);
    var micRetried = false;
    function toggleMic() {
        if (!SR) return;
        if (recActive) { rec.stop(); return; }
        stopAudio(); bear.talk(false);
        rec = new SR(); rec.lang = 'en-US'; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
        var finalText = '', heard = '', failed = '', startedAt = 0;
        earsSay('Starting the mic...');
        rec.onstart = function () {
            recActive = true; startedAt = performance.now();
            micBtn.classList.add('on'); ask.classList.add('listening');
            input.placeholder = 'Listening... ask away!';
            earsSay('Listening... speak now');
        };
        rec.onspeechstart = function () { earsSay('I hear you...'); };
        rec.onresult = function (e) {
            var txt = '';
            for (var i = 0; i < e.results.length; i++) { txt += e.results[i][0].transcript; if (e.results[i].isFinal) finalText = txt; }
            heard = txt; input.value = txt;
            earsSay('Heard: "' + txt + '"');
        };
        rec.onerror = function (e) {
            failed = e.error;
            if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
                earsSay('Microphone blocked. Click the icon left of the address bar, allow the microphone, then reload.');
                say('nomic');
            } else if (e.error === 'no-speech') {
                earsSay("I didn't hear anything. Tap the mic and speak a little louder.");
            } else if (e.error === 'network') {
                earsSay("Voice needs Google Chrome with internet (Brave, Arc and some others don't support it). Typing works everywhere!");
            } else if (e.error === 'audio-capture') {
                earsSay('No microphone found. Check your Mac sound settings, or type instead.');
            } else if (e.error !== 'aborted') {
                earsSay('Mic error: ' + e.error + '. Try typing instead!');
            }
        };
        rec.onend = function () {
            recActive = false; micBtn.classList.remove('on'); ask.classList.remove('listening'); input.placeholder = 'or type here...';
            var q = (finalText || heard || input.value).trim(); input.value = '';
            if (q) { earsSay(''); askQuestion(q); return; }
            if (failed) return;
            // Ended without hearing anything and without an error: usually the session ran out
            // while the visitor was clicking "Allow" on the permission prompt. Try once more.
            if (!micRetried && askOpen) { micRetried = true; earsSay('Mic ready! Listening again...'); setTimeout(function () { if (askOpen && !recActive) toggleMic(); }, 150); return; }
            earsSay("I didn't catch anything. Tap the mic to try again, or type!");
        };
        try { rec.start(); } catch (err) { recActive = false; earsSay('Could not start the mic: ' + err.message); }
    }

    function askQuestion(q) {
        q = String(q || '').trim(); if (!q) return;
        var it = brain.match(q);
        if (it.cmd === 'sleep') { closeAsk(); deepSleep(); return; }
        closeAsk(); stopTour();
        busy = true;
        var target = it.card ? document.querySelector('[data-project="' + it.card + '"]') : it.go ? document.getElementById(it.go) : null;
        var talking = say(it.id, it.say, { links: it.links, card: it.card });
        if (it.id === 'fallback') emote('question'); else if (it.pose === 'happy') emote('heart'); else if (it.pose === 'think') emote('bulb');
        if (!target) {
            bear.act(it.pose || 'wave', 1);
            talking.then(function () { busy = false; });
            return;
        }
        // if it's a filtered-out project, show all projects first
        if (it.card && target.classList.contains('hide')) { var all = document.querySelector('.clay-chip[data-filter="all"]'); all && all.click(); }
        // she's answering this section now, so don't start its tour on top
        var sec = target.closest('section[id]'); if (sec) reacted[sec.id] = true;
        var perchEl = target.matches('[data-perch]') ? target : (target.querySelector('.section-head[data-perch], [data-perch]') || target);
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: it.card ? 'center' : 'start' });
        waitForScroll().then(function () {
            glow(target);
            return walkToPerch(perchEl, .5);
        }).then(function () {
            bear.act('present'); emote('sparkle');
            return talking;
        }).then(function () { busy = false; });
    }

    function waitForScroll() {
        return new Promise(function (resolve) {
            var last = -1, still = 0, t0 = performance.now();
            (function check() {
                var y = window.scrollY;
                still = y === last ? still + 1 : 0; last = y;
                if (still > 6 || performance.now() - t0 > 1800) resolve(); else requestAnimationFrame(check);
            })();
        });
    }
    function glow(n) {
        if (!n) return;
        document.querySelectorAll('.kiki-glow').forEach(function (g) { g.classList.remove('kiki-glow'); });
        n.classList.add('kiki-glow'); setTimeout(function () { n.classList.remove('kiki-glow'); }, 4500);
    }

    /* ================================================================== */
    /* Touching Kiki: head pats, pokes, drag                               */
    /* ================================================================== */
    var press = null, taps = [], grumpy = false, pats = 0, lastHoverKiki = 0;
    box.addEventListener('pointerdown', function (e) {
        press = { x: e.clientX, y: e.clientY, id: e.pointerId };
        box.setPointerCapture(e.pointerId);
    });
    box.addEventListener('pointermove', function (e) {
        if (!press) return;
        if (!drag && Math.hypot(e.clientX - press.x, e.clientY - press.y) > 8 && !reduced && !compact) {
            drag = { x: e.clientX, y: e.clientY }; walk = null; fall = null; perch = null;
            if (deepNap) { deepNap = false; sleeping = false; box.classList.remove('sleeping'); setMuted(false); }
            if (askOpen) closeAsk();
            stopTour(); bear.prop(null);
            busy = true; bear.mode('flail'); box.classList.add('dragging');
            say('wheee'); emote('excl');
        }
        if (drag) { drag.x = e.clientX; drag.y = e.clientY; }
    });
    box.addEventListener('pointerup', function (e) {
        if (drag) {
            drag = null; box.classList.remove('dragging');
            dropFrom(pos.x, pos.y, function () { busy = false; bear.act('happy'); emote('star'); });
        } else if (press) {
            tapKiki(e.clientY - box.getBoundingClientRect().top);
        }
        press = null;
    });
    box.addEventListener('pointerenter', function () {
        if (!introDone || busy || touring || sleeping || grumpy || performance.now() - lastHoverKiki < 5000) return;
        lastHoverKiki = performance.now();
        bear.act('peekup'); emote('sparkle');
    });

    function tapKiki(localY) {
        lastActive = performance.now();
        if (grumpy) { emote('grr'); return; }
        if (deepNap) { wakeFromNap(); return; }
        if (sleeping) { wake(); return; }
        var now = performance.now();
        taps = taps.filter(function (t) { return now - t < 3000; }); taps.push(now);
        if (taps.length >= 5) { getGrumpy(); return; }
        var quick = taps.length >= 2 && now - taps[taps.length - 2] < 700;
        var onHead = localY < BH * (bear.head + .3);
        if (askOpen) { closeAsk(); return; }
        if (quick) { bear.act('poked'); emote('excl'); return; }   // a poke, not a question
        if (onHead) { pat(); return; }
        openAsk(true);
    }
    function pat() {
        pats++;
        bear.act('shy'); emote('heart');
        say(pats % 2 ? 'pat_1' : 'pat_2');
    }
    function getGrumpy() {
        grumpy = true; taps = [];
        if (askOpen) closeAsk();
        stopTour(); bear.prop(null);
        bear.mode('grumpy'); emote('grr');
        say('grumpy').then(function () { return later(2500); }).then(function () {
            grumpy = false; bear.mode('idle'); bear.act('happy'); emote('heart');
            say('forgive');
        });
    }
    box.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAsk(false); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAsk(); });
    document.addEventListener('pointerdown', function (e) {
        if (askOpen && !ask.contains(e.target) && !box.contains(e.target) && e.target !== askBtn && !(askBtn && askBtn.contains(e.target))) closeAsk();
    });

    /* ================================================================== */
    /* Hover anything with a description: she tells you about it (1–2 lines) */
    /* Works during tours too: the tour waits until she's done.            */
    /* ================================================================== */
    var hoverEl = null, hoverTimer = null, hoverP = null, lastHoverSay = 0;
    function afterHover() { return hoverP || Promise.resolve(); }
    document.addEventListener('pointerover', function (e) {
        if (e.pointerType === 'touch') return;
        var t = e.target.closest('[data-say], a[download], .contact-actions a, .hero-social a');
        if (!t || t === hoverEl) return;
        hoverEl = t;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(function () { describe(t); }, 550);   // only if they actually pause on it
    });
    document.addEventListener('pointerout', function (e) {
        if (hoverEl && !hoverEl.contains(e.relatedTarget)) { hoverEl = null; clearTimeout(hoverTimer); }
    });
    // Lines that mean the same thing, so hover and tour don't repeat each other.
    var SAME = { proj_medi: 'medicurious', proj_genai: 'genai', proj_fake: 'fakereview', sec_contact: 'contact_email' };
    function alreadySaid(id) {
        if (spoken.has(id)) return true;
        for (var k in SAME) { if ((SAME[k] === id && spoken.has(k)) || (k === id && spoken.has(SAME[k]))) return true; }
        return false;
    }
    function describe(t) {
        if (hoverEl !== t) return;
        if (!introDone || askOpen || sleeping || deepNap || grumpy || drag || fall) return;
        if (busy && !touring) return;                               // she's answering a question
        var id = t.getAttribute('data-say');
        if (t.matches('a[download]')) id = 'hov_resume';
        else if (t.matches('.contact-actions a, .hero-social a')) id = 'hov_contact';
        if (!id || !lineText(id)) return;
        var repeatable = id === 'hov_resume' || id === 'hov_contact';
        if (!repeatable && (explained.has(t) || alreadySaid(id))) return;   // she already told you about it
        if (repeatable && performance.now() - (spoken.get(id) || 0) < 30000) return;
        if (performance.now() - lastHoverSay < 1500) return;
        lastHoverSay = performance.now();
        explained.add(t);
        // If she's mid-sentence (e.g. on the tour), let her finish, then explain; the tour waits for this.
        var waitFor = line && !line.finished ? line.promise : Promise.resolve();
        var chain = waitFor.then(function () {
            if (hoverEl !== t && !repeatable) { explained.delete(t); return; }   // they moved on: maybe later
            var r = t.getBoundingClientRect(), dir = r.left + r.width / 2 > pos.x ? 1 : -1;
            bear.face(dir); setTimeout(function () { if (!walk) bear.face(0); }, 2600);
            if (id === 'hov_resume') { bear.act('present'); emote('star'); }
            else if (id === 'hov_contact' || id === 'hov_photo') { bear.act('wave'); emote('heart'); }
            else { bear.act('point', dir); emote(pick(['sparkle', 'star', 'bulb'])); }
            if (compact && !repeatable) glow(t);   // on phones, show which card she means
            return say(id);
        });
        hoverP = chain.then(function () { if (hoverP === mine) hoverP = null; });
        var mine = hoverP;
    }

    /* ================================================================== */
    /* Section tours: several stops per section while the visitor is there */
    /* ================================================================== */
    var reacted = {}, introDone = false, pendingSection = null, activeSection = null;
    function sectionActive(id) {
        var s = document.getElementById(id); if (!s) return false;
        var r = s.getBoundingClientRect();
        return r.top < window.innerHeight * .75 && r.bottom > window.innerHeight * .25;
    }
    var sectionIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            var id = en.target.id;
            activeSection = id;
            if (reacted[id] || !brain.tour[id]) return;
            if (touring && touring !== id) stopTour();
            if (!introDone || busy || askOpen || grumpy || deepNap) { pendingSection = id; return; }
            runTour(id);
        });
    }, { rootMargin: '-35% 0px -45% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { sectionIO.observe(s); });

    function centered(elm) {
        var r = elm.getBoundingClientRect(), vh = window.innerHeight;
        return r.width > 0 && r.top < vh * .62 && r.bottom > vh * .3;
    }
    // Phones have no hover: the card that stays in the middle of the screen for a moment
    // gets described instead (same no-repeat memory as hover and the tour).
    var centerEl = null, centerSince = 0;
    setInterval(function () {
        if (!compact || document.hidden) return;
        var hit = document.elementFromPoint(window.innerWidth / 2, window.innerHeight * .45);
        var t = hit && hit.closest && hit.closest('[data-say]');
        if (t !== centerEl) { centerEl = t; centerSince = performance.now(); hoverEl = t; return; }
        if (t && performance.now() - centerSince > 1100) { hoverEl = t; describe(t); centerSince = Infinity; }
    }, 300);
    function waitVisible(elm, ms) {
        return new Promise(function (resolve) {
            var t0 = performance.now();
            (function check() {
                if (compact ? centered(elm) : perchVisible(elm)) resolve(true);
                else if (performance.now() - t0 > ms) resolve(false);
                else setTimeout(check, 250);
            })();
        });
    }
    function runTour(id) {
        if (sleeping) wake();
        reacted[id] = true; pendingSection = null; touring = id;
        var beats = brain.tour[id], i = 0;
        function next() {
            if (touring !== id) return;
            if (i >= beats.length || !sectionActive(id)) { endTour(id); return; }
            var b = beats[i++], elm = document.querySelector(b.sel);
            if (!elm) { next(); return; }
            var isHead = elm.matches('.section-head');
            if (!isHead && (explained.has(elm) || alreadySaid(b.line))) { next(); return; }   // already covered on hover
            explained.add(elm);
            if (b.sel === '#about .stat') document.querySelectorAll('#about .stat[data-say="about_stats"]').forEach(function (n) { explained.add(n); });
            afterHover().then(function () { return waitVisible(elm, 5000); }).then(function (ok) {
                if (touring !== id) return;
                if (!ok) { next(); return; }
                bear.prop(b.prop || null);
                return walkToPerch(elm, b.fx == null ? rand(.25, .75) : b.fx).then(function () {
                    if (touring !== id) return;
                    if (b.sit && !compact) bear.mode('sit');
                    if (b.glow || (compact && !isHead)) glow(elm);
                    if (b.glowSel) glow(document.querySelector(b.glowSel));
                    if (b.emote) emote(b.emote);
                    if (b.pose) bear.act(b.pose, 1);
                    else if (!b.sit && !b.prop) bear.act('point', -1);
                    return afterHover().then(function () { return touring === id ? say(b.line) : null; }).then(function () {
                        if (touring !== id) return;
                        if (b.sit) bear.mode('idle');
                        return later(500).then(next);
                    });
                });
            });
        }
        next();
    }
    function endTour(id) {
        if (touring !== id) return;
        touring = null; bear.prop(null);
        if (bear.getMode() === 'sit') bear.mode('idle');
        if (pendingSection && !reacted[pendingSection] && sectionActive(pendingSection)) runTour(pendingSection);
        else if (activeSection && !reacted[activeSection] && brain.tour[activeSection] && sectionActive(activeSection)) runTour(activeSection);
    }
    function stopTour() {
        if (!touring) return;
        touring = null; bear.prop(null);
        if (bear.getMode() === 'sit') bear.mode('idle');
    }

    /* ================================================================== */
    /* Life: idle moves, playing with the page, naps                       */
    /* ================================================================== */
    var sleeping = false;
    function activity() {
        lastActive = performance.now();
        if (sleeping && !deepNap) wake();
    }
    window.addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; activity(); }, { passive: true });
    window.addEventListener('scroll', activity, { passive: true });
    window.addEventListener('keydown', activity);

    function sleep() {
        sleeping = true; bear.prop(null); bear.act('yawn');
        setTimeout(function () { if (sleeping) { bear.mode('sleep'); box.classList.add('sleeping'); } }, 1500);
        say('sleepy');
    }
    function wake() {
        if (deepNap) return;
        sleeping = false; box.classList.remove('sleeping'); bear.mode('idle'); bear.act('happy'); emote('excl');
    }

    // "Kiki, sleep" / "mute": she walks to the corner and naps until someone taps her.
    var deepNap = false;
    function deepSleep(silent) {
        stopTour(); bear.prop(null);
        if (askOpen) closeAsk();
        if (grumpy) { grumpy = false; }
        deepNap = true; busy = true;
        bear.act('yawn');
        if (silent) { stopAudio(); bear.talk(false); }
        (silent ? later(900) : say('cmd_sleep')).then(function () {
            if (!deepNap) return;
            setMuted(true);   // the speaker button shows she's off
            stopAudio(); bubble.classList.remove('on');
            return walkToFloor(BW * .55);
        }).then(function () {
            if (!deepNap) return;
            sleeping = true; bear.mode('sleep'); box.classList.add('sleeping');
            box.setAttribute('aria-label', 'Kiki is napping. Tap her to wake her up.');
        });
    }
    function wakeFromNap() {
        deepNap = false; sleeping = false; busy = false;
        setMuted(false);
        box.classList.remove('sleeping'); bear.mode('idle'); bear.act('happy'); emote('sparkle');
        box.setAttribute('aria-label', 'Kiki, Ashlesha\'s AI agent. Tap her to ask a question, pat her head, or drag her around.');
        say('cmd_wake');
    }

    var PLAY = {
        // hop onto a card and look around / wave
        perchHop: function () {
            var spots = visiblePerches();
            if (!spots.length) return PLAY.stroll();
            return walkToPerch(pick(spots)).then(function () { if (Math.random() < .5) bear.act(pick(['look', 'wave', 'stretch'])); });
        },
        // sit on a stat / edu / small card and swing her legs
        sitSwing: function () {
            var spots = visiblePerches('.stat, .edu-item, .job-sm, .skill, .post');
            if (!spots.length) return PLAY.perchHop();
            return walkToPerch(pick(spots)).then(function () {
                bear.mode('sit'); emote('music');
                return later(5500).then(function () { if (bear.getMode() === 'sit') bear.mode('idle'); });
            });
        },
        // kick a skill tag so it bounces
        kickTag: function () {
            var tags = Array.prototype.filter.call(document.querySelectorAll('.tags span'), function (t) {
                var card = t.closest('[data-perch]'); return card && perchVisible(card);
            });
            if (!tags.length) return PLAY.perchHop();
            var tag = pick(tags), card = tag.closest('[data-perch]');
            var cr = card.getBoundingClientRect(), tr = tag.getBoundingClientRect();
            var fx = clamp((tr.left + tr.width / 2 - cr.left - BW * .22) / cr.width, .05, .95);
            return walkToPerch(card, fx).then(function () {
                bear.face(1); bear.act('kick');
                return later(220).then(function () {
                    tag.classList.remove('kiki-kicked'); void tag.offsetWidth; tag.classList.add('kiki-kicked');
                    emote('excl');
                    setTimeout(function () { tag.classList.remove('kiki-kicked'); bear.face(0); }, 1100);
                });
            });
        },
        // peek in from the edge of the screen and wave
        peek: function () {
            var left = Math.random() < .5, edgeX = left ? BW * .12 : window.innerWidth - BW * .12;
            return walkToFloor(edgeX, { offEdge: true }).then(function () {
                bear.act('lean', left ? -1 : 1); emote('sparkle');
                return later(2800);
            }).then(function () { offEdge = false; return walkToFloor(left ? BW * .9 : window.innerWidth - BW * .9); });
        },
        // stand on a card's corner, then slide down its edge
        slide: function () {
            var spots = visiblePerches('.project, .job, .post, .skill, .clay-card');
            if (!spots.length) return PLAY.stroll();
            var card = pick(spots), leftSide = Math.random() < .5;
            return walkToPerch(card, leftSide ? .04 : .96).then(function () {
                return later(700);
            }).then(function () {
                var r = card.getBoundingClientRect();
                return new Promise(function (res) {
                    emote('music');
                    dropFrom(leftSide ? r.left - BW * .05 : r.right + BW * .05, pos.y + 4, function () { emote('star'); res(); }, { maxV: 360, pose: 'slide', skip: card });
                });
            });
        },
        // chase the cursor along the floor for a few seconds
        chase: function () {
            var t0 = performance.now();
            emote('excl');
            return walkTo(function () { return { x: clamp(mx, BW / 2, window.innerWidth - BW / 2), y: floorY() }; },
                { until: function () { return performance.now() - t0 > 3500; } })
                .then(function () { bear.act('happy'); emote('heart'); });
        },
        stroll: function () { return walkToFloor(rand(BW, window.innerWidth - BW)); },
        dance: function () { bear.act('dance'); emote('music'); return later(3200); },
        spin: function () { bear.act('spin'); emote('sparkle'); return later(1000); },
        jump: function () { bear.act('jump'); return later(1300); },
        stretch: function () { bear.act('stretch'); return later(1900); },
        sneeze: function () { bear.act('sneeze'); setTimeout(function () { emote('excl'); say('sneeze'); }, 650); return later(1600); },
        trip: function () {
            var dir = Math.random() < .5 ? -1 : 1;
            bear.act('trip', dir); emote('dizzy');
            return later(1300).then(function () { say('oops'); return later(800); });
        },
        read: function () {
            bear.prop('book');
            return later(4500).then(function () { bear.prop(null); bear.act('happy'); emote('bulb'); });
        },
        waveAtCursor: function () {
            bear.face(mx > pos.x ? 1 : -1); bear.act('wave'); emote('heart');
            return later(2200).then(function () { bear.face(0); });
        }
    };
    var PLAY_WEIGHTS = [
        ['perchHop', 18], ['sitSwing', 10], ['kickTag', 8], ['peek', 6], ['slide', 6], ['chase', 5], ['stroll', 8],
        ['dance', 6], ['spin', 4], ['jump', 4], ['stretch', 6], ['sneeze', 4], ['trip', 3], ['read', 6], ['waveAtCursor', 6]
    ];
    var IN_PLACE = ['dance', 'spin', 'jump', 'stretch', 'sneeze', 'trip', 'read', 'waveAtCursor'];
    function pickPlay() {
        var list = compact ? PLAY_WEIGHTS.filter(function (w) { return IN_PLACE.indexOf(w[0]) > -1; }) : PLAY_WEIGHTS;
        var total = list.reduce(function (s, w) { return s + w[1]; }, 0), r = Math.random() * total;
        for (var i = 0; i < list.length; i++) { r -= list[i][1]; if (r <= 0) return list[i][0]; }
        return compact ? 'stretch' : 'stroll';
    }
    var playing = false;
    function roam() {
        setTimeout(roam, rand(CONFIG.roamEvery[0], CONFIG.roamEvery[1]));
        if (!introDone || busy || touring || askOpen || drag || fall || walk || reduced || grumpy || playing || deepNap) return;
        if (pendingSection && !reacted[pendingSection] && sectionActive(pendingSection)) { runTour(pendingSection); return; }
        if (sleeping) return;
        if (performance.now() - lastActive > CONFIG.sleepAfter) { sleep(); return; }
        playing = true;
        Promise.resolve(PLAY[pickPlay()]()).then(function () { playing = false; }, function () { playing = false; });
        setTimeout(function () { playing = false; }, 9000);   // never get stuck
    }

    /* ================================================================== */
    /* Leaving and coming back to the tab                                  */
    /* ================================================================== */
    var realTitle = document.title, hiddenAt = 0;
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) { hiddenAt = performance.now(); document.title = 'Kiki misses you! \u{1F43B} · Ashlesha'; return; }
        document.title = realTitle;
        if (performance.now() - hiddenAt > 4000 && introDone && !askOpen && !busy && !grumpy && !deepNap) {
            if (sleeping) wake();
            bear.act('wave'); emote('heart'); say('welcome_back');
        }
    });

    /* ================================================================== */
    /* Arrival: a random entrance, then the intro                          */
    /* ================================================================== */
    var ENTRANCES = {
        drop: function (x, done) { dropFrom(x, -BH, done); },
        parachute: function (x, done) {
            chute.classList.add('on'); emote('sparkle');
            dropFrom(x, -BH * .2, function () {
                chute.classList.add('away');
                setTimeout(function () { chute.className = 'kiki-chute'; }, 900);
                done();
            }, { maxV: 150, pose: 'hang', sway: 40 });
        },
        rope: function (x, done) {
            rope.classList.add('on');
            dropFrom(x, -BH * .3, function () {
                rope.classList.add('away');
                setTimeout(function () { rope.className = 'kiki-rope'; }, 700);
                done();
            }, { maxV: 320, pose: 'hang' });
        },
        pop: function (x, done) {
            var photo = document.querySelector('.photo-clay');
            if (!photo || !perchVisible(photo)) { ENTRANCES.drop(x, done); return; }
            perch = { el: photo, fx: .5 };
            box.classList.add('kiki-popin'); emote('sparkle'); bear.act('jump');
            setTimeout(function () { box.classList.remove('kiki-popin'); done(); }, 900);
        }
    };
    function start() {
        var photo = document.querySelector('.photo-clay');
        var returning = store.get('met') === '1';
        function startX() {
            var r = photo && photo.getBoundingClientRect();
            return r && r.width && !small ? r.left + r.width * .5 : window.innerWidth * .72;
        }
        var intro = function () {
            if (muted) { introDone = true; store.set('met', '1'); deepSleep(true); return; }
            bear.act('wave', 1); emote(returning ? 'heart' : 'sparkle');
            say(returning ? 'intro_return' : 'intro').then(function () {
                introDone = true;
                store.set('met', '1');
                if (pendingSection && sectionActive(pendingSection)) runTour(pendingSection);
            });
        };
        if (reduced) { box.classList.add('on'); pos.x = window.innerWidth - BW; pos.y = floorY(); intro(); }
        else if (compact) setTimeout(function () {
            box.classList.add('on', 'kiki-popin'); bear.act('jump'); emote('sparkle');
            setTimeout(function () { box.classList.remove('kiki-popin'); intro(); }, 900);
        }, 450);
        else setTimeout(function () {
            box.classList.add('on');
            ENTRANCES[pick(Object.keys(ENTRANCES))](startX(), function () { setTimeout(intro, 250); });
        }, 450);
        setTimeout(roam, 9000);
    }
    window.addEventListener('resize', function () {
        var was = BW; measure();
        if (BW !== was) bear.resize(BW, BH);
        pos.x = clamp(pos.x, BW / 2, window.innerWidth - BW / 2);
    });
    // Script sits at the end of <body>, so the page is ready: don't wait for every image.
    start();
})();

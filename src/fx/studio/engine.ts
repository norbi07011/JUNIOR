// @ts-nocheck
/* ==================================================================
   Studio engine — shared Three.js runtime for all montage studios.
   A studio definition builds its own scene and returns:
     { CH, apply(t, ex), keys, exKey, labeled, focus, extraTags,
       cutaway, floorY, speed, voorT, onTick(dt, t, ex) }
   The engine provides renderer, environment, lights, camera orbit,
   drag / zoom, labelled tags, timeline playback and the public API
   used by <StudioView/>.
   ================================================================== */
import * as THREE from 'three';

export function createStudio(host: any, opts: any, def: any): any {
  var T: any = THREE;
  var renderer;
  try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' }); } catch (e) { return null; }
  if (!renderer.getContext()) return null;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  host.insertBefore(renderer.domElement, host.firstChild);
  var cv = renderer.domElement;
  var scene = new T.Scene();
  var cam = new T.PerspectiveCamera(32, 1, 0.05, 80);
  var maxAniso = renderer.capabilities.getMaxAnisotropy();

  /* ---------- math helpers ---------- */
  function rand(a, b) { return a + Math.random() * (b - a); }
  function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function eo(x) { return 1 - Math.pow(1 - x, 3); }
  function eio(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function ss(x) { return x * x * (3 - 2 * x); }
  function eback(x) { var c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
  var V = function (x, y, z) { return new T.Vector3(x, y, z); };

  /* ---------- environment (reflections) ---------- */
  (function () {
    var pm = new T.PMREMGenerator(renderer), es = new T.Scene();
    var sg = new T.SphereGeometry(20, 48, 24), pa = sg.attributes.position, cols = [];
    var zen = new T.Color(0x3d5f8f), hor = new T.Color(0xe4e7ec), gnd = new T.Color(0x22252b);
    for (var i = 0; i < pa.count; i++) { var y = pa.getY(i) / 20, c = y >= 0 ? hor.clone().lerp(zen, Math.pow(y, 0.55)) : hor.clone().lerp(gnd, Math.min(1, -y * 4)); cols.push(c.r, c.g, c.b); }
    sg.setAttribute('color', new T.Float32BufferAttribute(cols, 3));
    es.add(new T.Mesh(sg, new T.MeshBasicMaterial({ side: T.BackSide, vertexColors: true })));
    function panel(w, h, x, y, z, k) { var m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(k, k * .98, k * .95), side: T.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); es.add(m); }
    panel(9, 3.5, -5, 7, 9, 5); panel(3, 7, 9, 2, 5, 2.5); panel(6, 1, 0, -2, 10, 1.6); panel(6, 4, 0, 4, -9, 2.2);
    scene.environment = pm.fromScene(es, 0.03).texture; pm.dispose();
  })();

  /* ---------- procedural textures ---------- */
  function canvas(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function tex(c, rx, ry, srgb) { var t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = maxAniso; if (srgb !== false) t.encoding = T.sRGBEncoding; return t; }
  var cache = {};
  function brickCanvas(tone) {
    var key = 'brick' + tone; if (cache[key]) return cache[key];
    // tone: 'red' (rood-oranje), 'grey' (antraciet genuanceerd), 'yellow' (gele klinker)
    var P = tone === 'grey' ? { h: [200, 230], s: [4, 10], l: [22, 36], mortar: '#9a9690' }
      : tone === 'yellow' ? { h: [36, 46], s: [35, 55], l: [52, 66], mortar: '#b7b1a5' }
      : { h: [6, 20], s: [34, 52], l: [21, 33], mortar: '#8b857a' };
    var S = 1024, cols = 8, rows = 16, bw = S / cols, bh = S / rows, m = 6, c = canvas(S, S), g = c.getContext('2d'), b = canvas(S, S), gb = b.getContext('2d');
    g.fillStyle = P.mortar; g.fillRect(0, 0, S, S); gb.fillStyle = '#2a2a2a'; gb.fillRect(0, 0, S, S);
    for (var i = 0; i < 14000; i++) { g.fillStyle = Math.random() > .5 ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.09)'; g.fillRect(Math.random() * S, Math.random() * S, 2, 2); }
    for (var r = 0; r < rows; r++) {
      var off = (r % 2) ? bw / 2 : 0;
      for (var k = -1; k <= cols; k++) {
        var x = k * bw + off + m / 2, y = r * bh + m / 2, w = bw - m, h = bh - m, hue = rand(P.h[0], P.h[1]), sat = rand(P.s[0], P.s[1]), li = rand(P.l[0], P.l[1]);
        g.fillStyle = 'hsl(' + hue + ',' + sat + '%,' + li + '%)'; g.fillRect(x, y, w, h);
        for (var s = 0; s < 90; s++) { g.fillStyle = 'hsla(' + (hue + rand(-4, 4)) + ',' + sat + '%,' + (li + rand(-9, 9)) + '%,.55)'; g.fillRect(x + Math.random() * w, y + Math.random() * h, rand(1, 4), rand(1, 2.5)); }
        var gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, 'rgba(255,240,220,.08)'); gr.addColorStop(1, 'rgba(0,0,0,.22)'); g.fillStyle = gr; g.fillRect(x, y, w, h);
        var gv = Math.round(rand(190, 225)); gb.fillStyle = 'rgb(' + gv + ',' + gv + ',' + gv + ')'; gb.fillRect(x, y, w, h);
      }
    }
    return (cache[key] = { c: c, b: b });
  }
  function ksCanvas() {
    if (cache.ks) return cache.ks;
    var c = canvas(512, 512), g = c.getContext('2d');
    g.fillStyle = '#d4d0c7'; g.fillRect(0, 0, 512, 512);
    for (var i = 0; i < 9000; i++) { g.fillStyle = Math.random() > .5 ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.06)'; g.fillRect(Math.random() * 512, Math.random() * 512, 2, 2); }
    g.strokeStyle = 'rgba(90,85,78,.45)'; g.lineWidth = 3;
    for (var r = 0; r < 2; r++) { g.beginPath(); g.moveTo(0, r * 256 + 1); g.lineTo(512, r * 256 + 1); g.stroke(); var off = r % 2 ? 128 : 0; for (var k = 0; k < 3; k++) { g.beginPath(); g.moveTo(off + k * 256 + 1, r * 256); g.lineTo(off + k * 256 + 1, r * 256 + 256); g.stroke(); } }
    return (cache.ks = c);
  }
  function woolCanvas() {
    if (cache.wool) return cache.wool;
    var c = canvas(256, 256), g = c.getContext('2d');
    g.fillStyle = '#d8b24a'; g.fillRect(0, 0, 256, 256);
    for (var i = 0; i < 2600; i++) { g.strokeStyle = 'rgba(' + (Math.random() > .5 ? '255,236,170' : '150,110,30') + ',' + rand(.15, .4) + ')'; g.lineWidth = rand(.5, 1.5); var x = Math.random() * 256, y = Math.random() * 256; g.beginPath(); g.moveTo(x, y); g.lineTo(x + rand(-14, 14), y + rand(-3, 3)); g.stroke(); }
    return (cache.wool = c);
  }
  function woodCanvas(base, grain) {
    var key = 'wood' + base; if (cache[key]) return cache[key];
    var c = canvas(512, 512), g = c.getContext('2d');
    g.fillStyle = base; g.fillRect(0, 0, 512, 512);
    for (var i = 0; i < 160; i++) { g.strokeStyle = grain + rand(.08, .25) + ')'; g.lineWidth = rand(.6, 2.4); var y = Math.random() * 512; g.beginPath(); g.moveTo(0, y); for (var x = 0; x <= 512; x += 32) g.lineTo(x, y + Math.sin(x / rand(40, 90) + i) * rand(1, 5)); g.stroke(); }
    for (var k = 0; k < 3000; k++) { g.fillStyle = 'rgba(0,0,0,.04)'; g.fillRect(Math.random() * 512, Math.random() * 512, 2, 1); }
    return (cache[key] = c);
  }
  function tileCanvas() {
    if (cache.tile) return cache.tile;
    var c = canvas(512, 512), g = c.getContext('2d');
    g.fillStyle = '#2b2c30'; g.fillRect(0, 0, 512, 512);
    for (var r = 0; r < 4; r++) for (var k = 0; k < 4; k++) {
      var li = rand(20, 30);
      var gr = g.createLinearGradient(0, r * 128, 0, r * 128 + 128); gr.addColorStop(0, 'hsl(220,6%,' + (li + 10) + '%)'); gr.addColorStop(.85, 'hsl(220,6%,' + li + '%)'); gr.addColorStop(1, 'hsl(220,6%,' + (li - 10) + '%)');
      g.fillStyle = gr; g.fillRect(k * 128 + 3, r * 128 + 2, 122, 124);
      g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(k * 128 + 20, r * 128 + 2, 30, 124);
    }
    return (cache.tile = c);
  }
  function brickMat(tone, w, h) { var B = brickCanvas(tone); return new T.MeshStandardMaterial({ map: tex(B.c, w / 1.8, h / 1.2), bumpMap: tex(B.b, w / 1.8, h / 1.2, false), bumpScale: .006, roughness: .93, envMapIntensity: .45 }); }
  function layerMats(kind, w, h, d, tone) {
    function m(rx, ry) {
      if (kind === 'brick') return brickMat(tone || 'red', rx, ry);
      if (kind === 'ks') return new T.MeshStandardMaterial({ map: tex(ksCanvas(), rx / 1.8, ry / 1.2), roughness: .9, envMapIntensity: .5 });
      if (kind === 'wool') return new T.MeshStandardMaterial({ map: tex(woolCanvas(), rx / 0.6, ry / 0.6), roughness: 1, envMapIntensity: .4 });
      return new T.MeshStandardMaterial({ color: 0xefebe4, roughness: .85, envMapIntensity: .5 });
    }
    return [m(d, h), m(d, h), m(w, d), m(w, d), m(w, h), m(w, h)];
  }

  /* ---------- geometry helpers ---------- */
  function box(w, h, d, mat, shadow) { var m = new T.Mesh(new T.BoxGeometry(w, h, d), mat); if (shadow !== false) { m.castShadow = true; m.receiveShadow = true; } return m; }
  function ring(w, h, p, d, mat) {
    var g = new T.Group();
    function add(bw, bh, x, y) { var m = box(bw, bh, d, mat); m.position.set(x, y, 0); g.add(m); }
    add(w, p, 0, h / 2 - p / 2); add(w, p, 0, -h / 2 + p / 2); add(p, h - 2 * p, -w / 2 + p / 2, 0); add(p, h - 2 * p, w / 2 - p / 2, 0);
    return g;
  }
  function bead(len, r, mat) { var g = new T.CylinderGeometry(r, r, len, 10); g.translate(0, len / 2, 0); var m = new T.Mesh(g, mat); m.castShadow = true; return m; }
  function comp(obj, base, ex, name, anchor) { obj.userData.base = base; obj.userData.ex = ex; obj.userData.name = name; obj.userData.anchor = anchor || new T.Vector3(); scene.add(obj); return obj; }
  var exRef = { v: 0 };
  function place(obj, ax, ay, az) { var b = obj.userData.base, e = obj.userData.ex; obj.position.set(b.x + (ax || 0) + e.x * exRef.v, b.y + (ay || 0) + e.y * exRef.v, b.z + (az || 0) + e.z * exRef.v); }

  /** Cavity wall (brick / insulation / sand-lime / plaster) with a rectangular opening.
   *  o: {OW, OH, oy (opening centre y), WX (half width), YB, YT, tone, layers?}
   *  Returns {group, cutaway} — cutaway meshes fade in the exploded view. */
  function cavityWall(o) {
    var group = new T.Group(); scene.add(group);
    var cutaway = [];
    var LAY = o.layers || [{ k: 'brick', z0: 0, z1: -0.1 }, { k: 'wool', z0: -0.1, z1: -0.22 }, { k: 'ks', z0: -0.22, z1: -0.32 }, { k: 'plaster', z0: -0.32, z1: -0.335 }];
    var oy = o.oy || 0, ob = oy - o.OH / 2, ot = oy + o.OH / 2;
    LAY.forEach(function (L) {
      var d = L.z0 - L.z1, zc = (L.z0 + L.z1) / 2;
      var parts = [[-o.WX, -o.OW / 2, o.YB, o.YT, false], [o.OW / 2, o.WX, o.YB, o.YT, true], [-o.OW / 2, o.OW / 2, ot, o.YT, true]];
      if (ob > o.YB + 0.001) parts.push([-o.OW / 2, o.OW / 2, o.YB, ob, false]);
      parts.forEach(function (b) {
        var w = b[1] - b[0], h = b[3] - b[2]; if (w <= 0 || h <= 0) return;
        var mats = layerMats(L.k, w, h, d, o.tone);
        var m = new T.Mesh(new T.BoxGeometry(w, h, d), mats);
        m.position.set((b[0] + b[1]) / 2, (b[2] + b[3]) / 2, zc); m.castShadow = m.receiveShadow = true; group.add(m);
        if (b[4]) { mats.forEach(function (mt) { mt.transparent = true; }); cutaway.push(m); }
      });
    });
    return { group: group, cutaway: cutaway };
  }

  /* ---------- shared materials ---------- */
  var M = {
    antra: new T.MeshStandardMaterial({ color: 0x363b40, roughness: .42, metalness: .08, envMapIntensity: 1 }),
    antraLight: new T.MeshStandardMaterial({ color: 0x4a5056, roughness: .45, envMapIntensity: .9 }),
    white: new T.MeshStandardMaterial({ color: 0xf3f1ec, roughness: .35 }),
    rubber: new T.MeshStandardMaterial({ color: 0x151617, roughness: .8 }),
    steel: new T.MeshStandardMaterial({ color: 0xc9cdd1, metalness: .9, roughness: .28 }),
    steelDark: new T.MeshStandardMaterial({ color: 0x3a3d40, metalness: .6, roughness: .5 }),
    alu: new T.MeshStandardMaterial({ color: 0x9aa0a8, metalness: .85, roughness: .35 }),
    glass: new T.MeshPhysicalMaterial({ color: 0xa3bfca, roughness: .03, transparent: true, opacity: .14, envMapIntensity: 1.4, clearcoat: 1, clearcoatRoughness: .03, depthWrite: false }),
    mirror: new T.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: .06, transparent: true, opacity: .1, envMapIntensity: 1.2, depthWrite: false }),
    kit: new T.MeshStandardMaterial({ color: 0x56595c, roughness: .5 }),
    pur: new T.MeshStandardMaterial({ color: 0xe6cf7c, roughness: .95 }),
    blue: new T.MeshStandardMaterial({ color: 0x2563eb, roughness: .55 }),
    blueGlow: new T.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: .9 }),
    laser: new T.MeshBasicMaterial({ color: 0xff3326, transparent: true }),
    hardsteen: new T.MeshStandardMaterial({ color: 0x32363a, roughness: .45, metalness: .05 }),
    epdm: new T.MeshStandardMaterial({ color: 0x151617, roughness: .85 }),
  };
  function laserLine(len) { var g = new T.BoxGeometry(len, 0.005, 0.005); g.translate(len / 2, 0, 0); return new T.Mesh(g, M.laser); }
  function makeLevel() {
    var level = new T.Group();
    var yellow = new T.MeshStandardMaterial({ color: 0xf2c12e, roughness: .38, metalness: .35 });
    level.add(new T.Mesh(new T.BoxGeometry(0.6, 0.05, 0.026), yellow));
    [-0.31, 0.31].forEach(function (x) { var e = new T.Mesh(new T.BoxGeometry(0.022, 0.054, 0.03), M.rubber); e.position.x = x; level.add(e); });
    var vial = new T.Mesh(new T.CylinderGeometry(0.009, 0.009, 0.06, 16), new T.MeshStandardMaterial({ color: 0x9fe07a, transparent: true, opacity: .8, emissive: 0x3a6a1e, emissiveIntensity: .6 })); vial.rotation.z = Math.PI / 2; vial.position.z = 0.019; level.add(vial);
    var bubble = new T.Mesh(new T.SphereGeometry(0.0065, 12, 8), new T.MeshBasicMaterial({ color: 0xf4ffe6 })); bubble.position.z = 0.026; level.add(bubble);
    level.traverse(function (o) { if (o.isMesh) o.castShadow = true; });
    level.userData.bubble = bubble;
    return level;
  }
  function makeScrew() {
    var g = new T.Group();
    var head = new T.Mesh(new T.CylinderGeometry(0.009, 0.009, 0.004, 18), M.steel); head.rotation.z = Math.PI / 2; g.add(head);
    var shaft = new T.Mesh(new T.CylinderGeometry(0.0035, 0.0035, 0.16, 10), M.steel); shaft.rotation.z = Math.PI / 2; g.add(shaft);
    return g;
  }
  /** Simple GPU-cheap particle cloud (points) used for rain, dust, sawdust, airflow. */
  function particles(n, color, size, opacity) {
    var geo = new T.BufferGeometry(); var pos = new Float32Array(n * 3);
    geo.setAttribute('position', new T.BufferAttribute(pos, 3));
    var mat = new T.PointsMaterial({ color: color, size: size, transparent: true, opacity: opacity == null ? .85 : opacity, depthWrite: false, sizeAttenuation: true });
    var p = new T.Points(geo, mat); p.frustumCulled = false; scene.add(p);
    p.userData.data = Array.from({ length: n }, function () { return { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, life: 0, seed: Math.random() }; });
    p.userData.sync = function () { var d = p.userData.data; for (var i = 0; i < n; i++) { pos[i * 3] = d[i].x; pos[i * 3 + 1] = d[i].y; pos[i * 3 + 2] = d[i].z; } geo.attributes.position.needsUpdate = true; };
    return p;
  }

  /* ---------- lights ---------- */
  scene.add(new T.HemisphereLight(0xd6e0ea, 0x22252b, 0.55));
  var sun = new T.DirectionalLight(0xfff0dc, 2.2); sun.position.set(-2.6, 3.4, 3.4); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); var sc = sun.shadow.camera; sc.left = -3; sc.right = 3; sc.top = 3; sc.bottom = -3; sc.near = .5; sc.far = 14; sun.shadow.bias = -.0004; sun.shadow.normalBias = .015; scene.add(sun);
  var back = new T.DirectionalLight(0xcfe0ff, 0.9); back.position.set(2.2, 2.4, -3.5); scene.add(back);
  var fill = new T.DirectionalLight(0xbcd2ff, 0.3); fill.position.set(3, 1, 2); scene.add(fill);

  /* ---------- build the studio scene ---------- */
  var ctx = {
    T: T, scene: scene, renderer: renderer, cam: cam, sun: sun,
    rand: rand, cl: cl, eo: eo, eio: eio, ss: ss, eback: eback, V: V,
    canvas: canvas, tex: tex, brickMat: brickMat, layerMats: layerMats, woodCanvas: woodCanvas, tileCanvas: tileCanvas,
    box: box, ring: ring, bead: bead, comp: comp, place: place, cavityWall: cavityWall,
    M: M, laserLine: laserLine, makeLevel: makeLevel, makeScrew: makeScrew, particles: particles,
    ex: exRef,
  };
  var S = def(ctx);
  var CH = S.CH;
  var floorY = S.floorY == null ? -1.25 : S.floorY;
  var floor = new T.Mesh(new T.PlaneGeometry(30, 30), new T.ShadowMaterial({ opacity: .35 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = floorY; floor.receiveShadow = true; scene.add(floor);
  if (S.shadowBox) { var s = S.shadowBox; sc.left = -s; sc.right = s; sc.top = s; sc.bottom = -s; sc.updateProjectionMatrix(); }

  /* ---------- camera ---------- */
  var KEYS = S.keys;
  var EXK = S.exKey;
  var user = { yaw: 0, pitch: 0, zoom: 1, tyaw: 0, tpitch: 0, tzoom: 1 };
  var look = new T.Vector3();
  function camKey(t) {
    for (var i = 0; i < KEYS.length - 1; i++) {
      var a = KEYS[i], b = KEYS[i + 1];
      if (t <= b[0]) { var k = ss(cl((t - a[0]) / (b[0] - a[0]))); return a.map(function (v, j) { return j === 0 ? t : v + (b[j] - v) * k; }); }
    }
    return KEYS[KEYS.length - 1].slice();
  }
  var narrow = false, idle = 0, clock = 0;
  function placeCam(t) {
    user.yaw += (user.tyaw - user.yaw) * 0.12; user.pitch += (user.tpitch - user.pitch) * 0.12; user.zoom += (user.tzoom - user.zoom) * 0.12;
    var k = camKey(t), e = ss(exRef.v);
    var c = k.map(function (v, j) { return j === 0 ? v : v + (EXK[j] - v) * e; });
    var ang = c[1] + user.yaw + 0.05 * Math.sin(clock * 0.25) * (1 - e);
    var dist = c[2] * user.zoom * (narrow ? (W / H < 1 ? 1.5 : 1.15) : 1);
    var py = c[3] + user.pitch;
    cam.position.set(Math.sin(ang) * dist + c[4], py, Math.cos(ang) * dist + c[6]);
    look.set(c[4], c[5], c[6]);
    cam.lookAt(look); cam.updateMatrixWorld();
  }

  /* ---------- tags ---------- */
  var tmp = new T.Vector3(), pv = new T.Vector3();
  var tagEls = [];
  function mkTag(txt) { txt = (opts.labels && opts.labels[txt]) || txt; var el = document.createElement('div'); el.className = 'tag'; el.innerHTML = '<i></i><em></em><span>' + txt + '</span>'; opts.tags.appendChild(el); tagEls.push(el); return el; }
  var LABELED = S.labeled || [];
  var FOCUS = S.focus || [];
  LABELED.forEach(function (o) { o.userData.tag = mkTag(o.userData.name); });
  var EXTRA = (S.extraTags || []).map(function (x) { x.el = mkTag(x.n); return x; });
  function putTag(el, wp, show) {
    el.classList.toggle('show', !!show); if (!show) return;
    pv.copy(wp).project(cam); if (pv.z > 1) { el.classList.remove('show'); return; }
    var x = (pv.x * .5 + .5) * W, y = (-pv.y * .5 + .5) * H, left = x > W * 0.62;
    el.classList.toggle('left', left);
    el.style.transform = left ? 'translate(calc(' + (x + 5) + 'px - 100%),' + (y - 14) + 'px)' : 'translate(' + (x - 5) + 'px,' + (y - 14) + 'px)';
  }
  function chapterOf(t) { return Math.min(CH - 1, Math.floor(t)); }
  function visibleDeep(o) { while (o) { if (!o.visible) return false; o = o.parent; } return true; }
  function placeTags(t) {
    var ch = chapterOf(t), within = t - ch, exOn = exRef.v > .6;
    LABELED.forEach(function (o) {
      var show = visibleDeep(o) && (exOn || (within > .5 && (FOCUS[ch] || []).indexOf(o) > -1));
      putTag(o.userData.tag, o.localToWorld(tmp.copy(o.userData.anchor)), show);
    });
    EXTRA.forEach(function (x) {
      var p = x.pos(tmp); var show = p && x.show(ch, within, exOn, narrow);
      putTag(x.el, p || tmp, show);
    });
  }

  /* ---------- interaction ---------- */
  var drag = null;
  host.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; drag = { x: e.clientX, y: e.clientY, yaw: user.tyaw, pitch: user.tpitch }; host.setPointerCapture(e.pointerId); host.classList.add('grabbing'); idle = 0; if (opts.onInteract) opts.onInteract(); });
  host.addEventListener('pointermove', function (e) { if (!drag) return; user.tyaw = drag.yaw - (e.clientX - drag.x) * 0.008; user.tpitch = Math.max(-1.4, Math.min(2.2, drag.pitch + (e.clientY - drag.y) * 0.006)); });
  function endDrag() { drag = null; host.classList.remove('grabbing'); }
  host.addEventListener('pointerup', endDrag); host.addEventListener('pointercancel', endDrag);

  /* ---------- render & playback ---------- */
  var W = 0, H = 0;
  function resize() { W = host.clientWidth; H = host.clientHeight; if (!W || !H) return; narrow = W < 640; renderer.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix(); }
  resize();
  var ro = null;
  if ('ResizeObserver' in window) { ro = new ResizeObserver(function () { resize(); if (!running) draw(0); }); ro.observe(host); }

  var t = CH, playing = !opts.reduce, running = false, raf = 0, last = 0, hold = 0, target = null, speed = S.speed || 1 / 4.2;
  var exTarget = 0;
  var lastCh = -1;
  function emit() { var ch = chapterOf(t); if (opts.onFrame) opts.onFrame(ch, t - ch, t); if (ch !== lastCh) { lastCh = ch; if (opts.onChapter) opts.onChapter(ch); } }
  function draw(dt) {
    exRef.v += (exTarget - exRef.v) * Math.min(1, dt * 5 || 1);
    if (Math.abs(exTarget - exRef.v) < .001) exRef.v = exTarget;
    S.apply(t, exRef.v, dt || 0);
    if (S.onTick) S.onTick(dt || 0, t, exRef.v, clock);
    placeCam(t); placeTags(t);
    renderer.render(scene, cam);
  }
  function loop(now) {
    raf = requestAnimationFrame(loop);
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016; last = now; clock += dt;
    if (target !== null) {
      var d = target - t, step = Math.max(Math.abs(d) * dt * 3.2, dt * 1.2);
      if (Math.abs(d) <= step) { t = target; target = null; } else t += Math.sign(d) * step;
    } else if (playing && exRef.v < .02) {
      if (t >= CH) { hold += dt; if (hold > 3.5) { hold = 0; t = 0; } }
      else t = Math.min(CH, t + dt * speed);
    }
    emit(); draw(dt);
  }
  var api = {
    start: function () { if (running) return; running = true; last = 0; raf = requestAnimationFrame(loop); },
    stop: function () { running = false; cancelAnimationFrame(raf); },
    play: function () { playing = true; if (t >= CH) { t = 0; } emit(); },
    pause: function () { playing = false; emit(); },
    isPlaying: function () { return playing; },
    go: function (ch) { exTarget = 0; target = null; t = ch; playing = true; hold = 0; emit(); if (!running) draw(0); },
    voorNa: function (which) { playing = false; exTarget = 0; target = which === 'voor' ? (S.voorT == null ? 0.05 : S.voorT) : CH; emit(); },
    explode: function (on) { exTarget = on ? 1 : 0; if (on) playing = false; if (!running) draw(0.2); },
    isExploded: function () { return exTarget > .5; },
    zoom: function (f) { user.tzoom = Math.max(.55, Math.min(1.6, user.tzoom * f)); },
    reset: function () { user.tyaw = 0; user.tpitch = 0; user.tzoom = 1; },
    time: function () { return t; },
    destroy: function () {
      running = false; cancelAnimationFrame(raf); if (ro) ro.disconnect();
      scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) { (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) { if (m.map) m.map.dispose(); if (m.bumpMap) m.bumpMap.dispose(); m.dispose(); }); } });
      renderer.dispose(); renderer.forceContextLoss && renderer.forceContextLoss(); if (cv.parentNode) cv.parentNode.removeChild(cv); opts.tags.innerHTML = '';
    },
    seek: function (x, e) { t = x; playing = false; target = null; if (e !== undefined) { exRef.v = exTarget = e; } emit(); draw(0); },
  };
  emit(); draw(0.016);
  if (opts.onReady) opts.onReady();
  return api;
}

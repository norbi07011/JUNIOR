// @ts-nocheck
/* Dakraam studio — inbouwen van een dakraam in een hellend pannendak. 8 stappen. */
import { createStudio } from './engine';

export function createDakraamStudio(host: any, opts: any): any {
  return createStudio(host, opts, function (c) {
    var T = c.T, V = c.V, M = c.M, cl = c.cl, eo = c.eo, eio = c.eio, eback = c.eback, box = c.box, ring = c.ring;
    var ANG = -Math.PI / 4;
    var roof = new T.Group(); roof.rotation.x = ANG; c.scene.add(roof);
    var Z = new T.Vector3(0, Math.cos(-ANG) * 0 + 0.7071, 0.7071); // local +z in world
    function part(obj, name, anchor, exZ) { obj.userData.name = name; obj.userData.anchor = anchor || V(0, 0, 0); obj.userData.exZ = exZ || 0; obj.userData.base = obj.position.clone(); roof.add(obj); return obj; }
    function lay(obj, dx, dy, dz, ex) { var b = obj.userData.base; obj.position.set(b.x + (dx || 0), b.y + (dy || 0), b.z + (dz || 0) + obj.userData.exZ * ex); }

    /* ---------- maten (lokaal: x breedte, y langs helling, z normaal) ---------- */
    var HW = 1.5, HL = 1.5;            // half width / half length
    var RAF = [-1.35, -0.45, 0.45, 1.35];
    var WW = 0.78, WL = 1.18;          // dakraam 78 × 118
    var OX = 0.45, OY = 0.66;          // sparing (tussen sporen / raveelbalken)

    /* ---------- materialen ---------- */
    var woodC = c.woodCanvas('#c89a62', 'rgba(110,70,30,');
    var timber = new T.MeshStandardMaterial({ map: c.tex(woodC, 1, 1), roughness: .75 });
    var batten = new T.MeshStandardMaterial({ map: c.tex(c.woodCanvas('#b8875a', 'rgba(90,55,25,'), 2, .2), roughness: .8 });
    var foilMat = new T.MeshStandardMaterial({ color: 0x9fb3c9, roughness: .5, side: T.DoubleSide, transparent: true, opacity: .92 });
    var woolMat = new T.MeshStandardMaterial({ color: 0xd8b24a, roughness: 1 });
    var plate = new T.MeshStandardMaterial({ color: 0xeeeae3, roughness: .9, transparent: true });
    var tileMats = [0x8a3b24, 0x7d3420, 0x95452b, 0x733019].map(function (k) { return new T.MeshStandardMaterial({ color: new T.Color(k).convertSRGBToLinear(), roughness: .8, metalness: 0, envMapIntensity: .35, transparent: true }); });
    var foam = new T.MeshStandardMaterial({ color: 0xd9dde2, roughness: .95 });
    var manchetMat = new T.MeshStandardMaterial({ color: 0x5b7fb3, roughness: .6, transparent: true, opacity: .75, side: T.DoubleSide });
    var lead = new T.MeshStandardMaterial({ color: 0x4b4f55, roughness: .5, metalness: .3 });

    /* ---------- sporen, isolatie, binnenplaat ---------- */
    var rafters = new T.Group();
    RAF.forEach(function (x) { var r = box(0.07, HL * 2, 0.17, timber); r.position.set(x, 0, -0.095); rafters.add(r); });
    part(rafters, 'Sporen', V(-1.35, 1.1, -0.01), -0.5);
    var wool = new T.Group(), woolOpen;
    for (var b = 0; b < RAF.length - 1; b++) {
      var x0 = RAF[b] + 0.035, x1 = RAF[b + 1] - 0.035, w = x1 - x0, xc = (x0 + x1) / 2;
      if (b === 1) {
        var lo = box(w, HL - OY, 0.16, woolMat); lo.position.set(xc, -(HL + OY) / 2, -0.095); wool.add(lo);
        var hi = lo.clone(); hi.position.y = (HL + OY) / 2; wool.add(hi);
        woolOpen = box(w, OY * 2, 0.16, woolMat); woolOpen.position.set(xc, 0, -0.095); wool.add(woolOpen);
      } else { var m = box(w, HL * 2, 0.16, woolMat); m.position.set(xc, 0, -0.095); wool.add(m); }
    }
    part(wool, 'Isolatie tussen de sporen', V(0.9, -0.9, -0.05), -0.75);
    var inner = new T.Group(), innerCut = [];
    [[-HW, -OX, -HL, HL], [OX, HW, -HL, HL], [-OX, OX, OY, HL], [-OX, OX, -HL, -OY]].forEach(function (a) {
      var p = box(a[1] - a[0], a[3] - a[2], 0.012, plate); p.position.set((a[0] + a[1]) / 2, (a[2] + a[3]) / 2, -0.19); inner.add(p); innerCut.push(p);
    });
    part(inner, 'Binnenafwerking', V(-1, -1.2, -0.2), -1.0);

    /* ---------- folie, tengels, panlatten ---------- */
    var foil = new T.Group(), foilOpen;
    [[-HW, -OX, -HL, HL], [OX, HW, -HL, HL], [-OX, OX, OY, HL], [-OX, OX, -HL, -OY]].forEach(function (a) {
      var p = box(a[1] - a[0], a[3] - a[2], 0.003, foilMat, false); p.position.set((a[0] + a[1]) / 2, (a[2] + a[3]) / 2, 0.002); p.receiveShadow = true; foil.add(p);
    });
    foilOpen = box(OX * 2, OY * 2, 0.003, foilMat, false); foilOpen.position.set(0, 0, 0.002); foil.add(foilOpen);
    part(foil, 'Dampopen folie', V(1.0, 0.9, 0.01), 0.25);
    var tengels = new T.Group();
    RAF.forEach(function (x) { var t = box(0.035, HL * 2, 0.022, batten); t.position.set(x, 0, 0.015); tengels.add(t); });
    part(tengels, 'Tengels', V(1.35, -0.4, 0.03), 0.45);
    var latten = new T.Group(), lattenOpen = [];
    for (var j = 0; j < 10; j++) {
      var ly = -HL + 0.12 + j * 0.31;
      var inOpen = Math.abs(ly) < OY + 0.02;
      if (inOpen) {
        var l1 = box(HW - OX, 0.04, 0.025, batten); l1.position.set(-(HW + OX) / 2, ly, 0.038); latten.add(l1);
        var l2 = l1.clone(); l2.position.x = (HW + OX) / 2; latten.add(l2);
        var l3 = box(OX * 2, 0.04, 0.025, batten); l3.position.set(0, ly, 0.038); latten.add(l3); lattenOpen.push(l3);
      } else { var l = box(HW * 2, 0.04, 0.025, batten); l.position.set(0, ly, 0.038); latten.add(l); }
    }
    part(latten, 'Panlatten', V(-1.2, 0.3, 0.05), 0.65);

    /* ---------- dakpannen ---------- */
    var tiles = new T.Group(), tilesOpen = [], tilesAll = [];
    for (var r = 0; r < 10; r++) for (var i = 0; i < 10; i++) {
      var tx = -HW + 0.15 + i * 0.3, ty = -HL + 0.2 + r * 0.31;
      var tm = box(0.29, 0.36, 0.028, tileMats[(r * 3 + i * 7) % 4]);
      tm.position.set(tx, ty, 0.072); tm.rotation.x = 0.07; tiles.add(tm); tilesAll.push(tm);
      tm.userData.home = tm.position.clone();
      if (Math.abs(tx) < 0.62 && Math.abs(ty) < 0.86) { tilesOpen.push(tm); tm.userData.k = tilesOpen.length; }
    }
    part(tiles, 'Dakpannen', V(-1.0, -1.1, 0.1), 1.0);

    /* ---------- raveelwerk ---------- */
    var raveel = new T.Group();
    [-1, 1].forEach(function (s) { var rb = box(OX * 2 - 0.07, 0.07, 0.17, timber); rb.position.set(0, s * (OY + 0.035), -0.095); raveel.add(rb); });
    part(raveel, 'Raveelwerk', V(0.3, OY + 0.07, -0.02), -0.25);

    /* ---------- dakraam ---------- */
    var win = new T.Group();
    win.add(ring(WW, WL, 0.07, 0.13, M.antra));
    var sash = new T.Group(); sash.position.z = 0.03; win.add(sash);
    sash.add(ring(WW - 0.1, WL - 0.1, 0.06, 0.07, M.antraLight));
    var gl = box(WW - 0.2, WL - 0.2, 0.01, M.glass, false); gl.position.z = 0.02; gl.renderOrder = 2; sash.add(gl);
    var rf = new T.Mesh(new T.PlaneGeometry(WW - 0.2, WL - 0.2), M.mirror); rf.position.z = 0.026; rf.renderOrder = 3; sash.add(rf);
    var topCover = box(WW + 0.02, 0.06, 0.05, M.antra); topCover.position.set(0, WL / 2 + 0.01, 0.06); win.add(topCover);
    win.position.set(0, 0, 0.03);
    part(win, 'Dakraam (HR++ glas)', V(-WW / 2, WL / 2 - 0.1, 0.1), 1.6);
    var brackets = new T.Group();
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (s) {
      var bk = new T.Group();
      var a1 = box(0.006, 0.08, 0.06, M.steel); bk.add(a1);
      var a2 = box(0.06, 0.08, 0.006, M.steel); a2.position.set(s[0] * 0.03, 0, -0.03); bk.add(a2);
      bk.position.set(s[0] * (WW / 2 + 0.003), s[1] * (WL / 2 - 0.15), 0.02); brackets.add(bk);
    });
    part(brackets, 'Montagebeugels', V(WW / 2 + 0.03, -WL / 2 + 0.15, 0.05), 1.3);
    var level = c.makeLevel(); level.rotation.z = Math.PI / 2; level.scale.setScalar(0.8); roof.add(level);

    /* ---------- isolatieframe, manchet, drainagegoot, gootstukken ---------- */
    var isoF = ring(WW + 0.1, WL + 0.1, 0.05, 0.1, foam); isoF.position.set(0, 0, -0.02);
    part(isoF, 'Isolatieframe', V(-WW / 2 - 0.05, -0.2, 0.03), -0.35);
    var manchet = ring(OX * 2 + 0.2, OY * 2 + 0.2, 0.14, 0.004, manchetMat); manchet.position.set(0, 0, -0.18);
    part(manchet, 'Dampremmende manchet', V(OX + 0.05, -0.4, -0.18), -1.25);
    var goot = box(WW + 0.34, 0.05, 0.03, M.alu); goot.position.set(0, WL / 2 + 0.2, 0.065);
    part(goot, 'Drainagegoot', V(WW / 2 + 0.15, WL / 2 + 0.2, 0.08), 0.85);
    var flash = new T.Group(), flashParts = [];
    var fBot = box(WW + 0.36, 0.26, 0.012, lead); fBot.position.set(0, -WL / 2 - 0.13, 0.095); flash.add(fBot); flashParts.push(fBot);
    var pl = box(WW + 0.36, 0.02, 0.016, lead); pl.position.set(0, -WL / 2 - 0.25, 0.1); flash.add(pl);
    [-1, 1].forEach(function (s) { var fs = box(0.09, WL + 0.1, 0.05, M.antra); fs.position.set(s * (WW / 2 + 0.06), 0, 0.09); flash.add(fs); flashParts.push(fs); });
    var fTop = box(WW + 0.22, 0.14, 0.05, M.antra); fTop.position.set(0, WL / 2 + 0.08, 0.09); flash.add(fTop); flashParts.push(fTop);
    part(flash, 'Gootstukken', V(-WW / 2 - 0.1, -WL / 2 - 0.2, 0.11), 1.4);

    /* ---------- meten ---------- */
    var laser = new T.Group(); roof.add(laser);
    var lz = [c.laserLine(WW + 0.2), c.laserLine(WW + 0.2), c.laserLine(WL + 0.2), c.laserLine(WL + 0.2)];
    lz[0].position.set(-(WW + 0.2) / 2, WL / 2 + 0.1, 0.1); lz[1].position.set(-(WW + 0.2) / 2, -WL / 2 - 0.1, 0.1);
    lz[2].rotation.z = Math.PI / 2; lz[2].position.set(-(WW + 0.2) / 2, -WL / 2 - 0.1, 0.1);
    lz[3].rotation.z = Math.PI / 2; lz[3].position.set((WW + 0.2) / 2, -WL / 2 - 0.1, 0.1);
    lz.forEach(function (l) { laser.add(l); });

    /* ---------- regen ---------- */
    var N = 620, rain = c.particles(N, 0xdcecff, 0.05, .95); rain.renderOrder = 10;
    var Xw = new T.Vector3(1, 0, 0), Yw = new T.Vector3(0, Math.cos(ANG), Math.sin(ANG)), Zw = new T.Vector3(0, -Math.sin(ANG), Math.cos(ANG));
    var surfZ = 0.1;
    function toWorld(lx, ly, lz, out) { return out.set(0, 0, 0).addScaledVector(Xw, lx).addScaledVector(Yw, ly).addScaledVector(Zw, lz); }
    var tw = new T.Vector3();
    function spawn(d, first) {
      d.lx = c.rand(-1.35, 1.35); d.ly = c.rand(-0.9, 1.45); d.mode = 0; d.h = first ? c.rand(0, 3) : c.rand(1.8, 3.2); d.side = 0;
    }
    rain.userData.data.forEach(function (d) { spawn(d, true); });
    var rainOn = 0;
    function tickRain(dt) {
      rain.visible = rainOn > 0.01; rain.material.opacity = 0.9 * rainOn; if (!rain.visible) return;
      rain.userData.data.forEach(function (d) {
        if (d.mode === 0) { d.h -= dt * 5.5; if (d.h <= 0) { d.h = 0; d.mode = 1; } }
        else {
          var onGlass = Math.abs(d.lx) < WW / 2 - 0.05 && d.ly < WL / 2 && d.ly > -WL / 2;
          if (d.mode === 1 && Math.abs(d.lx) < WW / 2 + 0.12 && d.ly > WL / 2 + 0.17 && d.ly - dt * 0.9 <= WL / 2 + 0.22) { d.mode = 2; d.side = d.lx < 0 ? -1 : 1; }
          if (d.mode === 2) { d.lx += d.side * dt * 0.7; if (Math.abs(d.lx) > WW / 2 + 0.16) d.mode = 1; }
          else d.ly -= dt * (onGlass ? 1.1 : 0.9);
          if (d.ly < -HL) spawn(d, false);
        }
        var lzv = d.mode === 0 ? 0 : (Math.abs(d.lx) < WW / 2 && Math.abs(d.ly) < WL / 2 ? 0.16 : surfZ);
        toWorld(d.lx, d.ly, lzv, tw);
        d.x = tw.x; d.y = tw.y + d.h; d.z = tw.z;
      });
      rain.userData.sync();
    }

    /* ---------- tijdlijn (8 stappen) ---------- */
    function apply(t, ex) {
      function P(a, b) { return cl((t - a) / (b - a)); }
      // 0 · positie bepalen en inmeten
      var m = eo(P(0.15, 0.7));
      lz.forEach(function (l, i) { l.scale.x = Math.max(.001, cl(m * 4 - i)); });
      laser.visible = t > 0.1 && t < 1.25 && ex < .5; M.laser.opacity = 1 - P(1.05, 1.25);
      // 1 · pannen verwijderen (en 7 · terugleggen)
      var back = P(7.05, 7.55);
      tilesOpen.forEach(function (tm, i) {
        var a = 1.05 + i * 0.03, p = eio(P(a, a + 0.35));
        var keep = Math.abs(tm.userData.home.x) > WW / 2 + 0.15 || Math.abs(tm.userData.home.y) > WL / 2 + 0.25; // tiles that come back around the flashing
        var b2 = keep ? eio(cl(back * 1.6 - i * 0.03)) : 0;
        var off = p * (1 - b2);
        tm.visible = off < 0.98 || ex > .01;
        tm.position.set(tm.userData.home.x + off * 1.6 * (tm.userData.home.x >= 0 ? 1 : -1), tm.userData.home.y + off * 0.4, tm.userData.home.z + off * 0.9);
        tm.rotation.set(0.07 + off * 0.8, off * 0.5, 0);
        if (!keep && t >= 2) tm.visible = false;
      });
      // 2 · panlatten en folie insnijden, isolatie uit de sparing
      var c2 = eio(P(2.1, 2.5)), f2 = eio(P(2.45, 2.85)), w2 = eio(P(2.6, 2.95));
      lattenOpen.forEach(function (l) { l.visible = c2 < 0.98; l.scale.x = Math.max(.001, 1 - c2); });
      foilOpen.visible = f2 < 0.98; foilOpen.scale.set(1, Math.max(.001, 1 - f2), 1); foilOpen.position.y = OY * f2;
      woolOpen.visible = w2 < 0.98; woolOpen.position.z = -0.095 - 0.6 * w2;
      // 3 · raveelwerk
      var r3 = eio(P(3.05, 3.55)); raveel.visible = t >= 3.05; lay(raveel, 0, 0, -0.7 * (1 - r3), ex);
      // 4 · beugels + dakraam plaatsen
      brackets.visible = t >= 4.0; brackets.scale.setScalar(Math.max(.001, eback(P(4.0, 4.2)))); lay(brackets, 0, 0, 0, ex);
      var w4 = eio(P(4.15, 4.7)); win.visible = t >= 4.15; lay(win, 0, 0.2 * (1 - w4), 1.4 * (1 - w4), ex);
      win.rotation.set(0.25 * (1 - w4), -0.3 * (1 - w4), 0);
      level.visible = t >= 4.7 && t < 5.05 && ex < .5; level.position.set(WW / 2 - 0.12, 0, 0.13 + 0.25 * (1 - eo(P(4.7, 4.85))) + 0.3 * P(4.95, 5.05));
      var bp = P(4.75, 4.95); level.userData.bubble.position.x = bp <= 0 ? -0.022 : -0.022 * Math.exp(-4 * bp) * Math.cos(bp * 13) * (1 - bp);
      // 5 · isolatieframe, manchet, drainagegoot
      var i5 = eio(P(5.05, 5.4)), m5 = eio(P(5.35, 5.7)), g5 = eio(P(5.65, 5.95));
      isoF.visible = t >= 5.05; lay(isoF, 0, 0, 0.6 * (1 - i5), ex);
      manchet.visible = t >= 5.35; lay(manchet, 0, 0, -0.6 * (1 - m5), ex); manchet.scale.setScalar(0.6 + 0.4 * m5);
      goot.visible = t >= 5.65; lay(goot, 0, 0.3 * (1 - g5), 0.4 * (1 - g5), ex);
      // 6 · gootstukken
      flashParts.forEach(function (f, i) { var a = 6.05 + i * 0.18, p = eio(P(a, a + 0.35)); f.visible = t >= a; f.position.z = (f === fBot ? 0.095 : 0.09) + 0.5 * (1 - p); });
      pl.visible = t >= 6.05; flash.visible = t >= 6.05; lay(flash, 0, 0, 0, ex);
      // 7 · pannen terug + regentest
      rainOn = t >= 7.3 && ex < .5 ? Math.min(1, (t - 7.3) * 4) : 0;
      // layers that sit in front of the build-up (explode)
      [rafters, wool, inner, foil, tengels, latten, tiles].forEach(function (o) { lay(o, 0, 0, 0, ex); });
      var o = 1 - 0.85 * ex;
      tileMats.forEach(function (mt) { mt.opacity = o; mt.depthWrite = o > .95; });
      var inside = cl((t - 3.3) / 0.3) * (1 - cl((t - 6.0) / 0.3));
      plate.opacity = (1 - 0.7 * ex) * (1 - 0.65 * inside); plate.depthWrite = plate.opacity > .95;
    }

    return {
      CH: 8,
      floorY: -1.7,
      shadowBox: 3,
      voorT: 0.03,
      apply: apply,
      onTick: function (dt) { tickRain(dt); },
      keys: [
        [0.0, 0.35, 6.4, 2.6, 0, 0.0, 0.0],
        [0.9, 0.25, 5.4, 2.2, 0, 0.0, 0.0],
        [1.9, 0.5, 4.8, 2.3, 0, 0.0, 0.0],
        [2.9, 0.45, 4.6, 1.6, 0, -0.1, 0.0],
        [3.6, 2.7, 4.6, -1.3, 0, -0.2, 0.0],
        [4.6, 0.55, 5.0, 2.0, 0, 0.0, 0.0],
        [5.5, 0.95, 4.4, 1.9, 0, 0.0, 0.0],
        [6.6, 0.4, 4.4, 1.9, 0, -0.1, 0.0],
        [7.4, 0.3, 5.6, 2.5, 0, -0.1, 0.0],
        [8.0, 0.35, 6.4, 2.7, 0, 0.0, 0.0],
      ],
      exKey: [0, 0.9, 7.8, 3.0, 0, 0.0, 0.2],
      labeled: [tiles, latten, tengels, foil, rafters, wool, raveel, brackets, win, isoF, manchet, goot, flash],
      focus: [[], [tiles], [latten, foil, wool], [raveel, rafters], [brackets, win], [isoF, manchet, goot], [flash], [tiles]],
      extraTags: [
        { n: '780 × 1180 mm', pos: function (v) { return roof.localToWorld(v.set(0, WL / 2 + 0.12, 0.12)); }, show: function (ch, w, exOn) { return laser.visible && !exOn && w > 0.5; } },
        { n: 'Water wordt langs het raam geleid', pos: function (v) { return roof.localToWorld(v.set(WW / 2 + 0.2, WL / 2 + 0.25, 0.12)); }, show: function (ch, w, exOn) { return !exOn && ch === 7 && w > 0.45; } },
      ],
    };
  });
}

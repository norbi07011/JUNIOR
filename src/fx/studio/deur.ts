// @ts-nocheck
/* Voordeur studio — vervangen van een voordeur met meerpuntsluiting (SKG-keurmerk). 8 stappen. */
import { createStudio } from './engine';

export function createDeurStudio(host: any, opts: any): any {
  return createStudio(host, opts, function (c) {
    var T = c.T, V = c.V, M = c.M, cl = c.cl, eo = c.eo, eio = c.eio, eback = c.eback, place = c.place, comp = c.comp, box = c.box, ring = c.ring, bead = c.bead;

    /* ---------- maten ---------- */
    var YB = -1.25, OW = 1.05, OH = 2.3, oy = YB + OH / 2, WX = 1.3, YT = 1.45;
    var FW = OW - 0.02, FH = OH - 0.02, FP = 0.07, FD = 0.12, FZ = -0.08, FY0 = YB + 0.01;
    var DW = FW - 2 * FP - 0.008, DH = FH - FP - 0.06, DT = 0.07;

    var wall = c.cavityWall({ OW: OW, OH: OH, oy: oy, WX: WX, YB: YB, YT: YT, tone: 'yellow' });
    var latei = box(OW + 0.4, 0.16, 0.008, M.steelDark); latei.position.set(0, oy + OH / 2 + 0.08, -0.104); wall.group.add(latei);
    var stoep = box(2.8, 0.06, 1.2, new T.MeshStandardMaterial({ color: new T.Color(0x6e7178).convertSRGBToLinear(), roughness: .9 })); stoep.position.set(0, YB - 0.03, 0.6); c.scene.add(stoep);
    var hal = box(2.8, 0.04, 1.2, new T.MeshStandardMaterial({ map: c.tex(c.tileCanvas(), 3, 1.3), roughness: .5 })); hal.position.set(0, YB - 0.02, -0.95); c.scene.add(hal);

    /* ---------- materialen ---------- */
    var oldWood = new T.MeshStandardMaterial({ map: c.tex(c.woodCanvas('#6e4a2c', 'rgba(30,18,8,'), 1, 1), roughness: .7 });
    var oldPaint = new T.MeshStandardMaterial({ color: new T.Color(0x2f4a3a).convertSRGBToLinear(), roughness: .55 });
    var doorMat = new T.MeshStandardMaterial({ color: new T.Color(0x1f2a3a).convertSRGBToLinear(), roughness: .38, metalness: .1, envMapIntensity: 1 });
    var doorEdge = new T.MeshStandardMaterial({ color: new T.Color(0x151b25).convertSRGBToLinear(), roughness: .5 });
    var core = new T.MeshStandardMaterial({ color: 0xe9e3d0, roughness: .95 });
    var brass = new T.MeshStandardMaterial({ color: 0xc9cdd1, metalness: .95, roughness: .22 });
    var redGlow = new T.MeshBasicMaterial({ color: 0xff4040, transparent: true, opacity: .0 });

    /* ---------- oude deur ---------- */
    var oldFrame = ring(OW - 0.01, OH + 0.04, 0.09, 0.11, oldWood); oldFrame.position.y = 0.02;
    comp(oldFrame, V(0, oy - 0.02, -0.06), V(0, 0, 0.8), 'Oud houten kozijn', V(-OW / 2 + 0.05, OH / 2 - 0.1, 0.06));
    var oldDoor = new T.Group();
    var od = box(DW, DH, 0.05, oldPaint); od.position.set(DW / 2, 0, 0); oldDoor.add(od);
    var ogl = box(DW * 0.55, DH * 0.18, 0.052, new T.MeshPhysicalMaterial({ color: 0xb6c9a8, roughness: .1, transparent: true, opacity: .35, depthWrite: false }), false); ogl.position.set(DW / 2, DH * 0.3, 0); oldDoor.add(ogl);
    var oknob = new T.Mesh(new T.SphereGeometry(0.03, 16, 12), brass); oknob.position.set(DW - 0.08, -0.05, 0.04); oldDoor.add(oknob);
    comp(oldDoor, V(-DW / 2, oy - 0.02, -0.05), V(0, 0, 0.4), 'Oude voordeur', V(DW / 2, 0.6, 0.03));

    /* ---------- meten ---------- */
    var laser = new T.Group(); c.scene.add(laser);
    var lzW = c.laserLine(OW); lzW.position.set(-OW / 2, oy + 0.4, 0.04); laser.add(lzW);
    var lzH = c.laserLine(OH); lzH.rotation.z = Math.PI / 2; lzH.position.set(0.2, YB, 0.04); laser.add(lzH);
    var dg = Math.sqrt(OW * OW + OH * OH), ang = Math.atan2(OH, OW);
    var lzD = c.laserLine(dg); lzD.rotation.z = ang; lzD.position.set(-OW / 2, YB, 0.045); laser.add(lzD);

    /* ---------- dorpel + kozijn ---------- */
    var epdm = comp(box(OW + 0.1, 0.004, 0.26, M.epdm), V(0, YB + 0.002, -0.09), V(0, -0.12, 0.6), 'EPDM waterkering', V(-0.4, 0, 0.12));
    var dorpel = comp(box(FW, 0.04, FD + 0.06, new T.MeshStandardMaterial({ color: new T.Color(0x2b2e33).convertSRGBToLinear(), roughness: .4 })), V(0, YB + 0.02, FZ + 0.02), V(0, -0.1, 0.85), 'Kunststof onderdorpel', V(0.3, 0.02, 0.1));
    var frame = new T.Group();
    var fT = box(FW, FP, FD, M.antra); fT.position.y = FH - FP / 2; frame.add(fT);
    var fL = box(FP, FH, FD, M.antra); fL.position.set(-FW / 2 + FP / 2, FH / 2, 0); frame.add(fL);
    var jambMat = M.antra.clone(); jambMat.transparent = true;
    var fR = box(FP, FH, FD, jambMat); fR.position.set(FW / 2 - FP / 2, FH / 2, 0); frame.add(fR);
    // sluitkommen in het kozijn (scharnierzijde links, sluitzijde rechts)
    var keeps = [];
    [0.45, 0.95, 1.45, 1.95].forEach(function (y) { var k = box(0.012, 0.09, 0.03, M.steel); k.position.set(FW / 2 - FP - 0.003, y, 0.015); frame.add(k); keeps.push(k); });
    comp(frame, V(0, FY0, FZ), V(0, 0, 1.0), 'Kunststof deurkozijn', V(-FW / 2, FH - 0.1, FD / 2));
    var screws = [];
    [-1, 1].forEach(function (sx) {
      [0.3, 1.1, 1.9].forEach(function (y) {
        var s = c.makeScrew(); s.children[1].position.x = sx * 0.08; s.userData.sx = sx;
        comp(s, V(sx * (FW / 2 - FP), FY0 + y, FZ), V(sx * 0.32, 0, 1.0), 'Kozijnschroeven', V(0, 0, 0));
        screws.push(s);
      });
    });
    var level = c.makeLevel(); level.rotation.z = Math.PI / 2; c.scene.add(level);

    /* ---------- nieuwe deur (scharnierend, links) ---------- */
    var doorPivot = new T.Group();
    var door = new T.Group(); door.position.x = DW / 2; doorPivot.add(door);
    door.add(box(DW, DH, DT, doorMat));
    // groeven + glasstrook
    [-0.3, 0.3].forEach(function (y) { var g = box(DW - 0.12, 0.012, 0.004, doorEdge); g.position.set(0, y, DT / 2 + 0.001); door.add(g); });
    var dglass = box(0.12, DH - 0.5, 0.004, M.glass, false); dglass.position.set(-DW / 2 + 0.16, 0.05, DT / 2 + 0.002); dglass.renderOrder = 2; door.add(dglass);
    // binnenkern (zichtbaar in opengewerkt)
    var coreM = box(DW - 0.06, DH - 0.06, DT - 0.03, core); door.add(coreM); coreM.visible = false;
    // greep buiten (staaf) en kruk binnen
    var bar = box(0.03, 0.75, 0.03, brass); bar.position.set(DW / 2 - 0.12, 0.05, DT / 2 + 0.06); door.add(bar);
    [-0.3, 0.4].forEach(function (y) { var p = box(0.02, 0.02, 0.06, brass); p.position.set(DW / 2 - 0.12, y, DT / 2 + 0.03); door.add(p); });
    var lever = new T.Group(); var lv = box(0.14, 0.022, 0.022, brass); lv.position.x = -0.07; lever.add(lv);
    lever.position.set(DW / 2 - 0.08, -0.05, -DT / 2 - 0.035); door.add(lever);
    var cyl = new T.Mesh(new T.CylinderGeometry(0.014, 0.014, DT + 0.02, 16), brass); cyl.rotation.x = Math.PI / 2; cyl.position.set(DW / 2 - 0.08, -0.15, 0); door.add(cyl);
    // scharnieren
    var hinges = [];
    [-0.85, 0.0, 0.85].forEach(function (y) { var h = box(0.02, 0.12, 0.03, M.steel); h.position.set(-DW / 2 - 0.01, y, -DT / 2 + 0.01); door.add(h); hinges.push(h); });
    // meerpuntsluiting: haken/pennen op de sluitzijde
    var bolts = [];
    [0.45, 0.95, 1.45, 1.95].forEach(function (y) {
      var b = new T.Mesh(new T.CylinderGeometry(0.012, 0.012, 0.05, 14), M.steel); b.rotation.z = Math.PI / 2;
      b.position.set(DW / 2 - 0.01, y - (DH / 2 + 0.03), 0.015); door.add(b); bolts.push(b);
    });
    var glowRing = [];
    bolts.forEach(function (b) { var g = new T.Mesh(new T.SphereGeometry(0.03, 14, 10), new T.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0, depthWrite: false })); g.position.copy(b.position); g.position.x += 0.03; door.add(g); glowRing.push(g); });
    var lockBar = box(0.016, DH - 0.3, 0.012, M.steelDark); lockBar.position.set(DW / 2 - 0.015, 0, 0.015); door.add(lockBar); lockBar.visible = false;
    comp(doorPivot, V(-DW / 2, FY0 + 0.03 + DH / 2, FZ + 0.005), V(0, 0, 0.45), 'Geïsoleerde voordeur', V(DW / 2, 0.75, DT / 2));

    /* ---------- inbraakpoging (ongeveer: koevoet) ---------- */
    var crowbar = new T.Group();
    var cb1 = box(0.02, 0.6, 0.02, new T.MeshStandardMaterial({ color: 0xb91c1c, roughness: .5, metalness: .4 })); crowbar.add(cb1);
    var cb2 = box(0.02, 0.08, 0.02, cb1.material); cb2.position.set(0.02, -0.33, 0.02); cb2.rotation.z = 0.8; crowbar.add(cb2);
    c.scene.add(crowbar);

    /* ---------- afwerking ---------- */
    var kits = [], kitG = new T.Group();
    var k1 = bead(OH, 0.0075, M.kit); k1.position.set(-OW / 2 + 0.005, YB, 0); kitG.add(k1); kits.push(k1);
    var k2 = bead(OW, 0.0075, M.kit); k2.rotation.z = -Math.PI / 2; k2.position.set(-OW / 2, YB + OH - 0.004, 0); kitG.add(k2); kits.push(k2);
    var k3 = bead(OH, 0.0075, M.kit); k3.rotation.z = Math.PI; k3.position.set(OW / 2 - 0.005, YB + OH, 0); kitG.add(k3); kits.push(k3);
    comp(kitG, V(0, 0, -0.027), V(0, 0, 1.3), 'Kitvoeg buiten', V(-OW / 2, 0.3, 0));
    var dag = new T.Group();
    var dL = box(0.012, OH, 0.2, M.white); dL.position.set(-OW / 2 + 0.006, oy, 0); dag.add(dL);
    var dR = dL.clone(); dR.position.x = OW / 2 - 0.006; dag.add(dR);
    var dTp = box(OW, 0.012, 0.2, M.white); dTp.position.set(0, oy + OH / 2 - 0.006, 0); dag.add(dTp);
    comp(dag, V(0, 0, -0.235), V(0, 0, -1.5), 'Dagkantafwerking', V(OW / 2, 0.3, -0.1));

    /* ---------- tijdlijn (8 stappen) ---------- */
    var shakeAmt = 0;
    function apply(t, ex) {
      function P(a, b) { return cl((t - a) / (b - a)); }
      // 0 · oude deur + kozijn eruit
      var o1 = eio(P(0.1, 0.5)), o2 = eio(P(0.5, 0.95));
      oldDoor.visible = t < 0.55 || (ex > .01 && t < 1); place(oldDoor, 0.2 * o1, 0, 1.0 * o1); oldDoor.rotation.y = -1.4 * o1;
      oldFrame.visible = t < 1; place(oldFrame, 0, 0.2 * o2, 1.3 * o2); oldFrame.rotation.x = -0.2 * o2;
      // 1 · inmeten
      var m = eo(P(1.1, 1.8)); lzW.scale.x = Math.max(.001, cl(m * 3)); lzH.scale.x = Math.max(.001, cl(m * 3 - 1)); lzD.scale.x = Math.max(.001, cl(m * 3 - 2));
      laser.visible = t > 1.05 && t < 2.15 && ex < .5; M.laser.opacity = 1 - P(1.95, 2.15);
      // 2 · waterkering + dorpel
      epdm.visible = t >= 2.05; epdm.scale.set(Math.max(.001, eo(P(2.05, 2.35))), 1, 1); place(epdm);
      var d2 = eio(P(2.3, 2.75)); dorpel.visible = t >= 2.3; place(dorpel, 0, 0.5 * (1 - d2), 0.4 * (1 - d2));
      // 3 · kozijn stellen en verankeren
      var f3 = eio(P(3.05, 3.5)); frame.visible = t >= 3.05; place(frame, 0, 0.3 * (1 - f3), 1.6 * (1 - f3)); frame.rotation.set(0.06 * (1 - f3), -0.35 * (1 - f3), 0);
      level.visible = t >= 3.5 && t < 3.95 && ex < .5; level.position.set(-FW / 2 + FP + 0.02, oy, FZ + FD / 2 + 0.03 + 0.25 * (1 - eo(P(3.5, 3.65))) + 0.3 * P(3.85, 3.95));
      var bp = P(3.55, 3.85); level.userData.bubble.position.x = bp <= 0 ? -0.022 : -0.022 * Math.exp(-4 * bp) * Math.cos(bp * 13) * (1 - bp);
      screws.forEach(function (s, i) { var a = 3.6 + i * 0.05, p = eo(P(a, a + 0.25)); s.visible = t >= a; place(s, -s.userData.sx * 0.16 * (1 - p)); s.rotation.x = p * 14; });
      // 4 · deur afhangen
      var d4 = eio(P(4.05, 4.6)); doorPivot.visible = t >= 4.05;
      // 5 · meerpuntsluiting: deur dicht, kruk omhoog, pennen schuiven uit
      var close = eio(P(5.05, 5.3));
      var lift = eio(P(5.35, 5.5)), key = eio(P(5.5, 5.6));
      // door swings open after hanging (4.6–4.85), stays open, then closes (5.05–5.3)
      var openSwing = t < 4.6 ? 0 : t < 5.05 ? eio(P(4.6, 4.85)) : 1 - close;
      // 7 · na oplevering: deur opent nog even voor de binnenkant
      var fin = eio(P(7.55, 7.8)) - eio(P(7.85, 8.0));
      place(doorPivot, 0.25 * (1 - d4), 0.2 * (1 - d4), 1.4 * (1 - d4) + shakeAmt * 0.004);
      doorPivot.rotation.y = -1.2 * (openSwing + fin * 0.8) - 0.4 * (1 - d4);
      lever.rotation.z = 0.6 * (lift - eio(P(7.5, 7.55)));
      var boltOut = lift * (1 - eio(P(7.5, 7.55)));
      bolts.forEach(function (b, i) { var a = 5.36 + i * 0.03, p = eo(P(a, a + 0.12)) * boltOut; b.position.x = DW / 2 - 0.01 + 0.028 * p; });
      glowRing.forEach(function (g, i) { var a = 5.4 + i * 0.03, p = P(a, a + 0.1); g.material.opacity = (p > 0 && t < 6.1) ? 0.55 * Math.max(0, 1 - Math.abs(p - 0.6) * 1.5) + 0.25 * P(5.6, 5.7) * (1 - P(5.95, 6.1)) : 0; });
      lockBar.visible = ex > .3 || (t >= 5.3 && t < 6.05);
      // 6 · inbraakwerendheid (SKG): koevoet probeert, deur houdt
      var cbIn = eio(P(6.05, 6.3)), cbOut = eio(P(6.75, 6.95));
      crowbar.visible = t >= 6.05 && t < 6.95 && ex < .5;
      var pry = (t >= 6.3 && t < 6.75) ? Math.sin((t - 6.3) * 60) * 0.5 + 0.5 : 0;
      shakeAmt = pry;
      crowbar.position.set(doorPivot.position.x + DW - 0.015 + 0.4 * (1 - cbIn) + 0.4 * cbOut, FY0 + 1.0, FZ + DT / 2 + 0.04 + 0.4 * (1 - cbIn) + 0.4 * cbOut);
      crowbar.rotation.set(0, -0.4 - 0.15 * pry, -0.25 - 0.08 * pry);
      glowRing.forEach(function (g) { if (t >= 6.3 && t < 6.75) g.material.opacity = 0.5 + 0.4 * pry; });
      // 7 · afkitten en afwerken
      var kp = P(7.05, 7.35) * 3;
      kits.forEach(function (k, i) { var v = cl(kp - i); k.visible = v > 0; k.scale.y = Math.max(.001, v); });
      kitG.visible = t >= 7.05; place(kitG);
      var d7 = eio(P(7.3, 7.5)); dag.visible = t >= 7.3; place(dag, 0, 0, -0.4 * (1 - d7));
      // x-ray on the lock side while the bolts engage
      var xr = cl((t - 5.25) / 0.12) * (1 - cl((t - 6.0) / 0.1));
      jambMat.opacity = 1 - 0.8 * Math.max(xr, ex); jambMat.depthWrite = jambMat.opacity > .95;
      keeps.forEach(function (k) { k.material = xr > .1 ? M.blue : M.steel; });
      // opengewerkt: kern zichtbaar, wand transparant
      coreM.visible = ex > .3; doorMat.transparent = ex > .01; doorMat.opacity = 1 - 0.75 * ex; doorMat.depthWrite = ex < .5;
      var o = 1 - 0.9 * Math.max(ex, xr * 0.95);
      wall.cutaway.forEach(function (mm) { mm.material.forEach(function (mt) { mt.opacity = o; mt.depthWrite = o > .95; }); mm.castShadow = o > .5; });
    }

    return {
      CH: 8,
      floorY: YB,
      shadowBox: 2.6,
      voorT: 0.03,
      apply: apply,
      keys: [
        [0.0, 0.4, 6.4, 0.9, 0, -0.1, -0.1],
        [0.9, 0.35, 5.6, 0.5, 0, -0.1, -0.1],
        [1.9, 0.5, 5.8, 0.4, 0, -0.1, -0.1],
        [2.8, 0.55, 3.4, -0.5, 0, -1.0, -0.1],
        [3.9, 0.55, 5.6, 0.4, 0, -0.1, -0.1],
        [4.9, 0.7, 5.4, 0.3, 0, -0.1, -0.1],
        [5.25, 1.0, 3.6, 0.3, 0.35, -0.05, -0.1],
        [5.9, 1.25, 2.7, 0.25, 0.45, -0.05, -0.08],
        [6.2, 0.75, 3.6, 0.1, 0.35, -0.2, 0.0],
        [6.95, 0.55, 4.0, 0.2, 0.3, -0.2, 0.0],
        [7.6, 2.4, 5.4, 0.4, 0, -0.1, -0.2],
        [8.0, 0.45, 6.4, 0.9, 0, -0.1, -0.1],
      ],
      exKey: [0, 0.9, 7.0, 1.6, 0, -0.1, -0.2],
      labeled: [oldDoor, oldFrame, epdm, dorpel, frame, screws[1], doorPivot, kitG, dag],
      focus: [[oldDoor, oldFrame], [], [epdm, dorpel], [frame, screws[1]], [doorPivot], [], [], [kitG, dag]],
      extraTags: [
        { n: '1050 × 2300 mm', pos: function (v) { return v.set(-0.1, oy + 0.45, 0.05); }, show: function (ch, w, exOn) { return laser.visible && !exOn && ch === 1 && w > 0.5; } },
        { n: 'Meerpuntsluiting (4 pennen)', pos: function (v) { return door.localToWorld(v.set(DW / 2, 0.3, 0)); }, show: function (ch, w, exOn) { return (exOn || (ch === 5 && w > 0.35)); } },
        { n: 'Sluitkommen in het kozijn', pos: function (v) { return frame.localToWorld(v.set(FW / 2 - FP, 0.45, 0)); }, show: function (ch, w, exOn) { return !exOn && ch === 5 && w > 0.7; } },
        { n: 'SKG ★★ — houdt stand', pos: function (v) { return v.set(crowbar.position.x, crowbar.position.y + 0.35, crowbar.position.z); }, show: function (ch, w, exOn) { return !exOn && ch === 6 && w > 0.25 && w < 0.8; } },
        { n: 'Geïsoleerde kern', pos: function (v) { return door.localToWorld(v.set(0, -0.4, 0)); }, show: function (ch, w, exOn) { return exOn; } },
        { n: 'Veiligheidscilinder', pos: function (v) { return door.localToWorld(v.set(DW / 2 - 0.08, -0.15, 0.05)); }, show: function (ch, w, exOn) { return !exOn && ch === 5 && w > 0.55; } },
      ],
    };
  });
}

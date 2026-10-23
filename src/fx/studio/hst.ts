// @ts-nocheck
/* HST studio — vervangen van oude tuindeuren door een hefschuifpui. 8 stappen. */
import { createStudio } from './engine';

export function createHstStudio(host: any, opts: any): any {
  return createStudio(host, opts, function (c) {
    var T = c.T, V = c.V, M = c.M, cl = c.cl, eo = c.eo, eio = c.eio, eback = c.eback, place = c.place, comp = c.comp, box = c.box, ring = c.ring, bead = c.bead;

    /* ---------- maten ---------- */
    var YB = -1.25, OW = 2.6, OH = 2.2, oy = YB + OH / 2, WX = 1.9, YT = 1.45;
    var FZ = -0.12, FD = 0.17, FP = 0.075, FW = OW - 0.02, FH = OH - 0.04, FY0 = YB + 0.025;

    /* ---------- wand, latei, vloeren ---------- */
    var wall = c.cavityWall({ OW: OW, OH: OH, oy: oy, WX: WX, YB: YB, YT: YT, tone: 'grey' });
    var latei = box(OW + 0.4, 0.16, 0.008, M.steelDark); latei.position.set(0, oy + OH / 2 + 0.08, -0.104); wall.group.add(latei);
    var lateiB = box(OW + 0.4, 0.008, 0.1, M.steelDark); lateiB.position.set(0, oy + OH / 2 + 0.004, -0.05); wall.group.add(lateiB);
    var tc = c.canvas(256, 256), tg = tc.getContext('2d'); tg.fillStyle = '#2c2f34'; tg.fillRect(0, 0, 256, 256);
    for (var ti = 0; ti < 2; ti++) for (var tj = 0; tj < 2; tj++) { var tl = c.rand(30, 38); tg.fillStyle = 'hsl(220,4%,' + tl + '%)'; tg.fillRect(ti * 128 + 2, tj * 128 + 2, 124, 124); for (var tk = 0; tk < 900; tk++) { tg.fillStyle = 'rgba(0,0,0,.08)'; tg.fillRect(ti * 128 + Math.random() * 124, tj * 128 + Math.random() * 124, 2, 2); } }
    var terrace = box(4.6, 0.05, 1.6, new T.MeshStandardMaterial({ map: c.tex(tc, 4.6 / 1.2, 1.6 / 1.2), roughness: .9 })); terrace.position.set(0, YB - 0.026, 0.8); c.scene.add(terrace);
    var woodFloor = box(4.6, 0.05, 1.6, new T.MeshStandardMaterial({ map: c.tex(c.woodCanvas('#b98c5a', 'rgba(90,55,25,'), 2, 1), roughness: .6 })); woodFloor.position.set(0, YB - 0.026, -1.13); c.scene.add(woodFloor);

    /* ---------- oude tuindeuren ---------- */
    var oldWood = new T.MeshStandardMaterial({ map: c.tex(c.woodCanvas('#e7e0cf', 'rgba(110,85,60,'), 1, 1), roughness: .75 });
    var oldGlass = new T.MeshPhysicalMaterial({ color: 0xb6c9a8, roughness: .12, transparent: true, opacity: .22, depthWrite: false });
    var oldFrame = new T.Group();
    var ofT = box(OW - 0.01, 0.09, 0.11, oldWood); ofT.position.y = OH / 2 - 0.045; oldFrame.add(ofT);
    var ofL = box(0.09, OH - 0.01, 0.11, oldWood); ofL.position.x = -OW / 2 + 0.045; oldFrame.add(ofL);
    var ofR = ofL.clone(); ofR.position.x = OW / 2 - 0.045; oldFrame.add(ofR);
    comp(oldFrame, V(0, oy, -0.06), V(0, 0, 0.7), 'Oude houten tuindeuren', V(-0.9, OH / 2 - 0.1, 0.06));
    var leaves = [-1, 1].map(function (s) {
      var pivot = new T.Group();
      var leaf = new T.Group(); leaf.position.x = -s * 0.6; pivot.add(leaf);
      leaf.add(ring(1.2, OH - 0.1, 0.09, 0.055, oldWood));
      var g = box(1.03, OH - 0.28, 0.004, oldGlass, false); g.renderOrder = 2; leaf.add(g);
      var bar = box(1.03, 0.04, 0.04, oldWood); bar.position.y = -0.35; leaf.add(bar);
      comp(pivot, V(s * 1.2, oy - 0.02, -0.04), V(0, 0, 0.25), 'Oude houten tuindeuren', V(0, 0.4, 0.04));
      pivot.userData.s = s;
      return pivot;
    });

    /* ---------- meten ---------- */
    var laser = new T.Group(); c.scene.add(laser);
    var lzW = c.laserLine(OW); lzW.position.set(-OW / 2, oy - 0.3, 0.04); laser.add(lzW);
    var lzH = c.laserLine(OH); lzH.rotation.z = Math.PI / 2; lzH.position.set(0.5, YB, 0.04); laser.add(lzH);
    var lzF = c.laserLine(4.2); lzF.position.set(-2.1, YB + 0.003, -0.6); lzF.rotation.y = 0; laser.add(lzF);

    /* ---------- onderdorpel + waterkering ---------- */
    var epdm = comp(box(OW + 0.1, 0.004, 0.32, M.epdm), V(0, YB + 0.002, -0.12), V(0, -0.15, 1.1), 'EPDM waterkering', V(-1.0, 0, 0.12));
    var dorpel = new T.Group();
    var dBody = box(FW, 0.022, FD + 0.03, M.alu); dorpel.add(dBody);
    var dBreak = box(FW, 0.012, 0.02, M.blue); dBreak.position.set(0, 0.002, 0); dorpel.add(dBreak);
    var rail = box(FW - 0.16, 0.012, 0.01, M.steel); rail.position.set(0, 0.016, -0.035); dorpel.add(rail);
    var rail2 = rail.clone(); rail2.position.z = 0.035; dorpel.add(rail2);
    comp(dorpel, V(0, YB + 0.015, FZ), V(0, -0.1, 0.7), 'Drempelloze onderdorpel', V(0.7, 0.01, 0.1));
    var level = c.makeLevel(); c.scene.add(level);

    /* ---------- kozijn (boven + stijlen) ---------- */
    var frame = new T.Group();
    var fT = box(FW, FP, FD, M.antra); fT.position.y = FH - FP / 2; frame.add(fT);
    var fL = box(FP, FH, FD, M.antra); fL.position.set(-FW / 2 + FP / 2, FH / 2, 0); frame.add(fL);
    var fR = fL.clone(); fR.position.x = FW / 2 - FP / 2; frame.add(fR);
    var gL = box(0.012, FH - FP, 0.06, M.antraLight); gL.position.set(-FW / 2 + FP + 0.006, (FH - FP) / 2, 0); frame.add(gL);
    comp(frame, V(0, FY0, FZ), V(0, 0, 0.95), 'HST-kozijn (aluminium)', V(-FW / 2, FH - 0.1, FD / 2));
    var screws = [];
    [-1, 1].forEach(function (sx) {
      [0.35, 1.1, 1.85].forEach(function (y) {
        var s = c.makeScrew(); s.children[1].position.x = sx * 0.08; s.userData.sx = sx;
        comp(s, V(sx * (FW / 2 - FP), FY0 + y, FZ), V(sx * 0.4, 0, 0.95), 'Kozijnschroeven', V(0, 0, 0));
        screws.push(s);
      });
    });

    /* ---------- vleugels ---------- */
    var IW = FW - 2 * FP, SW = IW / 2 + 0.03, SH = FH - FP - 0.05, SP = 0.09;
    function sashGroup() {
      var g = new T.Group();
      g.add(ring(SW, SH, SP, 0.07, M.antra));
      var gl1 = box(SW - 2 * SP + 0.02, SH - 2 * SP + 0.02, 0.004, M.glass, false); gl1.position.z = 0.012; gl1.renderOrder = 2; g.add(gl1);
      var gl2 = gl1.clone(); gl2.position.z = -0.012; g.add(gl2);
      var rf = new T.Mesh(new T.PlaneGeometry(SW - 2 * SP, SH - 2 * SP), M.mirror); rf.position.z = 0.0145; rf.renderOrder = 3; g.add(rf);
      return g;
    }
    var xFix = IW / 4 - 0.015, zFix = FZ + 0.035, zSl = FZ - 0.035, ySash = YB + 0.03 + SH / 2;
    var fixed = comp(sashGroup(), V(xFix, ySash, zFix), V(0, 0, 0.45), 'Vast deel (HR++ glas)', V(0.3, 0.6, 0.04));
    var sliding = comp(sashGroup(), V(-xFix, ySash, zSl), V(0, 0, -0.75), 'Schuifvleugel (± 200 kg)', V(-0.2, 0.7, -0.04));
    // greep: draait 180° om de vleugel op te tillen
    var handle = new T.Group();
    var hb = box(0.035, 0.09, 0.014, M.steel); handle.add(hb);
    var hl = box(0.022, 0.3, 0.02, M.steel); hl.position.set(0, -0.14, -0.022); handle.add(hl);
    handle.position.set(-SW / 2 + 0.045, 0, -0.045); sliding.add(handle);
    // hef-indicator
    var lift = new T.Group();
    var arrow = new T.Mesh(new T.ConeGeometry(0.035, 0.07, 18), M.blueGlow); arrow.position.y = 0.06; lift.add(arrow);
    var stem = new T.Mesh(new T.CylinderGeometry(0.01, 0.01, 0.08, 10), M.blueGlow); lift.add(stem);
    lift.position.set(-SW / 2 + 0.045, -SH / 2 - 0.02, -0.07); sliding.add(lift);

    /* ---------- glaszuiger (vacuümheffer) ---------- */
    function lifter() {
      var g = new T.Group();
      g.add(box(0.62, 0.04, 0.04, M.steel));
      [-0.24, 0.24].forEach(function (x) {
        var cup = new T.Mesh(new T.CylinderGeometry(0.075, 0.075, 0.02, 28), M.rubber); cup.rotation.x = Math.PI / 2; cup.position.set(x, 0, -0.035); g.add(cup);
        var ring2 = new T.Mesh(new T.TorusGeometry(0.075, 0.006, 8, 28), M.blue); ring2.position.set(x, 0, -0.026); g.add(ring2);
      });
      var hd = box(0.04, 0.16, 0.04, M.blue); hd.position.set(0, 0.09, 0.0); g.add(hd);
      g.traverse(function (o) { if (o.isMesh) o.castShadow = true; });
      c.scene.add(g); return g;
    }
    var lifterA = lifter(), lifterB = lifter();
    lifterB.rotation.y = Math.PI;

    /* ---------- afwerking ---------- */
    var kits = [], kitG = new T.Group();
    var k1 = bead(OH, 0.0075, M.kit); k1.position.set(-OW / 2 + 0.005, YB, 0); kitG.add(k1); kits.push(k1);
    var k2 = bead(OW, 0.0075, M.kit); k2.rotation.z = -Math.PI / 2; k2.position.set(-OW / 2, YB + OH - 0.004, 0); kitG.add(k2); kits.push(k2);
    var k3 = bead(OH, 0.0075, M.kit); k3.rotation.z = Math.PI; k3.position.set(OW / 2 - 0.005, YB + OH, 0); kitG.add(k3); kits.push(k3);
    comp(kitG, V(0, 0, -0.027), V(0, 0, 1.5), 'Kitvoeg buiten', V(-OW / 2, 0.2, 0));
    var dag = new T.Group();
    var dL = box(0.012, OH, 0.2, M.white); dL.position.set(-OW / 2 + 0.006, oy, 0); dag.add(dL);
    var dR = dL.clone(); dR.position.x = OW / 2 - 0.006; dag.add(dR);
    var dT = box(OW, 0.012, 0.2, M.white); dT.position.set(0, oy + OH / 2 - 0.006, 0); dag.add(dT);
    comp(dag, V(0, 0, -0.235), V(0, 0, -1.7), 'Dagkantafwerking', V(OW / 2, 0.3, -0.1));

    /* ---------- tijdlijn (8 stappen) ---------- */
    function apply(t, ex) {
      function P(a, b) { return cl((t - a) / (b - a)); }
      // 0 · oude tuindeuren eruit
      var o1 = eio(P(0.1, 0.55)), o2 = eio(P(0.55, 0.95));
      leaves.forEach(function (lv) {
        var s = lv.userData.s; lv.visible = t < 0.6 || (ex > .01 && t < 1);
        place(lv, s * 0.2 * o1, 0, 0.9 * o1); lv.rotation.y = s * 1.3 * o1;
      });
      oldFrame.visible = t < 1;
      place(oldFrame, 0, 0.25 * o2, 1.4 * o2); oldFrame.rotation.x = -0.25 * o2;
      // 1 · inmeten
      var m1 = eo(P(1.1, 1.45)), m2 = eo(P(1.3, 1.65)), m3 = eo(P(1.5, 1.85));
      lzW.scale.x = Math.max(.001, m1); lzH.scale.x = Math.max(.001, m2); lzF.scale.x = Math.max(.001, m3);
      laser.visible = t > 1.05 && t < 2.15 && ex < .5; M.laser.opacity = 1 - P(1.95, 2.15);
      // 2 · waterkering + onderdorpel
      epdm.visible = t >= 2.08; epdm.scale.set(Math.max(.001, eo(P(2.08, 2.35))), 1, 1); place(epdm);
      var d2 = eio(P(2.3, 2.75)); dorpel.visible = t >= 2.3; place(dorpel, 0, 0.6 * (1 - d2), 0.5 * (1 - d2));
      var lv2 = P(2.75, 2.95), lvOut = P(2.95, 3.05);
      level.visible = t >= 2.75 && t < 3.05 && ex < .5;
      level.position.set(-0.6, YB + 0.05 + 0.25 * (1 - eo(lv2)) + 0.3 * lvOut, FZ);
      var bp = P(2.8, 3.0); level.userData.bubble.position.x = bp <= 0 ? -0.022 : -0.022 * Math.exp(-4 * bp) * Math.cos(bp * 13) * (1 - bp);
      // 3 · kozijn stellen + verankeren
      var f3 = eio(P(3.05, 3.55)); frame.visible = t >= 3.05;
      place(frame, 0, 0.35 * (1 - f3), 2.0 * (1 - f3)); frame.rotation.set(0.08 * (1 - f3), -0.4 * (1 - f3), 0);
      screws.forEach(function (s, i) { var a = 3.55 + i * 0.06, p = eo(P(a, a + 0.25)); s.visible = t >= a; place(s, -s.userData.sx * 0.16 * (1 - p)); s.rotation.x = p * 14; });
      // 4 · vast deel beglazen met glaszuiger
      var f4 = eio(P(4.05, 4.6)), aw = eio(P(4.65, 4.95));
      fixed.visible = t >= 4.05; place(fixed, 0.6 * (1 - f4), 0.15 * (1 - f4), 1.6 * (1 - f4));
      lifterA.visible = t >= 4.05 && t < 4.97 && ex < .5;
      lifterA.position.set(fixed.position.x, fixed.position.y + 0.1, fixed.position.z + 0.06 + 0.6 * aw); lifterA.position.y += 0.4 * aw;
      // 5 · schuifvleugel inhangen
      var f5 = eio(P(5.05, 5.65)), bw = eio(P(5.7, 5.95));
      sliding.visible = t >= 5.05;
      // 6 · hef-schuif: greep 180°, vleugel komt ± 5 mm omhoog en schuift open
      var h1 = eio(P(6.08, 6.25)), sl = eio(P(6.3, 6.85));
      // 7 · sluiten, greep terug, afkitten en afwerken
      var cls = eio(P(7.02, 7.25)), h2 = eio(P(7.27, 7.38));
      var lifted = (h1 - h2) * 0.014;
      var openX = (sl - cls) * (IW / 2 - 0.12);
      place(sliding, -0.4 * (1 - f5) + openX, 0.9 * (1 - f5) + lifted, -1.4 * (1 - f5));
      lifterB.visible = t >= 5.05 && t < 5.97 && ex < .5;
      lifterB.position.set(sliding.position.x, sliding.position.y + 0.1 + 0.4 * bw, sliding.position.z - 0.06 - 0.6 * bw);
      handle.rotation.z = Math.PI * (h1 - h2);
      lift.visible = (h1 - h2) > 0.5 && ex < .5;
      lift.position.y = -SH / 2 - 0.02 + 0.03 * Math.sin(t * 20) * 0.3;
      var kp = P(7.4, 7.7) * 3;
      kits.forEach(function (k, i) { var v = cl(kp - i); k.visible = v > 0; k.scale.y = Math.max(.001, v); });
      kitG.visible = t >= 7.4; place(kitG);
      var d7 = eio(P(7.7, 7.95)); dag.visible = t >= 7.7; place(dag, 0, 0, -0.4 * (1 - d7));
      // opengewerkt: wand transparant
      var o = 1 - 0.9 * ex;
      wall.cutaway.forEach(function (m) { m.material.forEach(function (mt) { mt.opacity = o; mt.depthWrite = o > .95; }); m.castShadow = o > .5; });
    }

    return {
      CH: 8,
      floorY: YB,
      shadowBox: 3.4,
      voorT: 0.03,
      apply: apply,
      keys: [
        [0.0, 0.45, 8.6, 1.0, 0, -0.15, -0.1],
        [0.9, 0.32, 7.6, 0.6, 0, -0.2, -0.1],
        [1.9, 0.5, 7.8, 0.4, 0, -0.3, -0.1],
        [2.8, 0.55, 4.0, -0.55, 0, -1.1, -0.1],
        [3.9, 0.5, 7.4, 0.4, 0, -0.2, -0.1],
        [4.9, 0.78, 6.8, 0.3, 0.4, -0.2, -0.1],
        [5.9, 2.55, 7.0, 0.4, 0, -0.2, -0.3],
        [6.95, 2.8, 5.6, 0.0, -0.3, -0.2, -0.3],
        [7.6, 0.5, 7.4, 0.5, 0, -0.2, -0.1],
        [8.0, 0.55, 8.6, 0.9, 0, -0.15, -0.1],
      ],
      exKey: [0, 1.0, 10.2, 2.2, 0, -0.2, -0.3],
      labeled: [oldFrame, epdm, dorpel, frame, screws[1], fixed, sliding, kitG, dag],
      focus: [[oldFrame], [], [epdm, dorpel], [frame, screws[1]], [fixed], [sliding], [sliding], [kitG, dag]],
      extraTags: [
        { n: '2600 mm', pos: function (v) { return v.set(-0.2, oy - 0.3, 0.05); }, show: function (ch, w, exOn) { return laser.visible && !exOn && ch === 1 && w > 0.4; } },
        { n: '2200 mm', pos: function (v) { return v.set(0.5, oy + 0.4, 0.05); }, show: function (ch, w, exOn) { return laser.visible && !exOn && ch === 1 && w > 0.6; } },
        { n: 'Vloerpeil binnen = buiten', pos: function (v) { return v.set(-1.3, YB + 0.02, -0.6); }, show: function (ch, w, exOn) { return laser.visible && !exOn && ch === 1 && w > 0.8; } },
        { n: 'Glaszuiger', pos: function (v) { return lifterA.visible ? v.copy(lifterA.position).add(V(0, 0.2, 0)) : lifterB.visible ? v.copy(lifterB.position).add(V(0, 0.2, 0)) : null; }, show: function (ch, w, exOn) { return !exOn && (ch === 4 || ch === 5) && w > 0.2 && w < 0.85; } },
        { n: 'Greep 180° → vleugel ± 5 mm omhoog', pos: function (v) { return sliding.localToWorld(v.set(-SW / 2 + 0.045, -0.25, -0.05)); }, show: function (ch, w, exOn) { return !exOn && ch === 6 && w > 0.12; } },
        { n: 'Thermisch onderbroken', pos: function (v) { return dorpel.localToWorld(v.set(0.9, 0.01, 0.1)); }, show: function (ch, w, exOn) { return exOn || (ch === 2 && w > 0.8); } },
        { n: 'Stalen latei', pos: function (v) { return v.set(1.0, oy + OH / 2 + 0.05, -0.05); }, show: function (ch, w, exOn, narrow) { return exOn && !narrow; } },
      ],
    };
  });
}

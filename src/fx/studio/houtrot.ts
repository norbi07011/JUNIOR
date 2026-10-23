// @ts-nocheck
/* Houtrot studio — herstel van houtrot in een houten onderdorpel. 7 stappen. */
import { createStudio } from './engine';

export function createHoutrotStudio(host: any, opts: any): any {
  return createStudio(host, opts, function (c) {
    var T = c.T, V = c.V, M = c.M, cl = c.cl, eo = c.eo, eio = c.eio, eback = c.eback, box = c.box;

    /* ---------- maten ---------- */
    var YB = -1.25, OW = 1.1, OH = 1.35, oy = 0.08, WX = 1.1, YT = 1.1;
    var FL = -0.53, FR = 0.53, SB = -0.6, SM = -0.54, ST = -0.48, Z0 = -0.05, Z1 = 0.08; // onderdorpel
    var RX0 = -0.53, RX1 = -0.27;                                                       // herstelzone

    /* ---------- wand ---------- */
    var wall = c.cavityWall({ OW: OW, OH: OH, oy: oy, WX: WX, YB: YB, YT: YT, tone: 'red' });
    var lintel = box(OW + 0.2, 0.08, 0.1, c.brickMat('red', OW, 0.1)); lintel.position.set(0, oy + OH / 2 + 0.04, -0.05); wall.group.add(lintel);

    /* ---------- materialen ---------- */
    var paintC = (function () {
      var cc = c.canvas(512, 256), g = cc.getContext('2d');
      g.fillStyle = '#e6e1d4'; g.fillRect(0, 0, 512, 256);
      for (var i = 0; i < 2600; i++) { g.fillStyle = 'rgba(90,80,60,' + c.rand(.03, .09) + ')'; g.fillRect(Math.random() * 512, Math.random() * 256, c.rand(1, 4), c.rand(1, 3)); }
      g.strokeStyle = 'rgba(70,60,45,.45)'; g.lineWidth = 1.2;
      for (var j = 0; j < 40; j++) { g.beginPath(); var x = Math.random() * 512, y = Math.random() * 256; g.moveTo(x, y); for (var k = 0; k < 5; k++) { x += c.rand(-18, 18); y += c.rand(-6, 6); g.lineTo(x, y); } g.stroke(); }
      for (var p = 0; p < 18; p++) { g.fillStyle = 'rgba(150,120,80,.55)'; g.beginPath(); g.ellipse(Math.random() * 512, Math.random() * 256, c.rand(4, 14), c.rand(2, 6), c.rand(0, 3), 0, Math.PI * 2); g.fill(); }
      return cc;
    })();
    var paintOld = new T.MeshStandardMaterial({ map: c.tex(paintC, 1, 1), roughness: .7 });
    var paintNew = new T.MeshStandardMaterial({ color: new T.Color(0xf6f5f1).convertSRGBToLinear(), roughness: .22, envMapIntensity: 1.2, transparent: true, opacity: 0 });
    var rawMat = new T.MeshStandardMaterial({ map: c.tex(c.woodCanvas('#c89a62', 'rgba(110,70,30,'), 1, 1), roughness: .8 });
    var rotC = (function () {
      var cc = c.canvas(256, 128), g = cc.getContext('2d');
      g.fillStyle = '#4a3220'; g.fillRect(0, 0, 256, 128);
      for (var i = 0; i < 900; i++) { g.fillStyle = Math.random() > .5 ? 'rgba(20,12,6,.45)' : 'rgba(120,90,60,.35)'; g.fillRect(Math.random() * 256, Math.random() * 128, c.rand(2, 8), c.rand(1, 3)); }
      g.strokeStyle = 'rgba(10,6,2,.8)'; g.lineWidth = 2;
      for (var j = 0; j < 12; j++) { g.beginPath(); var x = Math.random() * 256; g.moveTo(x, 0); g.lineTo(x + c.rand(-20, 20), 128); g.stroke(); }
      for (var k = 0; k < 10; k++) { g.beginPath(); var y = Math.random() * 128; g.moveTo(0, y); g.lineTo(256, y + c.rand(-8, 8)); g.stroke(); }
      return cc;
    })();
    var rotMat = new T.MeshStandardMaterial({ map: c.tex(rotC, 1, 1), roughness: 1 });
    var fillerMat = new T.MeshStandardMaterial({ color: new T.Color(0xd9caa3).convertSRGBToLinear(), roughness: .6 });
    var primerC = new T.Color(0xd9a441).convertSRGBToLinear(), white = new T.Color(0xffffff);
    var greyC = new T.Color(0xcfd2d6).convertSRGBToLinear(), fillerC0 = new T.Color(0xd9caa3).convertSRGBToLinear(), newC = new T.Color(0xf6f5f1).convertSRGBToLinear();

    /* ---------- kozijn ---------- */
    var frame = new T.Group(); c.scene.add(frame);
    var FP = 0.09;
    var top = box(FR - FL, FP, Z1 - Z0 - 0.02, paintOld); top.position.set(0, oy + OH / 2 - FP / 2, (Z0 + Z1) / 2 - 0.01); frame.add(top);
    var stL = box(FP, OH - FP - (ST - (oy - OH / 2)), Z1 - Z0 - 0.02, paintOld); stL.position.set(FL + FP / 2, (oy + OH / 2 - FP + ST) / 2, (Z0 + Z1) / 2 - 0.01); frame.add(stL);
    var stR = stL.clone(); stR.position.x = FR - FP / 2; frame.add(stR);
    // onderdorpel = gezonde onderlaag + rechterdeel + herstelzone
    var slab = new T.Mesh(new T.BoxGeometry(FR - FL, SM - SB, Z1 - Z0), [paintOld, paintOld, rawMat, paintOld, paintOld, paintOld]);
    slab.position.set(0, (SB + SM) / 2, (Z0 + Z1) / 2); slab.castShadow = slab.receiveShadow = true; frame.add(slab);
    var upR = new T.Mesh(new T.BoxGeometry(FR - RX1, ST - SM, Z1 - Z0), [paintOld, rawMat, paintOld, paintOld, paintOld, paintOld]);
    upR.position.set((RX1 + FR) / 2, (SM + ST) / 2, (Z0 + Z1) / 2); upR.castShadow = upR.receiveShadow = true; frame.add(upR);
    // waterhol / neus
    var nose = box(FR - FL, 0.025, 0.025, paintOld); nose.position.set(0, SB + 0.012, Z1 + 0.012); frame.add(nose);
    // raam + glas
    var sash = c.ring(OW - 2 * FP - 0.02, OH - 2 * FP - (ST - (oy - OH / 2)) + 0.02, 0.06, 0.05, paintOld);
    sash.position.set(0, (oy + OH / 2 - FP + ST) / 2, (Z0 + Z1) / 2 - 0.02); frame.add(sash);
    var gl = box(OW - 2 * FP - 0.14, OH - 0.36, 0.006, M.glass, false); gl.position.set(0, (oy + OH / 2 - FP + ST) / 2, (Z0 + Z1) / 2 - 0.02); gl.renderOrder = 2; frame.add(gl);
    var roomC = c.canvas(64, 64), rg = roomC.getContext('2d'); var gg = rg.createLinearGradient(0, 0, 0, 64); gg.addColorStop(0, '#1b2433'); gg.addColorStop(1, '#3a2f26'); rg.fillStyle = gg; rg.fillRect(0, 0, 64, 64);
    var room = new T.Mesh(new T.PlaneGeometry(OW - 0.2, OH - 0.2), new T.MeshBasicMaterial({ map: c.tex(roomC, 1, 1) })); room.position.set(0, oy, -0.06); frame.add(room);
    // nieuwe verflaag (fade-in overlay)
    var newCoat = new T.Group(); frame.add(newCoat);
    [top, stL, stR, slab, upR, nose].forEach(function (m) { var o = new T.Mesh(m.geometry, paintNew); o.position.copy(m.position); o.scale.setScalar(1.004); newCoat.add(o); });
    sash.children.forEach(function (m) { var o = new T.Mesh(m.geometry, paintNew); o.position.copy(m.position).add(sash.position); o.scale.setScalar(1.004); newCoat.add(o); });

    /* ---------- houtrot, vuller ---------- */
    var RW = RX1 - RX0, RH = ST - SM, RD = Z1 - Z0;
    var rotG = new T.Group();
    var rotBlock = new T.Mesh(new T.BoxGeometry(RW, RH, RD).translate(0, RH / 2, 0), rotMat); rotBlock.castShadow = true; rotG.add(rotBlock);
    var flakes = new T.Group(); rotG.add(flakes);
    for (var f = 0; f < 9; f++) { var fl = box(c.rand(0.03, 0.07), 0.003, c.rand(0.02, 0.05), paintOld, false); fl.position.set(c.rand(-RW / 2, RW / 2), RH + 0.002, c.rand(-RD / 2, RD / 2)); fl.rotation.set(c.rand(-.4, .4), c.rand(0, 3), c.rand(-.3, .3)); flakes.add(fl); }
    c.comp(rotG, V((RX0 + RX1) / 2, SM, (Z0 + Z1) / 2), V(0, 0.35, 0.3), 'Houtrot', V(0, RH, RD / 2));
    var filler = new T.Mesh(new T.BoxGeometry(RW, RH, RD).translate(0, RH / 2, 0), fillerMat); filler.castShadow = true;
    var fillerG = new T.Group(); fillerG.add(filler);
    c.comp(fillerG, V((RX0 + RX1) / 2, SM, (Z0 + Z1) / 2), V(0, 0.3, 0.45), '2K houtrotvuller (epoxy)', V(-RW / 2 + 0.02, RH, RD / 2));
    var bulge = new T.Mesh(new T.SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), fillerMat); bulge.scale.set(RW / 2, 0.02, RD / 2); bulge.position.y = RH; fillerG.add(bulge);

    /* ---------- gereedschap ---------- */
    function handleMat(col) { return new T.MeshStandardMaterial({ color: new T.Color(col).convertSRGBToLinear(), roughness: .5 }); }
    function tool(parts) { var g = new T.Group(); parts.forEach(function (p) { g.add(p); }); g.traverse(function (o) { if (o.isMesh) o.castShadow = true; }); c.scene.add(g); return g; }
    function cyl(r, h, mat) { return new T.Mesh(new T.CylinderGeometry(r, r, h, 16), mat); }
    // priem
    var awlH = cyl(0.014, 0.1, handleMat(0x2563eb)); awlH.position.y = 0.13;
    var awlS = new T.Mesh(new T.ConeGeometry(0.004, 0.1, 10), M.steel); awlS.rotation.x = Math.PI; awlS.position.y = 0.04;
    var awl = tool([awlH, awlS]);
    // vochtmeter
    var meterBody = box(0.06, 0.11, 0.025, handleMat(0x1f2937)); meterBody.position.y = 0.09;
    var meterScreen = new T.Mesh(new T.PlaneGeometry(0.044, 0.03), new T.MeshBasicMaterial({ color: 0xef4444 })); meterScreen.position.set(0, 0.11, 0.013);
    var pins = [-0.012, 0.012].map(function (x) { var p = cyl(0.002, 0.04, M.steel); p.position.set(x, 0.018, 0); return p; });
    var meter = tool([meterBody, meterScreen].concat(pins));
    // freesmachine
    var routerBody = cyl(0.045, 0.14, handleMat(0x2563eb)); routerBody.position.y = 0.11;
    var routerBase = cyl(0.06, 0.012, handleMat(0x111827)); routerBase.position.y = 0.035;
    var routerBit = cyl(0.008, 0.035, M.steel); routerBit.position.y = 0.012;
    var router = tool([routerBody, routerBase, routerBit]);
    // plamuurmes
    var knifeBlade = box(0.09, 0.003, 0.07, M.steel); knifeBlade.position.set(0, 0, 0);
    var knifeHandle = box(0.03, 0.02, 0.1, handleMat(0x111827)); knifeHandle.position.set(0, 0.012, 0.08);
    var knife = tool([knifeBlade, knifeHandle]);
    // schuurblok
    var sandBody = box(0.12, 0.035, 0.07, handleMat(0x2563eb)); sandBody.position.y = 0.02;
    var sandPaper = box(0.12, 0.004, 0.07, new T.MeshStandardMaterial({ color: 0x8b7d6b, roughness: 1 })); sandPaper.position.y = 0.002;
    var sander = tool([sandBody, sandPaper]);
    // kwast
    var brushH = cyl(0.01, 0.14, handleMat(0x7c4a1e)); brushH.position.y = 0.13;
    var ferrule = box(0.06, 0.03, 0.018, M.steel); ferrule.position.y = 0.05;
    var bristles = box(0.056, 0.04, 0.014, new T.MeshStandardMaterial({ color: 0x2b2118, roughness: .9 })); bristles.position.y = 0.017;
    var brushTip = box(0.056, 0.012, 0.014, new T.MeshStandardMaterial({ color: 0xffffff, roughness: .3 })); brushTip.position.y = 0.0;
    var brush = tool([brushH, ferrule, bristles, brushTip]);
    [awl, meter, router, knife, sander, brush].forEach(function (x) { x.visible = false; });

    /* ---------- deeltjes ---------- */
    var chips = c.particles(160, 0x6b4a2c, 0.018, 1); chips.renderOrder = 10;
    var dust = c.particles(220, 0xe8dcc0, 0.012, .8); dust.renderOrder = 10;
    function resetP(p, kind) {
      p.userData.data.forEach(function (d) {
        d.life = 0; d.x = c.rand(RX0, RX1); d.y = ST; d.z = c.rand(Z0, Z1);
      });
    }
    resetP(chips); resetP(dust);
    var emitChips = 0, emitDust = 0, emitX = (RX0 + RX1) / 2;
    function tickP(dt) {
      [[chips, emitChips, 1.6, -3.2], [dust, emitDust, 0.25, -0.15]].forEach(function (cfg) {
        var p = cfg[0], rate = cfg[1], speed = cfg[2], grav = cfg[3], alive = 0;
        p.userData.data.forEach(function (d) {
          if (d.life <= 0) {
            if (rate > 0 && Math.random() < rate * dt * 6) {
              d.life = c.rand(0.6, 1.4); d.x = emitX + c.rand(-0.03, 0.03); d.y = ST + 0.01; d.z = c.rand(Z0, Z1);
              d.vx = c.rand(-1, 1) * speed * 0.6; d.vy = c.rand(0.4, 1) * speed; d.vz = c.rand(0.2, 1) * speed * 0.7;
            } else { d.y = -50; return; }
          }
          d.life -= dt; if (d.y < SB - 0.7) d.life = 0; d.vy += grav * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.z += d.vz * dt;
          if (p === dust) { d.vx *= 0.98; d.vz *= 0.98; }
          alive++;
        });
        p.visible = alive > 0; p.userData.sync();
      });
    }

    /* ---------- tijdlijn (7 stappen) ---------- */
    var ZONE = new T.Vector3((RX0 + RX1) / 2, ST, (Z0 + Z1) / 2);
    function apply(t, ex) {
      function P(a, b) { return cl((t - a) / (b - a)); }
      var showTools = ex < .3;
      // 0 · inspectie: priem zakt diep weg in zacht hout, vochtmeter geeft hoog
      var a0 = eio(P(0.15, 0.4)), poke = eio(P(0.42, 0.62)), out0 = eio(P(0.62, 0.75));
      awl.visible = showTools && t >= 0.15 && t < 0.78;
      awl.position.set(ZONE.x - 0.02, ST + 0.35 * (1 - a0) + 0.12 * out0 - 0.045 * poke * (1 - out0), ZONE.z + 0.01);
      awl.rotation.set(0, 0, -0.25);
      var m0 = eio(P(0.72, 0.85)), mOut = eio(P(0.95, 1.0));
      meter.visible = showTools && t >= 0.72 && t < 1.0;
      meter.position.set(ZONE.x + 0.06, ST + 0.3 * (1 - m0) + 0.3 * mOut, ZONE.z + 0.02);
      // 1 · houtrot wegfrezen
      var r1 = eio(P(1.05, 1.15)), mill = P(1.15, 1.8), rOut = eio(P(1.82, 1.95));
      router.visible = showTools && t >= 1.05 && t < 1.95;
      emitX = RX1 - (RX1 - RX0) * cl(mill) + 0.02;
      router.position.set(emitX, ST + 0.02 + 0.3 * (1 - r1) + 0.3 * rOut - 0.035 * cl(mill * 4) + 0.003 * Math.sin(t * 400), ZONE.z);
      emitChips = t >= 1.15 && t < 1.8 && ex < .3 ? 1 : 0;
      var rotLeft = 1 - cl(mill);
      rotBlock.scale.set(1, Math.max(.001, 1 - cl(mill * 1.15)), 1);
      flakes.visible = t < 1.2 || ex > .5;
      rotG.visible = t < 1.85 || ex > .5;
      if (ex > .5) rotBlock.scale.y = 1;
      c.place(rotG);
      // 2 · drogen + primer (hout wordt amber)
      var pr = eio(P(2.1, 2.8));
      rawMat.color.copy(white).lerp(primerC, pr); rawMat.roughness = .8 - .35 * pr;
      var b2 = t >= 2.05 && t < 2.95;
      // 3 · vuller aanbrengen (iets te vol)
      var f3 = eio(P(3.15, 3.75));
      fillerG.visible = t >= 3.15; filler.scale.y = Math.max(.001, f3); bulge.visible = t >= 3.5; bulge.scale.y = 0.02 * eio(P(3.5, 3.8)) * (1 - eio(P(4.15, 4.8)));
      c.place(fillerG);
      var k3 = eio(P(3.05, 3.15)), kOut = eio(P(3.85, 3.95));
      knife.visible = showTools && t >= 3.05 && t < 3.95;
      knife.position.set(RX1 + 0.02 - (RX1 - RX0 + 0.04) * eio(P(3.2, 3.8)), ST + 0.02 + 0.006 * eio(P(3.5, 3.8)) + 0.3 * (1 - k3) + 0.3 * kOut, ZONE.z);
      knife.rotation.set(0, 0, 0.35);
      // 4 · schuren (glad, vlak met de dorpel)
      var s4 = eio(P(4.05, 4.15)), sOut = eio(P(4.85, 4.95));
      sander.visible = showTools && t >= 4.05 && t < 4.95;
      emitX = t >= 4.05 && t < 4.95 ? ZONE.x + Math.sin(t * 38) * 0.07 : emitX;
      sander.position.set(t >= 4.05 && t < 4.95 ? emitX : ZONE.x, ST + 0.024 + 0.3 * (1 - s4) + 0.3 * sOut, ZONE.z);
      emitDust = t >= 4.15 && t < 4.85 && ex < .3 ? 1 : 0;
      // 5 · gronden (grijze grondverf op het herstel)
      var g5 = eio(P(5.15, 5.75));
      fillerMat.color.copy(fillerC0).lerp(greyC, g5);
      // 6 · aflakken (hele kozijn nieuw)
      var l6 = eio(P(6.15, 6.85));
      paintNew.opacity = l6; paintNew.depthWrite = l6 > .95;
      if (l6 > 0) fillerMat.color.lerp(newC, l6);
      // kwast tijdens 2, 5 en 6
      var bOn = b2 || (t >= 5.05 && t < 5.95) || (t >= 6.05 && t < 6.95);
      brush.visible = showTools && bOn;
      if (bOn) {
        var st0 = t < 3 ? 2.05 : t < 6 ? 5.05 : 6.05, len = t >= 6.05 ? FR - FL - 0.1 : RX1 - RX0, x0 = t >= 6.05 ? FR - 0.05 : RX1;
        var pp = P(st0 + 0.1, st0 + 0.8), inn = eio(P(st0, st0 + 0.1)), ou = eio(P(st0 + 0.82, st0 + 0.9));
        brush.position.set(x0 - len * eio(pp) + Math.sin(t * 30) * 0.01, ST + 0.005 + (t < 3 ? -RH + 0.005 : 0) + 0.3 * (1 - inn) + 0.3 * ou, ZONE.z);
        brush.rotation.set(0, 0, -0.35);
      }
      // opengewerkt: kozijn transparanter
      var o = 1 - 0.9 * ex;
      wall.cutaway.forEach(function (m) { m.material.forEach(function (mt) { mt.opacity = o; mt.depthWrite = o > .95; }); });
    }

    return {
      CH: 7,
      floorY: YB,
      shadowBox: 2.2,
      voorT: 0.03,
      speed: 1 / 4.6,
      apply: apply,
      onTick: function (dt) { tickP(dt); },
      keys: [
        [0.0, 0.45, 3.6, 0.6, 0, -0.05, 0],
        [0.3, 0.5, 1.5, -0.1, -0.38, -0.5, 0.02],
        [0.95, 0.55, 1.4, -0.12, -0.38, -0.5, 0.02],
        [1.9, 0.75, 1.15, -0.15, -0.4, -0.52, 0.02],
        [2.9, 0.45, 1.2, -0.12, -0.4, -0.52, 0.02],
        [3.9, 0.85, 1.15, -0.2, -0.4, -0.52, 0.02],
        [4.9, 0.35, 1.25, -0.12, -0.38, -0.5, 0.02],
        [5.9, 0.6, 1.4, -0.05, -0.38, -0.5, 0.02],
        [6.5, 0.5, 2.6, 0.2, -0.1, -0.2, 0],
        [7.0, 0.45, 3.6, 0.6, 0, -0.05, 0],
      ],
      exKey: [0, 0.8, 2.0, 0.2, -0.38, -0.35, 0.1],
      labeled: [rotG, fillerG],
      focus: [[rotG], [rotG], [], [fillerG], [fillerG], [fillerG], []],
      extraTags: [
        { n: 'Priem zakt weg: zacht hout', pos: function (v) { return awl.visible ? v.copy(awl.position).add(V(0, 0.16, 0)) : null; }, show: function (ch, w) { return ch === 0 && w > 0.5 && w < 0.75; } },
        { n: 'Vochtmeter: 28 %', pos: function (v) { return meter.visible ? v.copy(meter.position).add(V(0.02, 0.16, 0)) : null; }, show: function (ch, w) { return ch === 0 && w > 0.8; } },
        { n: 'Freesmachine', pos: function (v) { return router.visible ? v.copy(router.position).add(V(0, 0.2, 0)) : null; }, show: function (ch, w) { return ch === 1 && w > 0.2 && w < 0.85; } },
        { n: 'Alleen gezond hout blijft over', pos: function (v) { return v.set((RX0 + RX1) / 2, SM + 0.005, Z1); }, show: function (ch, w, exOn) { return !exOn && ch === 1 && w > 0.85; } },
        { n: 'Houtrotprimer', pos: function (v) { return v.set((RX0 + RX1) / 2 - 0.05, SM + 0.005, Z1); }, show: function (ch, w, exOn) { return !exOn && ch === 2 && w > 0.5; } },
        { n: 'Plamuurmes', pos: function (v) { return knife.visible ? v.copy(knife.position).add(V(0, 0.08, 0.06)) : null; }, show: function (ch, w) { return ch === 3 && w > 0.2 && w < 0.85; } },
        { n: 'Schuurblok', pos: function (v) { return sander.visible ? v.copy(sander.position).add(V(0, 0.08, 0)) : null; }, show: function (ch, w) { return ch === 4 && w > 0.2 && w < 0.85; } },
        { n: 'Grondverf', pos: function (v) { return v.set((RX0 + RX1) / 2, ST + 0.01, Z1); }, show: function (ch, w, exOn) { return !exOn && ch === 5 && w > 0.75; } },
        { n: 'Twee lagen aflak', pos: function (v) { return v.set(0.1, ST + 0.01, Z1); }, show: function (ch, w, exOn) { return !exOn && ch === 6 && w > 0.75; } },
      ],
    };
  });
}

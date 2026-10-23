// @ts-nocheck
/* Keralit studio — gevelbekleding op een geventileerd regelwerk. 7 stappen. */
import { createStudio } from './engine';

export function createKeralitStudio(host: any, opts: any): any {
  return createStudio(host, opts, function (c) {
    var T = c.T, V = c.V, M = c.M, cl = c.cl, eo = c.eo, eio = c.eio, eback = c.eback, box = c.box;

    /* ---------- maten ---------- */
    var YB = -1.25, WW = 3.2, WH = 2.5, WX = WW / 2;
    var WIN = { x: 0.55, y: YB + 1.45, w: 1.0, h: 1.1 }; // bestaand raam in de gevel
    var PANEL_H = 0.177, PANEL_D = 0.016;

    /* ---------- bestaande gevel (oud, verweerd hout + raam) ---------- */
    var wall = new T.Group(); c.scene.add(wall);
    var bm = c.brickMat('red', WW, WH);
    var back = box(WW, WH, 0.1, bm); back.position.set(0, YB + WH / 2, -0.05); wall.add(back);
    var weathered = new T.MeshStandardMaterial({ map: c.tex(c.woodCanvas('#5a4632', 'rgba(20,12,6,'), 1, 6), roughness: .9 });
    var oldBoards = new T.Group();
    for (var i = 0; i < 13; i++) {
      var by = YB + 0.12 + i * 0.18; if (by > YB + WH - 0.05) break;
      var b = box(WW, 0.17, 0.02, weathered); b.position.set(0, by, 0.012); b.rotation.x = -0.06;
      b.userData.home = b.position.clone(); b.userData.k = i;
      // gat bij het raam
      if (by > WIN.y - WIN.h / 2 - 0.05 && by < WIN.y + WIN.h / 2 + 0.05) {
        var l = box(WIN.x - WIN.w / 2 + WX - 0.03, 0.17, 0.02, weathered); l.position.set((-WX + WIN.x - WIN.w / 2 - 0.03) / 2, by, 0.012); l.rotation.x = -0.06;
        var r = box(WX - (WIN.x + WIN.w / 2 + 0.03), 0.17, 0.02, weathered); r.position.set((WIN.x + WIN.w / 2 + 0.03 + WX) / 2, by, 0.012); r.rotation.x = -0.06;
        [l, r].forEach(function (x) { x.userData.home = x.position.clone(); oldBoards.add(x); });
        continue;
      }
      oldBoards.add(b);
    }
    oldBoards.userData.name = 'Oude houten gevelbetimmering'; oldBoards.userData.anchor = V(-1.2, YB + 1.9, 0.03); oldBoards.userData.base = V(0, 0, 0); oldBoards.userData.ex = V(0, 0, 0);
    c.scene.add(oldBoards);
    var winF = c.ring(WIN.w, WIN.h, 0.07, 0.1, M.white); winF.position.set(WIN.x, WIN.y, 0.0); wall.add(winF);
    var roomC = c.canvas(128, 128), rg2 = roomC.getContext('2d'); var rgr = rg2.createLinearGradient(0, 0, 0, 128); rgr.addColorStop(0, '#1b2433'); rgr.addColorStop(0.6, '#2c2a2a'); rgr.addColorStop(1, '#4a3826'); rg2.fillStyle = rgr; rg2.fillRect(0, 0, 128, 128);
    var room = new T.Mesh(new T.PlaneGeometry(WIN.w - 0.14, WIN.h - 0.14), new T.MeshBasicMaterial({ map: c.tex(roomC, 1, 1) })); room.position.set(WIN.x, WIN.y, 0.001); wall.add(room);
    var winG = box(WIN.w - 0.14, WIN.h - 0.14, 0.01, M.glass, false); winG.position.set(WIN.x, WIN.y, 0.008); winG.renderOrder = 2; wall.add(winG);
    var floor = box(4.6, 0.04, 2.4, new T.MeshStandardMaterial({ map: c.tex(c.tileCanvas(), 4, 2), roughness: .7 })); floor.position.set(0, YB - 0.02, 0.7); c.scene.add(floor);

    /* ---------- folie ---------- */
    var foilMat = new T.MeshStandardMaterial({ color: new T.Color(0x2a2d33).convertSRGBToLinear(), roughness: .6, transparent: true });
    var foil = new T.Group();
    [[-WX, WIN.x - WIN.w / 2 - 0.02, YB, YB + WH], [WIN.x + WIN.w / 2 + 0.02, WX, YB, YB + WH], [WIN.x - WIN.w / 2 - 0.02, WIN.x + WIN.w / 2 + 0.02, WIN.y + WIN.h / 2 + 0.02, YB + WH], [WIN.x - WIN.w / 2 - 0.02, WIN.x + WIN.w / 2 + 0.02, YB, WIN.y - WIN.h / 2 - 0.02]].forEach(function (a) {
      var p = box(a[1] - a[0], a[3] - a[2], 0.002, foilMat, false); p.position.set((a[0] + a[1]) / 2, (a[2] + a[3]) / 2, 0.002); p.receiveShadow = true; foil.add(p);
    });
    c.comp(foil, V(0, 0, 0), V(0, 0, 0.3), 'Waterkerende, dampopen folie', V(-1.3, YB + 0.6, 0.01));

    /* ---------- regelwerk ---------- */
    var batten = new T.MeshStandardMaterial({ map: c.tex(c.woodCanvas('#c89a62', 'rgba(110,70,30,'), .2, 2), roughness: .8 });
    var regels = new T.Group(), regelList = [];
    for (var k = 0; k < 9; k++) {
      var rx = -WX + 0.05 + k * 0.4; if (rx > WX - 0.02) break;
      if (rx > WIN.x - WIN.w / 2 - 0.02 && rx < WIN.x + WIN.w / 2 + 0.02) {
        var top = box(0.045, YB + WH - (WIN.y + WIN.h / 2 + 0.05), 0.022, batten); top.position.set(rx, (YB + WH + WIN.y + WIN.h / 2 + 0.05) / 2, 0.015); regels.add(top); regelList.push(top);
        var bot = box(0.045, WIN.y - WIN.h / 2 - 0.05 - YB, 0.022, batten); bot.position.set(rx, (YB + WIN.y - WIN.h / 2 - 0.05) / 2, 0.015); regels.add(bot); regelList.push(bot);
      } else { var rg = box(0.045, WH, 0.022, batten); rg.position.set(rx, YB + WH / 2, 0.015); regels.add(rg); regelList.push(rg); }
    }
    c.comp(regels, V(0, 0, 0), V(0, 0, 0.6), 'Verticaal regelwerk (ventilatiespouw)', V(-WX + 0.05, YB + 2.2, 0.03));

    /* ---------- profielen ---------- */
    var profMat = new T.MeshStandardMaterial({ color: new T.Color(0x3a3d42).convertSRGBToLinear(), roughness: .45, metalness: .2 });
    var vent = box(WW, 0.03, 0.04, profMat); vent.position.set(0, YB + 0.08, 0.03);
    var ventHoles = new T.Group(); for (var h = 0; h < 30; h++) { var hh = box(0.03, 0.006, 0.006, M.rubber, false); hh.position.set(-WX + 0.06 + h * 0.105, YB + 0.065, 0.051); ventHoles.add(hh); }
    var startG = new T.Group(); startG.add(vent); startG.add(ventHoles);
    c.comp(startG, V(0, 0, 0), V(0, -0.15, 0.9), 'Ventilatieprofiel + startprofiel', V(-1.0, YB + 0.08, 0.05));
    var corners = new T.Group();
    var cL = box(0.05, WH, 0.05, profMat); cL.position.set(-WX - 0.01, YB + WH / 2, 0.03); corners.add(cL);
    var cR = cL.clone(); cR.position.x = WX + 0.01; corners.add(cR);
    var wTrimL = box(0.05, WIN.h + 0.1, 0.05, profMat); wTrimL.position.set(WIN.x - WIN.w / 2 - 0.035, WIN.y, 0.03); corners.add(wTrimL);
    var wTrimR = wTrimL.clone(); wTrimR.position.x = WIN.x + WIN.w / 2 + 0.035; corners.add(wTrimR);
    var wTrimT = box(WIN.w + 0.12, 0.05, 0.05, profMat); wTrimT.position.set(WIN.x, WIN.y + WIN.h / 2 + 0.035, 0.03); corners.add(wTrimT);
    var sillK = box(WIN.w + 0.16, 0.03, 0.12, profMat); sillK.position.set(WIN.x, WIN.y - WIN.h / 2 - 0.035, 0.06); corners.add(sillK);
    c.comp(corners, V(0, 0, 0), V(0, 0, 1.15), 'Hoek- en aansluitprofielen', V(WX + 0.01, YB + 1.9, 0.05));

    /* ---------- keralit panelen ---------- */
    var panelC = (function () {
      var cc = c.canvas(1024, 64), g = cc.getContext('2d');
      g.fillStyle = '#d9d4cb'; g.fillRect(0, 0, 1024, 64);
      for (var i2 = 0; i2 < 80; i2++) { g.strokeStyle = 'rgba(120,110,95,' + c.rand(.05, .14) + ')'; g.lineWidth = c.rand(.5, 1.6); var y2 = Math.random() * 64; g.beginPath(); g.moveTo(0, y2); for (var x2 = 0; x2 <= 1024; x2 += 64) g.lineTo(x2, y2 + Math.sin(x2 / 70 + i2) * 1.5); g.stroke(); }
      var gr = g.createLinearGradient(0, 0, 0, 64); gr.addColorStop(0, 'rgba(255,255,255,.18)'); gr.addColorStop(0.5, 'rgba(255,255,255,0)'); gr.addColorStop(0.92, 'rgba(0,0,0,.08)'); gr.addColorStop(1, 'rgba(0,0,0,.4)');
      g.fillStyle = gr; g.fillRect(0, 0, 1024, 64);
      return cc;
    })();
    var panelMat = new T.MeshStandardMaterial({ map: c.tex(panelC, 1, 1), roughness: .55, envMapIntensity: .6, transparent: true });
    var panels = new T.Group(), panelList = [];
    var rows = Math.floor((WH - 0.12) / PANEL_H);
    for (var rr = 0; rr < rows; rr++) {
      var py = YB + 0.1 + PANEL_H / 2 + rr * PANEL_H;
      var segs = (py > WIN.y - WIN.h / 2 - 0.06 && py < WIN.y + WIN.h / 2 + 0.06)
        ? [[-WX, WIN.x - WIN.w / 2 - 0.06], [WIN.x + WIN.w / 2 + 0.06, WX]]
        : [[-WX, WX]];
      segs.forEach(function (sg) {
        var w2 = sg[1] - sg[0]; if (w2 < 0.05) return;
        var pm = box(w2, PANEL_H, PANEL_D, panelMat);
        pm.position.set((sg[0] + sg[1]) / 2, py, 0.034); pm.rotation.x = -0.025;
        pm.userData.home = pm.position.clone(); pm.userData.row = rr; pm.userData.side = sg[0] < 0 ? -1 : 1;
        panels.add(pm); panelList.push(pm);
      });
    }
    c.comp(panels, V(0, 0, 0), V(0, 0, 1.7), 'Keralit panelen (kunststof)', V(-1.2, YB + 1.2, 0.05));
    var clips = new T.Group();
    panelList.forEach(function (p) { if (p.userData.row % 2) return; regelList.forEach(function (rgl) { if (Math.abs(rgl.position.x - p.position.x) > p.geometry.parameters.width / 2) return; if (Math.abs(rgl.position.y - p.position.y) > rgl.geometry.parameters.height / 2) return; var cp = box(0.03, 0.03, 0.006, M.steel, false); cp.position.set(rgl.position.x, p.position.y - PANEL_H / 2 + 0.01, 0.03); clips.add(cp); }); });
    c.comp(clips, V(0, 0, 0), V(0, 0, 1.4), 'RVS bevestigingsclips', V(-0.95, YB + 0.5, 0.04));

    /* ---------- luchtstroom in de spouw ---------- */
    var NAIR = 140, air = c.particles(NAIR, 0x7dd3fc, 0.035, .9); air.renderOrder = 10;
    air.userData.data.forEach(function (d) { d.x = c.rand(-WX + 0.1, WX - 0.1); d.y = YB + Math.random() * WH; d.z = 0.022; d.vy = c.rand(0.35, 0.6); });
    var airOn = 0;

    /* ---------- tijdlijn (7 stappen) ---------- */
    var allBoards = [];
    oldBoards.children.forEach(function (b2) { allBoards.push(b2); });
    function apply(t, ex) {
      function P(a, b) { return cl((t - a) / (b - a)); }
      // 0 · oude betimmering verwijderen (van boven naar beneden)
      allBoards.forEach(function (b2, i2) {
        var n = allBoards.length, a = 0.1 + (n - i2) / n * 0.55, p = eio(P(a, a + 0.3));
        b2.visible = p < 0.99; b2.position.set(b2.userData.home.x + p * 0.3 * (b2.position.x >= 0 ? 1 : -1), b2.userData.home.y - p * 0.6, b2.userData.home.z + p * 1.4);
        b2.rotation.set(-0.06 + p * 1.1, 0, p * 0.3);
      });
      oldBoards.visible = t < 1.0;
      // 1 · folie
      var f1 = P(1.05, 1.8); foil.visible = t >= 1.05;
      foil.children.forEach(function (p, i2) { p.scale.y = Math.max(.001, eo(cl(f1 * 1.6 - i2 * 0.15))); });
      c.place(foil);
      // 2 · regelwerk
      regelList.forEach(function (rgl, i2) { var a = 2.05 + i2 * 0.05, p = eback(P(a, a + 0.25)); rgl.visible = t >= a; rgl.scale.z = Math.max(.001, p); rgl.position.z = 0.015 + 0.3 * (1 - eo(P(a, a + 0.25))); });
      regels.visible = t >= 2.05; c.place(regels);
      // 3 · ventilatie- en startprofiel
      var s3 = eio(P(3.05, 3.45)); startG.visible = t >= 3.05; c.place(startG, 0, -0.25 * (1 - s3), 0.5 * (1 - s3));
      var c3 = eio(P(3.4, 3.9)); corners.visible = t >= 3.4; c.place(corners, 0, 0, 0.5 * (1 - c3));
      // 4 · panelen klikken, rij voor rij
      panelList.forEach(function (p) {
        var a = 4.05 + p.userData.row * 0.062 + (p.userData.side > 0 ? 0.03 : 0), q = P(a, a + 0.16);
        p.visible = t >= a;
        var slide = eio(cl(q * 1.4)), snap = eback(cl(q * 1.4 - 0.4));
        p.position.set(p.userData.home.x + (1 - slide) * 1.6 * p.userData.side, p.userData.home.y + 0.04 * (1 - snap), p.userData.home.z + (1 - slide) * 0.5);
      });
      panels.visible = t >= 4.05; c.place(panels);
      clips.visible = ex > .3; c.place(clips);
      // 5 · ventilatie (lucht stroomt van onder naar boven achter de panelen)
      airOn = (t >= 5.05 && t < 6.05) || ex > .5 ? 1 : 0;
      var pv = 1 - 0.75 * Math.max(ex, cl((t - 5.05) / 0.15) * (1 - cl((t - 5.9) / 0.15)));
      panelMat.opacity = pv; panelMat.depthWrite = pv > .95;
      // 6 · eindresultaat
      foilMat.opacity = 1;
    }
    function tick(dt) {
      air.visible = airOn > 0;
      if (!air.visible) return;
      air.userData.data.forEach(function (d) {
        d.y += d.vy * dt; d.x += Math.sin(d.y * 4 + d.seed * 10) * dt * 0.03;
        var inWin = Math.abs(d.x - WIN.x) < WIN.w / 2 + 0.08 && d.y > WIN.y - WIN.h / 2 - 0.08 && d.y < WIN.y + WIN.h / 2 + 0.08;
        if (inWin) d.x += (d.x < WIN.x ? -1 : 1) * dt * 0.6;
        if (d.y > YB + WH - 0.02) { d.y = YB + 0.08; d.x = c.rand(-WX + 0.1, WX - 0.1); }
        d.z = 0.024 + c.ex.v * 0.6;
      });
      air.userData.sync();
    }

    return {
      CH: 7,
      floorY: YB,
      shadowBox: 3,
      voorT: 0.03,
      speed: 1 / 4.4,
      apply: apply,
      onTick: tick,
      keys: [
        [0.0, 0.45, 7.2, 0.9, 0, -0.05, 0],
        [0.9, 0.35, 6.4, 0.5, 0, -0.05, 0],
        [1.9, 0.6, 6.0, 0.5, 0, -0.05, 0],
        [2.9, 0.75, 4.0, -0.4, -0.6, -0.9, 0],
        [3.9, -0.6, 4.6, 0.2, 1.0, -0.2, 0],
        [4.9, 0.4, 6.4, 0.6, 0, -0.05, 0],
        [5.5, 1.15, 4.4, 0.4, -0.4, 0.0, 0],
        [6.6, 0.45, 6.6, 0.8, 0, -0.05, 0],
        [7.0, 0.5, 7.2, 0.95, 0, -0.05, 0],
      ],
      exKey: [0, 1.05, 7.8, 1.9, 0, -0.05, 0.3],
      labeled: [oldBoards, foil, regels, startG, corners, panels, clips],
      focus: [[oldBoards], [foil], [regels], [startG, corners], [panels], [], []],
      extraTags: [
        { n: 'Lucht stroomt achter de panelen', pos: function (v) { return v.set(-0.6, YB + 1.6, 0.06 + c.ex.v * 0.6); }, show: function (ch, w, exOn) { return airOn > 0 && (ch === 5 || exOn) && w > 0.2; } },
        { n: 'Nooit meer schilderen', pos: function (v) { return v.set(-0.9, YB + 1.95, 0.05); }, show: function (ch, w, exOn) { return !exOn && ch === 6 && w > 0.35; } },
      ],
    };
  });
}

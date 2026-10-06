// REPRIS TEL QUEL de la maquette (maquette/site-v3.dc.html).
// Ne pas modifier ici : editer la maquette et relancer `npm run page`.
/* eslint-disable */
export default (DCLogic) => {
class Component extends DCLogic {
  state = { joined: false };
  clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  rng = (p, a, b) => this.clamp((p - a) / (b - a));
  eoc = (x) => 1 - Math.pow(1 - x, 3);
  eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  eox = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
  eob = (x) => { const c = 1.70158; return x <= 0 ? 0 : 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  st = (e, tr, op) => { if (!e) return; if (tr != null) e.style.transform = tr; if (op != null) e.style.opacity = op; };

  componentDidMount() {
    const W = window, mq = (q) => !!(W.matchMedia && W.matchMedia(q).matches);
    this.reduced = mq('(prefers-reduced-motion: reduce)');
    this.fine = mq('(hover: hover) and (pointer: fine)');
    this.k = {}; this.SL = []; this.S = {}; this.rv = []; this.cf = []; this.push = {}; this.dim = {};
    this.mx = 0; this.my = 0; this.smx = 0; this.smy = 0; this.cx = -1; this.cy = -1; this.pcx = 0; this.pcy = 0;
    this.t0 = performance.now(); this.lt = this.t0; this.lastY = W.scrollY; this.vel = 0; this.skew = 0;
    this.ld = { shown: 0, exit: null, gone: false }; this.mp = 0;
    this.g = { init: false, x: 0, y: 0, h: 0, yaw: 0, roll: 0, ly: 0, lp: 0, key: '', on: null };
    this.calm = {}; this.seen = {}; this.pokeN = 0; this.pokeUntil = 0; this.mapKey = 'm0';
    this.RQ = [
      { q: 'Dans un tableau, où sont les fils de i ?', a: '2i + 1 et 2i + 2', ok: true, tag: 'RECTO / VERSO' },
      { q: 'Coût d\u2019une insertion dans un tas binaire ?', a: 'O(log n)', ok: true, tag: 'RECTO / VERSO' },
      { q: 'Dans ℚ, toute suite de Cauchy converge ?', a: 'Non : ℚ n\u2019est pas complet', ok: false, tag: 'VRAI / FAUX' },
      { q: 'Hauteur d\u2019un tas de n éléments = ___', a: '⌊log₂ n⌋', ok: true, tag: 'À COMPLÉTER' },
      { q: 'Amorti ≠ moyen : on borne…', a: 'une suite d\u2019opérations', ok: true, tag: 'À COMPLÉTER' },
    ];
    this.RV = [{ xp: 0, combo: 1, gom: 5 }];
    { let xp = 0, cb = 1, gm = 5; this.RQ.forEach((c) => { if (c.ok) { cb += 1; xp += 22 * cb; } else { cb = 1; gm -= 1; } this.RV.push({ xp, combo: cb, gom: gm }); }); }
    this.LX = [1180, 940, 870, 720, 610, 560, 410]; this.lrY = []; this.lr = []; this.rxp = 0; this.segA = 0; this.rowH = 52;
    this.fmt = (n) => (n >= 1000 ? Math.floor(n / 1000) + '\u00A0' + String(n % 1000).padStart(3, '0') : String(n));
    this.onMove = (e) => {
      this.cx = e.clientX; this.cy = e.clientY;
      this.mx = (e.clientX / W.innerWidth) * 2 - 1; this.my = (e.clientY / W.innerHeight) * 2 - 1;
      const t = e.target && e.target.closest ? e.target : null;
      const c = t ? t.closest('[data-cursor]') : null;
      const lab = c ? c.getAttribute('data-cursor') : '';
      if (lab !== this.curLab && this.k.curIn) { this.curLab = lab; if (lab) this.k.curIn.textContent = lab; this.k.curIn.style.transform = 'translate(16px,16px) scale(' + (lab ? 1 : 0) + ')'; }
      const m = t ? t.closest('[data-mag]') : null;
      if (m !== this.magEl) { if (this.magEl) this.magEl.style.transform = 'translate(0px,0px)'; this.magEl = m; }
      if (m && !this.reduced) { const r = m.getBoundingClientRect(); m.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1) + 'px)'; }
    };
    this.onResize = () => { this.scan(); this.measure(); };
    this.onClick = (e) => {
      const a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      const id = a.getAttribute('href').slice(1), el = id ? document.getElementById(id) : null;
      if (!el) return;
      e.preventDefault();
      const y = this.absTop(el);
      if (this.lenis) this.lenis.scrollTo(y, { duration: 1.8 }); else W.scrollTo({ top: y, behavior: this.reduced ? 'auto' : 'smooth' });
    };
    W.addEventListener('pointermove', this.onMove, { passive: true });
    W.addEventListener('resize', this.onResize);
    W.addEventListener('load', this.onResize);
    document.addEventListener('click', this.onClick);
    this.timers = [80, 500, 1500, 3000, 6000].map((ms) => setTimeout(this.onResize, ms));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => this.onResize());
    this.scan(); this.measure(); this.setupScroll(); this.setupStage(); this.setupVideo();
    const loop = (now) => {
      try { this.frame(now); } catch (err) { if (!this.errLogged) { this.errLogged = true; console.error(err); } }
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  componentWillUnmount() {
    const W = window;
    cancelAnimationFrame(this.raf);
    W.removeEventListener('pointermove', this.onMove); W.removeEventListener('resize', this.onResize); W.removeEventListener('load', this.onResize);
    if (this.ld && this.ld.onUp) { W.removeEventListener('pointerup', this.ld.onUp); W.removeEventListener('pointercancel', this.ld.onCancel); }
    document.removeEventListener('click', this.onClick);
    (this.timers || []).forEach(clearTimeout); clearInterval(this.lenisPoll);
    if (this.io) this.io.disconnect();
    if (this.lenis) this.lenis.destroy();
    if (this.stage) this.stage.dispose();
  }

  absTop(n) { let t = 0; while (n) { t += n.offsetTop; n = n.offsetParent; } return t; }

  scan() {
    const k = {};
    document.querySelectorAll('[data-k]').forEach((n) => { k[n.getAttribute('data-k')] = n; });
    this.k = k;
    this.cf = [...document.querySelectorAll('[data-cf]')].map((n) => ({ n, dx: +n.getAttribute('data-dx'), dy: +n.getAttribute('data-dy'), r: +n.getAttribute('data-rot') }));
    this.push = {}; this.dim = {};
    document.querySelectorAll('[data-push]').forEach((n) => { this.push[n.getAttribute('data-push')] = n; });
    document.querySelectorAll('[data-dim]').forEach((n) => { this.dim[n.getAttribute('data-dim')] = n; });
    if (k.video && this.vid !== k.video) this.setupVideo();
  }

  measure() {
    const k = this.k, W = window;
    this.vw = W.innerWidth; this.vh = W.innerHeight;
    this.docH = Math.max(1, document.documentElement.scrollHeight - this.vh);
    this.SL = [...document.querySelectorAll('[data-scene]')].map((n) => ({ n, name: n.getAttribute('data-scene'), top: this.absTop(n), h: n.offsetHeight, pin: n.hasAttribute('data-pin'), chap: n.getAttribute('data-chapter') || '', anchor: n.querySelector('[data-g]'), lc: -1 }));
    this.S = {};
    this.SL.forEach((s, i) => { const nx = this.SL[i + 1]; s.cov = !!(nx && nx.n.hasAttribute('data-cover')); s.span = Math.max(1, s.h - this.vh - (s.cov ? this.vh : 0)); this.S[s.name] = s; });
    this.rv = [...document.querySelectorAll('[data-rv]')].map((n) => ({ n, top: this.absTop(n), d: parseFloat(n.getAttribute('data-rv')) || 0, last: -1, count: n.hasAttribute('data-count') }));
    if (k.track) this.trackDist = Math.max(0, k.track.scrollWidth - this.vw);
    const show = (e, on, d) => { if (e) e.style.display = on ? d || 'block' : 'none'; };
    show(k.navLinks, this.vw >= 820, 'flex');
    show(k.note1, this.vw >= 1000); show(k.note2, this.vw >= 1000);
    show(k.cur, this.fine);
    this.hwM = [0, 1, 2].map((i) => { const e = k['hw' + i]; return e ? { x: e.offsetLeft, y: e.offsetTop, w: e.offsetWidth, h: e.offsetHeight } : null; });
    const ga = document.querySelector('[data-g="ecrire"]'); this.gaW = ga ? ga.offsetWidth : 0; this.gaH = ga ? ga.offsetHeight : 0;
    this.pbw = k.pb1 ? k.pb1.offsetWidth : 140;
    if (this.stage) this.stage.resize(this.vw, this.vh, W.devicePixelRatio || 1);
  }

  P(name) { const s = this.S[name]; return s ? this.clamp((this.sy - s.top) / s.span) : 0; }
  C(name) { const s = this.S[name]; return s && s.cov ? this.clamp((this.sy - s.top - s.span) / this.vh) : 0; }

  setupScroll() {
    const init = () => {
      if (this.lenis) return true;
      if (this.reduced || !window.Lenis) return false;
      try { this.lenis = new window.Lenis({ lerp: this.clamp(this.props.smooth ?? 0.1, 0.04, 1), smoothWheel: true, autoRaf: false }); } catch (e) { this.lenis = null; }
      if (this.lenis && !this.ld.gone) { this.lenis.stop(); this.ld.stopped = true; }
      return !!this.lenis;
    };
    if (this.reduced || init()) return;
    let n = 0;
    this.lenisPoll = setInterval(() => { if (init() || ++n > 50) clearInterval(this.lenisPoll); }, 100);
  }

  setupStage() {
    const c = this.k.gl;
    if (!c || this.stageStarted) return;
    this.stageStarted = true;
    const base = document.baseURI;
    import('./gribou-stage.js')
      .then((m) => m.createStage(c, '/3d/Gribou_Kurso_v2.glb', (p) => { this.mp = p; }))
      .then((s) => { this.stage = s; this.mp = 1; this.g.key = ''; s.resize(this.vw, this.vh, window.devicePixelRatio || 1); })
      .catch((err) => { console.warn('Gribou 3D indisponible, image de secours', err); this.noGL = true; this.mp = 1; if (this.k.gfb) this.k.gfb.style.display = 'block'; });
  }

  setupVideo() {
    const v = this.k && this.k.video;
    if (!v) return;
    this.vid = v; v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', '');
    if (this.io) this.io.disconnect();
    if ('IntersectionObserver' in window) {
      this.io = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting && e.intersectionRatio > 0.35) { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); } else v.pause();
      }), { threshold: [0, 0.35, 0.7] });
      this.io.observe(v);
    }
  }

  toggleSound = () => {
    const v = this.vid;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); }
    if (this.k.soundLabel) this.k.soundLabel.textContent = v.muted ? 'Activer le son' : 'Couper le son';
    if (this.k.soundWaves) this.k.soundWaves.setAttribute('opacity', v.muted ? '0.3' : '1');
  };

  poke = () => {
    const list = ['surpris', 'victoire', 'applaudir', 'sautiller', 'coucou'];
    const n = list[this.pokeN % list.length];
    this.pokeN++;
    const d = this.stage ? this.stage.duration(n) : 1.2;
    this.pokeWant = { key: 'poke' + this.pokeN, n, once: true, fade: 0.15, then: { n: 'idle' } };
    this.pokeUntil = performance.now() + d * 1000 + 120;
    if (this.domName) this.calm[this.domName] = true;
  };

  station(i) {
    const s = this.SL[i];
    if (!s || !s.anchor) return null;
    const an = s.anchor, mn = parseFloat(an.getAttribute('data-min')) || 0, mh = parseFloat(an.getAttribute('data-minh')) || 0;
    if (this.vw < mn || this.vh < mh) return null;
    const r = an.getBoundingClientRect(), ow = an.offsetWidth || 1;
    return { x: r.left + r.width / 2, y: r.bottom, h: (an.offsetHeight || r.height) * (r.width / ow), yaw: parseFloat(an.getAttribute('data-yaw')) || 0, look: an.hasAttribute('data-look') ? parseFloat(an.getAttribute('data-look')) : 0.6, flow: !s.pin };
  }

  clipFor(name, now) {
    if (name !== this.lastDom) { if (this.lastDom) { this.seen[this.lastDom] = true; this.calm[this.lastDom] = false; } this.lastDom = name; }
    if (now < this.pokeUntil && this.pokeWant) return this.pokeWant;
    const P = (s) => this.P(s), calm = this.calm[name];
    switch (name) {
      case 'hero':
        if (this.ld.exit == null) return { key: 'h-wait', n: 'idle' };
        if (calm) return { key: 'h-calm', n: 'idle' };
        return this.seen.hero ? { key: 'h-back', n: 'coucou', once: true, then: { n: 'idle' } } : { key: 'h-in', n: 'saut_apparition', once: true, fade: 0.05, then: { n: 'coucou', once: true, then: { n: 'idle' } } };
      case 'ecrire': return { key: 'ec', n: 'ecrire' };
      case 'circle': { const p = P('circle'); return p < 0.48 ? { key: 'c1', n: 'pointer' } : p < 0.8 ? { key: 'c2', n: 'surpris', once: true, then: { n: 'concentré' } } : { key: 'c3', n: 'applaudir' }; }
      case 'reviens': {
        const r = this.rvState || { vi: 0 };
        if (r.end) return { key: 'r-end', n: 'victoire', once: true, then: { n: 'fier' } };
        if (!r.vi) return { key: 'r-0', n: 'idle' };
        return r.ok ? { key: 'r-ok' + r.vi, n: 'applaudir', once: true, then: { n: 'idle' } } : { key: 'r-no' + r.vi, n: 'surpris', once: true, then: { n: 'idle' } };
      }
      case 'amis': {
        const p = P('amis');
        if (p < 0.3) return { key: 'a-0', n: 'pointer' };
        if (p < 0.58) return { key: 'a-fly', n: 'surpris', once: true, then: { n: 'idle' } };
        if (p < 0.66) return { key: 'a-got', n: 'applaudir' };
        if (p < 0.84) return { key: 'a-write', n: 'concentré' };
        if (p < 0.94) return { key: 'a-new', n: 'sautiller' };
        return { key: 'a-end', n: 'fier' };
      }
      case 'ligue': {
        const p = P('ligue');
        if (this.lgUp) return { key: 'l-up', n: 'victoire', once: true, then: { n: 'fier' } };
        if (p > 0.73) return { key: 'l-crown', n: 'applaudir' };
        return p > 0.17 ? { key: 'l-rise', n: 'sautiller' } : { key: 'l-0', n: 'pointer' };
      }
      case 'game': { const p = P('game'); return p < 0.66 ? { key: 'g1', n: 'taille_crayon', scrub: this.rng(p, 0.1, 0.64) } : { key: 'g2', n: 'victoire', once: true, then: { n: 'fier' } }; }
      case 'sync': return P('sync') < 0.52 ? { key: 's1', n: 'concentré' } : { key: 's2', n: 'applaudir', once: true, then: { n: 'idle' } };
      case 'beta':
        if (this.state.joined) return { key: 'b-yes', n: 'victoire', once: true, then: { n: 'fier' } };
        if (calm) return { key: 'b-calm', n: 'idle' };
        return { key: 'b-in', n: 'saut_apparition', once: true, fade: 0.1, then: { n: 'coucou', once: true, then: { n: 'idle' } } };
      default: return { key: 'idle', n: 'idle' };
    }
  }

  gribou(dt, ti, now) {
    const { clamp, eio, eob } = this, SL = this.SL, vh = this.vh, sy = this.sy, g = this.g;
    if (!SL.length) return;
    let a = 0;
    for (let i = 0; i < SL.length; i++) if (SL[i].top <= sy + 1) a = i;
    const n = Math.min(SL.length - 1, a + 1);
    let b = n === a ? 0 : clamp((sy - (SL[n].top - vh)) / vh);
    let A = this.station(a), B = n !== a ? this.station(n) : null;
    if (B && B.flow) b = clamp((b - 0.45) / 0.55);
    const off = (p) => ({ x: p.x, y: -0.1 * vh, h: p.h, yaw: p.yaw, look: p.look });
    if (!A && B) A = off(B);
    if (A && !B) B = off(A);
    const dom = SL[b < 0.5 ? a : n];
    this.domS = dom; this.domName = dom.name;
    if (!this.stage && !this.noGL) return;
    let T = null;
    if (A) {
      const e = eio(b), arc = Math.sin(Math.PI * b);
      T = { x: A.x + (B.x - A.x) * e, y: A.y + (B.y - A.y) * e - arc * 0.08 * vh, h: A.h + (B.h - A.h) * e, yaw: A.yaw + (B.yaw - A.yaw) * e + arc * 1.2, look: A.look + (B.look - A.look) * e };
      if (SL[a].name === 'hero') {
        T.h *= ti < 0 ? 0 : eob(clamp((ti - 0.2) / 0.65));
        if (n !== a) T.yaw += e * Math.PI * 2 - arc * 1.2;
      }
      if (SL[a].name === 'game') T.yaw += (-0.4 + 0.8 * eio(this.P('game'))) * (1 - e);
    }
    const vis = !!T && T.h > 4 && T.y > -0.02 * vh && T.y - T.h < vh;
    if (T) {
      const kf = 1 - Math.exp(-dt * 14);
      if (!g.init || !g.on) { g.x = T.x; g.y = T.y; g.h = T.h; g.yaw = T.yaw; g.init = true; }
      const px = g.x;
      g.x += (T.x - g.x) * kf; g.y += (T.y - g.y) * kf; g.h += (T.h - g.h) * kf; g.yaw += (T.yaw - g.yaw) * kf;
      g.roll += (clamp(-((g.x - px) / dt) * 0.0003, -0.3, 0.3) - g.roll) * (1 - Math.exp(-dt * 8));
      const lk = this.reduced ? 0 : T.look, lf = 1 - Math.exp(-dt * 4);
      const dx = this.cx >= 0 ? clamp((this.cx - g.x) / (this.vw * 0.45), -1, 1) : 0;
      const dy = this.cy >= 0 ? clamp((this.cy - (g.y - g.h * 0.7)) / (vh * 0.6), -1, 1) : 0;
      g.ly += (dx * 0.6 * lk - g.ly) * lf; g.lp += (dy * 0.22 * lk - g.lp) * lf;
    }
    if (this.stage && T) {
      const w = this.clipFor(dom.name, now);
      if (w.key !== g.key) { g.key = w.key; if (w.scrub == null) this.stage.play(w.n, w); }
      if (w.scrub != null) this.stage.scrub(w.n, w.scrub);
    }
    if (vis !== g.on) { g.on = vis; const el = this.noGL ? this.k.gfb : this.k.gl; if (el) el.style.opacity = vis ? 1 : 0; }
    if (!vis) return;
    if (this.stage) {
      this.stage.pose({ x: g.x, y: g.y, h: g.h, yaw: g.yaw + g.ly, pitch: 0.07 + g.lp, roll: g.roll, shadow: 1 });
      this.stage.render(dt);
    } else if (this.k.gfb) {
      const im = this.k.gfb, ar = im.naturalWidth && im.naturalHeight ? im.naturalWidth / im.naturalHeight : 0.6;
      im.style.transform = 'translate(' + (g.x - 50 * ar).toFixed(1) + 'px,' + (g.y - 100).toFixed(1) + 'px) scale(' + (g.h / 100).toFixed(4) + ') rotate(' + g.roll.toFixed(3) + 'rad)';
    }
  }

  flame(o, i, t) {
    this.st(o, 'scale(' + (1 + 0.06 * Math.sin(t * 7.3)).toFixed(3) + ',' + (1 - 0.05 * Math.sin(t * 7.3 + 1.1)).toFixed(3) + ') rotate(' + (Math.sin(t * 4.7) * 3).toFixed(2) + 'deg)');
    this.st(i, 'scale(' + (1 - 0.1 * Math.sin(t * 9.1 + 0.6)).toFixed(3) + ',' + (1 + 0.08 * Math.sin(t * 9.1)).toFixed(3) + ')');
  }

  ldChime() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      const a = this.ac; if (!a || a.state !== 'running') return;
      const n = a.currentTime + 0.01;
      [523.25, 659.25, 783.99, 1046.5].forEach((fq, i) => {
        const o = a.createOscillator(), g = a.createGain(), d = n + i * 0.07;
        o.type = 'square'; o.frequency.setValueAtTime(fq, d);
        g.gain.setValueAtTime(0.0001, d); g.gain.exponentialRampToValueAtTime(0.05, d + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, d + (i === 3 ? 0.42 : 0.2));
        o.connect(g); g.connect(a.destination); o.start(d); o.stop(d + 0.45);
      });
    } catch (e) {}
  }

  ldAudio() {
    try { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; if (!this.ac) this.ac = new AC(); if (this.ac.state === 'suspended') this.ac.resume(); } catch (e) {}
  }

  ldSfx(type, n) {
    const a = this.ac; if (!a || a.state === 'closed') return;
    try {
      const t0 = a.currentTime + 0.01;
      const tone = (fq, f2, d, ty, g0, at) => {
        const o = a.createOscillator(), g = a.createGain(), s = t0 + (at || 0);
        o.type = ty; o.frequency.setValueAtTime(fq, s); if (f2) o.frequency.exponentialRampToValueAtTime(f2, s + d);
        g.gain.setValueAtTime(0.0001, s); g.gain.exponentialRampToValueAtTime(g0, s + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, s + d);
        o.connect(g); g.connect(a.destination); o.start(s); o.stop(s + d + 0.03);
      };
      if (type === 'pop') { const fq = 520 * Math.pow(2, (n || 0) / 12); tone(fq, fq * 1.8, 0.1, 'triangle', 0.09); tone(fq * 2, null, 0.07, 'sine', 0.03, 0.03); }
      else if (type === 'press') tone(190, 120, 0.08, 'sine', 0.07);
      else if (type === 'twang') { tone(170, 128, 0.5, 'triangle', 0.08); tone(340, 250, 0.3, 'sine', 0.025); }
      else if (type === 'flip') {
        const len = Math.floor(a.sampleRate * 0.4), buf = a.createBuffer(1, len, a.sampleRate), ch = buf.getChannelData(0);
        for (let i = 0; i < len; i++) { const u = i / len; ch[i] = (Math.random() * 2 - 1) * Math.pow(Math.sin(Math.PI * u), 2) * (1 - u * 0.5); }
        const src = a.createBufferSource(), bp = a.createBiquadFilter(), g = a.createGain();
        src.buffer = buf; bp.type = 'bandpass'; bp.Q.value = 1.1; bp.frequency.setValueAtTime(2400, t0); bp.frequency.exponentialRampToValueAtTime(650, t0 + 0.38);
        g.gain.value = 0.14; src.connect(bp); bp.connect(g); g.connect(a.destination); src.start(t0); src.stop(t0 + 0.41);
      }
      else if (type === 'flap') { tone(150, 62, 0.16, 'sine', 0.16); tone(95, 55, 0.1, 'triangle', 0.05); }
      else if (type === 'stamp') { tone(300, 170, 0.1, 'triangle', 0.09); tone(600, 420, 0.06, 'sine', 0.03, 0.01); }
      else if (type === 'swoosh') {
        const len = Math.floor(a.sampleRate * 0.55), buf = a.createBuffer(1, len, a.sampleRate), ch = buf.getChannelData(0);
        for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.sin((Math.PI * i) / len);
        const src = a.createBufferSource(), bp = a.createBiquadFilter(), g = a.createGain();
        src.buffer = buf; bp.type = 'bandpass'; bp.Q.value = 0.8; bp.frequency.setValueAtTime(350, t0); bp.frequency.exponentialRampToValueAtTime(2600, t0 + 0.5);
        g.gain.value = 0.12; src.connect(bp); bp.connect(g); g.connect(a.destination); src.start(t0); src.stop(t0 + 0.56);
      }
    } catch (e) {}
  }

  ldInit() {
    const L = this.ld, k = this.k;
    Object.assign(L, { v: 0, msgN: -1, msgT: 0, oldT: -9, pc: -1, ux: 0.5, uy: 0.8, uvx: 0, uvy: 0, px: 0, py: 0, pvx: 0, pvy: 0, pr: 0, prv: 0, down: false, hov: 0, ov: false, sw: 0, swv: 0, b: 0, bv: 0, by: 0.5, grab: false, combo: 0, lastClick: -9, clicks: 0, pops: [], popN: 0, hv: 0, pcx: null, pcy: null, lastMove: -9, mc: 0, kMode: true, kHand: false, tx: 0, ty: 0, back: false, bookOn: false, flipS: false, flapS: false, stamped: false, chimed: false, dotA: false, f0: null, snapS: false });
    let seen = false; try { seen = !!sessionStorage.getItem('kurso-start'); } catch (e) {}
    L.speed = seen ? 1.15 : 0.48; L.ts = seen ? 1.25 : 1;
    L.onDown = (e) => {
      if (e.pointerType === 'mouse') this.ldAudio();
      if (e.clientX != null) { this.cx = e.clientX; this.cy = e.clientY; }
      const M = L.M;
      if (!M || L.done != null || L.kx == null) return;
      if (Math.hypot(e.clientX - L.kx, e.clientY - L.ky) < M.kh * M.s0 * 0.62) { L.down = true; this.ldSfx('press'); }
    };
    L.onUp = (e) => { this.ldAudio(); if (!L.down) return; L.down = false; if (L.done == null) this.ldClick(e); };
    L.onCancel = () => { L.down = false; };
    k.loader.addEventListener('pointerdown', L.onDown);
    window.addEventListener('pointerup', L.onUp); window.addEventListener('pointercancel', L.onCancel);
    if (k.ldHintT && !this.fine) k.ldHintT.textContent = 'touche-moi !';
  }

  ldClick(e) {
    const L = this.ld, k = this.k, t = (performance.now() - this.t0) / 1000;
    L.combo = t - L.lastClick < 0.75 ? Math.min(L.combo + 1, 9) : 0; L.lastClick = t; L.clicks++;
    const el = k['ldPop' + (L.popN++ % 5)];
    if (el) {
      L.pops = L.pops.filter((o) => o.el !== el);
      el.textContent = '+' + (5 + L.combo * 5) + ' XP';
      L.pops.push({ el, t, x: e.clientX != null ? e.clientX : L.kx, y: e.clientY != null ? e.clientY : L.ky, r: (Math.random() - 0.5) * 18 });
    }
    this.ldSfx('pop', L.combo);
  }

  ldMeasure() {
    const L = this.ld, k = this.k, vw = this.vw, vh = this.vh;
    let S = 0; try { S = parseFloat(getComputedStyle(k.wm).fontSize); } catch (e) {}
    if (!(S > 10)) S = Math.min(vw * 0.3, vh * 0.46);
    k.ldK.style.fontSize = S + 'px';
    const fw = k.ldKFace.offsetWidth, by = k.ldBase ? k.ldBase.offsetTop : S * 0.8;
    let a = S * 0.66, l = 0, r = fw * 0.9;
    try { const c = document.createElement('canvas').getContext('2d'); c.font = "800 " + S + "px 'Baloo 2'"; const m = c.measureText('K'); if (m.actualBoundingBoxAscent > S * 0.3) { a = m.actualBoundingBoxAscent; l = -m.actualBoundingBoxLeft; r = m.actualBoundingBoxRight; } } catch (e) {}
    const lw = k.loader.clientWidth || vw, lh = k.loader.clientHeight || vh, bk = k.ldBook;
    const bl = bk.offsetLeft, bt = bk.offsetTop, bw = bk.offsetWidth, bh = bk.offsetHeight;
    let lt = bt + bh * 0.72;
    if (k.ldLabel) lt = bt + (k.ldFront ? k.ldFront.clientTop : 0) + k.ldLabel.offsetTop;
    const room = Math.max(100, lt - bt), kw = r - l;
    const s0 = Math.max(0.4, Math.min((room * 0.6) / a, (bw * 0.4) / kw, 3.4));
    const sw = Math.max(12, Math.min(19, vw * 0.0125));
    if (k.ldBandO) k.ldBandO.setAttribute('stroke-width', String(sw + 7));
    if (k.ldBandI) k.ldBandI.setAttribute('stroke-width', String(sw));
    const Z = Math.max(lw / (0.8 * bw), lh / (0.9 * bh)), s1 = Math.max(0.7, Math.min(0.95, (0.94 * lw) / (2 * bw + 60)));
    if (k.ldPageDots) { const dr = (1.6 / Z).toFixed(3), ds = (30 / Z).toFixed(3); k.ldPageDots.style.backgroundImage = 'radial-gradient(#DCE2F4 ' + dr + 'px, transparent ' + dr + 'px)'; k.ldPageDots.style.backgroundSize = ds + 'px ' + ds + 'px'; }
    L.M = { vw, vh, lw, lh, S, fw, kw, kh: a, kcx: (l + r) / 2, kcy: by - a / 2, cl: bl, ct: bt, cw: bw, ch: bh, s0, x0: bl + bw * 0.52, y0: bt + room * 0.54, bx: bw * 0.93, bw: sw, Z, s1, cr: { x: lw / 2 - bl, y: lh / 2 - bt }, cs: { x: 0, y: bh / 2 }, cf: { x: bw * 0.57, y: bh * 0.5 }, hiW: Math.max(60, (k.ldLabelBox ? k.ldLabelBox.clientWidth : 300) - 52), hw: k.ldHint ? k.ldHint.offsetWidth : 200, hh: k.ldHint ? k.ldHint.offsetHeight : 60 };
  }

  ldEnd() {
    const L = this.ld, k = this.k;
    if (L.gone) return;
    L.gone = true; L.kHand = true;
    if (L.exit == null) L.exit = (performance.now() - this.t0) / 1000;
    if (k.loader) { k.loader.style.display = 'none'; if (L.onDown) k.loader.removeEventListener('pointerdown', L.onDown); }
    if (L.onUp) window.removeEventListener('pointerup', L.onUp);
    if (L.onCancel) window.removeEventListener('pointercancel', L.onCancel);
    if (this.lenis) this.lenis.start();
    try { sessionStorage.setItem('kurso-start', '1'); } catch (e) {}
  }

  ldFrame(t, dt, vw, vh) {
    const L = this.ld, k = this.k, { clamp, eoc, eio, eob, st } = this, f = (n, d) => n.toFixed(d == null ? 2 : d);
    if (L.v == null) this.ldInit();
    if (t > 16 && L.done == null) { this.ldEnd(); return; }
    if (!L.fok) { try { L.fok = document.fonts.check("800 100px 'Baloo 2'"); } catch (e) { L.fok = true; } if (t > 2.5) L.fok = true; }
    if (L.M && L.done == null && t - L.mc > 0.4) { L.mc = t; if (k.ldKFace.offsetWidth !== L.M.fw) L.M = null; }
    if (L.fok && L.done == null && (!L.M || L.M.vw !== vw || L.M.vh !== vh)) this.ldMeasure();
    const M = L.M;
    if (!M) return;
    if (L.tk == null) L.tk = t;
    if (t - L.tk > 0.5) L.v = Math.min(L.shown, L.v + L.speed * dt);
    const V = L.v;
    if (L.done == null && V >= 1) L.done = t;
    const dn = L.done == null ? -1 : (t - L.done) * L.ts;
    // l'étiquette : on écrit, on rature, on surligne
    const MSG = ['On taille le crayon…', 'On remplit tes gommes…', 'On rallume ta série…', 'C’est parti !'];
    const mi = dn >= 0 ? 3 : V < 0.34 ? 0 : V < 0.67 ? 1 : 2;
    if (mi !== L.msgN) {
      if (L.msgN >= 0 && k.ldMsgOldT) { k.ldMsgOldT.textContent = MSG[L.msgN]; L.oldT = t; }
      L.msgT = t + (L.msgN >= 0 ? 0.14 : 0); L.msgN = mi;
      if (k.ldMsg) k.ldMsg.textContent = MSG[mi];
    }
    if (k.ldMsg) { const w = eio(clamp((t - L.msgT) / 0.42)), cp = 'inset(-30% ' + f((1 - w) * 104, 1) + '% -30% -4%)'; k.ldMsg.style.clipPath = cp; k.ldMsg.style.webkitClipPath = cp; }
    if (k.ldMsgOld) { const o = t - L.oldT; k.ldMsgOld.style.opacity = f(o < 0.14 ? 1 : 1 - clamp((o - 0.14) / 0.12), 3); if (k.ldStrike) k.ldStrike.style.transform = 'rotate(-2deg) scaleX(' + f(eio(clamp(o / 0.14)), 3) + ')'; }
    const pc = Math.round(V * 100);
    if (pc !== L.pc && k.ldNum) { L.pc = pc; k.ldNum.textContent = String(pc); }
    st(k.ldNum, 'scale(' + f(1 + Math.sin(clamp(dn / 0.32) * Math.PI) * 0.45, 3) + ')');
    if (k.ldHi) k.ldHi.style.width = f(V * M.hiW, 1) + 'px';
    // la lumière suit le curseur — sinon elle se balade toute seule
    if (this.cx !== L.pcx || this.cy !== L.pcy) { if (L.pcx != null && this.cx >= 0) L.lastMove = t; L.pcx = this.cx; L.pcy = this.cy; }
    const idle = this.cx < 0 ? 1 : eio(clamp((t - L.lastMove - 2.4) / 1.4));
    const ox = M.x0 + Math.cos(t * 0.85) * M.cw * 0.34, oy = M.ct + M.ch * 0.06 + Math.sin(t * 1.25) * M.ch * 0.1;
    const lx = this.cx < 0 ? ox : this.cx + (ox - this.cx) * idle, ly = this.cy < 0 ? oy : this.cy + (oy - this.cy) * idle;
    // caméra : repos → double page → plongée dans la page
    const l1 = Math.log(M.s1), lZ = Math.log(M.Z);
    let ccx = M.cr.x, ccy = M.cr.y, ls = 0;
    if (dn >= 0.62) { const e = eio(clamp((dn - 0.62) / 0.66)); ccx += (M.cs.x - M.cr.x) * e; ccy += (M.cs.y - M.cr.y) * e; ls = l1 * e; }
    if (dn >= 1.45) { const e = eio(clamp((dn - 1.45) / 0.7)); ccx = M.cs.x + (M.cf.x - M.cs.x) * e; ccy = M.cs.y + (M.cf.y - M.cs.y) * e; ls = l1 + (lZ - l1) * e; }
    const cs = Math.exp(ls), Tx = M.lw / 2 - cs * ccx - M.cl, Ty = M.lh / 2 - cs * ccy - M.ct;
    // le cahier se pose, puis penche vers ta souris
    const qi = clamp((t - L.tk) / 0.8), fr = dn < 0 ? 1 : 1 - eio(clamp(dn / 0.45)), tf6 = 1 - Math.exp(-dt * 6);
    const nx = clamp((lx - M.cl - M.cw / 2) / (M.lw * 0.5), -1, 1), ny = clamp((ly - M.ct - M.ch / 2) / (M.lh * 0.5), -1, 1);
    L.tx += (-ny * 6 - L.tx) * tf6; L.ty += (nx * 8 - L.ty) * tf6;
    const hw2 = M.cw / 2, hh2 = M.ch / 2, rr = (-1.6 - 6 * (1 - eoc(qi))) * fr, si = 1.12 - 0.12 * eob(qi), bdy = -(1 - eoc(qi)) * 34;
    k.ldBook.style.transform = 'translate(' + f(Tx, 2) + 'px,' + f(Ty + bdy, 2) + 'px) scale(' + f(cs, 5) + ') translate(' + f(hw2, 1) + 'px,' + f(hh2, 1) + 'px) perspective(1600px) rotateX(' + f(L.tx * fr, 3) + 'deg) rotateY(' + f(L.ty * fr, 3) + 'deg) rotate(' + f(rr, 3) + 'deg) scale(' + f(si, 4) + ') translate(' + f(-hw2, 1) + 'px,' + f(-hh2, 1) + 'px)';
    if (!L.bookOn) { const o = clamp(qi * 4); k.ldBook.style.opacity = o >= 1 ? '1' : f(o, 3); if (o >= 1) L.bookOn = true; }
    st(k.ldDrop, 'translate(' + f(-nx * 18 * fr, 1) + 'px,' + f(-ny * 12 * fr + 6, 1) + 'px)', f(0.16 * eoc(qi) * (dn < 0 ? 1 : 1 - clamp((dn - 0.4) / 0.4)), 3));
    st(k.ldLamp, 'translate(' + f(lx, 1) + 'px,' + f(ly, 1) + 'px)');
    if (k.ldFl) this.flame(k.ldFl, k.ldFlI, t);
    // le K : aimanté, en relief, et c'est un gros bouton
    const mxT = clamp((lx - M.x0) * 0.1, -M.cw * 0.08, M.cw * 0.08), myT = clamp((ly - M.y0) * 0.07, -M.ch * 0.04, M.ch * 0.04);
    L.pvx += ((mxT - L.px) * 70 - L.pvx * 12) * dt; L.px += L.pvx * dt;
    L.pvy += ((myT - L.py) * 70 - L.pvy * 12) * dt; L.py += L.pvy * dt;
    let X = M.x0 + L.px, Y = M.y0 + L.py + Math.sin(t * 1.6) * M.kh * M.s0 * 0.012;
    L.kx = X; L.ky = Y;
    const R = M.kh * M.s0 * 0.55, dxl = X - lx, dyl = Y - ly, dl = Math.max(1, Math.hypot(dxl, dyl)), mg = clamp(dl / R, 0.42, 1);
    L.uvx += (((dxl / dl) * mg - L.ux) * 110 - L.uvx * 15) * dt; L.ux += L.uvx * dt;
    L.uvy += (((dyl / dl) * mg - L.uy) * 110 - L.uvy * 15) * dt; L.uy += L.uvy * dt;
    const over = dn < 0 && this.cx >= 0 && Math.hypot(this.cx - X, this.cy - Y) < R * 1.1;
    if (over !== L.ov) { L.ov = over; k.loader.style.cursor = over ? 'pointer' : 'default'; }
    L.hov += ((over ? 1 : 0) - L.hov) * (1 - Math.exp(-dt * 12));
    const pT = L.down || (dn >= 0.36 && dn < 0.54) ? 1 : 0;
    L.prv += ((pT - L.pr) * 650 - L.prv * 19) * dt; L.pr += L.prv * dt;
    L.swv += ((clamp(L.pvx * 0.035, -9, 9) - L.sw) * 90 - L.swv * 13) * dt; L.sw += L.swv * dt;
    const ke = clamp((t - L.tk - 0.35) / 0.55);
    let sc = M.s0 * eob(ke) * (1 + 0.035 * L.hov - 0.025 * clamp(L.pr)), rot = (1 - eoc(ke)) * -18 + L.sw, sx = 1, sy = 1;
    let D = M.S * 0.062, p = clamp(L.pr, -0.4, 1) * 0.72, gl = 1;
    // il saute dans le cahier ouvert et atterrit pile où sera le K du titre
    if (dn >= 0.55) {
      if (!L.f0) { L.f0 = { x: X, y: Y, s: sc, r: rot }; this.ldSfx('swoosh'); }
      let gx = M.lw * 0.3, gy = M.lh * 0.42;
      if (k.wo0) { const r = k.wo0.getBoundingClientRect(); if (r.width > 0) { gx = r.left + M.kcx; gy = r.top + M.kcy; } }
      const pbx = (gx - M.lw / 2) / M.Z + M.cf.x, pby = (gy - M.lh / 2) / M.Z + M.cf.y;
      const txK = M.cl + Tx + cs * pbx, tyK = M.ct + Ty + cs * pby, tsK = cs / M.Z;
      const q = clamp((dn - 0.55) / 0.81), e = eio(q), hop = Math.sin(Math.PI * Math.pow(q, 0.8));
      X = L.f0.x + (txK - L.f0.x) * e; Y = L.f0.y + (tyK - L.f0.y) * e - hop * Math.min(M.lh * 0.18, 170);
      sc = L.f0.s * Math.pow(tsK / L.f0.s, e) * (1 + 0.22 * hop); rot = L.f0.r * (1 - e) - 360 * eio(clamp((q - 0.04) / 0.86));
      const q2 = clamp((dn - 1.36) / 0.26), sq = Math.sin(Math.PI * q2) * (1 - q2) * 0.24;
      sx = 1 + sq; sy = 1 - sq;
      D *= 1 - eoc(clamp(q * 1.6)); p *= 1 - clamp(q * 3); gl = 1 - clamp(q * 2);
      if (q2 > 0 && !L.stamped) { L.stamped = true; this.ldSfx('stamp'); }
      if (dn >= 2.15 && !L.chimed) { L.chimed = true; this.ldChime(); }
    }
    const Yp = Y + (1 - sy) * M.kh * 0.5 * sc;
    k.ldK.style.transform = 'translate(' + f(X, 1) + 'px,' + f(Yp, 1) + 'px) rotate(' + f(rot, 2) + 'deg) scale(' + f(sc * sx, 4) + ',' + f(sc * sy, 4) + ') translate(' + f(-M.kcx, 1) + 'px,' + f(-M.kcy, 1) + 'px)';
    const Dl = D * (1 - p), tf = 'translate(' + f(L.ux * D * p, 2) + 'px,' + f(L.uy * D * p, 2) + 'px)';
    k.ldKFace.style.transform = tf;
    if (k.ldKGlint) { k.ldKGlint.style.transform = tf; k.ldKGlint.style.opacity = f(gl * (0.5 + 0.5 * L.hov), 3); k.ldKGlint.style.backgroundPosition = f(50 - L.ux * 42, 1) + '% 0'; }
    if (k.ldKSide) {
      k.ldKSide.style.transform = tf;
      let sh = 'none';
      if (Dl * sc > 0.5) { const n = Math.max(6, Math.min(26, Math.round((Dl * sc) / 1.6))), rim = Math.max(1, Math.round(n * 0.14)), arr = []; for (let i = 1; i <= n; i++) { const u = (Dl * i) / n; arr.push(f(L.ux * u, 2) + 'px ' + f(L.uy * u, 2) + 'px 0 ' + (i <= rim ? '#2A44D6' : '#131A33')); } arr.push(f(L.ux * Dl * 1.7, 2) + 'px ' + f(L.uy * Dl * 1.7, 2) + 'px ' + f(Dl * 0.9, 2) + 'px rgba(19,26,51,0.22)'); sh = arr.join(','); }
      k.ldKSide.style.textShadow = sh;
    }
    if (k.ldHint) {
      L.hv += ((dn < 0 && L.clicks === 0 && t - L.tk > 1.3 ? 1 : 0) - L.hv) * (1 - Math.exp(-dt * 8));
      const hx = Math.min(X + M.kw * sc * 0.4, vw - M.hw - 10), hy = Math.max(Y - M.kh * sc * 0.4, M.hh + 8);
      st(k.ldHint, 'translate(' + f(hx, 1) + 'px,' + f(hy, 1) + 'px) translateY(-100%) rotate(' + f(-4 + Math.sin(t * 2.6) * 2.5, 2) + 'deg) scale(' + f(0.7 + 0.3 * L.hv, 3) + ')', f(L.hv, 3));
    }
    for (let i = L.pops.length - 1; i >= 0; i--) {
      const o = L.pops[i], q = (t - o.t) / 0.85;
      if (q >= 1) { o.el.style.opacity = '0'; L.pops.splice(i, 1); continue; }
      st(o.el, 'translate(' + f(o.x, 1) + 'px,' + f(o.y - 16 - eoc(q) * 84, 1) + 'px) translate(-50%,-100%) rotate(' + f(o.r * (1 - q), 2) + 'deg) scale(' + f(eob(clamp(q * 3.5)), 3) + ')', f(q < 0.62 ? 1 : 1 - (q - 0.62) / 0.38, 3));
    }
    // la couverture : reflet plastique qui suit la lumière
    const cx0 = lx - M.cl, cy0 = ly - M.ct;
    st(k.ldSheen, 'translate(' + f(cx0, 1) + 'px,' + f(cy0, 1) + 'px)');
    st(k.ldGlare, 'translateX(' + f(M.cw * 0.1 - cx0 * 0.35, 1) + 'px) rotate(24deg)');
    st(k.ldDots, 'translate(' + f(-this.smx * 14, 1) + 'px,' + f(-this.smy * 10, 1) + 'px)');
    // l'élastique : on peut le pincer, puis il saute
    if (k.ldBandO) {
      const H = M.ch;
      let bx = M.bx, bend = L.b, bo = 1;
      if (dn < 0.25) {
        const lcx = this.cx - M.cl, lcy = this.cy - M.ct, inY = this.cx >= 0 && lcy > 8 && lcy < H - 8;
        if (!L.grab && dn < 0 && inY && Math.abs(lcx - M.bx) < 30) L.grab = true;
        if (L.grab && (!inY || Math.abs(lcx - M.bx) > 110 || dn >= 0)) { L.grab = false; if (Math.abs(L.b) > 22) this.ldSfx('twang'); }
        if (L.grab) L.by += (clamp(lcy / H, 0.1, 0.9) - L.by) * (1 - Math.exp(-dt * 16));
        const bT = L.grab ? clamp(lcx - M.bx, -100, 100) : 0;
        L.bv += ((bT - L.b) * (L.grab ? 900 : 520) - L.bv * (L.grab ? 42 : 6)) * dt; L.b += L.bv * dt;
        bend = L.b;
      } else {
        const q = clamp((dn - 0.25) / 0.36);
        if (!L.snapS && q > 0.36) { L.snapS = true; this.ldSfx('twang'); }
        L.by += (0.5 - L.by) * (1 - Math.exp(-dt * 10));
        if (q < 0.36) bend = L.b + (-64 - L.b) * eio(q / 0.36);
        else { const e2 = (q - 0.36) / 0.64; bend = -64 * (1 - eoc(e2)) + Math.sin(Math.PI * e2) * 46; bx = M.bx + (M.cw - M.bx + 160) * eio(e2); bo = 1 - clamp((e2 - 0.7) / 0.3); }
      }
      const yc = L.by * H, d = 'M' + f(bx, 1) + ' -6 Q' + f(bx + bend * 2, 1) + ' ' + f(yc, 1) + ' ' + f(bx, 1) + ' ' + f(H + 6, 1), hx = bx - M.bw * 0.24;
      k.ldBandO.setAttribute('d', d); if (k.ldBandI) k.ldBandI.setAttribute('d', d);
      if (k.ldBandH) k.ldBandH.setAttribute('d', 'M' + f(hx, 1) + ' ' + f(H * 0.05, 1) + ' Q' + f(hx + bend * 2, 1) + ' ' + f(yc, 1) + ' ' + f(hx, 1) + ' ' + f(H * 0.95, 1));
      if (k.ldBand) k.ldBand.style.opacity = f(bo, 3);
    }
    // la couverture s'ouvre vers toi, en vraie perspective
    const PP = Math.max(M.cw * 2.4, 1100), thS = (Math.atan2(2 * PP, M.cw) * 180) / Math.PI;
    const th = dn < 0.62 ? 0 : eio(clamp((dn - 0.62) / 0.66)) * 180, back = th > thS;
    if (back !== L.back) { L.back = back; if (k.ldFront) k.ldFront.style.visibility = back ? 'hidden' : 'visible'; if (k.ldInside) k.ldInside.style.visibility = back ? 'visible' : 'hidden'; if (k.ldBand) k.ldBand.style.visibility = back ? 'hidden' : 'visible'; }
    k.ldCover.style.transform = th > 0 ? 'translateX(' + f(M.cw / 2, 1) + 'px) perspective(' + f(PP, 0) + 'px) translateX(' + f(-M.cw / 2, 1) + 'px) rotateY(' + f(-th, 2) + 'deg)' : 'none';
    if (k.ldShade) k.ldShade.style.opacity = f(back ? 0 : Math.sin((Math.min(1, th / thS) * Math.PI) / 2) * 0.34, 3);
    if (k.ldShade2) k.ldShade2.style.opacity = f(back ? (1 - (th - thS) / (180 - thS)) * 0.32 : 0, 3);
    if (k.ldPageShade) k.ldPageShade.style.opacity = f(Math.sin((th * Math.PI) / 180) * 0.75, 3);
    if (th > 24 && !L.flipS) { L.flipS = true; this.ldSfx('flip'); }
    if (th >= 179.9 && !L.flapS) { L.flapS = true; this.ldSfx('flap'); }
    // la page devient l'accueil : ses points tombent pile sur ceux du site
    if (dn >= 1.4 && !L.dotA && k.ldPageDots && k.ldPage && k.heroDots) {
      L.dotA = true;
      const r = k.heroDots.getBoundingClientRect(), s = 30 / M.Z, pg = k.ldPage, pd = k.ldPageDots, md = (v) => ((v % s) + s) % s;
      const ox2 = pg.offsetLeft + pg.clientLeft + pd.offsetLeft, oy2 = pg.offsetTop + pg.clientTop + pd.offsetTop;
      pd.style.backgroundPosition = f(md((r.left - M.lw / 2) / M.Z + M.cf.x - ox2), 3) + 'px ' + f(md((r.top - M.lh / 2) / M.Z + M.cf.y - oy2), 3) + 'px';
    }
    if (dn >= 2.15 && L.exit == null) L.exit = L.done + 2.15 / L.ts;
    if (k.ldScene) k.ldScene.style.opacity = f(1 - clamp((dn - 2.15) / 0.25), 3);
    if (dn >= 2.4 && !L.kHand) { L.kHand = true; k.ldK.style.visibility = 'hidden'; }
    if (dn >= 2.42) this.ldEnd();
  }


  frame(now) {
    const k = this.k;
    if (!this.vh) { this.measure(); if (!this.vh) return; }
    const { clamp, rng, eoc, eio, eox, eob, st } = this;
    const dt = Math.min(0.05, Math.max(0.001, (now - this.lt) / 1000)); this.lt = now;
    const t = (now - this.t0) / 1000;
    const P = this.props || {};
    const M = this.reduced ? 0 : P.parallax ?? 1;
    if (this.lenis) this.lenis.raf(now);
    const sy = (this.sy = window.scrollY), vh = this.vh, vw = this.vw;
    const f = (n, d) => n.toFixed(d == null ? 2 : d);
    const dy = sy - this.lastY; this.lastY = sy;
    this.vel += (Math.abs(dy) / dt - this.vel) * (1 - Math.exp(-dt * 6));
    const mf = 1 - Math.exp(-dt * 4);
    this.smx += (this.mx - this.smx) * mf; this.smy += (this.my - this.smy) * mf;

    // chargement — le cahier s'ouvre
    const L = this.ld;
    if (!L.gone) {
      if (P.intro === false || this.reduced || !(k.loader && k.ldCover && k.ldK && k.ldKFace)) { L.gone = true; L.exit = -20; if (k.loader) k.loader.style.display = 'none'; if (this.lenis) this.lenis.start(); }
      else {
        const tgt = t > 8 ? 1 : 0.1 + 0.9 * (this.stage || this.noGL ? 1 : this.mp * 0.95);
        L.shown += (tgt - L.shown) * (1 - Math.exp(-dt * 3.2));
        if (tgt >= 1 && L.shown > 0.994) L.shown = 1;
        this.ldFrame(t, dt, vw, vh);
      }
    }
    const ti = L.exit == null ? -1 : t - L.exit;
    const it = (a, b) => (ti < 0 ? 0 : clamp((ti - a) / (b - a)));

    this.gribou(dt, ti, now);

    // 00 · héros
    const ph = this.P('hero'), sp = eio(ph), wox = [-1, -0.5, 0, 0.5, 1];
    st(k.wm, 'translate(-50%,-50%) translate(' + f(-this.smx * 18 * M, 1) + 'px,' + f(-this.smy * 10 * M - sp * vh * 0.08, 1) + 'px) scale(' + f(1 + sp * 0.12, 4) + ')');
    for (let i = 0; i < 5; i++) {
      st(k['wl' + i], 'translateY(' + f(i === 0 && L.kMode ? (L.kHand ? 0 : 105) : (1 - eox(it(0.12 + i * 0.06, 1.05 + i * 0.06))) * 105) + '%)');
      st(k['wo' + i], 'translateX(' + f(wox[i] * sp * vw * 0.2, 1) + 'px)', f(1 - rng(ph, 0.25, 0.95), 3));
    }
    const hx = eio(rng(ph, 0.05, 0.7));
    st(k.hl0, 'translateY(' + f((1 - eox(it(0.42, 1.3))) * 110 - hx * 110) + '%)');
    st(k.hl1, 'translateY(' + f((1 - eox(it(0.5, 1.38))) * 110 - hx * 110) + '%)');
    if (k.hlF) k.hlF.style.clipPath = 'inset(-40% ' + f(100 - 112 * eoc(it(1.05, 1.65)), 2) + '% -40% -30%)';
    const hs = eoc(it(0.75, 1.4));
    st(k.heroTop, null, f(hs * (1 - rng(ph, 0, 0.4)), 3));
    st(k.heroSide, 'translateY(' + f((1 - hs) * 18 - rng(ph, 0, 0.6) * 30, 1) + 'px)', f(hs * (1 - rng(ph, 0, 0.5)), 3));
    st(k.heroDots, 'translate3d(' + f(-this.smx * 8 * M, 1) + 'px,' + f(-ph * 140 * M - this.smy * 6 * M, 1) + 'px,0)');
    const sd = [[-1, -0.7], [1, -0.9], [1, 0.5], [-1, 0.6]], sr = [-10, 8, -6, 12];
    for (let i = 0; i < 4; i++) {
      const pop = eob(it(0.95 + i * 0.09, 1.5 + i * 0.09)), d = 14 + i * 7;
      const x = sd[i][0] * sp * vw * 0.22 - this.smx * d * M, y = sd[i][1] * sp * vh * 0.3 + Math.sin(t * 0.9 + i * 1.9) * 7 * M - this.smy * d * 0.6 * M;
      st(k['s' + i], 'translate3d(' + f(x, 1) + 'px,' + f(y, 1) + 'px,0) rotate(' + f(sr[i] + Math.sin(t * 0.7 + i) * 4 * M, 1) + 'deg) scale(' + f(pop, 3) + ')', f(clamp(pop * 1.4) * (1 - rng(ph, 0.4, 0.9)), 3));
    }
    this.flame(k.hfO, k.hfI, t);

    // recouvrements entre scènes
    for (const s of this.SL) {
      if (!s.cov) continue;
      const c = this.C(s.name);
      if (c === s.lc) continue;
      s.lc = c;
      const e = eio(c), pu = this.push[s.name], di = this.dim[s.name];
      if (pu) pu.style.transform = 'translateY(' + f(-e * 6) + 'vh) scale(' + f(1 - 0.06 * e, 4) + ')';
      if (di) di.style.opacity = f(e * 0.55, 3);
    }

    // 01 · écris
    const pi = this.P('ecrire'), ie = eoc(rng(pi, 0, 0.5));
    st(k.ipad, 'translateY(' + f((1 - ie) * 20) + 'vh) rotateX(' + f((1 - ie) * 58) + 'deg) rotateZ(' + f((1 - ie) * -6) + 'deg) scale(' + f(0.8 + 0.2 * ie + 0.03 * eio(rng(pi, 0.78, 1)), 4) + ')');
    const ci = eoc(rng(pi, 0, 0.22));
    st(k.ipadCopy, 'translateY(' + f((1 - ci) * 30, 1) + 'px)', f(ci, 3));
    for (let i = 0; i < 3; i++) { const q = eoc(rng(pi, 0.4 + i * 0.08, 0.54 + i * 0.08)); st(k['if' + i], 'translateX(' + f((1 - q) * -24, 1) + 'px)', f(q, 3)); }
    if (k.arrow1) k.arrow1.style.strokeDashoffset = f(1 - eio(rng(pi, 0.56, 0.76)), 4);
    if (k.arrow2) k.arrow2.style.strokeDashoffset = f(1 - eio(rng(pi, 0.64, 0.84)), 4);
    st(k.note1t, null, f(rng(pi, 0.62, 0.74), 3)); st(k.note2t, null, f(rng(pi, 0.7, 0.82), 3));
    const hwR = [rng(pi, 0.42, 0.6), rng(pi, 0.62, 0.76), rng(pi, 0.78, 0.9)];
    let li = 0;
    for (let i = 0; i < 3; i++) { const el = k['hw' + i]; if (el) el.style.clipPath = 'inset(-30% ' + f((1 - hwR[i]) * 100, 2) + '% -30% 0)'; if (hwR[i] > 0) li = i; }
    const hm = this.hwM && this.hwM[li], ga = this.S.ecrire && this.S.ecrire.anchor;
    if (hm && ga) ga.style.transform = 'translate(' + f(hm.x + hm.w * hwR[li] - this.gaW / 2, 1) + 'px,' + f(hm.y + hm.h * 0.84 - this.gaH, 1) + 'px)';

    // 02 · entoure
    const pc = this.P('circle'), hc = eoc(rng(pc, 0, 0.16));
    st(k.circleHead, 'translateY(' + f((1 - hc) * 30, 1) + 'px)', f(hc, 3));
    if (k.loop) k.loop.style.strokeDashoffset = f(1 - eio(rng(pc, 0.08, 0.4)), 4);
    const lift = eio(rng(pc, 0.44, 0.7));
    st(k.phrase, 'translateY(' + f(-lift * 15) + 'vh) scale(' + f(1 - 0.32 * lift, 4) + ')', f(1 - 0.82 * lift, 3));
    const cc = rng(pc, 0.5, 0.8);
    st(k.card, 'translate(-50%,-50%) translateY(' + f((1 - eoc(cc)) * 30) + 'vh) rotateY(' + f((1 - eoc(cc)) * -96) + 'deg) scale(' + f(0.84 + 0.16 * eob(cc), 4) + ')', f(rng(pc, 0.5, 0.58), 3));
    const fan = eob(rng(pc, 0.8, 0.94));
    st(k.card2, 'translate(-50%,-50%) translateX(' + f(-fan * 9) + '%) translateY(' + f(fan * 3) + '%) rotate(' + f(-fan * 7) + 'deg)', f(clamp(fan), 3));
    st(k.card3, 'translate(-50%,-50%) translateX(' + f(fan * 9) + '%) translateY(' + f(fan * 3) + '%) rotate(' + f(fan * 7) + 'deg)', f(clamp(fan), 3));
    const cq = rng(pc, 0.86, 0.96);
    st(k.cardCount, 'translateY(' + f((1 - eoc(cq)) * 20, 1) + 'px)', f(cq, 3));

    // 03 · reviens
    const pr = this.P('reviens'), hr = eoc(rng(pr, 0, 0.12));
    st(k.rvCopy, 'translateY(' + f((1 - hr) * 30, 1) + 'px)', f(hr, 3));
    const cr = eoc(rng(pr, 0.03, 0.14));
    st(k.rvCard, 'translateY(' + f((1 - cr) * 40, 1) + 'px) rotate(' + f((1 - cr) * 3, 2) + 'deg)', f(cr * (1 - 0.45 * rng(pr, 0.88, 0.95)), 3));
    const RQ = this.RQ, nQ = RQ.length, q0 = 0.12, qw = 0.15;
    const qi = Math.min(nQ - 1, Math.max(0, Math.floor((pr - q0) / qw))), u = clamp((pr - q0 - qi * qw) / qw), lastQ = qi === nQ - 1;
    if (qi !== this.lastQ) { this.lastQ = qi; const c = RQ[qi]; if (k.rqQ) k.rqQ.textContent = c.q; if (k.rqA) k.rqA.textContent = c.a; if (k.rqTag) { k.rqTag.textContent = c.tag; k.rqTag.style.background = c.ok ? '#3B5BFF' : '#131A33'; } }
    const ein = eoc(rng(u, 0, 0.2)), eout = lastQ ? 0 : eio(rng(u, 0.82, 1));
    st(k.rq, 'translateX(' + f((1 - ein) * 45 - eout * 55) + '%) rotate(' + f((1 - ein) * 7 - eout * 9, 2) + 'deg)', f(pr < q0 ? 0 : ein * (1 - eout), 3));
    const ra = eoc(rng(u, 0.28, 0.46));
    st(k.rqA, 'translateY(' + f((1 - ra) * 10, 1) + 'px)', f(ra, 3));
    const press = pr >= q0 && u >= 0.5 && (lastQ || u < 0.86), okQ = RQ[qi].ok;
    const btn = (el, on, bg) => { if (!el) return; const sk = on ? bg : 'off'; if (el._s === sk) return; el._s = sk; el.style.background = on ? bg : '#FFFFFF'; el.style.transform = on ? 'translateY(3px)' : 'none'; el.style.boxShadow = on ? '0 1px 0 #131A33' : '0 4px 0 #131A33'; };
    btn(k.rbYes, press && okQ, '#17B26A'); btn(k.rbNo, press && !okQ, '#FF8FA3');
    let vi = 0;
    for (let i = 0; i < nQ; i++) if (pr >= q0 + i * qw + qw * 0.6) vi = i + 1;
    const RVs = this.RV[vi], rEnd = pr >= 0.9;
    this.rvState = { vi, end: rEnd, ok: vi > 0 ? RQ[vi - 1].ok : true };
    const xpT = rEnd ? 286 : RVs.xp;
    this.rxp += (xpT - this.rxp) * (1 - Math.exp(-dt * 7));
    const xr = Math.round(this.rxp);
    if (xr !== this.lastRX && k.rXP) { this.lastRX = xr; k.rXP.textContent = String(xr); }
    if (RVs.combo !== this.lastCombo) { this.lastCombo = RVs.combo; this.comboT = t; if (k.rCombo) { k.rCombo.textContent = '×' + RVs.combo; k.rCombo.style.background = RVs.combo >= 3 ? '#FF8FA3' : '#FFD24D'; } }
    const cpop = this.comboT ? Math.sin(clamp((t - this.comboT) / 0.35) * Math.PI) : 0;
    st(k.rCombo, 'scale(' + f(1 + 0.35 * cpop, 3) + ') rotate(' + f(-8 * cpop, 1) + 'deg)');
    for (let i = 0; i < 5; i++) { const on = i < RVs.gom, el = k['rg' + i]; if (el && el._on !== on) { el._on = on; el.style.transition = 'transform 0.35s cubic-bezier(0.3,1.5,0.5,1), opacity 0.35s'; el.style.transform = on ? 'none' : 'scaleY(0.2)'; el.style.opacity = on ? 1 : 0.3; } }
    this.segA += (vi * 2 - this.segA) * (1 - Math.exp(-dt * 6));
    for (let i = 0; i < 10; i++) st(k['rs' + i], 'scaleX(' + f(clamp(this.segA - i), 3) + ')');
    const pe = eob(rng(pr, 0.9, 0.98));
    st(k.rvEnd, 'translate(-50%,-50%) scale(' + f(pe, 3) + ') rotate(' + f((1 - clamp(pe)) * -8, 1) + 'deg)', f(clamp(pe), 3));

    // 04 · entre amis
    {
      const pa = this.P('amis'), A = this.amS2 || (this.amS2 = { W: 0, H: 0, R: null, S: [0, 0], on: [null, null, null], dot: null });
      const ci = eoc(rng(pa, 0, 0.1));
      st(k.amCopy, 'translateY(' + f((1 - ci) * 30, 1) + 'px)', f(ci, 3));
      const TK = [0.12, 0.6, 0.9];
      for (let i = 0; i < 3; i++) {
        const on = pa >= TK[i], c = k['amC' + i];
        if (c && A.on[i] !== on) { A.on[i] = on; c.style.background = on ? '#17B26A' : 'transparent'; c.style.borderStyle = on ? 'solid' : 'dashed'; }
        st(k['amK' + i], 'scale(' + f(eob(rng(pa, TK[i], TK[i] + 0.03)), 3) + ')');
      }
      // l'iPad arrive, la page du cours manqué est vide
      const ie = eoc(rng(pa, 0, 0.16)), bp = pa > 0.58 ? Math.sin(clamp((pa - 0.58) / 0.05) * Math.PI) : 0;
      st(k.amIpad, 'translateY(' + f((1 - ie) * 20, 2) + 'vh) translateY(' + f(bp * 5, 1) + 'px) rotateX(' + f((1 - ie) * 58, 2) + 'deg) rotateZ(' + f((1 - ie) * -6, 2) + 'deg) scale(' + f(0.8 + 0.2 * ie, 4) + ')');
      const an = vw >= 760 && vh >= 520 ? 1 : 0, ar = (el, a, b) => { if (el) el.style.strokeDashoffset = f(1 - eoc(rng(pa, a, b)), 3); };
      st(k.amNA, null, f(an * eoc(rng(pa, 0.1, 0.16)) * (1 - rng(pa, 0.31, 0.35)), 3)); ar(k.amArA, 0.12, 0.2);
      st(k.amNB, null, f(an * eoc(rng(pa, 0.22, 0.27)) * (1 - rng(pa, 0.31, 0.35)), 3)); ar(k.amArB, 0.23, 0.3);
      st(k.amNC, null, f(an * eoc(rng(pa, 0.7, 0.75)) * (1 - rng(pa, 0.86, 0.9)), 3)); ar(k.amArC, 0.71, 0.78);
      // tes amis qui ont écrit ce jour-là, tu touches Léa
      for (let i = 0; i < 3; i++) {
        const tap = i === 0 && pa > 0.29 ? Math.sin(clamp((pa - 0.29) / 0.05) * Math.PI) : 0;
        st(k['amAv' + i], 'scale(' + f(eob(rng(pa, 0.18 + i * 0.03, 0.23 + i * 0.03)) * (1 + 0.28 * tap), 3) + ')');
      }
      const rq = rng(pa, 0.29, 0.36);
      st(k.amRing, 'scale(' + f(1 + rq * 0.9, 3) + ')', f(rq > 0 && rq < 1 ? (1 - rq) * 0.9 : 0, 3));
      // sa page s'envole, se retourne et se pose dans ton iPad
      const ip = k.amIpad, sl = k.amSlot, IW = ip ? ip.offsetWidth : 0, IH = ip ? ip.offsetHeight : 0;
      if (IW && sl && (A.W !== IW || A.H !== IH)) {
        A.W = IW; A.H = IH;
        const rel = (n) => { let x = 0, y = 0; while (n && n !== ip) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return [x, y]; };
        const sp = rel(sl), sw = sl.offsetWidth, sh = sl.offsetHeight;
        A.R = { w: sw, h: sh };
        for (const n of [k.amSheet, k.amShadow]) if (n) { n.style.left = sp[0] + 'px'; n.style.top = sp[1] + 'px'; n.style.width = sw + 'px'; n.style.height = sh + 'px'; }
        const av = k.amAv0; if (av) { const ap = rel(av); A.S = [ap[0] + av.offsetWidth / 2 - (sp[0] + sw / 2), ap[1] + av.offsetHeight / 2 - (sp[1] + sh / 2)]; }
      }
      const q = eio(rng(pa, 0.34, 0.58));
      if (A.R) {
        const x0 = A.S[0], y0 = A.S[1], h1 = Math.sin(Math.PI * q), u = 1 - q, cx = x0 * 0.15, cy = -A.R.h * 0.85;
        const dx = u * u * x0 + 2 * u * q * cx, dy2 = u * u * y0 + 2 * u * q * cy;
        const s = (0.1 + 0.9 * eoc(q)) * (1 + 0.24 * h1);
        const rz = (1 - eoc(q)) * -28 + Math.sin(q * Math.PI * 3) * 5 * u, ry = (1 - eio(q)) * 180, rx = h1 * 16;
        st(k.amSheet, 'translate(' + f(dx, 1) + 'px,' + f(dy2, 1) + 'px) perspective(1400px) rotateX(' + f(rx, 2) + 'deg) rotateY(' + f(ry, 2) + 'deg) rotate(' + f(rz, 2) + 'deg) scale(' + f(s * (1 + 0.03 * bp), 4) + ')', q > 0 ? '1' : '0');
        st(k.amShadow, 'translate(' + f(dx + h1 * 40, 1) + 'px,' + f(dy2 + h1 * 70, 1) + 'px) scale(' + f(s * (1 - 0.08 * h1), 4) + ')', f(q > 0 && q < 1 ? 0.24 * (0.35 + 0.65 * h1) : 0, 3));
      }
      const landed = pa >= 0.58, sw2 = eob(rng(pa, 0.58, 0.63));
      st(k.amChipA, 'scale(' + f(1 - 0.4 * clamp(sw2), 3) + ')', f(1 - clamp(sw2 * 2), 3));
      st(k.amChipB, 'scale(' + f(0.5 + 0.5 * sw2, 3) + ')', f(clamp(sw2 * 2), 3));
      if (A.dot !== landed && k.amDot) { A.dot = landed; k.amDot.style.background = landed ? '#17B26A' : 'transparent'; k.amDot.style.borderStyle = landed ? 'solid' : 'dashed'; }
      st(k.amDot, 'scale(' + f(1 + 0.7 * (landed ? Math.sin(clamp((pa - 0.58) / 0.04) * Math.PI) : 0), 3) + ')');
      const tq = eob(rng(pa, 0.59, 0.64)), tout = 1 - rng(pa, 0.8, 0.84);
      st(k.amToast, 'translate(-50%,-50%) rotate(' + f(-3 - (1 - clamp(tq)) * 9, 1) + 'deg) scale(' + f(Math.max(0, tq) * tout, 3) + ')', f(clamp(tq * 3) * tout, 3));
      const my = Math.round(100 - 100 * eoc(rng(pa, 0.66, 0.75)));
      if (k.amMy && k.amMy._v !== my) { k.amMy._v = my; k.amMy.style.clipPath = 'inset(-30% ' + my + '% -30% 0)'; }
      // un nouvel ami arrive avec ton code
      const pq = eob(rng(pa, 0.84, 0.88)), sq = rng(pa, 0.88, 0.93), se = eob(sq);
      st(k.amPlus, 'scale(' + f(pq, 3) + ')');
      st(k.amSami, 'translate(' + f(260 * (1 - se), 1) + 'px,' + f(-220 * (1 - se), 1) + 'px) rotate(' + f(40 * (1 - se), 1) + 'deg) scale(' + f(1 + 0.8 * (1 - clamp(sq * 1.4)), 3) + ')', sq > 0 ? '1' : '0');
      const cq = eob(rng(pa, 0.9, 0.95));
      st(k.amCode, 'scale(' + f(0.6 + 0.4 * cq, 3) + ') rotate(' + f(-2 * cq, 2) + 'deg)', f(clamp(cq * 2), 3));
    }

    // 04 · la ligue
    const pl = this.P('ligue'), hl = eoc(rng(pl, 0, 0.1));
    st(k.lgCopy, 'translateY(' + f((1 - hl) * 30, 1) + 'px)', f(hl, 3));
    const bn = eob(rng(pl, 0.02, 0.14)), sw = Math.sin(t * 1.7) * 1.4 * clamp(bn);
    st(k.bnL, 'translateY(' + f((1 - bn) * -115) + '%) rotate(' + f(sw, 2) + 'deg)');
    st(k.bnR, 'translateY(' + f((1 - bn) * -115) + '%) rotate(' + f(-sw, 2) + 'deg)');
    st(k.pBase, 'scaleX(' + f(eoc(rng(pl, 0.08, 0.17)), 3) + ')');
    const bw2 = (this.pbw || 140) / 2;
    [[3, 0.17, 0.29], [2, 0.35, 0.47], [1, 0.53, 0.65]].forEach(([n, a0, a1]) => {
      const r = rng(pl, a0, a1);
      st(k['pb' + n], 'translateY(' + f((1 - eob(r)) * 140, 2) + '%)');
      const du = rng(r, 0.25, 1), op = Math.sin(du * Math.PI);
      for (let j = 0; j < 6; j++) { const s = j % 2 ? 1 : -1; st(k['pd' + n + j], 'translate(' + f(s * (bw2 + du * (12 + j * 7)), 1) + 'px,' + f(-du * (8 + (j % 3) * 10), 1) + 'px) scale(' + f(0.5 + du * 0.8, 3) + ')', f(op * 0.95, 3)); }
      const av = rng(pl, a1 - 0.01, a1 + 0.06);
      st(k['pa' + n], 'translateY(' + f((1 - eob(av)) * -320) + '%)', f(clamp(av * 4), 3));
      const tg = eob(rng(pl, a1 + 0.04, a1 + 0.09));
      st(k['pt' + n], 'scale(' + f(Math.max(0, tg), 3) + ')', f(clamp(tg * 2), 3));
    });
    const cw = rng(pl, 0.73, 0.8);
    st(k.pCrown, 'translate(-50%,' + f((1 - eob(cw)) * -260) + '%) rotate(' + f((1 - cw) * -35, 1) + 'deg)', f(clamp(cw * 3), 3));
    const up = pl >= 0.83;
    this.lgUp = up;
    this.lgB = (this.lgB || 0) + ((up ? 1 : 0) - (this.lgB || 0)) * (1 - Math.exp(-dt * 7));
    st(k.lgBadge, 'translateX(-50%) scale(' + f(Math.max(0, eob(this.lgB)), 3) + ') rotate(-4deg)', f(clamp(this.lgB * 1.5), 3));
    if (up !== this.lastUp) {
      this.lastUp = up;
      if (k.lgG2) { const g2 = k.lgG2.style; g2.background = up ? '#17B26A' : 'transparent'; g2.borderColor = up ? '#131A33' : '#DCE3FF'; g2.borderStyle = up ? 'solid' : 'dashed'; g2.color = up ? '#131A33' : '#FFFFFF'; g2.transform = up ? 'scale(1.12)' : 'none'; }
      if (k.pt3) k.pt3.style.background = up ? '#17B26A' : '#FFD24D';
    }

    // 05 · le jeu
    const pg = this.P('game'), hg = eoc(rng(pg, 0, 0.14));
    st(k.gameCopy, 'translateY(' + f((1 - hg) * 30, 1) + 'px)', f(hg, 3));
    const mine = Math.round(18 + 82 * eio(rng(pg, 0.1, 0.64)));
    if (mine !== this.lastMine) { this.lastMine = mine; if (k.minePct) k.minePct.textContent = mine + ' %'; st(k.mineBar, 'scaleX(' + (mine / 100).toFixed(3) + ')'); }
    const lv = pg >= 0.66 ? 13 : 12;
    if (lv !== this.lastLv) { this.lastLv = lv; if (k.lvl) k.lvl.textContent = String(lv); }
    const bp = Math.sin(rng(pg, 0.66, 0.74) * Math.PI);
    st(k.lvlBox, 'scale(' + f(1 + 0.3 * bp, 4) + ') rotate(' + f(bp * -6) + 'deg)');
    const lt = eoc(rng(pg, 0.68, 0.78));
    st(k.lvlTag, 'translateX(' + f((1 - lt) * -16, 1) + 'px)', f(lt, 3));
    const cb = eoc(rng(pg, 0.66, 0.88)), cfade = 1 - rng(pg, 0.84, 0.98);
    this.cf.forEach((c) => st(c.n, 'translate(' + f(c.dx * cb, 1) + 'px,' + f(c.dy * cb + cb * cb * 70, 1) + 'px) rotate(' + f(c.r * cb, 1) + 'deg)', f(cb > 0.001 ? cfade : 0, 3)));
    for (let i = 0; i < 3; i++) { const q = rng(pg, 0.18 + i * 0.09, 0.34 + i * 0.09); st(k['st' + i], 'translateY(' + f((1 - eoc(q)) * 50, 1) + 'px) scale(' + f(0.9 + 0.1 * eob(q), 4) + ')', f(clamp(q * 1.5), 3)); }
    this.flame(k.flameO, k.flameI, t);

    // 06 · le motion
    const pf = this.P('film');
    st(k.mq1, 'translate3d(' + f((-10 - pf * 40) * M) + 'vw,0,0)');
    st(k.mq2, 'translate3d(' + f((-50 + pf * 40) * M) + 'vw,0,0)');
    const fe = eoc(rng(pf, 0, 0.42));
    st(k.phone, 'translateY(' + f((1 - fe) * 26) + 'vh) rotate(' + f((1 - fe) * -9) + 'deg) scale(' + f(0.62 + 0.38 * fe + 0.03 * rng(pf, 0.7, 1), 4) + ')');
    const fc = eoc(rng(pf, 0.3, 0.46));
    st(k.filmL, 'translateY(' + f((1 - fc) * 24, 1) + 'px)', f(fc, 3));
    st(k.filmR, 'translateY(' + f((1 - fc) * 16, 1) + 'px)', f(fc, 3));
    st(k.soundBtn, null, f(fc, 3));

    // 07 · partout
    const ps = this.P('sync'), se = eio(rng(ps, 0.04, 0.55));
    st(k.syHead, null, f(eoc(rng(ps, 0, 0.14)), 3));
    st(k.syIpad, 'translateX(' + f((1 - se) * -36) + 'vw) rotate(' + f((1 - se) * -8 - 2) + 'deg)', f(clamp(0.2 + se), 3));
    st(k.syMac, 'translateX(' + f((1 - se) * 36) + 'vw) rotate(' + f((1 - se) * 8 + 1.5) + 'deg)', f(clamp(0.2 + se), 3));
    const spp = eob(rng(ps, 0.5, 0.64));
    st(k.syPill, 'translate(-50%,-50%) scale(' + f(spp, 4) + ')', f(clamp(spp), 3));
    const cyc = (t % 1.8) / 1.8;
    st(k.syRing, 'scale(' + f(1 + 1.1 * cyc, 3) + ')', f(0.55 * (1 - cyc) * clamp(spp), 3));
    st(k.syCap, null, f(eoc(rng(ps, 0.6, 0.74)), 3));

    // apparitions au défilement
    for (const r of this.rv) {
      const q = clamp((sy + vh * 0.9 - r.top) / (vh * 0.32) - r.d);
      const e = Math.round(eoc(q) * 1000) / 1000;
      if (e === r.last) continue;
      r.last = e;
      r.n.style.transform = 'translateY(' + f((1 - e) * 56, 1) + 'px)';
      r.n.style.opacity = e;
      if (r.count) r.n.textContent = (19.99 * e).toFixed(2).replace('.', ',') + ' €';
    }
    const fb = this.S.beta;
    if (fb && k.footWM) st(k.footWM, 'translate(-50%,' + f((1 - eoc(clamp((sy + vh - (fb.top + fb.h) + vh * 0.5) / (vh * 0.5)))) * 35) + '%)');

    // navigation, chapitre, curseur
    if (k.nav) {
      if (sy > vh * 0.9 && dy > 4 && !this.navHidden) { this.navHidden = true; k.nav.style.transform = 'translate(-50%,-150%)'; }
      else if ((dy < -4 || sy < vh * 0.9) && this.navHidden) { this.navHidden = false; k.nav.style.transform = 'translate(-50%,0)'; }
    }
    const lab = this.domS ? this.domS.chap : '';
    if (lab !== this.lastChap) {
      this.lastChap = lab;
      if (k.chapTxt && lab) { k.chapTxt.textContent = lab; if (k.chapTxt.animate && !this.reduced) k.chapTxt.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: 520, easing: 'cubic-bezier(0.2,0.8,0.2,1)' }); }
      if (k.chap) k.chap.style.opacity = lab ? 1 : 0;
    }
    st(k.chapBar, 'scaleX(' + f(clamp(sy / this.docH), 4) + ')');
    if (this.fine && k.cur) {
      const cf = 1 - Math.exp(-dt * 16);
      this.pcx += (this.cx - this.pcx) * cf; this.pcy += (this.cy - this.pcy) * cf;
      k.cur.style.transform = 'translate(' + f(this.pcx, 1) + 'px,' + f(this.pcy, 1) + 'px)';
    }
  }

  renderVals() {
    const S = {
      solide: { dot: '#17B26A', label: 'acquise', labelFg: '#0E7A4E', pct: '94%', bg: '#FFFFFF', border: '3px solid #131A33', shadow: '0 5px 0 #131A33' },
      palit: { dot: '#B8934A', label: 'à revoir', labelFg: '#8A6410', pct: '58%', bg: '#FFFFFF', border: '3px solid #131A33', shadow: '0 5px 0 #131A33' },
      pale: { dot: '#E5484D', label: 'à sauver', labelFg: '#B3242A', pct: '22%', bg: '#FFFFFF', border: '3px solid #131A33', shadow: '0 5px 0 #131A33' },
      brouillon: { dot: '#C9CFE0', label: 'brouillon', labelFg: '#4C5470', pct: '4%', bg: '#F6F8FF', border: '3px dashed #6C7590', shadow: 'none' },
    };
    const raw = [
      ['S36', '01.09', 'Récurrences', 'Algorithmique', 'solide'],
      ['S36', '03.09', 'Suites de Cauchy', 'Analyse III', 'solide'],
      ['S37', '08.09', 'Théorème maître', 'Algorithmique', 'solide'],
      ['S37', '10.09', 'Fonction d\u2019onde', 'Physique quantique', 'palit'],
      ['S38', '15.09', 'Tri par tas', 'Algorithmique', 'solide'],
      ['S38', '17.09', 'Variables aléatoires', 'Statistiques', 'solide'],
      ['S39', '22.09', 'Files de priorité', 'Algorithmique', 'pale'],
      ['S40', '29.09', 'Effet tunnel', 'Physique quantique', 'pale'],
      ['S41', '06.10', 'Tables de hachage', 'Algorithmique', 'solide'],
      ['S42', '13.10', 'Intégrale de Riemann', 'Analyse III', 'palit'],
      ['S43', '20.10', 'Graphes pondérés', 'Algorithmique', 'pale'],
      ['S44', '27.10', 'Dijkstra', 'Algorithmique', 'palit'],
      ['S45', '03.11', 'Tests d\u2019hypothèse', 'Statistiques', 'solide'],
      ['S46', '10.11', 'Complexité amortie', 'Algorithmique', 'solide'],
      ['S48', '24.11', 'NP-complétude', 'Algorithmique', 'brouillon'],
    ];
    const ys = [0, 26, -12, 18, -6, 30, 4, -16, 22, -4, 14, -18, 10, 24, -8];
    const rots = [-2, 1.5, -1, 2, -1.5, 1, -2, 1.5, -1, 2, -1.5, 1, -2, 1.5, -1];
    const mapCards = raw.map((r, i) => Object.assign({ week: r[0], date: r[1], title: r[2], course: r[3], y: ys[i] + 'px', rot: rots[i] + 'deg' }, S[r[4]]));
    const cols = ['#FFD24D', '#FFFFFF', '#FF8FA3', '#17B26A'];
    const confetti = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + (i % 2 ? 0.18 : -0.12), d = 170 + ((i * 37) % 110);
      confetti.push({ bg: cols[i % 4], w: (i % 3 === 0 ? 18 : 12) + 'px', h: (i % 3 === 0 ? 10 : 12) + 'px', r: i % 2 ? '999px' : '3px', dx: Math.round(Math.cos(a) * d), dy: Math.round(Math.sin(a) * d * 0.8 - 30), rot: (i % 2 ? 1 : -1) * (120 + i * 23) });
    }
    return {
      mapCards,
      confetti,
      poke: this.poke,
      toggleSound: this.toggleSound,
      notJoined: !this.state.joined,
      joined: this.state.joined,
      onEmail: (e) => { this.email = e.target.value; },
      submit: (e) => {
        e.preventDefault();
        if ((this.email || '').indexOf('@') > 0) this.setState({ joined: true });
        else if (this.k && this.k.emailField) this.k.emailField.style.borderColor = '#B3242A';
      },
    };
  }
}
return Component
}

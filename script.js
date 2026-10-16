// Invitation sounds — warm and mature, synthesized with WebAudio (no files needed)
let sfxCtx = null, master = null, verbSend = null;
function audio() {
  if (!sfxCtx) {
    sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
    master = sfxCtx.createGain(); master.gain.value = 0.9; master.connect(sfxCtx.destination);
    // small hall reverb from a generated impulse
    const dur = 2.4, rate = sfxCtx.sampleRate, len = Math.floor(rate * dur);
    const ir = sfxCtx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8);
    }
    const conv = sfxCtx.createConvolver(); conv.buffer = ir;
    const wet = sfxCtx.createGain(); wet.gain.value = 0.45;
    verbSend = sfxCtx.createGain();
    verbSend.connect(conv); conv.connect(wet); wet.connect(master);
  }
  if (sfxCtx.state === "suspended") sfxCtx.resume();
  return sfxCtx;
}
function out(node, send = 0.6) {
  node.connect(master);
  if (send > 0) { const s = sfxCtx.createGain(); s.gain.value = send; node.connect(s); s.connect(verbSend); }
}
function noiseSrc(ctx, dur) {
  const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
  const ch = buf.getChannelData(0);
  for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  return src;
}
// Muted wax-seal break: soft low thud, no cartoon pop
function playPop() {
  try {
    const ctx = audio(), t = ctx.currentTime;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(170, t);
    o.frequency.exponentialRampToValueAtTime(58, t + 0.18);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.28, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
    o.connect(g); out(g, 0.5);
    o.start(t); o.stop(t + 0.35);
  } catch {}
}
// Flap opening: faint low air movement, slow and quiet — no swoosh sweep
function playWhoosh(dur = 0.8) {
  try {
    const ctx = audio(), t = ctx.currentTime;
    const src = noiseSrc(ctx, dur);
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05, t + dur * 0.45);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(lp); lp.connect(g); out(g, 0.7);
    src.start(t); src.stop(t + dur + 0.05);
  } catch {}
}
// Card sliding out: soft warm page, quiet with a slow bloom
function playPaper(dur = 0.9) {
  try {
    const ctx = audio(), t = ctx.currentTime;
    const src = noiseSrc(ctx, dur);
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 500;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2400;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.07, t + dur * 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(hp); hp.connect(lp); lp.connect(g); out(g, 0.7);
    src.start(t); src.stop(t + dur + 0.05);
  } catch {}
}
// Reveal: one temple bell over a warm Sa–Pa drone swell. Dignified, no sparkle.
// Hindu temple bell (kovil mani): bronze partials with slow beating + bright strike clang
function templeBell(freq, t, vol, decay) {
  // slightly detuned pairs give bronze its living shimmer
  [[1, 1, 0], [1.004, 0.55, 0], [2.39, 0.34, 0], [2.398, 0.2, 0], [3.91, 0.16, 0], [5.43, 0.09, 0]].forEach(([m, a]) => {
    const o = sfxCtx.createOscillator(), g = sfxCtx.createGain();
    o.type = "sine"; o.frequency.value = freq * m;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(vol * a, 0.0002), t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    o.connect(g); out(g, 0.9);
    o.start(t); o.stop(t + decay + 0.1);
  });
  // deep hum an octave below for body
  const h = sfxCtx.createOscillator(), hg = sfxCtx.createGain();
  h.type = "sine"; h.frequency.value = freq / 2;
  hg.gain.setValueAtTime(0.0001, t);
  hg.gain.exponentialRampToValueAtTime(Math.max(vol * 0.35, 0.0002), t + 0.03);
  hg.gain.exponentialRampToValueAtTime(0.0001, t + decay * 0.8);
  h.connect(hg); out(hg, 0.8);
  h.start(t); h.stop(t + decay);
  // bright metallic strike transient
  const src = noiseSrc(sfxCtx, 0.07);
  const hp = sfxCtx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 4200;
  const ng = sfxCtx.createGain();
  ng.gain.setValueAtTime(Math.max(vol * 0.5, 0.0002), t);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
  src.connect(hp); hp.connect(ng); out(ng, 0.7);
  src.start(t);
}
function playShimmer() {
  try {
    const ctx = audio(), t = ctx.currentTime;
    const dg = ctx.createGain();
    dg.gain.setValueAtTime(0.0001, t);
    dg.gain.exponentialRampToValueAtTime(0.035, t + 1.1);
    dg.gain.exponentialRampToValueAtTime(0.0001, t + 3.4);
    out(dg, 0.8);
    [130.81, 196.0].forEach((f) => {
      const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = f;
      o.connect(dg); o.start(t); o.stop(t + 3.5);
    });
    templeBell(261.63, t + 0.05, 0.22, 3.6);
    templeBell(392.0, t + 0.9, 0.09, 2.8);
  } catch {}
}

// Festive nadaswaram welcome when the invitation opens.
// Drop a real recording as "nadaswaram.mp3" next to index.html and it plays;
// otherwise a synthesized reed-like mangala phrase plays (no files needed).
let nadPlayed = false;
function playMangalaSynth() {
  try {
    const ctx = audio(), t0 = ctx.currentTime + 0.05;
    // soft Sa–Pa drone bed
    const dg = ctx.createGain();
    dg.gain.setValueAtTime(0.0001, t0);
    dg.gain.exponentialRampToValueAtTime(0.03, t0 + 1.0);
    dg.gain.exponentialRampToValueAtTime(0.0001, t0 + 8.2);
    out(dg, 0.8);
    [130.81, 196.0].forEach((f) => {
      const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = f;
      o.connect(dg); o.start(t0); o.stop(t0 + 8.3);
    });
    // reedy lead (detuned saws + vibrato), Mohanam ascent
    const seq = [
      [261.63, 0.0, 0.42], [293.66, 0.42, 0.42], [329.63, 0.84, 0.42],
      [392.0, 1.26, 0.84], [440.0, 2.1, 0.42], [392.0, 2.52, 0.42],
      [329.63, 2.94, 0.42], [293.66, 3.36, 0.84], [261.63, 4.2, 1.4],
      [329.63, 5.7, 0.3], [392.0, 6.0, 0.3], [440.0, 6.3, 0.3], [523.25, 6.6, 1.6],
    ];
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1900; lp.Q.value = 0.6;
    const lg = ctx.createGain(); lg.gain.value = 0.075;
    lp.connect(lg); out(lg, 0.85);
    seq.forEach(([f, dt, d]) => {
      const st = t0 + dt;
      const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = f;
      const o2 = ctx.createOscillator(); o2.type = "sawtooth"; o2.frequency.value = f; o2.detune.value = 6;
      const vib = ctx.createOscillator(); vib.frequency.value = 5.8;
      const vg = ctx.createGain(); vg.gain.value = f * 0.012;
      vib.connect(vg); vg.connect(o.frequency); vg.connect(o2.frequency);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, st);
      g.gain.exponentialRampToValueAtTime(1, st + 0.09);
      g.gain.setValueAtTime(1, st + Math.max(d - 0.08, 0.1));
      g.gain.exponentialRampToValueAtTime(0.0001, st + d + 0.06);
      o.connect(g); o2.connect(g); g.connect(lp);
      [o, o2, vib].forEach(n => { n.start(st); n.stop(st + d + 0.15); });
    });
  } catch {}
}
function playNadaswaram() {
  if (nadPlayed) return; nadPlayed = true;
  let done = false;
  const synth = () => { if (!done) { done = true; playMangalaSynth(); } };
  try {
    const a = new Audio("./nadaswaram.mp3");
    a.volume = 0.85;
    a.addEventListener("error", synth);
    a.addEventListener("playing", () => { done = true; });
    const p = a.play();
    if (p && typeof p.catch === "function") p.catch(synth);
  } catch { synth(); }
}

// Sealed-envelope opener: seal breaks -> flap opens -> card rises -> expands into the temple-by-the-sea scene
const opener = document.getElementById("opener");
const openBtn = document.getElementById("openBtn");
const envelope = document.getElementById("envelope");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
function revealSite() {
  opener.classList.add("open");
  document.body.classList.remove("locked");
  document.body.classList.add("opened");
  window.scrollTo({ top: 0 });
  const cover = document.getElementById("cover");
  if (cover) cover.classList.add("in");
  if (location.hash) {
    const t = document.querySelector(location.hash);
    if (t) setTimeout(() => t.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }), 150);
  }
}
if (opener && openBtn && envelope) {
  document.body.classList.add("locked");
  document.body.classList.remove("opened");
  const petals = ["🌸", "🏵️", "🌼", "❋"];
  const burst = () => {
    if (reducedMotion) return;
    for (let i = 0; i < 22; i++) {
      const s = document.createElement("span");
      s.className = "petal";
      s.textContent = petals[i % petals.length];
      s.style.left = `${38 + Math.random() * 24}%`;
      s.style.setProperty("--dx", `${(Math.random() - 0.5) * 60}vw`);
      s.style.animationDelay = `${Math.random() * 0.3}s`;
      opener.appendChild(s);
      setTimeout(() => s.remove(), 2400);
    }
  };
  openBtn.addEventListener("click", () => {
    openBtn.disabled = true;
    if (reducedMotion) {
      playPop(); playNadaswaram();
      revealSite();
      setTimeout(() => opener.remove(), 100);
      return;
    }
    playPop();                                            // seal breaks
    envelope.classList.add("unsealed");       // seal pops
    setTimeout(() => { envelope.classList.add("flap-open"); playWhoosh(0.8); }, 380);   // flap rotates up
    setTimeout(() => { envelope.classList.add("letter-out"); playPaper(0.9); }, 1050); // card slides out
    setTimeout(() => { envelope.classList.add("expand"); burst(); playWhoosh(1.0); playShimmer(); playNadaswaram(); }, 1950); // card -> temple scene
    setTimeout(revealSite, 2650);
    setTimeout(() => opener.remove(), 3450);
  });
} else {
  document.body.classList.remove("locked");
  document.body.classList.add("opened");
}

// Muhurtham: Sunday 13 Dec 2026, 6:30 AM IST. Format: YYYY-MM-DDTHH:MM:SS+05:30
const WEDDING_DATE = new Date("2026-12-13T06:30:00+05:30");

const dEl = document.getElementById("d");
const hEl = document.getElementById("h");
const mEl = document.getElementById("m");
const sEl = document.getElementById("s");
const noteEl = document.getElementById("countNote");

function tick() {
  if (!dEl) return;
  const diff = WEDDING_DATE - new Date();
  if (diff <= 0) {
    dEl.textContent = hEl.textContent = mEl.textContent = sEl.textContent = "0";
    if (noteEl) noteEl.textContent = "Married! Thank you for blessing us.";
    return;
  }
  const d = Math.floor(diff / 864e5);
  const h = Math.floor(diff / 36e5) % 24;
  const m = Math.floor(diff / 6e4) % 60;
  const s = Math.floor(diff / 1e3) % 60;
  dEl.textContent = d; hEl.textContent = h; mEl.textContent = m; sEl.textContent = s;
}
tick();
setInterval(tick, 1000);

// Add to Calendar (.ics download, works on mobile)
const calBtn = document.getElementById("calBtn");
if (calBtn) calBtn.addEventListener("click", () => {
  const start = WEDDING_DATE.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = new Date(WEDDING_DATE.getTime() + 1 * 36e5).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT",
    `DTSTART:${start}`, `DTEND:${end}`,
    "SUMMARY:GnanaGanesh weds Dharshini — Muhurtham",
    "LOCATION:Shanmugar Mahal\\, Tiruchendur",
    "DESCRIPTION:Wedding invitation — ganesh-weds-dharshini.gnanaganesh.in",
    "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = "ganesh-weds-dharshini.ics";
  a.click();
  URL.revokeObjectURL(a.href);
});

// Traditional-style drone (no audio file needed).
// Tanpura-like Sa–Pa–Sa using WebAudio oscillators. Starts only on user tap.
let ctx = null, nodes = [], playing = false;
const btn = document.getElementById("musicBtn");
function startDrone() {
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  ctx.resume();
  const freqs = [136.1, 204.15, 272.2]; // Sa, Pa, Sa (C# drone-ish)
  freqs.forEach((f, i) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = i === 1 ? "triangle" : "sine";
    o.frequency.value = f;
    g.gain.value = 0.035;
    // gentle pluck pulse
    const lfo = ctx.createOscillator(), lg = ctx.createGain();
    lfo.frequency.value = 0.25 + i * 0.12; lg.gain.value = 0.015;
    lfo.connect(lg); lg.connect(g.gain);
    o.connect(g); g.connect(ctx.destination);
    o.start(); lfo.start();
    nodes.push(o, lfo);
  });
}
function stopDrone() {
  nodes.forEach(n => { try { n.stop(); } catch {} });
  nodes = [];
}
if (btn) btn.addEventListener("click", () => {
  playing = !playing;
  btn.setAttribute("aria-pressed", String(playing));
  btn.innerHTML = playing ? "🔊 <span>Playing</span>" : "🔇 <span>Music</span>";
  if (playing) startDrone(); else stopDrone();
});

// ---------- Continuous scroll story: progress, reveal, smooth anchors, Play tour ----------
const panels = Array.from(document.querySelectorAll(".panel"));
const progress = document.getElementById("progress");

// Scroll progress bar & subtle temple parallax
let ticking = false;
const templeArt = document.querySelector(".temple-artwork");
function updateProgress() {
  ticking = false;
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    progress.style.width = (p * 100) + "%";
  }
  if (!reducedMotion && templeArt) {
    const sy = window.scrollY;
    if (sy < window.innerHeight * 1.4) {
      templeArt.style.transform = `scale(1.025) translateY(${sy * 0.16}px)`;
    }
  }
}
window.addEventListener("scroll", () => {
  if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); }
}, { passive: true });
updateProgress();

// Scroll-triggered reveal (like the reference's section entrances)
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("in");
    });
  }, { threshold: 0.22 });
  panels.forEach((p) => io.observe(p));
} else {
  panels.forEach((p) => p.classList.add("in"));
}

// Play-tour: auto glide through the story; any manual scroll/touch stops it
let tourTimer = null;
const playBtn = document.getElementById("playBtn");
function stopTour() {
  if (tourTimer) { clearInterval(tourTimer); tourTimer = null; }
  if (playBtn) {
    playBtn.setAttribute("aria-pressed", "false");
    playBtn.innerHTML = "▶ Play invitation";
  }
}
function startTour() {
  stopTour();
  const order = panels;
  let idx = 0;
  // start from the panel nearest the top of the viewport
  let best = 0, bestDist = Infinity;
  order.forEach((p, i) => {
    const d = Math.abs(p.getBoundingClientRect().top);
    if (d < bestDist) { bestDist = d; best = i; }
  });
  idx = Math.min(best + 1, order.length - 1);
  if (playBtn) {
    playBtn.setAttribute("aria-pressed", "true");
    playBtn.innerHTML = "⏸ Pause tour";
  }
  const step = () => {
    if (idx >= order.length) { stopTour(); return; }
    order[idx].scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    idx++;
  };
  step();
  tourTimer = setInterval(step, 3400);
  // pause when the tab hides
  const onHide = () => { if (document.hidden) stopTour(); };
  document.addEventListener("visibilitychange", onHide, { once: true });
}
if (playBtn) playBtn.addEventListener("click", () => {
  if (tourTimer) stopTour(); else startTour();
});
["wheel", "touchmove", "keydown"].forEach((ev) =>
  window.addEventListener(ev, () => { if (tourTimer) stopTour(); }, { passive: true })
);
const exploreBtn = document.getElementById("exploreBtn");
if (exploreBtn) exploreBtn.addEventListener("click", () => {
  stopTour();
  const t = document.getElementById("invitation");
  if (t) t.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
});
// Smooth anchor buttons
const goIds = ["cover", "invitation", "agenda", "venue", "travel", "rsvp", "countdown"];
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-scroll]");
  if (t) {
    e.preventDefault();
    stopTour();
    const target = document.querySelector(t.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    return;
  }
  const g = e.target.closest("[data-go]");
  if (g) {
    e.preventDefault();
    stopTour();
    const p = panels[parseInt(g.dataset.go, 10)] || document.getElementById(goIds[parseInt(g.dataset.go, 10)]);
    if (p) (p.scrollIntoView ? p : document.getElementById(goIds[parseInt(g.dataset.go, 10)])).scrollIntoView?.({ behavior: reducedMotion ? "auto" : "smooth" });
  }
});

// Ambient floating petals (reference-style falling petal layer)
if (!reducedMotion) {
  const amb = document.getElementById("ambience");
  if (amb) {
    const glyphs = ["🌸", "🏵️", "🌼", "❋"];
    for (let i = 0; i < 14; i++) {
      const s = document.createElement("span");
      s.className = "ambient-petal";
      s.textContent = glyphs[i % glyphs.length];
      s.style.left = Math.random() * 100 + "%";
      s.style.fontSize = 0.7 + Math.random() * 0.9 + "rem";
      s.style.animationDuration = 9 + Math.random() * 10 + "s";
      s.style.animationDelay = -Math.random() * 15 + "s";
      amb.appendChild(s);
    }
  }
}

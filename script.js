

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Initial hash scroll if deep-linked
if (location.hash) {
  const targetElement = document.querySelector(location.hash);
  if (targetElement) {
    setTimeout(() => {
      targetElement.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }, 250);
  }
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
// Looped invitation track (guest-provided mp3). Starts on the seal tap;
// the Music button toggles it. Synth drone is the fallback if it can't play.
const loopTrack = document.getElementById("bgMusic");
if (loopTrack) loopTrack.volume = 0.85;
function startMusic() {
  if (loopTrack) {
    const p = loopTrack.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => { try { startDrone(); } catch {} });
    }
  } else {
    try { startDrone(); } catch {}
  }
}
function stopMusic() {
  try { if (loopTrack) loopTrack.pause(); } catch {}
  try { stopDrone(); } catch {}
}
if (btn) btn.addEventListener("click", () => {
  playing = !playing;
  btn.setAttribute("aria-pressed", String(playing));
  btn.classList.toggle("is-playing", playing);
  if (playing) startMusic(); else stopMusic();
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

}
window.addEventListener("scroll", () => {
  if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); }
}, { passive: true });
updateProgress();

// Scroll-triggered reveal (like the reference's section entrances)
// Scroll-triggered reveal & dynamic day-night atmospheric transition
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        const timeTheme = e.target.dataset.time;
        if (timeTheme) {
          document.body.setAttribute("data-time-of-day", timeTheme);
        }
      }
    });
  }, { threshold: 0.28 });
  panels.forEach((p) => io.observe(p));
} else {
  panels.forEach((p) => p.classList.add("in"));
}

// ==========================================================================
// METHOD 3: CINEMATIC SCROLL FILM ENGINE (Unfolding Video on Scroll)
// ==========================================================================
const filmTrack = document.getElementById("scrollCinemaTrack");
const filmLayers = Array.from(document.querySelectorAll(".film-layer"));
const filmFrames = Array.from(document.querySelectorAll(".film-scene-frame"));
const filmTimelineFill = document.getElementById("filmTimelineFill");
const filmActName = document.getElementById("filmActName");
const filmDots = Array.from(document.querySelectorAll(".film-cue-dot"));
const playBtn = document.getElementById("playBtn");

const actTitles = [
  "PROLOGUE · TIRUCHENDUR SHORE",
  "ACT I · THE ENGAGEMENT (12 DEC)",
  "ACT II · SACRED MUHURTHAM (13 DEC)",
  "ACT III · RECEPTION GALA (13 DEC)"
];

const timeThemes = ["sunrise", "twilight", "sunrise", "night"];

let currentFilmAct = 0;
let filmAutoPlaying = false;
let autoScrollAnimId = null;

function updateFilmProgress() {
  if (!filmTrack) return;
  const rect = filmTrack.getBoundingClientRect();
  const trackHeight = filmTrack.offsetHeight - window.innerHeight;
  if (trackHeight <= 0) return;

  // Normalized progress from 0.0 to 1.0 within the cinema track
  const progress = Math.min(Math.max(-rect.top / trackHeight, 0), 1);

  // Update scrubber progress bar fill
  if (filmTimelineFill) {
    filmTimelineFill.style.width = (progress * 100) + "%";
  }

  // 4 acts across the progress:
  // Act 0: 0.00 – 0.24
  // Act 1: 0.25 – 0.49
  // Act 2: 0.50 – 0.74
  // Act 3: 0.75 – 1.00
  let activeIdx = 0;
  if (progress < 0.24) activeIdx = 0;
  else if (progress < 0.50) activeIdx = 1;
  else if (progress < 0.75) activeIdx = 2;
  else activeIdx = 3;

  currentFilmAct = activeIdx;

  // Relative phase within current act for subtle Ken Burns effect
  const stepSize = 0.25;
  const phase = (progress % stepSize) / stepSize; // 0.0 to 1.0

  // Cross-fade backdrops & Ken Burns zoom
  filmLayers.forEach((layer, idx) => {
    if (idx === activeIdx) {
      layer.classList.add("is-active");
      if (!reducedMotion) {
        const scale = 1.0 + phase * 0.06;
        layer.style.transform = `scale(${scale})`;
      }
    } else {
      layer.classList.remove("is-active");
      layer.style.transform = "scale(1.0)";
    }
  });

  // Cross-fade narrative cards
  filmFrames.forEach((frame, idx) => {
    if (idx === activeIdx) {
      frame.classList.add("is-active");
    } else {
      frame.classList.remove("is-active");
    }
  });

  // Update HUD act title & active dot
  if (filmActName) {
    filmActName.textContent = actTitles[activeIdx];
  }
  filmDots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === activeIdx);
  });

  // Dynamic atmospheric body lighting
  document.body.setAttribute("data-time-of-day", timeThemes[activeIdx]);
}

window.addEventListener("scroll", () => {
  requestAnimationFrame(updateFilmProgress);
}, { passive: true });
updateFilmProgress();

// Smooth Jump to specific Film Act (0, 1, 2, 3)
function jumpToFilmAct(actIdx) {
  stopAutoPlayFilm();
  if (!filmTrack) return;
  const trackHeight = filmTrack.offsetHeight - window.innerHeight;
  const actTargets = [0.01, 0.35, 0.62, 0.88];
  const targetTop = filmTrack.offsetTop + trackHeight * actTargets[Math.min(Math.max(actIdx, 0), 3)];

  window.scrollTo({
    top: targetTop,
    behavior: reducedMotion ? "auto" : "smooth"
  });
}

// Click on Scrubber Dots or Next Act Buttons
document.addEventListener("click", (e) => {
  const cueDot = e.target.closest("[data-target-act]");
  if (cueDot) {
    const act = parseInt(cueDot.dataset.targetAct, 10);
    jumpToFilmAct(act);
    return;
  }
  const actJumpBtn = e.target.closest("[data-act-jump]");
  if (actJumpBtn) {
    const act = parseInt(actJumpBtn.dataset.actJump, 10);
    jumpToFilmAct(act);
    return;
  }
});

// Auto-Playback "Watch Wedding Film"
function startAutoPlayFilm() {
  filmAutoPlaying = true;
  if (playBtn) {
    playBtn.innerHTML = "⏸ Pause Story";
  }

  // Ensure music plays during film walkthrough
  if (!playing && typeof startMusic === "function") {
    try {
      startMusic();
      playing = true;
      if (btn) {
        btn.setAttribute("aria-pressed", "true");
        btn.classList.add("is-playing");
      }
    } catch {}
  }

  // If already at or past the end of the film track, rewind to start
  if (filmTrack) {
    const rect = filmTrack.getBoundingClientRect();
    if (rect.bottom < window.innerHeight * 0.5) {
      window.scrollTo({ top: filmTrack.offsetTop, behavior: "smooth" });
    }
  }

  let lastTime = performance.now();
  const speed = 0.55; // pixels per ms (~33px per frame at 60fps)

  function step(time) {
    if (!filmAutoPlaying) return;
    const delta = Math.min(time - lastTime, 40);
    lastTime = time;

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= maxScroll - 5) {
      stopAutoPlayFilm();
      return;
    }

    window.scrollBy(0, delta * speed);
    autoScrollAnimId = requestAnimationFrame(step);
  }

  autoScrollAnimId = requestAnimationFrame(step);
}

function stopAutoPlayFilm() {
  if (!filmAutoPlaying) return;
  filmAutoPlaying = false;
  if (autoScrollAnimId) {
    cancelAnimationFrame(autoScrollAnimId);
    autoScrollAnimId = null;
  }
  if (playBtn) {
    playBtn.innerHTML = '<span class="play-icon-glow">▶</span> <span>Watch Wedding Film / கதைப் பயணம்</span>';
  }
}

if (playBtn) {
  playBtn.addEventListener("click", () => {
    if (filmAutoPlaying) {
      stopAutoPlayFilm();
    } else {
      startAutoPlayFilm();
    }
  });
}

// User manual scroll / touch pauses auto-playback gently
let userInteractionTimeout = null;
window.addEventListener("wheel", () => { if (filmAutoPlaying) stopAutoPlayFilm(); }, { passive: true });
window.addEventListener("touchmove", () => { if (filmAutoPlaying) stopAutoPlayFilm(); }, { passive: true });
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && filmAutoPlaying) stopAutoPlayFilm();
});

// Smooth anchor buttons
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-scroll]");
  if (t) {
    e.preventDefault();
    stopAutoPlayFilm();
    const selector = t.dataset.scroll;
    if (selector === "#muhurtham") {
      jumpToFilmAct(2);
      return;
    }
    if (selector === "#engagement") {
      jumpToFilmAct(1);
      return;
    }
    if (selector === "#reception") {
      jumpToFilmAct(3);
      return;
    }
    if (selector === "#cover") {
      jumpToFilmAct(0);
      return;
    }
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    }
  }
});

// ==========================================================================
// ==========================================================================
// PETAL SHOWERS ON EVERY TAP + SHARED SERVER COUNT (அட்சதை & மலர் மழை)
// ==========================================================================
const showerCountEl = document.getElementById("showerCount");
let showerTotal = null;
let lastShowerAt = 0;

function renderShowerTotal() {
  if (showerCountEl && showerTotal !== null) {
    showerCountEl.textContent = showerTotal.toLocaleString("en-IN");
  }
}

async function fetchShowerTotal() {
  try {
    const res = await fetch("/api/showers", { cache: "no-store" });
    if (!res.ok) throw new Error("bad status");
    const data = await res.json();
    showerTotal = data.count;
  } catch {
    try {
      showerTotal = parseInt(localStorage.getItem("gd_shower_total") || "0", 10) || 0;
    } catch { showerTotal = 0; }
  }
  renderShowerTotal();
}

async function recordShower() {
  showerTotal = (showerTotal === null ? 0 : showerTotal) + 1;
  renderShowerTotal();
  try {
    const res = await fetch("/api/showers", { method: "POST", cache: "no-store" });
    if (!res.ok) throw new Error("bad status");
    const data = await res.json();
    showerTotal = data.count;
    renderShowerTotal();
  } catch {
    try { localStorage.setItem("gd_shower_total", String(showerTotal)); } catch {}
  }
}

function triggerBlessingShower(originX, originY, count = 14) {
  if (reducedMotion) return;
  const flowerGlyphs = ["🌸", "🌹", "🌼", "🏵️", "🌺"];
  const totalItems = Math.min(Math.max(count, 10), 16);

  for (let i = 0; i < totalItems; i++) {
    const isPetal = i % 3 !== 0; // ~66% petals, ~33% golden akshadhai grains
    const el = document.createElement("span");

    if (isPetal) {
      el.className = "blessing-rose-petal";
      el.textContent = flowerGlyphs[i % flowerGlyphs.length];
      const sizeRem = 0.95 + (i % 4) * 0.12;
      el.style.setProperty("--petal-size", `${sizeRem}rem`);
    } else {
      el.className = "akshadhai-grain";
    }

    // Centered start coordinates
    el.style.left = `${originX}px`;
    el.style.top = `${originY}px`;

    // Symmetrical, organized fan spread
    const spreadNorm = (i / (totalItems - 1) - 0.5) * 2; // -1.0 to +1.0
    const spreadX = (spreadNorm * (50 + (i % 3) * 20)) + "px"; // soft horizontal fan ±70px
    const riseY = -(25 + (1 - Math.abs(spreadNorm)) * 25 + (i % 3) * 8) + "px"; // gentle crest in center
    const sway = ((i % 2 === 0 ? 1 : -1) * (20 + (i % 3) * 8)) + "px"; // natural oscillating sway ±30px
    const rot1 = (spreadNorm * 35) + "deg";
    const rot2 = (-spreadNorm * 45) + "deg";

    // Drop distance to bottom of viewport with margin
    const dropH = Math.max(450, window.innerHeight - originY + 120) + "px";

    // Durations & rhythmic delays
    const dur = 3.2 + (i % 4) * 0.3 + "s";
    const delay = (i * 0.03) + "s";

    el.style.setProperty("--spread-x", spreadX);
    el.style.setProperty("--rise-y", riseY);
    el.style.setProperty("--sway", sway);
    el.style.setProperty("--rot-1", rot1);
    el.style.setProperty("--rot-2", rot2);
    el.style.setProperty("--drop-h", dropH);
    el.style.setProperty("--anim-dur", dur);
    el.style.animationDelay = delay;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4500);
  }
}

// Shower petals on taps, anywhere on the page EXCEPT on buttons & interactive links
document.addEventListener("pointerdown", (e) => {
  // Never interfere with buttons (like mute/unmute), links, inputs, or scrubber controls
  if (e.target.closest("button, a, input, select, textarea, [role='button'], .film-cue-dot")) {
    return;
  }
  const now = Date.now();
  if (now - lastShowerAt < 280) return;
  lastShowerAt = now;
  const x = (typeof e.clientX === "number" ? e.clientX : window.innerWidth / 2);
  const y = (typeof e.clientY === "number" ? e.clientY : window.innerHeight / 2);
  triggerBlessingShower(x, y);
  recordShower();
});

fetchShowerTotal();
setInterval(fetchShowerTotal, 30000);

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

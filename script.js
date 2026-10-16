// Shared WebAudio context for short synth accents (e.g. the blessing chime).
let drumAudioCtx = null;
function getDrumContext() {
  if (!drumAudioCtx) {
    drumAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (drumAudioCtx.state === "suspended") drumAudioCtx.resume();
  return drumAudioCtx;
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
    // Guest track loops from the tap itself (user gesture unlocks audio)
    try {
      startMusic();
      playing = true;
      if (btn) { btn.setAttribute("aria-pressed", "true"); btn.innerHTML = "🔊 <span>Playing</span>"; }
    } catch {}
    if (reducedMotion) {
      revealSite();
      setTimeout(() => opener.remove(), 100);
      return;
    }
    envelope.classList.add("unsealed");       // seal pops visually
    setTimeout(() => { envelope.classList.add("flap-open"); }, 380);   // flap rotates up
    setTimeout(() => { envelope.classList.add("letter-out"); }, 1050); // card slides out
    setTimeout(() => { envelope.classList.add("expand"); burst(); }, 1950); // card -> temple scene
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
  btn.innerHTML = playing ? "🔊 <span>Playing</span>" : "🔇 <span>Music</span>";
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
// CINEMATIC VIDEO WALKTHROUGH ENGINE (கதைப் பயணம்)
// ==========================================================================
const cinemaOverlay = document.getElementById("cinemaOverlay");
const cinemaChapter = document.getElementById("cinemaChapter");
const subTamil = document.getElementById("subTamil");
const subEnglish = document.getElementById("subEnglish");
const cinemaProgressBar = document.getElementById("cinemaProgressBar");
const cinemaPlayPauseBtn = document.getElementById("cinemaPlayPauseBtn");
const exitCinemaBtn = document.getElementById("exitCinemaBtn");
const cinemaPrevBtn = document.getElementById("cinemaPrevBtn");
const cinemaNextBtn = document.getElementById("cinemaNextBtn");
const playBtn = document.getElementById("playBtn");

const cinemaScenes = [
  {
    targetId: "cover",
    chapter: "PROLOGUE · THE SACRED SHORE OF TIRUCHENDUR",
    tamil: "அருள்மிகு திருச்செந்தூர் அலைகடலின் ஓரம் சுப முகூர்த்த அழைப்பு...",
    english: "Welcome to the wedding chronicle of GnanaGanesh & Dharshini at holy Tiruchendur...",
    duration: 5000
  },
  {
    targetId: "engagement",
    chapter: "ACT I · THE ENGAGEMENT · 12 DEC (6:30 PM)",
    tamil: "மாலை 6:30 மணிக்கு நிச்சயதார்த்த வைபவம் · சண்முகர் மஹால், திருச்செந்தூர்...",
    english: "Act I: Auspicious ring exchange and lagna pathirikai at Shanmugar Mahal, Tiruchendur...",
    duration: 5500
  },
  {
    targetId: "muhurtham",
    chapter: "ACT II · SACRED MARRIAGE · 13 DEC (6:30 AM)",
    tamil: "காலை 6:30 மணிக்கு திருமாங்கல்ய தாரணம் · சண்முகர் மஹால், திருச்செந்தூர்...",
    english: "Act II: Sacred Thali tying at Brahma Muhurtham sunrise amidst divine hymns and nadaswaram...",
    duration: 6000
  },
  {
    targetId: "reception",
    chapter: "ACT III · RECEPTION · 13 DEC (6:30 PM)",
    tamil: "மாலை 6:30 மணிக்கு மணமக்கள் வரவேற்பு விழா · தூத்துக்குடி...",
    english: "Act III: Starlit reception celebration and royal banquet in the Pearl City of Thoothukudi...",
    duration: 5500
  },
  {
    targetId: "venue",
    chapter: "ACT IV · VENUES & COASTAL ROUTE",
    tamil: "திருச்செந்தூர் சண்முகர் மஹால் & தூத்துக்குடி...",
    english: "Convenient travel and maps to celebrate with us in Tiruchendur and Thoothukudi...",
    duration: 4800
  },
  {
    targetId: "countdown",
    chapter: "ACT V · SHOWER BLESSINGS & CELEBRATE",
    tamil: "அன்போடு வந்து அட்சதை தூவி வாழ்த்துக!",
    english: "Shower sacred akshadhai and jasmine flowers upon the couple as their new journey begins...",
    duration: 6000
  }
];

let cinemaActive = false;
let currentSceneIdx = 0;
let sceneTimer = null;
let sceneStartTime = 0;
let sceneRemainingTime = 0;
let isPaused = false;

function updateCinemaSubtitles(scene) {
  if (!subTamil || !subEnglish || !cinemaChapter) return;
  subTamil.style.opacity = "0";
  subEnglish.style.opacity = "0";
  setTimeout(() => {
    cinemaChapter.textContent = scene.chapter;
    subTamil.textContent = scene.tamil;
    subEnglish.textContent = scene.english;
    subTamil.style.opacity = "1";
    subEnglish.style.opacity = "1";
  }, 200);

  if (cinemaProgressBar) {
    const pct = ((currentSceneIdx + 1) / cinemaScenes.length) * 100;
    cinemaProgressBar.style.width = pct + "%";
  }
}

function showScene(idx) {
  if (idx < 0) idx = 0;
  if (idx >= cinemaScenes.length) {
    exitCinemaMode();
    return;
  }
  currentSceneIdx = idx;
  const scene = cinemaScenes[idx];
  const target = document.getElementById(scene.targetId);
  if (target) {
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }
  updateCinemaSubtitles(scene);

  if (sceneTimer) clearTimeout(sceneTimer);
  sceneStartTime = Date.now();
  sceneRemainingTime = scene.duration;

  if (!isPaused) {
    sceneTimer = setTimeout(() => {
      showScene(currentSceneIdx + 1);
    }, scene.duration);
  }
}

function startCinemaMode(fromIdx = 0) {
  cinemaActive = true;
  document.body.classList.add("cinema-active");
  if (playBtn) {
    playBtn.innerHTML = "⏸ Pause Film";
  }
  if (cinemaPlayPauseBtn) {
    cinemaPlayPauseBtn.textContent = "⏸";
  }
  isPaused = false;

  // Auto-play ambient music if silent
  if (!playing && typeof startMusic === "function") {
    try {
      startMusic();
      playing = true;
      if (btn) {
        btn.setAttribute("aria-pressed", "true");
        btn.innerHTML = "🔊 <span>Playing</span>";
      }
    } catch {}
  }

  showScene(fromIdx);
}

function exitCinemaMode() {
  cinemaActive = false;
  document.body.classList.remove("cinema-active");
  if (sceneTimer) { clearTimeout(sceneTimer); sceneTimer = null; }
  if (playBtn) {
    playBtn.innerHTML = '<span class="play-icon-glow">▶</span> <span>Watch Wedding Film / கதைப் பயணம்</span>';
  }
}

function toggleCinemaPause() {
  if (!cinemaActive) {
    startCinemaMode(currentSceneIdx);
    return;
  }
  if (!isPaused) {
    isPaused = true;
    if (sceneTimer) clearTimeout(sceneTimer);
    const elapsed = Date.now() - sceneStartTime;
    sceneRemainingTime = Math.max(1000, cinemaScenes[currentSceneIdx].duration - elapsed);
    if (cinemaPlayPauseBtn) cinemaPlayPauseBtn.textContent = "▶";
    if (playBtn) playBtn.innerHTML = "▶ Resume Film";
  } else {
    isPaused = false;
    sceneStartTime = Date.now();
    if (cinemaPlayPauseBtn) cinemaPlayPauseBtn.textContent = "⏸";
    if (playBtn) playBtn.innerHTML = "⏸ Pause Film";
    sceneTimer = setTimeout(() => {
      showScene(currentSceneIdx + 1);
    }, sceneRemainingTime);
  }
}

if (playBtn) {
  playBtn.addEventListener("click", () => {
    if (cinemaActive && !isPaused) {
      toggleCinemaPause();
    } else if (cinemaActive && isPaused) {
      toggleCinemaPause();
    } else {
      startCinemaMode(0);
    }
  });
}

if (exitCinemaBtn) exitCinemaBtn.addEventListener("click", exitCinemaMode);
if (cinemaPlayPauseBtn) cinemaPlayPauseBtn.addEventListener("click", toggleCinemaPause);
if (cinemaNextBtn) cinemaNextBtn.addEventListener("click", () => showScene(currentSceneIdx + 1));
if (cinemaPrevBtn) cinemaPrevBtn.addEventListener("click", () => showScene(currentSceneIdx - 1));

const exploreBtn = document.getElementById("exploreBtn");
if (exploreBtn) exploreBtn.addEventListener("click", () => {
  exitCinemaMode();
  const t = document.getElementById("invitation");
  if (t) t.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
});

// Any user escape key exits cinema mode
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && cinemaActive) exitCinemaMode();
});

// Smooth anchor buttons
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-scroll]");
  if (t) {
    e.preventDefault();
    exitCinemaMode();
    const target = document.querySelector(t.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }
});

// ==========================================================================
// INTERACTIVE SHOWER BLESSINGS (அட்சதை & மலர் மழை)
// ==========================================================================
const blessBtn = document.getElementById("blessBtn");
const blessingCount = document.getElementById("blessingCount");
const blessingToast = document.getElementById("blessingToast");

let blessings = parseInt(localStorage.getItem("ganesh_dharshini_blessings") || "1842", 10);
if (blessingCount) blessingCount.textContent = blessings.toLocaleString("en-IN");

function triggerBlessingShower(originX, originY) {
  if (reducedMotion) return;
  const count = 38;
  const flowerGlyphs = ["🌸", "🌹", "🌼", "🌺", "🏵️"];

  for (let i = 0; i < count; i++) {
    const isPetal = i % 4 === 0;
    const el = document.createElement("span");
    
    if (isPetal) {
      el.className = "blessing-rose-petal";
      el.textContent = flowerGlyphs[i % flowerGlyphs.length];
    } else {
      el.className = "akshadhai-grain";
    }

    el.style.left = originX + "px";
    el.style.top = originY + "px";

    const dx = (Math.random() - 0.5) * 80 + "vw";
    const dyPeak = -(160 + Math.random() * 320) + "px";
    const dur = 2.0 + Math.random() * 1.0 + "s";

    el.style.setProperty("--dx", dx);
    el.style.setProperty("--dy-peak", dyPeak);
    el.style.setProperty("--anim-dur", dur);

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }
}

// Auspicious Chime sound on blessing
function playBlessingChime() {
  try {
    const ctx = getDrumContext();
    const t = ctx.currentTime + 0.02;
    // Pentatonic mangala chime chord (C5, E5, G5, C6)
    [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + idx * 0.05);
      g.gain.exponentialRampToValueAtTime(0.08, t + idx * 0.05 + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.05 + 1.6);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(t + idx * 0.05);
      o.stop(t + idx * 0.05 + 1.8);
    });
  } catch {}
}

if (blessBtn) {
  blessBtn.addEventListener("click", (e) => {
    const rect = blessBtn.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;

    triggerBlessingShower(x, y);
    playBlessingChime();

    blessings++;
    localStorage.setItem("ganesh_dharshini_blessings", String(blessings));
    if (blessingCount) {
      blessingCount.textContent = blessings.toLocaleString("en-IN");
      blessingCount.classList.remove("bump");
      void blessingCount.offsetWidth;
      blessingCount.classList.add("bump");
    }

    if (blessingToast) {
      const msgs = [
        "🌸 வாழ்க வளமுடன்! Thank you for showering your blessings!",
        "✨ மங்கலம் பெருகுக! Your love and wishes mean the world to us!",
        "💐 அன்பான நல்வாழ்த்துகளுக்கு மனமார்ந்த நன்றி!",
        "🪔 May Lord Murugan bless you and your family!"
      ];
      blessingToast.textContent = msgs[Math.floor(Math.random() * msgs.length)];
      blessingToast.classList.add("show");
      setTimeout(() => blessingToast.classList.remove("show"), 3800);
    }
  });
}

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

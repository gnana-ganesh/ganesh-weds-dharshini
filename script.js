// ---------- Fast Non-Blocking Preloader ----------
(function initSitePreloader() {
  const preloader = document.getElementById("sitePreloader");
  if (!preloader) return;

  const bar = document.getElementById("preloaderBar");
  let currentPercent = 0;
  let targetPercent = 35;
  let isDone = false;
  const MAX_WAIT_MS = 1200; // Fast failsafe so user is never blocked

  function setProgress(val) {
    currentPercent = Math.min(100, Math.max(currentPercent, Math.round(val)));
    if (bar) bar.style.width = `${currentPercent}%`;
    preloader.setAttribute("aria-valuenow", String(currentPercent));
  }

  const interval = setInterval(() => {
    if (currentPercent < targetPercent) {
      const step = Math.max(2, Math.ceil((targetPercent - currentPercent) * 0.28));
      setProgress(currentPercent + step);
    }
    if (currentPercent >= 100 && isDone) {
      clearInterval(interval);
      finish();
    }
  }, 30);

  function finish() {
    setProgress(100);
    preloader.classList.add("is-loaded");
    window.dispatchEvent(new CustomEvent("sitePreloaderDone"));
    setTimeout(() => {
      try { preloader.remove(); } catch (e) { preloader.style.display = "none"; }
    }, 500);
  }

  function complete() {
    if (isDone) return;
    isDone = true;
    targetPercent = 100;
  }

  if (document.readyState === "interactive" || document.readyState === "complete") {
    targetPercent = Math.max(targetPercent, 60);
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      targetPercent = Math.max(targetPercent, 60);
    }, { once: true });
  }

  const fontsReady = (document.fonts && document.fonts.ready)
    ? document.fonts.ready.catch(() => { })
    : Promise.resolve();

  const sealReady = new Promise((resolve) => {
    const img = new Image();
    img.onload = img.onerror = resolve;
    img.src = "./seal.webp";
  });

  Promise.all([fontsReady, sealReady]).then(() => {
    targetPercent = 90;
    complete();
  });

  setTimeout(complete, MAX_WAIT_MS);
})();

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
let filmAutoPlaying = false;

// Muhurtham: Sunday 13 Dec 2026, 6:30 AM IST.
const WEDDING_DATE = new Date("2026-12-13T06:30:00+05:30");

const dEl = document.getElementById("d");
const hEl = document.getElementById("h");
const mEl = document.getElementById("m");
const sEl = document.getElementById("s");
const noteEl = document.getElementById("countNote");

function tick() {
  const diff = WEDDING_DATE - new Date();
  if (diff <= 0) {
    if (dEl) dEl.textContent = "0";
    if (hEl) hEl.textContent = "0";
    if (mEl) mEl.textContent = "0";
    if (sEl) sEl.textContent = "0";
    if (noteEl) noteEl.textContent = "Married! Thank you for blessing us.";
    return;
  }
  const d = Math.floor(diff / 864e5);
  const h = Math.floor(diff / 36e5) % 24;
  const m = Math.floor(diff / 6e4) % 60;
  const s = Math.floor(diff / 1e3) % 60;
  if (dEl) { dEl.textContent = d; hEl.textContent = h; mEl.textContent = m; sEl.textContent = s; }
}
tick();
setInterval(tick, 1000);

// ---------- Add to Calendar Dialog ----------
const calDialog = document.getElementById("calDialog");
const calCloseBtn = document.getElementById("calCloseBtn");
const calDialogSub = document.getElementById("calDialogSub");
const calMetaDate = document.getElementById("calMetaDate");
const calMetaTime = document.getElementById("calMetaTime");
const calMetaLocation = document.getElementById("calMetaLocation");
const gcalOption = document.getElementById("gcalOption");
const appleOption = document.getElementById("appleOption");
const outlookOption = document.getElementById("outlookOption");

const CALENDAR_EVENTS = {
  engagement: {
    sub: "GnanaGanesh weds Dharshini · Engagement Ceremony",
    dateHtml: "🗓️ <strong>Saturday, 12 Dec 2026</strong>",
    timeHtml: "⏰ <strong>6:30 PM – 8:30 PM IST</strong>",
    locHtml: "📍 <strong>Shanmugar Mahal, Tiruchendur</strong>",
    icsFile: "./engagement.ics",
    gcalUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent("GnanaGanesh weds Dharshini — Engagement Ceremony") +
      "&dates=20261212T130000Z/20261212T150000Z" +
      "&details=" + encodeURIComponent("With the blessings of our families, GnanaGanesh & Dharshini invite you to celebrate their sacred Engagement ceremony.\n\nWebsite: https://gnanaganesh-weds-dharshini.gnanaganesh.in\nVenue: Shanmugar Mahal, Tiruchendur") +
      "&location=" + encodeURIComponent("Shanmugar Mahal, Tiruchendur, Thoothukudi District, Tamil Nadu 628215"),
    outlookUrl: "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent" +
      "&startdt=2026-12-12T13:00:00Z" +
      "&enddt=2026-12-12T15:00:00Z" +
      "&subject=" + encodeURIComponent("GnanaGanesh weds Dharshini — Engagement Ceremony") +
      "&body=" + encodeURIComponent("With the blessings of our families, GnanaGanesh & Dharshini invite you to celebrate their sacred Engagement ceremony.\n\nWebsite: https://gnanaganesh-weds-dharshini.gnanaganesh.in\nVenue: Shanmugar Mahal, Tiruchendur") +
      "&location=" + encodeURIComponent("Shanmugar Mahal, Tiruchendur, Thoothukudi District, Tamil Nadu 628215")
  },
  muhurtham: {
    sub: "GnanaGanesh weds Dharshini · Sacred Muhurtham",
    dateHtml: "🗓️ <strong>Sunday, 13 Dec 2026</strong>",
    timeHtml: "⏰ <strong>6:30 AM – 8:30 AM IST</strong>",
    locHtml: "📍 <strong>Shanmugar Mahal, Tiruchendur</strong>",
    icsFile: "./invite.ics",
    gcalUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent("GnanaGanesh weds Dharshini — Sacred Muhurtham") +
      "&dates=20261213T010000Z/20261213T030000Z" +
      "&details=" + encodeURIComponent("With the blessings of our families, GnanaGanesh & Dharshini invite you to celebrate their sacred wedding ceremony.\n\nWebsite: https://gnanaganesh-weds-dharshini.gnanaganesh.in\nVenue: Shanmugar Mahal, Tiruchendur") +
      "&location=" + encodeURIComponent("Shanmugar Mahal, Tiruchendur, Thoothukudi District, Tamil Nadu 628215"),
    outlookUrl: "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent" +
      "&startdt=2026-12-13T01:00:00Z" +
      "&enddt=2026-12-13T03:00:00Z" +
      "&subject=" + encodeURIComponent("GnanaGanesh weds Dharshini — Sacred Muhurtham") +
      "&body=" + encodeURIComponent("With the blessings of our families, GnanaGanesh & Dharshini invite you to celebrate their sacred wedding ceremony.\n\nWebsite: https://gnanaganesh-weds-dharshini.gnanaganesh.in\nVenue: Shanmugar Mahal, Tiruchendur") +
      "&location=" + encodeURIComponent("Shanmugar Mahal, Tiruchendur, Thoothukudi District, Tamil Nadu 628215")
  },
  reception: {
    sub: "GnanaGanesh weds Dharshini · Wedding Reception",
    dateHtml: "🗓️ <strong>Sunday, 13 Dec 2026</strong>",
    timeHtml: "⏰ <strong>6:30 PM – 9:30 PM IST</strong>",
    locHtml: "📍 <strong>Santhiya Mahal, Thoothukudi</strong>",
    icsFile: "./reception.ics",
    gcalUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent("GnanaGanesh weds Dharshini — Wedding Reception") +
      "&dates=20261213T130000Z/20261213T160000Z" +
      "&details=" + encodeURIComponent("With joy and gratitude, join GnanaGanesh & Dharshini as they celebrate their Wedding Reception evening.\n\nWebsite: https://gnanaganesh-weds-dharshini.gnanaganesh.in\nVenue: Santhiya Mahal, Thoothukudi") +
      "&location=" + encodeURIComponent("Santhiya Mahal, VMS Nagar South, Meelavittan Road, Thoothukudi, Tamil Nadu"),
    outlookUrl: "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent" +
      "&startdt=2026-12-13T13:00:00Z" +
      "&enddt=2026-12-13T16:00:00Z" +
      "&subject=" + encodeURIComponent("GnanaGanesh weds Dharshini — Wedding Reception") +
      "&body=" + encodeURIComponent("With joy and gratitude, join GnanaGanesh & Dharshini as they celebrate their Wedding Reception evening.\n\nWebsite: https://gnanaganesh-weds-dharshini.gnanaganesh.in\nVenue: Santhiya Mahal, Thoothukudi") +
      "&location=" + encodeURIComponent("Santhiya Mahal, VMS Nagar South, Meelavittan Road, Thoothukudi, Tamil Nadu")
  }
};

function openCalendarModal(eventType) {
  if (typeof stopAutoPlayFilm === "function") {
    stopAutoPlayFilm();
  }
  const ev = CALENDAR_EVENTS[eventType] || CALENDAR_EVENTS.muhurtham;
  if (calDialogSub) calDialogSub.textContent = ev.sub;
  if (calMetaDate) calMetaDate.innerHTML = ev.dateHtml;
  if (calMetaTime) calMetaTime.innerHTML = ev.timeHtml;
  if (calMetaLocation) calMetaLocation.innerHTML = ev.locHtml;
  if (gcalOption) gcalOption.href = ev.gcalUrl;
  if (outlookOption) outlookOption.href = ev.outlookUrl;
  if (appleOption) appleOption.href = ev.icsFile;

  // Always show the picker so Apple/iOS, Google, and Outlook users can pick their app
  if (calDialog) {
    if (typeof calDialog.showModal === "function") {
      try {
        calDialog.showModal();
      } catch (e) {
        calDialog.setAttribute("open", "");
      }
    } else {
      calDialog.setAttribute("open", "");
    }
  }
}

document.addEventListener("click", (e) => {
  const calTrigger = e.target.closest(".venue-cal-btn");
  if (calTrigger) {
    openCalendarModal(calTrigger.dataset.calEvent || "muhurtham");
    return;
  }
  const venueLink = e.target.closest(".venue-btn");
  if (venueLink && typeof stopAutoPlayFilm === "function") {
    stopAutoPlayFilm();
  }
});

// Freeze auto-playback immediately when user touches/clicks interactive controls
window.addEventListener("pointerdown", (e) => {
  if (!filmAutoPlaying) return;
  const isInteractive = e.target && e.target.closest && e.target.closest(
    ".venue-btn, .venue-cal-btn, .scene-card, .cinema-lower-third, .cal-opt-item, .film-event-menu"
  );
  if (isInteractive) {
    stopAutoPlayFilm();
  }
}, { capture: true, passive: true });

document.querySelectorAll(".cal-opt-item").forEach((opt) => {
  opt.addEventListener("click", () => {
    setTimeout(() => {
      if (calDialog && typeof calDialog.close === "function") {
        calDialog.close();
      }
    }, 250);
  });
});

if (calCloseBtn && calDialog) {
  calCloseBtn.addEventListener("click", () => calDialog.close());
}

if (calDialog) {
  calDialog.addEventListener("click", (e) => {
    if (e.target === calDialog) {
      calDialog.close();
    }
  });
}

// ---------- Music Player (MP3 + WebAudio Tanpura Drone Fallback) ----------
let ctx = null, nodes = [], playing = false;
const btn = document.getElementById("musicBtn");

function startDrone() {
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  ctx.resume();
  const freqs = [136.1, 204.15, 272.2];
  freqs.forEach((f, i) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = i === 1 ? "triangle" : "sine";
    o.frequency.value = f;
    g.gain.value = 0.035;
    const lfo = ctx.createOscillator(), lg = ctx.createGain();
    lfo.frequency.value = 0.25 + i * 0.12;
    lg.gain.value = 0.015;
    lfo.connect(lg);
    lg.connect(g.gain);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    lfo.start();
    nodes.push(o, lfo);
  });
}

function stopDrone() {
  nodes.forEach(n => { try { n.stop(); } catch { } });
  nodes = [];
}

const loopTrack = document.getElementById("bgMusic");
if (loopTrack) {
  loopTrack.volume = 0.85;
  loopTrack.loop = true;
  loopTrack.addEventListener("ended", () => {
    try {
      loopTrack.currentTime = 0;
      loopTrack.play();
    } catch (e) { }
  });
}

function startMusic() {
  if (loopTrack) {
    loopTrack.loop = true;
    const p = loopTrack.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => { try { startDrone(); } catch { } });
    }
  } else {
    try { startDrone(); } catch { }
  }
}

function stopMusic() {
  try { if (loopTrack) loopTrack.pause(); } catch { }
  try { stopDrone(); } catch { }
}

if (btn) {
  btn.addEventListener("click", () => {
    playing = !playing;
    btn.setAttribute("aria-pressed", String(playing));
    btn.classList.toggle("is-playing", playing);
    if (playing) startMusic(); else stopMusic();
  });
}

// ---------- Sealed-Envelope Opener ----------
const opener = document.getElementById("opener");
const openBtn = document.getElementById("openBtn");
const envelope = document.getElementById("envelope");
const cardPlayBtn = document.getElementById("cardPlayBtn");
const cardSkipBtn = document.getElementById("cardSkipBtn");

let isEnvelopeOpened = false;

function playFilmVideos() {
  const v1 = document.getElementById("filmVideo1");
  const v2 = document.getElementById("filmVideo2");
  const v3 = document.getElementById("filmVideo3");
  if (v1) {
    v1.preload = "auto";
    v1.muted = true;
    try {
      v1.pause();
      if (v1.currentTime < 2.0 || v1.currentTime > 5.0) {
        v1.currentTime = 2.85;
      }
    } catch (e) { }
  }
  if (v2 && v2.src) {
    v2.muted = true;
    try { v2.pause(); v2.currentTime = 0.001; } catch (e) { }
  }
  if (v3 && v3.src) {
    v3.muted = true;
    try { v3.pause(); v3.currentTime = 0.001; } catch (e) { }
  }
}

function revealSite({ autoPlay = true } = {}) {
  if (opener) opener.classList.add("open");
  document.body.classList.remove("locked");
  document.body.classList.add("opened");
  window.scrollTo({ top: 0, behavior: "instant" });
  cacheFilmTrackMetrics();
  const cover = document.getElementById("cover");
  if (cover) cover.classList.add("in");
  if (typeof updateFilmProgress === "function") updateFilmProgress();
  if (autoPlay && typeof startAutoPlayFilm === "function") {
    startAutoPlayFilm();
  }
  if (location.hash) {
    const t = document.querySelector(location.hash);
    if (t) setTimeout(() => t.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }), 150);
  }
}

const petals = ["🌸", "🏵️", "🌼", "❋"];
const burst = () => {
  if (reducedMotion || !opener) return;
  for (let i = 0; i < 24; i++) {
    const s = document.createElement("span");
    s.className = "petal";
    s.textContent = petals[i % petals.length];
    s.style.left = `${30 + Math.random() * 40}%`;
    s.style.setProperty("--dx", `${(Math.random() - 0.5) * 60}vw`);
    s.style.animationDelay = `${Math.random() * 0.3}s`;
    opener.appendChild(s);
    setTimeout(() => s.remove(), 2200);
  }
};

function openEnvelope() {
  if (isEnvelopeOpened) return;
  isEnvelopeOpened = true;
  if (openBtn) openBtn.disabled = true;

  // Prime Reel 1 & audio gently once user opens the seal
  ensureReelLoaded(1);

  try {
    startMusic();
    playing = true;
    if (btn) {
      btn.setAttribute("aria-pressed", "true");
      btn.classList.add("is-playing");
    }
  } catch (e) { }

  if (reducedMotion) {
    if (envelope) envelope.classList.add("unsealed", "flap-open", "letter-out");
    if (opener) opener.classList.add("showing-invitation");
    if (cardPlayBtn) cardPlayBtn.focus({ preventScroll: true });
    return;
  }

  if (envelope) envelope.classList.add("unsealed");
  setTimeout(() => { if (envelope) envelope.classList.add("flap-open"); }, 340);
  setTimeout(() => { if (envelope) envelope.classList.add("letter-out"); }, 860);
  setTimeout(() => {
    if (opener) opener.classList.add("showing-invitation");
    burst();
    if (cardPlayBtn) {
      setTimeout(() => cardPlayBtn.focus({ preventScroll: true }), 120);
    }
  }, 1300);
}

function closeOpenerAndReveal({ autoPlay = true, scrollToSelector = null } = {}) {
  try {
    startMusic();
    playing = true;
    if (btn) {
      btn.setAttribute("aria-pressed", "true");
      btn.classList.add("is-playing");
    }
  } catch (e) { }

  userInteractionAllowedAfter = Date.now() + 250;
  playFilmVideos();
  if (autoPlay) ensureReelLoaded(2);

  if (opener) {
    opener.classList.add("open");
  }

  revealSite({ autoPlay });

  if (scrollToSelector) {
    const el = document.querySelector(scrollToSelector);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      }, 60);
    }
  }

  setTimeout(() => {
    try { if (opener) opener.remove(); } catch (e) { }
  }, 700);
}

if (opener && openBtn && envelope) {
  document.body.classList.add("locked");
  document.body.classList.remove("opened");

  openBtn.addEventListener("click", openEnvelope);

  if (cardPlayBtn) {
    cardPlayBtn.addEventListener("click", () => closeOpenerAndReveal({ autoPlay: true }));
  }
  if (cardSkipBtn) {
    cardSkipBtn.addEventListener("click", () => closeOpenerAndReveal({ autoPlay: false, scrollToSelector: "#countdown" }));
  }
} else {
  document.body.classList.remove("locked");
  document.body.classList.add("opened");
  if (location.hash) {
    const targetElement = document.querySelector(location.hash);
    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      }, 250);
    }
  }
}

// ---------- Scroll Progress & Section Reveal ----------
const panels = Array.from(document.querySelectorAll(".panel"));
const progressBar = document.getElementById("progress");

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
  }, { threshold: 0.22 });
  panels.forEach((p) => io.observe(p));
} else {
  panels.forEach((p) => p.classList.add("in"));
}

// ==========================================================================
// CINEMATIC SCROLL FILM ENGINE (LAZY REEL LOADING & LOW-OVERHEAD LOOP)
// ==========================================================================
const filmTrack = document.getElementById("scrollCinemaTrack");
const video1 = document.getElementById("filmVideo1");
const video2 = document.getElementById("filmVideo2");
const video3 = document.getElementById("filmVideo3");
const videoLayer1 = document.getElementById("videoLayer1");
const videoLayer2 = document.getElementById("videoLayer2");
const videoLayer3 = document.getElementById("videoLayer3");
const filmFrames = Array.from(document.querySelectorAll(".film-scene-frame"));
const filmEventMenu = document.getElementById("filmEventMenu");
const filmResumeBtn = document.getElementById("filmResumeBtn");
const coverScrollHint = document.getElementById("coverScrollHint");
const filmBottomProgressFill = document.getElementById("filmBottomProgressFill");
const filmBuffering = document.getElementById("filmBuffering");
const actMenuButtons = Array.from(document.querySelectorAll("[data-target-act]"));

function setBuffering(show) {
  if (filmBuffering) {
    filmBuffering.hidden = !show;
  }
}

const timeThemes = ["sunrise", "twilight", "sunrise", "night"];
const FILM_PLAYBACK_RATE = 0.40;
const RECEPTION_PLAYBACK_RATE = 0.48;
let dur1 = 10.0;
let dur2 = 10.0;
let dur3 = 10.0;

const reelVideos = [video1, video2, video3];
const reelInitialized = [false, false, false];

function ensureReelLoaded(reelNumber) {
  const idx = reelNumber - 1;
  const v = reelVideos[idx];
  if (!v || reelInitialized[idx]) return;
  reelInitialized[idx] = true;

  const reelRate = idx === 2 ? RECEPTION_PLAYBACK_RATE : FILM_PLAYBACK_RATE;
  v.muted = true;
  v.playsInline = true;
  v.defaultPlaybackRate = reelRate;
  v.playbackRate = reelRate;
  v.setAttribute("playsinline", "");
  v.setAttribute("webkit-playsinline", "");

  if (!v.src && v.dataset.src) {
    v.src = v.dataset.src;
  }
  v.preload = "auto";

  v.addEventListener("loadedmetadata", () => {
    v.playbackRate = reelRate;
    if (idx === 0 && v.duration && !isNaN(v.duration)) dur1 = v.duration;
    if (idx === 1 && v.duration && !isNaN(v.duration)) dur2 = v.duration;
    if (idx === 2 && v.duration && !isNaN(v.duration)) dur3 = v.duration;
    try {
      if (!filmAutoPlaying) {
        v.pause();
        if (idx === 0 && (v.currentTime < 2.0 || v.currentTime > 5.0)) {
          v.currentTime = 2.85;
        }
      }
    } catch (e) { }
  }, { once: true });

  v.addEventListener("play", () => { v.playbackRate = reelRate; });
  v.addEventListener("waiting", () => { if (filmAutoPlaying) setBuffering(true); });
  v.addEventListener("canplay", () => setBuffering(false));
  v.addEventListener("playing", () => setBuffering(false));
  v.addEventListener("seeked", () => setBuffering(false));
  v.addEventListener("ratechange", () => {
    if (filmAutoPlaying && Math.abs(v.playbackRate - reelRate) > 0.02) {
      v.playbackRate = reelRate;
    }
  });

  try {
    v.load();
    v.playbackRate = reelRate;
    v.pause();
    v.currentTime = idx === 0 ? 2.85 : 0.001;
  } catch (e) { }
}

// Initialize Reel 1 metadata lightly at startup; Reels 2 & 3 stay deferred until needed
if (video1) {
  video1.muted = true;
  video1.playsInline = true;
  video1.defaultPlaybackRate = FILM_PLAYBACK_RATE;
  video1.playbackRate = FILM_PLAYBACK_RATE;
  video1.addEventListener("loadedmetadata", () => {
    if (video1.duration && !isNaN(video1.duration)) dur1 = video1.duration;
    try { video1.pause(); video1.currentTime = 2.85; } catch (e) { }
  }, { once: true });
}

let currentFilmAct = 0;
let autoPlayAnimId = null;
let userInteractionAllowedAfter = 0;
let touchStartX = 0;
let touchStartY = 0;

// Cached layout metrics (refreshed on resize / reveal)
let cachedTrackTop = 0;
let cachedTrackHeight = 1;
let cachedDocScrollMax = 1;
function cacheFilmTrackMetrics() {
  if (filmTrack) {
    cachedTrackTop = filmTrack.offsetTop;
    cachedTrackHeight = Math.max(1, filmTrack.offsetHeight - window.innerHeight);
  }
  cachedDocScrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
}
cacheFilmTrackMetrics();

// Memoized UI state to avoid redundant DOM writes at 60fps
let lastRenderedAct = -1;
let lastMenuVisible = null;
let lastResumeVisible = null;
let lastHintHidden = null;
let lastTimeTheme = null;
let lastMeasuredAct = -1;
const frameCache = filmFrames.map(() => ({ op: -1, ty: 999, active: null, pe: null }));

function updateResumeBtnPosition(force = false) {
  if (!filmResumeBtn) return;
  if (!force && lastMeasuredAct === currentFilmAct) return;
  lastMeasuredAct = currentFilmAct;

  const activeFrame = filmFrames[currentFilmAct] || document.querySelector(".film-scene-frame.is-active");
  if (!activeFrame) return;
  const card = activeFrame.querySelector(".cinema-lower-third, .cinema-cover-footer");
  if (card) {
    const cardRect = card.getBoundingClientRect();
    if (cardRect.top > 0) {
      const bottomDist = Math.max(Math.round(window.innerHeight - cardRect.top + (currentFilmAct === 0 ? 12 : 14)), 130);
      filmResumeBtn.style.setProperty("--resume-btn-bottom", `${bottomDist}px`);
    }
  }
}

function renderFilmUI(progress) {
  if (filmBottomProgressFill) {
    filmBottomProgressFill.style.transform = `scaleX(${progress.toFixed(4)})`;
  }

  const hintHidden = progress > 0.08 || window.scrollY > 120;
  if (coverScrollHint && hintHidden !== lastHintHidden) {
    lastHintHidden = hintHidden;
    coverScrollHint.classList.toggle("is-hidden", hintHidden);
  }

  let activeIdx = 0;
  if (progress < 0.20) activeIdx = 0;
  else if (progress < 0.44) activeIdx = 1;
  else if (progress < 0.72) activeIdx = 2;
  else activeIdx = 3;

  currentFilmAct = activeIdx;

  const menuVisible = progress >= 0.12 && progress < 0.98;
  if (filmEventMenu && menuVisible !== lastMenuVisible) {
    lastMenuVisible = menuVisible;
    filmEventMenu.classList.toggle("is-visible", menuVisible);
  }

  const resumeVisible = progress < 0.98;
  if (filmResumeBtn && resumeVisible !== lastResumeVisible) {
    lastResumeVisible = resumeVisible;
    filmResumeBtn.classList.toggle("is-visible", resumeVisible);
  }
  updateResumeBtnPosition();

  if (activeIdx !== lastRenderedAct) {
    lastRenderedAct = activeIdx;
    actMenuButtons.forEach((b) => {
      const act = parseInt(b.dataset.targetAct, 10);
      const isActive = act === activeIdx && activeIdx > 0;
      b.classList.toggle("is-active", isActive);
      b.setAttribute("aria-current", isActive ? "true" : "false");
    });
    const theme = timeThemes[activeIdx];
    if (theme !== lastTimeTheme) {
      lastTimeTheme = theme;
      document.body.setAttribute("data-time-of-day", theme);
    }
  }

  // Lazy-load Reels 2 & 3 ahead of their transition windows
  if (progress > 0.15) ensureReelLoaded(2);
  if (progress > 0.48) ensureReelLoaded(3);

  for (let idx = 0; idx < filmFrames.length; idx++) {
    const frame = filmFrames[idx];
    let opacity = 0;
    let translateY = 24;

    if (idx === 0) {
      if (progress < 0.14) { opacity = 1; translateY = 0; }
      else if (progress < 0.20) {
        const t = (progress - 0.14) / 0.06;
        opacity = 1 - t;
        translateY = -t * 24;
      }
    } else if (idx === 1) {
      if (progress >= 0.18 && progress < 0.24) {
        const t = (progress - 0.18) / 0.06;
        opacity = t;
        translateY = (1 - t) * 24;
      } else if (progress >= 0.24 && progress < 0.38) {
        opacity = 1; translateY = 0;
      } else if (progress >= 0.38 && progress < 0.44) {
        const t = (progress - 0.38) / 0.06;
        opacity = 1 - t;
        translateY = -t * 24;
      }
    } else if (idx === 2) {
      if (progress >= 0.42 && progress < 0.48) {
        const t = (progress - 0.42) / 0.06;
        opacity = t;
        translateY = (1 - t) * 24;
      } else if (progress >= 0.48 && progress < 0.66) {
        opacity = 1; translateY = 0;
      } else if (progress >= 0.66 && progress < 0.72) {
        const t = (progress - 0.66) / 0.06;
        opacity = 1 - t;
        translateY = -t * 24;
      }
    } else if (idx === 3) {
      if (progress >= 0.70 && progress < 0.76) {
        const t = (progress - 0.70) / 0.06;
        opacity = t;
        translateY = (1 - t) * 24;
      } else if (progress >= 0.76 && progress < 0.94) {
        opacity = 1; translateY = 0;
      } else if (progress >= 0.94) {
        const t = (progress - 0.94) / 0.06;
        opacity = 1 - t;
        translateY = -t * 24;
      }
    }

    const quantizedOp = reducedMotion ? (opacity > 0.2 ? 1 : 0) : Math.round(opacity * 200) / 200;
    const quantizedTy = reducedMotion ? 0 : Math.round(translateY * 2) / 2;
    const isFocused = quantizedOp > 0.05 && (activeIdx === idx || (idx > 0 && Math.abs(activeIdx - idx) <= 1));
    const peMode = (activeIdx === idx || quantizedOp > 0.2) ? "auto" : "none";

    const cache = frameCache[idx];
    if (cache.op !== quantizedOp) {
      cache.op = quantizedOp;
      frame.style.opacity = String(quantizedOp);
    }
    if (cache.ty !== quantizedTy) {
      cache.ty = quantizedTy;
      frame.style.transform = `translateY(${quantizedTy}px)`;
    }
    if (cache.active !== isFocused) {
      cache.active = isFocused;
      frame.classList.toggle("is-active", isFocused);
    }
    if (cache.pe !== peMode) {
      cache.pe = peMode;
      frame.style.pointerEvents = "none";
      const card = frame.querySelector(".cinema-lower-third, .cinema-cover-header, .cinema-cover-footer");
      if (card) card.style.pointerEvents = peMode;
    }
  }
}

function scrubVideoTo(video, targetT) {
  if (!video || !video.src) return;
  const clamped = Math.max(0, Math.min(targetT, video.duration || 10));
  if (!video.seeking && Math.abs(video.currentTime - clamped) > 0.06) {
    try {
      if (typeof video.fastSeek === "function") {
        video.fastSeek(clamped);
      } else {
        video.currentTime = clamped;
      }
    } catch (e) { }
  }
}

let lastInCinema = null;
function updateFilmProgress() {
  if (!filmTrack) return;
  const rect = filmTrack.getBoundingClientRect();
  const trackHeight = cachedTrackHeight;
  if (trackHeight <= 0) return;

  const progress = Math.min(Math.max(-rect.top / trackHeight, 0), 1);
  const inCinema = rect.top <= 80 && rect.bottom >= window.innerHeight * 0.15;
  if (inCinema !== lastInCinema) {
    lastInCinema = inCinema;
    document.body.classList.toggle("in-cinema", inCinema);
  }

  renderFilmUI(progress);

  if (progress < 0.38) {
    if (videoLayer1) videoLayer1.style.opacity = "1";
    if (videoLayer2) videoLayer2.style.opacity = "0";
    if (videoLayer3) videoLayer3.style.opacity = "0";
  } else if (progress < 0.44) {
    const t = (progress - 0.38) / 0.06;
    if (videoLayer1) videoLayer1.style.opacity = "1";
    if (videoLayer2) videoLayer2.style.opacity = String(t.toFixed(3));
    if (videoLayer3) videoLayer3.style.opacity = "0";
  } else if (progress < 0.66) {
    if (videoLayer1) videoLayer1.style.opacity = "0";
    if (videoLayer2) videoLayer2.style.opacity = "1";
    if (videoLayer3) videoLayer3.style.opacity = "0";
  } else if (progress < 0.72) {
    const t = (progress - 0.66) / 0.06;
    if (videoLayer1) videoLayer1.style.opacity = "0";
    if (videoLayer2) videoLayer2.style.opacity = "1";
    if (videoLayer3) videoLayer3.style.opacity = String(t.toFixed(3));
  } else {
    if (videoLayer1) videoLayer1.style.opacity = "0";
    if (videoLayer2) videoLayer2.style.opacity = "0";
    if (videoLayer3) videoLayer3.style.opacity = "1";
  }

  if (!filmAutoPlaying) {
    if (progress < 0.46 && video1) {
      const t1 = 2.85 + Math.min(Math.max(progress / 0.44, 0), 1) * (9.6 - 2.85);
      scrubVideoTo(video1, t1);
    }
    if (progress >= 0.38 && progress < 0.74 && video2) {
      const maxReel2T = (dur2 && dur2 > 1.0) ? dur2 : 10.0;
      const t2 = Math.min(Math.max((progress - 0.44) / 0.28, 0), 1) * maxReel2T;
      scrubVideoTo(video2, t2);
    }
    if (progress >= 0.66 && video3) {
      const maxReel3T = (dur3 && dur3 > 1.0) ? dur3 : 10.0;
      const t3 = Math.min(Math.max((progress - 0.72) / 0.28, 0), 1) * Math.min(maxReel3T, 9.6);
      scrubVideoTo(video3, t3);
    }
  }
}

function startAutoPlayFilm() {
  if (filmAutoPlaying || !filmTrack) return;
  filmAutoPlaying = true;
  document.body.classList.add("movie-playing");

  ensureReelLoaded(1);

  if (!playing) {
    try {
      startMusic();
      playing = true;
      if (btn) {
        btn.setAttribute("aria-pressed", "true");
        btn.classList.add("is-playing");
      }
    } catch { }
  }

  const rect = filmTrack.getBoundingClientRect();
  const trackHeight = cachedTrackHeight;
  let currentProg = Math.min(Math.max(-rect.top / trackHeight, 0), 1);

  if (currentProg >= 0.96) {
    currentProg = 0;
    if (video1) video1.currentTime = 2.85;
    if (video2 && video2.src) video2.currentTime = 0;
    if (video3 && video3.src) video3.currentTime = 0;
    window.scrollTo({ top: cachedTrackTop, behavior: "instant" });
  }

  let activeReel = 1;
  if (currentProg < 0.44) activeReel = 1;
  else if (currentProg < 0.72) activeReel = 2;
  else activeReel = 3;

  ensureReelLoaded(activeReel);

  if (activeReel === 1) {
    if (videoLayer1) videoLayer1.style.opacity = "1";
    if (videoLayer2) videoLayer2.style.opacity = "0";
    if (videoLayer3) videoLayer3.style.opacity = "0";
    if (video1) {
      if (video1.currentTime < 2.5 || video1.currentTime >= 9.6) {
        video1.currentTime = 2.85;
      }
      video1.playbackRate = FILM_PLAYBACK_RATE;
      video1.play().catch(() => { });
    }
  } else if (activeReel === 2) {
    if (videoLayer1) videoLayer1.style.opacity = "0";
    if (videoLayer2) videoLayer2.style.opacity = "1";
    if (videoLayer3) videoLayer3.style.opacity = "0";
    if (video2) {
      const maxReel2T = (dur2 && dur2 > 1.0) ? dur2 : 10.0;
      if (video2.currentTime >= maxReel2T - 0.2) {
        video2.currentTime = 0;
      }
      video2.playbackRate = FILM_PLAYBACK_RATE;
      video2.play().catch(() => { });
    }
  } else {
    if (videoLayer1) videoLayer1.style.opacity = "0";
    if (videoLayer2) videoLayer2.style.opacity = "0";
    if (videoLayer3) videoLayer3.style.opacity = "1";
    if (video3) {
      if (video3.currentTime >= 9.5) {
        video3.currentTime = 0;
      }
      video3.playbackRate = RECEPTION_PLAYBACK_RATE;
      video3.play().catch(() => { });
    }
  }

  function autoPlayStep() {
    if (!filmAutoPlaying) return;

    let overallProg = 0;

    if (activeReel === 1) {
      const t1 = video1 ? video1.currentTime : 2.85;
      const progReel1 = Math.min(Math.max((t1 - 2.85) / (9.6 - 2.85), 0), 1);
      overallProg = progReel1 * 0.44;

      if (t1 >= 6.0) ensureReelLoaded(2);

      if (t1 >= 8.15) {
        if (video2 && video2.paused) {
          video2.currentTime = 0.04;
          video2.playbackRate = FILM_PLAYBACK_RATE;
          video2.play().catch(() => { });
        }
        const fade = Math.min(Math.max((t1 - 8.15) / 1.40, 0), 1);
        if (videoLayer1) videoLayer1.style.opacity = "1";
        if (videoLayer2) videoLayer2.style.opacity = String(fade.toFixed(3));
        if (videoLayer3) videoLayer3.style.opacity = "0";
      } else {
        if (videoLayer1) videoLayer1.style.opacity = "1";
        if (videoLayer2) videoLayer2.style.opacity = "0";
        if (videoLayer3) videoLayer3.style.opacity = "0";
      }

      if (t1 >= 9.55) {
        activeReel = 2;
        if (video1) video1.pause();
        if (videoLayer1) videoLayer1.style.opacity = "0";
        if (videoLayer2) videoLayer2.style.opacity = "1";
        if (video2 && video2.paused) {
          video2.playbackRate = FILM_PLAYBACK_RATE;
          video2.play().catch(() => { });
        }
      }
    } else if (activeReel === 2) {
      const maxReel2T = (dur2 && dur2 > 1.0) ? dur2 : 10.0;
      const t2 = video2 ? video2.currentTime : 0;
      const progReel2 = Math.min(Math.max(t2 / maxReel2T, 0), 1);
      overallProg = 0.44 + progReel2 * 0.28;

      if (t2 >= 5.0) ensureReelLoaded(3);

      const fadeStart2 = Math.max(maxReel2T - 1.40, 0.5);
      if (t2 >= fadeStart2) {
        if (video3 && video3.paused) {
          video3.currentTime = 0.04;
          video3.playbackRate = RECEPTION_PLAYBACK_RATE;
          video3.play().catch(() => { });
        }
        const fade = Math.min(Math.max((t2 - fadeStart2) / 1.35, 0), 1);
        if (videoLayer1) videoLayer1.style.opacity = "0";
        if (videoLayer2) videoLayer2.style.opacity = "1";
        if (videoLayer3) videoLayer3.style.opacity = String(fade.toFixed(3));
      } else {
        if (videoLayer1) videoLayer1.style.opacity = "0";
        if (videoLayer2) videoLayer2.style.opacity = "1";
        if (videoLayer3) videoLayer3.style.opacity = "0";
      }

      if (t2 >= maxReel2T - 0.08) {
        activeReel = 3;
        if (video2) video2.pause();
        if (videoLayer2) videoLayer2.style.opacity = "0";
        if (videoLayer3) videoLayer3.style.opacity = "1";
        if (video3 && video3.paused) {
          video3.playbackRate = RECEPTION_PLAYBACK_RATE;
          video3.play().catch(() => { });
        }
      }
    } else {
      const maxReel3T = (dur3 && dur3 > 1.0) ? dur3 : 10.0;
      const t3 = video3 ? video3.currentTime : 0;
      const progReel3 = Math.min(Math.max(t3 / Math.min(maxReel3T, 9.6), 0), 1);
      overallProg = 0.72 + progReel3 * 0.28;

      if (videoLayer1) videoLayer1.style.opacity = "0";
      if (videoLayer2) videoLayer2.style.opacity = "0";
      if (videoLayer3) videoLayer3.style.opacity = "1";

      if (t3 >= Math.min(maxReel3T, 9.6) - 0.15 || overallProg >= 0.995) {
        stopAutoPlayFilm();
        if (video3) {
          try {
            video3.pause();
            video3.currentTime = Math.min(maxReel3T, 9.6) - 0.06;
          } catch (e) { }
        }
        const countdownEl = document.getElementById("countdown");
        if (countdownEl) {
          countdownEl.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
        }
        return;
      }
    }

    renderFilmUI(overallProg);

    const targetScrollY = cachedTrackTop + overallProg * cachedTrackHeight;
    window.scrollTo({ top: targetScrollY, behavior: "instant" });

    autoPlayAnimId = requestAnimationFrame(autoPlayStep);
  }

  autoPlayAnimId = requestAnimationFrame(autoPlayStep);
}

function stopAutoPlayFilm() {
  if (!filmAutoPlaying) return;
  filmAutoPlaying = false;
  setBuffering(false);
  document.body.classList.remove("movie-playing");
  if (autoPlayAnimId) {
    cancelAnimationFrame(autoPlayAnimId);
    autoPlayAnimId = null;
  }
  if (video1) { try { video1.pause(); } catch (e) { } }
  if (video2) { try { video2.pause(); } catch (e) { } }
  if (video3) { try { video3.pause(); } catch (e) { } }
  updateResumeBtnPosition(true);
}

// User interactions pause autoplay promptly
window.addEventListener("wheel", (e) => {
  if (!filmAutoPlaying || Date.now() < userInteractionAllowedAfter) return;
  if (Math.abs(e.deltaY) > 3 || Math.abs(e.deltaX) > 3) {
    stopAutoPlayFilm();
  }
}, { passive: true });

window.addEventListener("touchstart", (e) => {
  if (e.touches && e.touches[0]) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }
}, { passive: true });

window.addEventListener("touchmove", (e) => {
  if (!filmAutoPlaying || Date.now() < userInteractionAllowedAfter) return;
  if (e.touches && e.touches[0]) {
    const dx = Math.abs(e.touches[0].clientX - touchStartX);
    const dy = Math.abs(e.touches[0].clientY - touchStartY);
    if (dx > 8 || dy > 8) {
      stopAutoPlayFilm();
    }
  }
}, { passive: true });

const NAV_KEYS = new Set([
  "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "Spacebar", "Escape"
]);
window.addEventListener("keydown", (e) => {
  if (!filmAutoPlaying || Date.now() < userInteractionAllowedAfter) return;
  if (NAV_KEYS.has(e.key)) {
    stopAutoPlayFilm();
  }
});

// Unified rAF-throttled scroll handler
let scrollTicking = false;
function onWindowScroll() {
  scrollTicking = false;
  if (progressBar) {
    const p = Math.min(Math.max(window.scrollY / cachedDocScrollMax, 0), 1);
    progressBar.style.width = `${(p * 100).toFixed(2)}%`;
  }
  if (!filmAutoPlaying) {
    updateFilmProgress();
  }
}

window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(onWindowScroll);
  }
}, { passive: true });

onWindowScroll();

function jumpToFilmAct(actIdx) {
  stopAutoPlayFilm();
  if (!filmTrack) return;
  const clampedAct = Math.min(Math.max(actIdx, 0), 3);
  if (clampedAct >= 1) ensureReelLoaded(1);
  if (clampedAct >= 2) ensureReelLoaded(2);
  if (clampedAct >= 3) ensureReelLoaded(3);
  const actTargets = [0.01, 0.30, 0.56, 0.84];
  const p = actTargets[clampedAct];

  // Seek target video frame immediately so the jump lands on the matching visual scene
  try {
    if (clampedAct <= 1 && video1) {
      video1.currentTime = 2.85 + Math.min(Math.max(p / 0.44, 0), 1) * (9.6 - 2.85);
    } else if (clampedAct === 2 && video2 && video2.src) {
      const maxReel2T = (dur2 && dur2 > 1.0) ? dur2 : 10.0;
      video2.currentTime = Math.min(Math.max((p - 0.44) / 0.28, 0), 1) * maxReel2T;
    } else if (clampedAct === 3 && video3 && video3.src) {
      const maxReel3T = (dur3 && dur3 > 1.0) ? dur3 : 10.0;
      video3.currentTime = Math.min(Math.max((p - 0.72) / 0.28, 0), 1) * Math.min(maxReel3T, 9.6);
    }
  } catch (e) { }

  const targetTop = cachedTrackTop + cachedTrackHeight * p;
  window.scrollTo({
    top: targetTop,
    behavior: reducedMotion ? "auto" : "smooth"
  });
}

document.addEventListener("click", (e) => {
  const actBtn = e.target.closest("[data-target-act]");
  if (actBtn) {
    const act = parseInt(actBtn.dataset.targetAct, 10);
    jumpToFilmAct(act);
    return;
  }
  const scrollTrigger = e.target.closest("[data-scroll]");
  if (scrollTrigger) {
    e.preventDefault();
    stopAutoPlayFilm();
    const selector = scrollTrigger.dataset.scroll;
    if (selector === "#muhurtham") return jumpToFilmAct(2);
    if (selector === "#engagement") return jumpToFilmAct(1);
    if (selector === "#reception") return jumpToFilmAct(3);
    if (selector === "#cover") return jumpToFilmAct(0);
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    }
  }
});

if (filmResumeBtn) {
  filmResumeBtn.addEventListener("click", () => {
    userInteractionAllowedAfter = Date.now() + 250;
    startAutoPlayFilm();
  });
}

const replayFilmBtn = document.getElementById("replayFilmBtn");
if (replayFilmBtn) {
  replayFilmBtn.addEventListener("click", () => {
    userInteractionAllowedAfter = Date.now() + 250;
    if (video1) video1.currentTime = 2.85;
    if (video2 && video2.src) video2.currentTime = 0;
    if (video3 && video3.src) video3.currentTime = 0;
    window.scrollTo({ top: cachedTrackTop, behavior: "instant" });
    updateFilmProgress();
    startAutoPlayFilm();
  });
}

const stickyFilmViewport = document.querySelector(".sticky-film-viewport");
if (stickyFilmViewport) {
  stickyFilmViewport.addEventListener("click", (e) => {
    if (e.target.closest("button, a, input, .scene-card")) return;
    if (filmAutoPlaying && Date.now() >= userInteractionAllowedAfter) {
      stopAutoPlayFilm();
    }
  });
}

window.addEventListener("resize", () => {
  cacheFilmTrackMetrics();
  updateResumeBtnPosition(true);
}, { passive: true });

updateResumeBtnPosition(true);

// Silent Backend View Counter
(function trackViewSilently() {
  try {
    const isNewSession = !sessionStorage.getItem("gd_view_counted");
    if (isNewSession) {
      sessionStorage.setItem("gd_view_counted", "1");
    }
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isNewSession }),
      cache: "no-store",
      keepalive: true
    }).catch(() => { });
  } catch (e) { }
})();

// ==========================================================================
// PETAL SHOWERS + SHARED BLESSING COUNTER
// ==========================================================================
const showerCountEl = document.getElementById("showerCount");
let showerTotal = null;
let lastShowerVisualAt = 0;
let lastShowerPostAt = 0;

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
  const now = Date.now();
  if (now - lastShowerPostAt < 2000) return;
  lastShowerPostAt = now;
  try {
    const res = await fetch("/api/showers", { method: "POST", cache: "no-store" });
    if (!res.ok) throw new Error("bad status");
    const data = await res.json();
    showerTotal = data.count;
    renderShowerTotal();
  } catch {
    try { localStorage.setItem("gd_shower_total", String(showerTotal)); } catch { }
  }
}

// ==========================================================================
// CANVAS PARTICLE ENGINE (BLESSING BURSTS + CURSOR TRAIL, ZERO DOM CHURN)
// ==========================================================================
const particleCanvas = document.getElementById("particleCanvas");
const pCtx = particleCanvas ? particleCanvas.getContext("2d") : null;
const activeParticles = [];
let particleAnimId = null;
let canvasW = window.innerWidth;
let canvasH = window.innerHeight;
const MAX_CANVAS_PARTICLES = window.innerWidth < 768 ? 48 : 75;

function resizeParticleCanvas() {
  if (!particleCanvas || !pCtx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvasW = window.innerWidth;
  canvasH = window.innerHeight;
  particleCanvas.width = Math.round(canvasW * dpr);
  particleCanvas.height = Math.round(canvasH * dpr);
  pCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
if (particleCanvas && pCtx) {
  resizeParticleCanvas();
  window.addEventListener("resize", resizeParticleCanvas, { passive: true });
}

function stepParticles(now) {
  if (!pCtx || activeParticles.length === 0) {
    if (pCtx) pCtx.clearRect(0, 0, canvasW, canvasH);
    particleAnimId = null;
    return;
  }

  pCtx.clearRect(0, 0, canvasW, canvasH);

  for (let i = activeParticles.length - 1; i >= 0; i--) {
    const p = activeParticles[i];
    const age = (now - p.born) / 1000;
    if (age >= p.life) {
      activeParticles.splice(i, 1);
      continue;
    }

    const t = age / p.life;
    const alpha = t < 0.12 ? t / 0.12 : Math.max(0, 1 - (t - 0.12) / 0.88);
    const swayOffset = Math.sin(age * p.swayFreq + p.phase) * p.swayAmp;
    const x = p.x + p.vx * age + swayOffset;
    const y = p.y + p.vy * age + 0.5 * p.gravity * age * age;
    const rot = p.rot + p.vRot * age;

    pCtx.save();
    pCtx.globalAlpha = alpha;
    pCtx.translate(x, y);
    pCtx.rotate(rot);

    if (p.kind === "grain") {
      pCtx.fillStyle = "#f5c842";
      pCtx.beginPath();
      pCtx.ellipse(0, 0, 2.5, 5, 0, 0, Math.PI * 2);
      pCtx.fill();
    } else {
      pCtx.font = `${p.size}px serif`;
      pCtx.textAlign = "center";
      pCtx.textBaseline = "middle";
      pCtx.fillText(p.glyph, 0, 0);
    }

    pCtx.restore();
  }

  particleAnimId = requestAnimationFrame(stepParticles);
}

function pushParticle(p) {
  if (!pCtx || reducedMotion) return;
  if (activeParticles.length >= MAX_CANVAS_PARTICLES) {
    activeParticles.shift();
  }
  activeParticles.push(p);
  if (!particleAnimId) {
    particleAnimId = requestAnimationFrame(stepParticles);
  }
}

function triggerBlessingShower(originX, originY, count = 12) {
  if (reducedMotion || !pCtx) return;
  const flowerGlyphs = ["🌸", "🌹", "🌼", "🏵️", "🌺"];
  const totalItems = Math.min(Math.max(count, 8), 16);
  const now = performance.now();

  for (let i = 0; i < totalItems; i++) {
    const spreadNorm = (i / (totalItems - 1) - 0.5) * 2;
    const isPetal = i % 3 !== 0;
    pushParticle({
      kind: isPetal ? "petal" : "grain",
      glyph: flowerGlyphs[i % flowerGlyphs.length],
      size: 16 + (i % 4) * 3,
      x: originX,
      y: originY,
      vx: spreadNorm * (45 + (i % 3) * 14),
      vy: -(65 + (1 - Math.abs(spreadNorm)) * 45 + (i % 3) * 12),
      gravity: 165,
      swayAmp: 18 + (i % 3) * 6,
      swayFreq: 2.5 + (i % 3) * 0.6,
      phase: i * 0.7,
      rot: spreadNorm * 0.6,
      vRot: (i % 2 === 0 ? 1 : -1) * (1.2 + (i % 3) * 0.5),
      born: now + i * 22,
      life: 2.8 + (i % 4) * 0.28
    });
  }
}

document.addEventListener("pointerdown", (e) => {
  if (document.body.classList.contains("locked")) return;
  if (e.target.closest("button, a, input, select, textarea, [role='button'], .invitation-card, #calDialog, .cal-dialog")) {
    return;
  }
  const now = Date.now();
  if (now - lastShowerVisualAt < 320) return;
  lastShowerVisualAt = now;
  const x = typeof e.clientX === "number" ? e.clientX : window.innerWidth / 2;
  const y = typeof e.clientY === "number" ? e.clientY : window.innerHeight / 2;
  triggerBlessingShower(x, y);
  recordShower();
});

const blessBtn = document.getElementById("blessBtn");
if (blessBtn) {
  blessBtn.addEventListener("click", (e) => {
    const r = blessBtn.getBoundingClientRect();
    const x = e.clientX || (r.left + r.width / 2);
    const y = e.clientY || r.top;
    triggerBlessingShower(x, y, 14);
    recordShower();
  });
}

// Share Invitation button (Web Share API with clipboard fallback)
const shareBtn = document.getElementById("shareBtn");
if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    const shareUrl = "https://gnanaganesh-weds-dharshini.gnanaganesh.in/";
    const shareData = {
      title: "GnanaGanesh weds Dharshini — Wedding Invitation",
      text: "Join us to celebrate the wedding of GnanaGanesh & Dharshini on 12–13 December 2026 in Tiruchendur & Thoothukudi!",
      url: shareUrl
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (e) {
        if (e && e.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      const label = shareBtn.querySelector("span");
      if (label) {
        const orig = label.textContent;
        label.textContent = "✓ Link Copied!";
        setTimeout(() => { label.textContent = orig; }, 2200);
      }
    } catch (e) { }
  });
}

// Modal focus trap inside #opener while locked
if (opener) {
  opener.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || opener.classList.contains("open")) return;
    const isCardOpen = opener.classList.contains("showing-invitation");
    const scope = isCardOpen ? document.getElementById("invitationCard") : opener;
    if (!scope) return;
    const focusables = Array.from(scope.querySelectorAll("button:not([disabled]), a[href]"))
      .filter((el) => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

// Fetch shared count once (no background polling)
fetchShowerTotal();

// Ambient floating petals
if (!reducedMotion) {
  const amb = document.getElementById("ambience");
  if (amb) {
    const glyphs = ["🌸", "🏵️", "🌼", "❋"];
    for (let i = 0; i < 10; i++) {
      const s = document.createElement("span");
      s.className = "ambient-petal";
      s.textContent = glyphs[i % glyphs.length];
      s.style.left = `${Math.random() * 100}%`;
      s.style.fontSize = `${0.7 + Math.random() * 0.8}rem`;
      s.style.animationDuration = `${10 + Math.random() * 9}s`;
      s.style.animationDelay = `${-Math.random() * 15}s`;
      amb.appendChild(s);
    }
  }
}

// Interactive Cursor Trail via Canvas
(function initCursorShower() {
  if (reducedMotion || !pCtx) return;

  const flowerGlyphs = ["🌸", "🌹", "🌼", "🏵️", "🌺", "✨", "🌾"];
  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;

  function spawnTrailParticle(x, y) {
    const isAkshadhai = Math.random() < 0.22;
    pushParticle({
      kind: isAkshadhai ? "grain" : "petal",
      glyph: flowerGlyphs[Math.floor(Math.random() * flowerGlyphs.length)],
      size: 14 + Math.random() * 6,
      x,
      y,
      vx: (Math.random() - 0.5) * 38,
      vy: -(Math.random() * 20 + 8),
      gravity: 145,
      swayAmp: 12 + Math.random() * 10,
      swayFreq: 3.2,
      phase: Math.random() * Math.PI * 2,
      rot: (Math.random() - 0.5) * 0.8,
      vRot: (Math.random() - 0.5) * 2.6,
      born: performance.now(),
      life: 1.1 + Math.random() * 0.35
    });
  }

  function handleMove(clientX, clientY) {
    if (document.body.classList.contains("locked")) return;
    const now = performance.now();
    const dist = Math.hypot(clientX - lastX, clientY - lastY);

    if (dist > 20 || (now - lastTime > 50 && dist > 6)) {
      if (dist > 60) {
        spawnTrailParticle((lastX + clientX) / 2, (lastY + clientY) / 2);
      }
      spawnTrailParticle(clientX, clientY);
      lastX = clientX;
      lastY = clientY;
      lastTime = now;
    }
  }

  window.addEventListener("pointermove", (e) => handleMove(e.clientX, e.clientY), { passive: true });
  window.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
})();

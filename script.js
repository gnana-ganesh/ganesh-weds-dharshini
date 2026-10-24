

// ---------- Auspicious Wedding Preloader ----------
(function initSitePreloader() {
  const preloader = document.getElementById("sitePreloader");
  if (!preloader) return;

  const bar = document.getElementById("preloaderBar");
  const percentEl = document.getElementById("preloaderPercent");
  const statusEl = document.getElementById("preloaderStatus");

  let currentPercent = 0;
  let targetPercent = 25;
  let isDone = false;
  const startTime = Date.now();
  const MIN_DISPLAY_MS = 1400; // Auspicious breath so users experience the royal prologue
  const MAX_WAIT_MS = 3800;    // Failsafe so user is never blocked on slow connections

  const statusMessages = [
    { at: 0, text: "மங்கல அழைப்பிதழ் தயாராகிறது..." },
    { at: 45, text: "இசையும் காட்சிகளும் இணைகின்றன..." },
    { at: 85, text: "அழைப்பு தயார் · மங்கலம் நிறைக!" }
  ];

  function updateStatus(val) {
    if (!statusEl) return;
    for (let i = statusMessages.length - 1; i >= 0; i--) {
      if (val >= statusMessages[i].at) {
        statusEl.textContent = statusMessages[i].text;
        break;
      }
    }
  }

  function setProgress(val) {
    currentPercent = Math.min(100, Math.max(currentPercent, Math.round(val)));
    if (bar) bar.style.width = `${currentPercent}%`;
    if (percentEl) percentEl.textContent = `${currentPercent}%`;
    if (preloader) preloader.setAttribute("aria-valuenow", currentPercent);
    updateStatus(currentPercent);
  }

  // Smooth interpolation ticker
  const interval = setInterval(() => {
    if (currentPercent < targetPercent) {
      const step = Math.max(1, Math.ceil((targetPercent - currentPercent) * 0.18));
      setProgress(currentPercent + step);
    }
    if (currentPercent >= 100 && isDone) {
      clearInterval(interval);
      finish();
    }
  }, 35);

  function finish() {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
    setTimeout(() => {
      setProgress(100);
      if (statusEl) statusEl.textContent = "அழைப்பு தயார் · மங்கலம் நிறைக!";
      setTimeout(() => {
        preloader.classList.add("is-loaded");
        window.dispatchEvent(new CustomEvent("sitePreloaderDone"));
        setTimeout(() => {
          try { preloader.remove(); } catch (e) { preloader.style.display = "none"; }
        }, 800);
      }, 250);
    }, remaining);
  }

  function complete() {
    if (isDone) return;
    isDone = true;
    targetPercent = 100;
  }

  // Stage 1: DOM readiness
  if (document.readyState === "interactive" || document.readyState === "complete") {
    targetPercent = Math.max(targetPercent, 50);
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      targetPercent = Math.max(targetPercent, 50);
    });
  }

  // Stage 2: Fonts loaded
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      targetPercent = Math.max(targetPercent, 70);
    }).catch(() => { });
  }

  // Stage 3: Key image preloads (seal & background poster)
  const keyImages = ["./seal.jpg", "./tiruchendur-comic-landscape.webp?v=4.0"];
  let loadedImages = 0;
  keyImages.forEach(src => {
    const img = new Image();
    img.onload = img.onerror = () => {
      loadedImages++;
      targetPercent = Math.max(targetPercent, 70 + Math.round((loadedImages / keyImages.length) * 20));
    };
    img.src = src;
  });

  // Stage 4: Window complete load
  if (document.readyState === "complete") {
    complete();
  } else {
    window.addEventListener("load", () => {
      complete();
    });
  }

  // Hard safety timeout
  setTimeout(complete, MAX_WAIT_MS);
})();

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;



// Muhurtham: Sunday 13 Dec 2026, 6:30 AM IST. Format: YYYY-MM-DDTHH:MM:SS+05:30
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

// Add to Calendar — Direct invite creation across Google, Apple & Outlook for Muhurtham & Reception
const calBtn = document.getElementById("calBtn");
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
      "&details=" + encodeURIComponent("With the blessings of our families, GnanaGanesh & Dharshini invite you to celebrate their sacred Engagement ceremony.\n\nWebsite: https://ganesh-weds-dharshini.gnanaganesh.in\nVenue: Shanmugar Mahal, Tiruchendur") +
      "&location=" + encodeURIComponent("Shanmugar Mahal, Tiruchendur, Thoothukudi District, Tamil Nadu 628215"),
    outlookUrl: "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent" +
      "&startdt=2026-12-12T13:00:00Z" +
      "&enddt=2026-12-12T15:00:00Z" +
      "&subject=" + encodeURIComponent("GnanaGanesh weds Dharshini — Engagement Ceremony") +
      "&body=" + encodeURIComponent("With the blessings of our families, GnanaGanesh & Dharshini invite you to celebrate their sacred Engagement ceremony.\n\nWebsite: https://ganesh-weds-dharshini.gnanaganesh.in\nVenue: Shanmugar Mahal, Tiruchendur") +
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
      "&details=" + encodeURIComponent("With the blessings of our families, GnanaGanesh & Dharshini invite you to celebrate their sacred wedding ceremony.\n\nWebsite: https://ganesh-weds-dharshini.gnanaganesh.in\nVenue: Shanmugar Mahal, Tiruchendur") +
      "&location=" + encodeURIComponent("Shanmugar Mahal, Tiruchendur, Thoothukudi District, Tamil Nadu 628215"),
    outlookUrl: "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent" +
      "&startdt=2026-12-13T01:00:00Z" +
      "&enddt=2026-12-13T03:00:00Z" +
      "&subject=" + encodeURIComponent("GnanaGanesh weds Dharshini — Sacred Muhurtham") +
      "&body=" + encodeURIComponent("With the blessings of our families, GnanaGanesh & Dharshini invite you to celebrate their sacred wedding ceremony.\n\nWebsite: https://ganesh-weds-dharshini.gnanaganesh.in\nVenue: Shanmugar Mahal, Tiruchendur") +
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
      "&details=" + encodeURIComponent("With joy and gratitude, join GnanaGanesh & Dharshini as they celebrate their Wedding Reception evening.\n\nWebsite: https://ganesh-weds-dharshini.gnanaganesh.in\nVenue: Santhiya Mahal, Thoothukudi") +
      "&location=" + encodeURIComponent("Santhiya Mahal, VMS Nagar South, Meelavittan Road, Thoothukudi, Tamil Nadu"),
    outlookUrl: "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent" +
      "&startdt=2026-12-13T13:00:00Z" +
      "&enddt=2026-12-13T16:00:00Z" +
      "&subject=" + encodeURIComponent("GnanaGanesh weds Dharshini — Wedding Reception") +
      "&body=" + encodeURIComponent("With joy and gratitude, join GnanaGanesh & Dharshini as they celebrate their Wedding Reception evening.\n\nWebsite: https://ganesh-weds-dharshini.gnanaganesh.in\nVenue: Santhiya Mahal, Thoothukudi") +
      "&location=" + encodeURIComponent("Santhiya Mahal, VMS Nagar South, Meelavittan Road, Thoothukudi, Tamil Nadu")
  }
};

function openCalendarModal(eventType) {
  const ev = CALENDAR_EVENTS[eventType] || CALENDAR_EVENTS.muhurtham;
  if (calDialogSub) calDialogSub.textContent = ev.sub;
  if (calMetaDate) calMetaDate.innerHTML = ev.dateHtml;
  if (calMetaTime) calMetaTime.innerHTML = ev.timeHtml;
  if (calMetaLocation) calMetaLocation.innerHTML = ev.locHtml;
  if (gcalOption) gcalOption.href = ev.gcalUrl;
  if (outlookOption) outlookOption.href = ev.outlookUrl;
  if (appleOption) appleOption.href = ev.icsFile;

  // Open directly to Google Calendar by default
  if (ev && ev.gcalUrl) {
    window.open(ev.gcalUrl, "_blank", "noopener");
  } else if (calDialog && typeof calDialog.showModal === "function") {
    calDialog.showModal();
  }
}

if (calBtn) {
  calBtn.addEventListener("click", () => openCalendarModal("muhurtham"));
}

document.addEventListener("click", (e) => {
  const calTrigger = e.target.closest(".venue-cal-btn");
  if (calTrigger) {
    openCalendarModal(calTrigger.dataset.calEvent || "muhurtham");
  }
});

if (calCloseBtn && calDialog) {
  calCloseBtn.addEventListener("click", () => calDialog.close());
}

if (calDialog) {
  calDialog.addEventListener("click", (e) => {
    const rect = calDialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX && e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      calDialog.close();
    }
  });
}

function updatePlaybackUI(isPlaying) {
  if (playBtn) {
    playBtn.innerHTML = isPlaying
      ? "⏸ Pause Story"
      : '<span class="play-icon-glow">▶</span> <span>Watch Wedding Film / கதைப் பயணம்</span>';
  }
}

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
  nodes.forEach(n => { try { n.stop(); } catch { } });
  nodes = [];
}
// Looped invitation track (guest-provided mp3). Starts on the seal tap;
// the Music button toggles it. Synth drone is the fallback if it can't play.
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
if (btn) btn.addEventListener("click", () => {
  playing = !playing;
  btn.setAttribute("aria-pressed", String(playing));
  btn.classList.toggle("is-playing", playing);
  if (playing) startMusic(); else stopMusic();
});

// Sealed-envelope opener: seal breaks -> flap opens -> card rises & stays -> user taps "Play Invitation" -> cinema begins
const opener = document.getElementById("opener");
const openBtn = document.getElementById("openBtn");
const envelope = document.getElementById("envelope");
const cardPlayBtn = document.getElementById("cardPlayBtn");

let isEnvelopeOpened = false;
let sealAutoOpenTimer = null;

function playFilmVideos() {
  const v1 = document.getElementById("filmVideo1");
  const v2 = document.getElementById("filmVideo2");
  const v3 = document.getElementById("filmVideo3");
  if (v1) {
    v1.muted = true;
    try {
      v1.pause();
      if (v1.currentTime < 2.0 || v1.currentTime > 5.0) {
        v1.currentTime = 2.85;
      }
    } catch (e) { }
  }
  if (v2) {
    v2.muted = true;
    try { v2.pause(); v2.currentTime = 0.001; } catch (e) { }
  }
  if (v3) {
    v3.muted = true;
    try { v3.pause(); v3.currentTime = 0.001; } catch (e) { }
  }
}

function revealSite() {
  if (opener) opener.classList.add("open");
  document.body.classList.remove("locked");
  document.body.classList.add("opened");
  window.scrollTo({ top: 0 });
  const cover = document.getElementById("cover");
  if (cover) cover.classList.add("in");
  if (typeof updateFilmProgress === "function") updateFilmProgress();
  // Start playing the wedding film now
  if (typeof startAutoPlayFilm === "function") {
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
  for (let i = 0; i < 28; i++) {
    const s = document.createElement("span");
    s.className = "petal";
    s.textContent = petals[i % petals.length];
    s.style.left = `${30 + Math.random() * 40}%`;
    s.style.setProperty("--dx", `${(Math.random() - 0.5) * 60}vw`);
    s.style.animationDelay = `${Math.random() * 0.3}s`;
    opener.appendChild(s);
    setTimeout(() => s.remove(), 2400);
  }
};

const enterFullScreen = () => {
  try {
    const docEl = document.documentElement;
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    if (isFullscreen) return;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen().catch(() => { });
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    } else if (docEl.webkitRequestFullScreen) {
      docEl.webkitRequestFullScreen();
    } else if (docEl.mozRequestFullScreen) {
      docEl.mozRequestFullScreen();
    } else if (docEl.msRequestFullscreen) {
      docEl.msRequestFullscreen();
    }
  } catch (e) { }
};

function openEnvelope() {
  if (isEnvelopeOpened) return;
  isEnvelopeOpened = true;
  if (sealAutoOpenTimer) {
    clearTimeout(sealAutoOpenTimer);
    sealAutoOpenTimer = null;
  }
  if (openBtn) openBtn.disabled = true;

  // Try unlocking audio if browser allows (succeeds immediately on user gesture)
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
    return;
  }

  // 1. Break the seal
  if (envelope) envelope.classList.add("unsealed");

  // 2. Open the envelope flap
  setTimeout(() => {
    if (envelope) envelope.classList.add("flap-open");
  }, 380);

  // 3. Letter slides up out of the envelope
  setTimeout(() => {
    if (envelope) envelope.classList.add("letter-out");
  }, 950);

  // 4. Reveal the full invitation card with all ceremony details & Play button — and STAY!
  setTimeout(() => {
    if (opener) opener.classList.add("showing-invitation");
    burst();
  }, 1450);
}

function handlePlayInvitation() {
  enterFullScreen();
  try {
    startMusic();
    playing = true;
    if (btn) {
      btn.setAttribute("aria-pressed", "true");
      btn.classList.add("is-playing");
    }
  } catch (e) { }

  userInteractionAllowedAfter = Date.now() + 3200;
  playFilmVideos();

  if (opener) {
    opener.classList.add("open");
  }

  // Reveal site and immediately start the videos
  revealSite();

  setTimeout(() => {
    try {
      if (opener) opener.remove();
    } catch (e) { }
  }, 850);
}

if (opener && openBtn && envelope) {
  document.body.classList.add("locked");
  document.body.classList.remove("opened");

  // User manual tap on seal opens immediately
  openBtn.addEventListener("click", () => {
    openEnvelope();
  });

  // Schedule auto-open: seal opens by default in 2 seconds if not opened already
  function scheduleSealAutoOpen() {
    if (sealAutoOpenTimer || isEnvelopeOpened) return;
    sealAutoOpenTimer = setTimeout(() => {
      if (!isEnvelopeOpened) {
        openEnvelope();
      }
    }, 2000);
  }

  const preloaderEl = document.getElementById("sitePreloader");
  if (!preloaderEl || preloaderEl.classList.contains("is-loaded")) {
    scheduleSealAutoOpen();
  } else {
    window.addEventListener("sitePreloaderDone", scheduleSealAutoOpen, { once: true });
    // Safety fallback
    setTimeout(scheduleSealAutoOpen, 4200);
  }

  // Play button on the invitation card triggers video film
  if (cardPlayBtn) {
    cardPlayBtn.addEventListener("click", handlePlayInvitation);
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
// CINEMATIC SCROLL FILM ENGINE: TRIPLE-REEL STORYTELLING ON SCROLL
// ==========================================================================
const filmTrack = document.getElementById("scrollCinemaTrack");
const video1 = document.getElementById("filmVideo1");
const video2 = document.getElementById("filmVideo2");
const video3 = document.getElementById("filmVideo3");
const videoLayer1 = document.getElementById("videoLayer1");
const videoLayer2 = document.getElementById("videoLayer2");
const videoLayer3 = document.getElementById("videoLayer3");
const filmStageContent = document.querySelector(".film-stage-content");
const filmFrames = Array.from(document.querySelectorAll(".film-scene-frame"));
const filmTimelineFill = document.getElementById("filmTimelineFill");
const filmActName = document.getElementById("filmActName");
const filmTimecode = document.getElementById("filmTimecode");
const filmDots = Array.from(document.querySelectorAll(".film-cue-dot"));
const filmFocusBtn = document.getElementById("filmFocusBtn");
const playBtn = document.getElementById("playBtn");

const actTitles = [
  "REEL 1 · TIRUCHENDUR SHORE",
  "REEL 1 · ACT I: ENGAGEMENT",
  "REEL 2 · ACT II: SACRED MUHURTHAM",
  "REEL 3 · ACT III: RECEPTION GALA"
];

const timeThemes = ["sunrise", "twilight", "sunrise", "night"];

// Initialize 3 video reels: muted, inline, primed, sped up by 10% across all chapters
const FILM_PLAYBACK_RATE = 0.40; // Sped up by 10% (0.36 * 1.10 = 0.396 ≈ 0.40x)
const RECEPTION_PLAYBACK_RATE = 0.48; // Sped up by 10% (0.44 * 1.10 = 0.484 ≈ 0.48x)
let dur1 = 10.0;
let dur2 = 10.0;
let dur3 = 10.0;
[video1, video2, video3].forEach((v, idx) => {
  if (!v) return;
  const reelRate = (idx === 2) ? RECEPTION_PLAYBACK_RATE : FILM_PLAYBACK_RATE;
  v.muted = true;
  v.playsInline = true;
  v.defaultPlaybackRate = reelRate;
  v.playbackRate = reelRate;
  v.setAttribute("playsinline", "");
  v.setAttribute("webkit-playsinline", "");
  v.addEventListener("loadedmetadata", () => {
    v.playbackRate = reelRate;
    if (idx === 0 && v.duration && !isNaN(v.duration)) dur1 = v.duration;
    if (idx === 1 && v.duration && !isNaN(v.duration)) dur2 = v.duration;
    if (idx === 2 && v.duration && !isNaN(v.duration)) dur3 = v.duration;
    try {
      v.pause();
      if (idx === 0) v.currentTime = 2.85;
    } catch (e) { }
  });
  v.addEventListener("play", () => {
    v.playbackRate = reelRate;
  });
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
});

// Scrubbing and playback state (start with standing couple at 2.85s)
let targetTime1 = 2.85;
let targetTime2 = 0;
let targetTime3 = 0;
let currentFilmAct = 0;
let filmAutoPlaying = false;
let autoPlayAnimId = null;
let cardsHidden = false;
let userInteractionAllowedAfter = 0;
let touchStartX = 0;
let touchStartY = 0;

// Toggle Focus Mode (Hide/Show Narrative Cards to admire full-screen film)
if (filmFocusBtn && filmStageContent) {
  filmFocusBtn.addEventListener("click", () => {
    cardsHidden = !cardsHidden;
    filmStageContent.classList.toggle("cards-hidden", cardsHidden);
    filmFocusBtn.classList.toggle("is-active", cardsHidden);
    filmFocusBtn.setAttribute("aria-pressed", String(cardsHidden));
    const label = filmFocusBtn.querySelector(".focus-label");
    if (label) {
      label.textContent = cardsHidden ? "Show Story" : "Film Focus";
    }
  });
}

// Dock the floating play button directly above the active event description card or footer
let lastMeasuredAct = -1;
function updateResumeBtnPosition(force = false) {
  const filmResumeBtn = document.getElementById("filmResumeBtn");
  if (!filmResumeBtn) return;
  if (!force && lastMeasuredAct === currentFilmAct) return;
  lastMeasuredAct = currentFilmAct;

  const activeFrame = (typeof filmFrames !== "undefined" && filmFrames[currentFilmAct]) || document.querySelector(".film-scene-frame.is-active");
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

// Render narrative cards, timecode, HUD and lighting according to normalized progress (0.00 to 1.00)
function renderFilmUI(progress) {
  // Update scrubber progress bar fill
  if (filmTimelineFill) {
    filmTimelineFill.style.width = (progress * 100) + "%";
  }

  // Hide the "Scroll up" hint on cover once scrolled past the premiere title
  const coverScrollHint = document.getElementById("coverScrollHint");
  if (coverScrollHint) {
    if (progress > 0.02 || window.scrollY > 40) {
      coverScrollHint.classList.add("is-hidden");
    } else {
      coverScrollHint.classList.remove("is-hidden");
    }
  }

  // 4 acts across progress:
  // Act 0: 0.00 – 0.20 (Standing Couple on Shore)
  // Act 1: 0.20 – 0.44 (Engagement Mandapam)
  // Act 2: 0.44 – 0.72 (Sacred Muhurtham)
  // Act 3: 0.72 – 1.00 (Reception Gala)
  let activeIdx = 0;
  if (progress < 0.20) activeIdx = 0;
  else if (progress < 0.44) activeIdx = 1;
  else if (progress < 0.72) activeIdx = 2;
  else activeIdx = 3;

  currentFilmAct = activeIdx;

  // Update HUD act title & active dot
  if (filmActName) {
    filmActName.textContent = actTitles[activeIdx];
  }
  filmDots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === activeIdx);
  });

  // Update floating event navigation menu visibility & active states
  const filmEventMenu = document.getElementById("filmEventMenu");
  if (filmEventMenu) {
    if (progress >= 0.12 && progress < 0.98) {
      filmEventMenu.classList.add("is-visible");
    } else {
      filmEventMenu.classList.remove("is-visible");
    }
  }

  // Floating play/resume button visibility inside the cinema scenes (including the first part)
  const filmResumeBtn = document.getElementById("filmResumeBtn");
  if (filmResumeBtn) {
    filmResumeBtn.classList.toggle("is-visible", progress < 0.98);
    updateResumeBtnPosition();
  }

  document.querySelectorAll("[data-target-act]").forEach((btn) => {
    const act = parseInt(btn.dataset.targetAct, 10);
    const isActive = (act === activeIdx && activeIdx > 0);
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-current", isActive ? "true" : "false");
  });

  // Dynamic atmospheric body lighting
  document.body.setAttribute("data-time-of-day", timeThemes[activeIdx]);

  // Update Timecode in HUD
  if (filmTimecode) {
    const totalSecs = progress * (dur1 + dur2 + dur3);
    const m = Math.floor(totalSecs / 60);
    const s = Math.floor(totalSecs % 60);
    const ms = Math.floor((totalSecs % 1) * 10);
    filmTimecode.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${ms}`;
  }

  // --- NARRATIVE SCENE CARD PROGRESSION ---
  filmFrames.forEach((frame, idx) => {
    let opacity = 0;
    let translateY = 24; // px
    if (idx === 0) {
      // Act 0: Cover (0.00 to 0.20)
      if (progress < 0.14) {
        opacity = 1;
        translateY = 0;
      } else if (progress < 0.20) {
        const t = (progress - 0.14) / 0.06;
        opacity = 1 - t;
        translateY = -t * 24;
      }
    } else if (idx === 1) {
      // Act 1: Engagement (0.20 to 0.44)
      if (progress >= 0.18 && progress < 0.24) {
        const t = (progress - 0.18) / 0.06;
        opacity = t;
        translateY = (1 - t) * 24;
      } else if (progress >= 0.24 && progress < 0.38) {
        opacity = 1;
        translateY = 0;
      } else if (progress >= 0.38 && progress < 0.44) {
        const t = (progress - 0.38) / 0.06;
        opacity = 1 - t;
        translateY = -t * 24;
      }
    } else if (idx === 2) {
      // Act 2: Sacred Muhurtham (0.44 to 0.72)
      if (progress >= 0.42 && progress < 0.48) {
        const t = (progress - 0.42) / 0.06;
        opacity = t;
        translateY = (1 - t) * 24;
      } else if (progress >= 0.48 && progress < 0.66) {
        opacity = 1;
        translateY = 0;
      } else if (progress >= 0.66 && progress < 0.72) {
        const t = (progress - 0.66) / 0.06;
        opacity = 1 - t;
        translateY = -t * 24;
      }
    } else if (idx === 3) {
      // Act 3: Reception (0.72 to 1.00)
      if (progress >= 0.70 && progress < 0.76) {
        const t = (progress - 0.70) / 0.06;
        opacity = t;
        translateY = (1 - t) * 24;
      } else if (progress >= 0.76 && progress < 0.94) {
        opacity = 1;
        translateY = 0;
      } else if (progress >= 0.94) {
        const t = (progress - 0.94) / 0.06;
        opacity = 1 - t;
        translateY = -t * 24;
      }
    }

    if (!reducedMotion) {
      frame.style.opacity = opacity.toFixed(3);
      frame.style.transform = `translateY(${translateY.toFixed(1)}px)`;
    }
    const isFocused = opacity > 0.4;
    frame.classList.toggle("is-active", isFocused);
    frame.style.pointerEvents = isFocused ? "auto" : "none";
  });
}

// Gentle, non-blocking video frame seeking for manual scrolling
function scrubVideoTo(video, targetT) {
  if (!video) return;
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

// Update state when manually scrolling
function updateFilmProgress() {
  if (!filmTrack) return;
  const rect = filmTrack.getBoundingClientRect();
  const trackHeight = filmTrack.offsetHeight - window.innerHeight;
  if (trackHeight <= 0) return;

  const progress = Math.min(Math.max(-rect.top / trackHeight, 0), 1);
  const inCinema = rect.top <= 80 && rect.bottom >= window.innerHeight * 0.15;
  document.body.classList.toggle("in-cinema", inCinema);

  renderFilmUI(progress);

  // Smooth layered crossfade across the 3 video layers (top layer dissolves over 100% opaque bottom layer)
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

  // If user is manually scrolling, gently scrub video frames to current position
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

// Buttery-smooth hardware-accelerated Auto-Playback at 0.85x speed:
// Videos actually play natively at 60fps, crossfade seamlessly, and smoothly drive the film journey
function startAutoPlayFilm() {
  if (filmAutoPlaying) return;
  filmAutoPlaying = true;
  document.body.classList.add("movie-playing");
  updatePlaybackUI(true);

  // Background audio track starts/ensures playback
  if (!playing && typeof startMusic === "function") {
    try {
      startMusic();
      playing = true;
      if (btn) {
        btn.setAttribute("aria-pressed", "true");
        btn.classList.add("is-playing");
      }
    } catch { }
  }

  // Determine current position to resume playing from
  if (!filmTrack) return;
  const rect = filmTrack.getBoundingClientRect();
  const trackHeight = filmTrack.offsetHeight - window.innerHeight;
  let currentProg = Math.min(Math.max(-rect.top / trackHeight, 0), 1);

  // If near the end, restart from beginning
  if (currentProg >= 0.96) {
    currentProg = 0;
    if (video1) video1.currentTime = 2.85;
    if (video2) video2.currentTime = 0;
    if (video3) video3.currentTime = 0;
    window.scrollTo({ top: filmTrack.offsetTop, behavior: "instant" });
  }

  let activeReel = 1;
  if (currentProg < 0.44) activeReel = 1;
  else if (currentProg < 0.72) activeReel = 2;
  else activeReel = 3;

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
      // REEL 1 PLAYBACK (Act 0 & Act 1)
      const t1 = video1 ? video1.currentTime : 2.85;
      const progReel1 = Math.min(Math.max((t1 - 2.85) / (9.6 - 2.85), 0), 1);
      overallProg = progReel1 * 0.44;

      // Luxurious 1.4s smooth crossfade into Reel 2 between 8.15s and 9.55s
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
      // REEL 2 PLAYBACK (Act 2: Sacred Muhurtham)
      const maxReel2T = (dur2 && dur2 > 1.0) ? dur2 : 10.0;
      const t2 = video2 ? video2.currentTime : 0;
      const progReel2 = Math.min(Math.max(t2 / maxReel2T, 0), 1);
      overallProg = 0.44 + progReel2 * 0.28;

      // Luxurious 1.4s smooth crossfade into Reel 3 during last 1.4s of Reel 2
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
      // REEL 3 PLAYBACK (Act 3: Reception Gala)
      const maxReel3T = (dur3 && dur3 > 1.0) ? dur3 : 10.0;
      const t3 = video3 ? video3.currentTime : 0;
      const progReel3 = Math.min(Math.max(t3 / Math.min(maxReel3T, 9.6), 0), 1);
      overallProg = 0.72 + progReel3 * 0.28;

      if (videoLayer1) videoLayer1.style.opacity = "0";
      if (videoLayer2) videoLayer2.style.opacity = "0";
      if (videoLayer3) videoLayer3.style.opacity = "1";

      // Reached the end of the film — hold on final frame of reception video
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
          countdownEl.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }
    }

    // Drive UI & narrative scenes smoothly
    renderFilmUI(overallProg);

    // Keep page scroll position synchronized with the film
    const targetScrollY = filmTrack.offsetTop + overallProg * trackHeight;
    window.scrollTo(0, targetScrollY);

    autoPlayAnimId = requestAnimationFrame(autoPlayStep);
  }

  autoPlayAnimId = requestAnimationFrame(autoPlayStep);
}

function stopAutoPlayFilm() {
  if (!filmAutoPlaying) return;
  filmAutoPlaying = false;
  document.body.classList.remove("movie-playing");
  if (autoPlayAnimId) {
    cancelAnimationFrame(autoPlayAnimId);
    autoPlayAnimId = null;
  }
  if (video1) { try { video1.pause(); } catch (e) { } }
  if (video2) { try { video2.pause(); } catch (e) { } }
  if (video3) { try { video3.pause(); } catch (e) { } }
  updatePlaybackUI(false);
  updateResumeBtnPosition(true);
}

// User interactions (wheel, touch swipe, keys) pause autoplay
window.addEventListener("wheel", (e) => {
  if (!filmAutoPlaying) return;
  if (Date.now() < userInteractionAllowedAfter) return;
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
  if (!filmAutoPlaying) return;
  if (Date.now() < userInteractionAllowedAfter) return;
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
  if (!filmAutoPlaying) return;
  if (Date.now() < userInteractionAllowedAfter) return;
  if (NAV_KEYS.has(e.key)) {
    stopAutoPlayFilm();
  }
});

// Window scroll listener: only syncs progress when in manual mode.
// Programmatic scrolling will NEVER pause autoplay.
window.addEventListener("scroll", () => {
  if (!filmAutoPlaying) {
    requestAnimationFrame(updateFilmProgress);
  }
}, { passive: true });

updateFilmProgress();

// Smooth Jump to specific Film Act (0, 1, 2, 3)
function jumpToFilmAct(actIdx) {
  stopAutoPlayFilm();
  if (!filmTrack) return;
  const trackHeight = filmTrack.offsetHeight - window.innerHeight;
  const actTargets = [0.01, 0.30, 0.56, 0.84];
  const targetTop = filmTrack.offsetTop + trackHeight * actTargets[Math.min(Math.max(actIdx, 0), 3)];

  window.scrollTo({
    top: targetTop,
    behavior: reducedMotion ? "auto" : "smooth"
  });
}

// Click on Scrubber Dots
document.addEventListener("click", (e) => {
  const cueDot = e.target.closest("[data-target-act]");
  if (cueDot) {
    const act = parseInt(cueDot.dataset.targetAct, 10);
    jumpToFilmAct(act);
  }
});

if (playBtn) {
  playBtn.addEventListener("click", () => {
    if (filmAutoPlaying) {
      stopAutoPlayFilm();
    } else {
      startAutoPlayFilm();
    }
  });
}

const filmResumeBtn = document.getElementById("filmResumeBtn");
if (filmResumeBtn) {
  filmResumeBtn.addEventListener("click", () => {
    userInteractionAllowedAfter = Date.now() + 2500;
    startAutoPlayFilm();
  });
}

// Tapping the film stage while video is playing pauses playback and shows the play button
const stickyFilmViewport = document.querySelector(".sticky-film-viewport");
if (stickyFilmViewport) {
  stickyFilmViewport.addEventListener("click", (e) => {
    if (e.target.closest("button") || e.target.closest("a") || e.target.closest("input") || e.target.closest(".scene-card")) {
      return;
    }
    if (filmAutoPlaying && Date.now() >= userInteractionAllowedAfter) {
      stopAutoPlayFilm();
    }
  });
}

window.addEventListener("resize", () => {
  updateResumeBtnPosition(true);
}, { passive: true });

updateResumeBtnPosition(true);


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

// Silent Backend View Counter (stored in backend only, not exposed anywhere in the UI)
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
    try { localStorage.setItem("gd_shower_total", String(showerTotal)); } catch { }
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
  if (e.target.closest("button, a, input, select, textarea, [role='button'], .film-cue-dot, .invitation-card")) {
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

// ==========================================================================
// INTERACTIVE MOUSE-MOVE SHOWER (CURSOR TRAIL OF PETALS & AKSHADHAI)
// ==========================================================================
(function initCursorShower() {
  if (reducedMotion) return;

  const container = document.getElementById("cursorShower") || document.body;
  const flowerGlyphs = ["🌸", "🌹", "🌼", "🏵️", "🌺", "✨", "🌾"];
  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;
  const MAX_ACTIVE_PARTICLES = 50;

  function spawnParticle(x, y) {
    if (container.children.length > MAX_ACTIVE_PARTICLES) {
      container.removeChild(container.firstElementChild);
    }

    const isAkshadhai = Math.random() < 0.22;
    const el = document.createElement("span");

    if (isAkshadhai) {
      el.className = "cursor-akshadhai-grain";
    } else {
      el.className = "cursor-shower-particle";
      const glyph = flowerGlyphs[Math.floor(Math.random() * flowerGlyphs.length)];
      el.textContent = glyph;
      const size = (0.9 + Math.random() * 0.45).toFixed(2);
      el.style.setProperty("--c-size", `${size}rem`);
    }

    const vx = ((Math.random() - 0.5) * 44).toFixed(1) + "px";
    const vy = (-(Math.random() * 22 + 8)).toFixed(1) + "px";
    const drop = (Math.random() * 85 + 110).toFixed(1) + "px";
    const sway = ((Math.random() - 0.5) * 32).toFixed(1) + "px";
    const rot1 = Math.round((Math.random() - 0.5) * 50) + "deg";
    const rot2 = Math.round((Math.random() - 0.5) * 220) + "deg";
    const dur = (1.2 + Math.random() * 0.4).toFixed(2) + "s";

    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
    el.style.setProperty("--vx", vx);
    el.style.setProperty("--vy", vy);
    el.style.setProperty("--drop", drop);
    el.style.setProperty("--sway", sway);
    el.style.setProperty("--rot1", rot1);
    el.style.setProperty("--rot2", rot2);
    el.style.setProperty("--c-dur", dur);

    container.appendChild(el);
    setTimeout(() => {
      if (el.parentNode === container) {
        container.removeChild(el);
      }
    }, 1600);
  }

  function handleMove(clientX, clientY) {
    const now = performance.now();
    const dist = Math.hypot(clientX - lastX, clientY - lastY);

    // Only shower when moving with noticeable speed or distance
    if (dist > 16 || (now - lastTime > 40 && dist > 5)) {
      // If user moved briskly, interpolate a middle particle so trail is continuous
      if (dist > 50) {
        const midX = (lastX + clientX) / 2;
        const midY = (lastY + clientY) / 2;
        spawnParticle(midX, midY);
      }
      spawnParticle(clientX, clientY);

      lastX = clientX;
      lastY = clientY;
      lastTime = now;
    }
  }

  window.addEventListener("pointermove", (e) => {
    handleMove(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
})();


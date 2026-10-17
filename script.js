

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;



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
    locHtml: "📍 <strong>Sandhya Mahal, Thoothukudi</strong>",
    icsFile: "./reception.ics",
    gcalUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent("GnanaGanesh weds Dharshini — Wedding Reception") +
      "&dates=20261213T130000Z/20261213T160000Z" +
      "&details=" + encodeURIComponent("With joy and gratitude, join GnanaGanesh & Dharshini as they celebrate their Wedding Reception evening.\n\nWebsite: https://ganesh-weds-dharshini.gnanaganesh.in\nVenue: Sandhya Mahal, Thoothukudi") +
      "&location=" + encodeURIComponent("Sandhya Mahal, VMS Nagar South, Meelavittan Road, Thoothukudi, Tamil Nadu"),
    outlookUrl: "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent" +
      "&startdt=2026-12-13T13:00:00Z" +
      "&enddt=2026-12-13T16:00:00Z" +
      "&subject=" + encodeURIComponent("GnanaGanesh weds Dharshini — Wedding Reception") +
      "&body=" + encodeURIComponent("With joy and gratitude, join GnanaGanesh & Dharshini as they celebrate their Wedding Reception evening.\n\nWebsite: https://ganesh-weds-dharshini.gnanaganesh.in\nVenue: Sandhya Mahal, Thoothukudi") +
      "&location=" + encodeURIComponent("Sandhya Mahal, VMS Nagar South, Meelavittan Road, Thoothukudi, Tamil Nadu")
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

  if (calDialog) {
    if (typeof calDialog.showModal === "function") {
      calDialog.showModal();
    } else {
      window.open(ev.gcalUrl, "_blank", "noopener");
    }
  }
}

if (calBtn) {
  calBtn.addEventListener("click", () => openCalendarModal("muhurtham"));
}

document.querySelectorAll(".venue-cal-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    openCalendarModal(btn.dataset.calEvent || "muhurtham");
  });
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

// Floating Right-Bottom Controller Dock: Scroll Up Hint & Play/Pause
const filmDock = document.getElementById("filmDock");
const dockPlayBtn = document.getElementById("dockPlayBtn");
const dockScrollText = document.getElementById("dockScrollText");

function updatePlaybackUI(isPlaying) {
  if (dockPlayBtn) {
    const icon = dockPlayBtn.querySelector(".dock-btn-icon");
    const label = dockPlayBtn.querySelector(".dock-btn-label");
    if (icon) icon.textContent = isPlaying ? "⏸" : "▶";
    if (label) label.textContent = isPlaying ? "Pause" : "Play";
    dockPlayBtn.classList.toggle("is-playing", isPlaying);
    dockPlayBtn.setAttribute("aria-label", isPlaying ? "Pause story" : "Play wedding film automatically");
  }
  if (playBtn) {
    playBtn.innerHTML = isPlaying
      ? "⏸ Pause Story"
      : '<span class="play-icon-glow">▶</span> <span>Watch Wedding Film / கதைப் பயணம்</span>';
  }
  if (filmDock) {
    filmDock.classList.toggle("is-playing", isPlaying);
  }
}

if (dockPlayBtn) {
  dockPlayBtn.addEventListener("click", () => {
    if (filmAutoPlaying) {
      stopAutoPlayFilm();
    } else {
      startAutoPlayFilm();
    }
  });
}

if (dockScrollText) {
  dockScrollText.addEventListener("click", () => {
    if (filmAutoPlaying) {
      stopAutoPlayFilm();
    }
    // Smooth scroll nudge down into the next section
    const nudge = Math.min(window.innerHeight * 0.75, 520);
    window.scrollBy({ top: nudge, behavior: reducedMotion ? "auto" : "smooth" });
  });
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

// Sealed-envelope opener: seal breaks -> flap opens -> card rises -> expands into the temple-by-the-sea scene
const opener = document.getElementById("opener");
const openBtn = document.getElementById("openBtn");
const envelope = document.getElementById("envelope");

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
    } catch (e) {}
  }
  if (v2) {
    v2.muted = true;
    try { v2.pause(); v2.currentTime = 0.001; } catch (e) {}
  }
  if (v3) {
    v3.muted = true;
    try { v3.pause(); v3.currentTime = 0.001; } catch (e) {}
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
  // When seal is broken, immediately start playing the wedding film first
  if (typeof startAutoPlayFilm === "function") {
    startAutoPlayFilm();
  }
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
    for (let i = 0; i < 24; i++) {
      const s = document.createElement("span");
      s.className = "petal";
      s.textContent = petals[i % petals.length];
      s.style.left = `${36 + Math.random() * 28}%`;
      s.style.setProperty("--dx", `${(Math.random() - 0.5) * 60}vw`);
      s.style.animationDelay = `${Math.random() * 0.3}s`;
      opener.appendChild(s);
      setTimeout(() => s.remove(), 2400);
    }
  };
  openBtn.addEventListener("click", () => {
    openBtn.disabled = true;
    userInteractionAllowedAfter = Date.now() + 3200;
    playFilmVideos();
    // Guest track loops from the tap itself (user gesture unlocks audio)
    try {
      startMusic();
      playing = true;
      if (btn) {
        btn.setAttribute("aria-pressed", "true");
        btn.classList.add("is-playing");
      }
    } catch {}
    if (reducedMotion) {
      revealSite();
      setTimeout(() => {
        try { opener.remove(); } catch (e) {}
      }, 100);
      return;
    }
    envelope.classList.add("unsealed");       // seal pops visually
    setTimeout(() => { envelope.classList.add("flap-open"); }, 380);   // flap rotates up
    setTimeout(() => { envelope.classList.add("letter-out"); }, 1050); // card slides out
    setTimeout(() => { envelope.classList.add("expand"); burst(); }, 1950); // card -> temple scene
    setTimeout(revealSite, 2650);
    setTimeout(() => {
      try { opener.remove(); } catch (e) {}
    }, 3250);
  });
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

// Initialize 3 video reels: muted, inline, primed
let dur1 = 10.0;
let dur2 = 5.77;
let dur3 = 10.0;
[video1, video2, video3].forEach((v, idx) => {
  if (!v) return;
  v.muted = true;
  v.playsInline = true;
  v.setAttribute("playsinline", "");
  v.setAttribute("webkit-playsinline", "");
  v.addEventListener("loadedmetadata", () => {
    if (idx === 0 && v.duration && !isNaN(v.duration)) dur1 = v.duration;
    if (idx === 1 && v.duration && !isNaN(v.duration)) dur2 = v.duration;
    if (idx === 2 && v.duration && !isNaN(v.duration)) dur3 = v.duration;
    try {
      v.pause();
      if (idx === 0) v.currentTime = 2.85;
    } catch (e) {}
  });
  try {
    v.load();
    v.pause();
    v.currentTime = idx === 0 ? 2.85 : 0.001;
  } catch (e) {}
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
    } catch (e) {}
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

  // Smooth crossfade across the 3 video layers
  if (progress < 0.38) {
    if (videoLayer1) videoLayer1.style.opacity = "1";
    if (videoLayer2) videoLayer2.style.opacity = "0";
    if (videoLayer3) videoLayer3.style.opacity = "0";
  } else if (progress < 0.44) {
    const t = (progress - 0.38) / 0.06;
    if (videoLayer1) videoLayer1.style.opacity = String((1 - t).toFixed(3));
    if (videoLayer2) videoLayer2.style.opacity = String(t.toFixed(3));
    if (videoLayer3) videoLayer3.style.opacity = "0";
  } else if (progress < 0.66) {
    if (videoLayer1) videoLayer1.style.opacity = "0";
    if (videoLayer2) videoLayer2.style.opacity = "1";
    if (videoLayer3) videoLayer3.style.opacity = "0";
  } else if (progress < 0.72) {
    const t = (progress - 0.66) / 0.06;
    if (videoLayer1) videoLayer1.style.opacity = "0";
    if (videoLayer2) videoLayer2.style.opacity = String((1 - t).toFixed(3));
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
      const maxReel2T = (dur2 && dur2 > 1.0) ? dur2 : 5.77;
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

// Buttery-smooth hardware-accelerated Auto-Playback:
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
    } catch {}
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
      video1.play().catch(() => {});
    }
  } else if (activeReel === 2) {
    if (videoLayer1) videoLayer1.style.opacity = "0";
    if (videoLayer2) videoLayer2.style.opacity = "1";
    if (videoLayer3) videoLayer3.style.opacity = "0";
    if (video2) {
      const maxReel2T = (dur2 && dur2 > 1.0) ? dur2 : 5.77;
      if (video2.currentTime >= maxReel2T - 0.2) {
        video2.currentTime = 0;
      }
      video2.play().catch(() => {});
    }
  } else {
    if (videoLayer1) videoLayer1.style.opacity = "0";
    if (videoLayer2) videoLayer2.style.opacity = "0";
    if (videoLayer3) videoLayer3.style.opacity = "1";
    if (video3) {
      if (video3.currentTime >= 9.5) {
        video3.currentTime = 0;
      }
      video3.play().catch(() => {});
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

      // Smooth crossfade into Reel 2 between 8.8s and 9.6s
      if (t1 >= 8.8) {
        if (video2 && video2.paused) {
          video2.currentTime = 0.02;
          video2.play().catch(() => {});
        }
        const fade = Math.min(Math.max((t1 - 8.8) / 0.8, 0), 1);
        if (videoLayer1) videoLayer1.style.opacity = String((1 - fade).toFixed(3));
        if (videoLayer2) videoLayer2.style.opacity = String(fade.toFixed(3));
        if (videoLayer3) videoLayer3.style.opacity = "0";
      } else {
        if (videoLayer1) videoLayer1.style.opacity = "1";
        if (videoLayer2) videoLayer2.style.opacity = "0";
        if (videoLayer3) videoLayer3.style.opacity = "0";
      }

      if (t1 >= 9.58) {
        activeReel = 2;
        if (video1) video1.pause();
        if (videoLayer1) videoLayer1.style.opacity = "0";
        if (videoLayer2) videoLayer2.style.opacity = "1";
        if (video2 && video2.paused) video2.play().catch(() => {});
      }
    } else if (activeReel === 2) {
      // REEL 2 PLAYBACK (Act 2: Sacred Muhurtham)
      const maxReel2T = (dur2 && dur2 > 1.0) ? dur2 : 5.77;
      const t2 = video2 ? video2.currentTime : 0;
      const progReel2 = Math.min(Math.max(t2 / maxReel2T, 0), 1);
      overallProg = 0.44 + progReel2 * 0.28;

      // Smooth crossfade into Reel 3 during last 0.8s of Reel 2
      const fadeStart2 = Math.max(maxReel2T - 0.8, 0.5);
      if (t2 >= fadeStart2) {
        if (video3 && video3.paused) {
          video3.currentTime = 0.02;
          video3.play().catch(() => {});
        }
        const fade = Math.min(Math.max((t2 - fadeStart2) / 0.8, 0), 1);
        if (videoLayer1) videoLayer1.style.opacity = "0";
        if (videoLayer2) videoLayer2.style.opacity = String((1 - fade).toFixed(3));
        if (videoLayer3) videoLayer3.style.opacity = String(fade.toFixed(3));
      } else {
        if (videoLayer1) videoLayer1.style.opacity = "0";
        if (videoLayer2) videoLayer2.style.opacity = "1";
        if (videoLayer3) videoLayer3.style.opacity = "0";
      }

      if (t2 >= maxReel2T - 0.12) {
        activeReel = 3;
        if (video2) video2.pause();
        if (videoLayer2) videoLayer2.style.opacity = "0";
        if (videoLayer3) videoLayer3.style.opacity = "1";
        if (video3 && video3.paused) video3.play().catch(() => {});
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

      // Reached the end of the film
      if (t3 >= Math.min(maxReel3T, 9.6) - 0.15 || overallProg >= 0.995) {
        stopAutoPlayFilm();
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
  if (video1) { try { video1.pause(); } catch (e) {} }
  if (video2) { try { video2.pause(); } catch (e) {} }
  if (video3) { try { video3.pause(); } catch (e) {} }
  updatePlaybackUI(false);
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

if (dockPlayBtn) {
  dockPlayBtn.addEventListener("click", () => {
    if (filmAutoPlaying) {
      stopAutoPlayFilm();
    } else {
      startAutoPlayFilm();
    }
  });
}

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


(function () {
  const current = window.__ASSET_VERSION__ || "unknown";

  fetch("/res/version.json?nc=" + Date.now())
    .then(res => res.json())
    .then(data => {
      if (!data.assetVersion) return;

      const latest = String(data.assetVersion);

      if (latest !== current) {
        console.log("%c[assets]", "color:#15f4ff", "New version detected → refreshing…");
        localStorage.setItem("assetVersion", latest);

        // Reload so the new ?v=HASH is used
        window.location.reload();
      }
    })
    .catch(err => console.warn("[assets] version check failed:", err));
})();

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initTypedRoles();
  initTiltCards();
  initParticlesBackground();
  initGsapAnimations();
  initSmoothScroll();
  initBlogPage();
  initProjectsPage();
  initProjectsFilter();
  initSpotifyPage(); // new: spotify page bootstrap
});

function initYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }
}

function initTypedRoles() {
  const target = document.getElementById("typed-roles");
  if (!target || typeof Typed === "undefined") return;

  new Typed("#typed-roles", {
    strings: [
      "gamer",
      "coder",
      "artist",
      "music enjoyer",
      "visual novel addict",
      "server tinkerer"
    ],
    typeSpeed: 75,
    backSpeed: 45,
    backDelay: 1100,
    startDelay: 250,
    loop: true,
    smartBackspace: true,
    showCursor: true,
    cursorChar: "_"
  });
}

function initTiltCards() {
  if (typeof VanillaTilt === "undefined") return;
  const tiltNodes = document.querySelectorAll(".tilt-card[data-tilt]");
  if (!tiltNodes.length) return;

  VanillaTilt.init(tiltNodes, {
    max: 16,
    speed: 400,
    glare: true,
    "max-glare": 0.18,
    perspective: 900,
    scale: 1.02,
    gyroscope: true
  });
}

function initParticlesBackground() {
  if (typeof particlesJS === "undefined") return;

  const container = document.getElementById("particles-js");
  if (!container) return;

  particlesJS("particles-js", {
    particles: {
      number: {
        value: 65,
        density: {
          enable: true,
          value_area: 900
        }
      },
      color: {
        value: "#15f4ff"
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.45,
        random: true,
        anim: {
          enable: true,
          speed: 0.6,
          opacity_min: 0.15,
          sync: false
        }
      },
      size: {
        value: 2,
        random: true
      },
      line_linked: {
        enable: true,
        distance: 140,
        color: "#15f4ff",
        opacity: 0.35,
        width: 0.7
      },
      move: {
        enable: true,
        speed: 1.1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: true,
          rotateX: 1200,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: ["grab", "repulse"]
        },
        onclick: {
          enable: false
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 170,
          line_linked: {
            opacity: 0.65
          }
        },
        repulse: {
          distance: 110,
          duration: 0.3
        }
      }
    },
    retina_detect: true
  });
}

function initGsapAnimations() {
  if (typeof gsap === "undefined") return;

  const tl = gsap.timeline({
    defaults: {
      duration: 0.9,
      ease: "power3.out"
    }
  });

  const nav = document.querySelector(".nav-island");

  const heroGreeting = document.querySelector(".hero-greeting");
  const heroTitle = document.querySelector(".hero-title");
  const heroHandles = document.querySelector(".hero-handles");
  const heroPronouns = document.querySelector(".hero-pronouns");
  const heroRoles = document.querySelector(".hero-roles");
  const heroTagline = document.querySelector(".hero-tagline");
  const heroTaglineExtra = document.querySelector(".hero-tagline-extra");
  const heroActions = document.querySelector(".hero-actions");
  const profileCard = document.querySelector(".profile-card");
  const bentoCards = document.querySelectorAll(".bento-card");

  if (nav) {
    tl.from(nav, { y: -40, opacity: 0 });
  }

  const heroEls = [
    heroGreeting,
    heroTitle,
    heroHandles,
    heroPronouns,
    heroRoles,
    heroTagline,
    heroTaglineExtra,
    heroActions
  ].filter(Boolean);

  if (heroEls.length) {
    tl.from(
      heroEls,
      {
        y: 24,
        opacity: 0,
        stagger: 0.08
      },
      "-=0.4"
    );
  }

  if (profileCard) {
    tl.from(
      profileCard,
      {
        opacity: 0,
        scale: 0.9,
        y: 30
      },
      heroEls.length ? "-=0.4" : "-=0.2"
    );
  }

  if (bentoCards.length) {
    tl.from(
      bentoCards,
      {
        y: 30,
        opacity: 0,
        stagger: 0.08
      },
      "-=0.2"
    );
  }
}

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  if (!links.length) return;

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#" || href.length < 2) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const header = document.querySelector(".nav-shell");
      const headerOffset = header ? header.offsetHeight + 16 : 16;
      const rect = target.getBoundingClientRect();
      const offset = rect.top + window.scrollY - headerOffset;

      window.scrollTo({
        top: offset,
        behavior: "smooth"
      });
    });
  });
}

/* ===========================
   BLOG PAGE + MODAL
   =========================== */

let blogModalClosingTimeout = null;

function initBlogPage() {
  const root = document.querySelector("[data-blog-root]");
  if (!root) return;
  const listEl = root.querySelector("[data-blog-list]");
  const timelineEl = root.querySelector("[data-blog-timeline]");
  const loadingEl = root.querySelector(".blog-loading");

  setupBlogModalHandlers();

  if (!listEl) return;

  if (loadingEl) {
    loadingEl.textContent = "loading posts…";
  }

  fetch("/res/blog.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch blog.json (" + res.status + ")");
      }
      return res.json();
    })
    .then((data) => {
      const posts = data && Array.isArray(data.posts) ? data.posts.slice() : [];

      if (!posts.length) {
        if (loadingEl) {
          loadingEl.textContent = "no posts yet — check back later.";
        }
        return;
      }

      posts.sort((a, b) => {
        const da = new Date(a.date);
        const db = new Date(b.date);
        return db - da;
      });

      listEl.innerHTML = "";

      const yearGroups = {};

      posts.forEach((post, index) => {
        const card = createBlogCard(post, index);
        listEl.appendChild(card);

        const dt = new Date(post.date);
        const year = !isNaN(dt.getTime())
          ? dt.getFullYear().toString()
          : "????";

        yearGroups[year] = (yearGroups[year] || 0) + 1;
      });

      if (timelineEl) {
        timelineEl.innerHTML = "";
        const years = Object.keys(yearGroups).sort((a, b) => b.localeCompare(a));
        years.forEach((year) => {
          const li = document.createElement("li");
          li.className = "blog-timeline-item";
          const count = yearGroups[year];
          li.innerHTML = `
            <span class="blog-timeline-year">${year}</span>
            <span class="blog-timeline-count">${count} post${count !== 1 ? "s" : ""}</span>
          `;
          timelineEl.appendChild(li);
        });
      }

      window.__blogPosts = posts;
    })
    .catch((err) => {
      console.error("Error loading blog.json:", err);
      if (loadingEl) {
        loadingEl.textContent = "couldn’t load posts right now.";
      }
    });
}

function createBlogCard(post, index) {
  const card = document.createElement("article");
  card.className = "blog-card";
  card.tabIndex = 0;

  const id = post.id || post.slug || `post-${index}`;
  card.id = `post-${id}`;
  card.dataset.blogId = id;

  const dateObj = new Date(post.date);
  const dateFormatted = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    : (post.date || "");

  const title = post.title || "untitled post";
  const summary =
    post.summary ||
    "no summary yet, just vibes and text in the full post.";
  const tags = Array.isArray(post.tags) ? post.tags : [];

  card.innerHTML = `
    <header class="blog-card-header">
      <h3 class="blog-card-title">${escapeHtml(title)}</h3>
      <span class="blog-card-date">${escapeHtml(dateFormatted)}</span>
    </header>
    <p class="blog-card-summary">${escapeHtml(summary)}</p>
    ${
      tags.length
        ? `<div class="blog-card-tags">
             ${tags
               .map(
                 (tag) =>
                   `<span class="blog-tag-pill">${escapeHtml(String(tag))}</span>`
               )
               .join("")}
           </div>`
        : ""
    }
  `;

  const openHandler = (e) => {
    e.preventDefault();
    openBlogModal(post);
  };

  card.addEventListener("click", openHandler);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openBlogModal(post);
    }
  });

  return card;
}

function setupBlogModalHandlers() {
  const backdrop = document.querySelector("[data-blog-modal]");
  if (!backdrop) return;

  const modal = backdrop.querySelector(".blog-modal");
  const closeBtn = backdrop.querySelector("[data-blog-modal-close]");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => closeBlogModal());
  }

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      closeBlogModal();
    }
  });

  if (modal) {
    modal.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeBlogModal();
    }
  });
}

function openBlogModal(post) {
  const backdrop = document.querySelector("[data-blog-modal]");
  if (!backdrop) return;

  const titleEl = backdrop.querySelector("[data-blog-modal-title]");
  const dateEl = backdrop.querySelector("[data-blog-modal-date]");
  const tagsEl = backdrop.querySelector("[data-blog-modal-tags]");
  const bodyEl = backdrop.querySelector("[data-blog-modal-body]");
  const imageWrapper = backdrop.querySelector("[data-blog-modal-image-wrapper]");

  const dateObj = new Date(post.date);
  const dateFormatted = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : (post.date || "");

  if (titleEl) titleEl.textContent = post.title || "untitled post";
  if (dateEl) dateEl.textContent = dateFormatted;

  if (tagsEl) {
    tagsEl.innerHTML = "";
    const tags = Array.isArray(post.tags) ? post.tags : [];
    tags.forEach((tag) => {
      const pill = document.createElement("span");
      pill.className = "blog-tag-pill";
      pill.textContent = tag;
      tagsEl.appendChild(pill);
    });
  }

  if (imageWrapper) {
    imageWrapper.innerHTML = "";
    if (post.image) {
      const img = document.createElement("img");
      img.src = post.image;
      img.alt = post.imageAlt || "";
      imageWrapper.appendChild(img);
    }
  }

  if (bodyEl) {
    bodyEl.innerHTML = "";

    const content = Array.isArray(post.content) ? post.content : [];

    if (content.length) {
      content.forEach((block) => {
        if (typeof block === "string") {
          const p = document.createElement("p");
          p.textContent = block;
          bodyEl.appendChild(p);
        } else if (block && typeof block === "object") {
          if (block.type === "image" && block.src) {
            const img = document.createElement("img");
            img.src = block.src;
            img.alt = block.alt || "";
            bodyEl.appendChild(img);
          } else if (block.type === "p" && block.text) {
            const p = document.createElement("p");
            p.textContent = block.text;
            bodyEl.appendChild(p);
          }
        }
      });
    } else {
      const p = document.createElement("p");
      p.textContent =
        post.summary ||
        "no full content yet — this post only has a summary for now.";
      bodyEl.appendChild(p);
    }
  }

  backdrop.hidden = false;
  document.body.dataset.prevOverflow = document.body.style.overflow || "";
  document.body.style.overflow = "hidden";

  requestAnimationFrame(() => {
    backdrop.classList.add("is-open");
  });
}

function closeBlogModal() {
  const backdrop = document.querySelector("[data-blog-modal]");
  if (!backdrop || backdrop.hasAttribute("hidden")) return;

  backdrop.classList.remove("is-open");
  document.body.style.overflow = document.body.dataset.prevOverflow || "";
  delete document.body.dataset.prevOverflow;

  if (blogModalClosingTimeout) {
    clearTimeout(blogModalClosingTimeout);
  }
  blogModalClosingTimeout = setTimeout(() => {
    backdrop.hidden = true;
  }, 200);
}

/* ===========================
   PROJECTS PAGE
   =========================== */

function initProjectsPage() {
  const root = document.querySelector("[data-projects-root]");
  if (!root) return;

  const grid = root.querySelector("[data-projects-grid]");
  const loadingEl = root.querySelector("[data-projects-loading]");
  if (!grid) return;

  if (loadingEl) {
    loadingEl.textContent = "loading projects…";
  }

  fetch("/res/projects.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch projects.json (" + res.status + ")");
      }
      return res.json();
    })
    .then((data) => {
      const projects = data && Array.isArray(data.projects) ? data.projects : [];

      if (!projects.length) {
        if (loadingEl) {
          loadingEl.textContent = "no projects listed yet.";
        }
        return;
      }

      grid.innerHTML = "";

      projects.forEach((project, index) => {
        const card = createProjectCard(project, index);
        grid.appendChild(card);
      });

      initTiltCards();
    })
    .catch((err) => {
      console.error("Error loading projects.json:", err);
      if (loadingEl) {
        loadingEl.textContent = "couldn’t load projects right now.";
      }
    });
}

function createProjectCard(project, index) {
  const card = document.createElement("article");
  card.className = "bento-card project-card tilt-card";
  card.setAttribute("data-tilt", "");
  card.setAttribute("data-project-card", "");

  const id = project.anchorId || project.id || `project-${index}`;
  if (id) {
    card.id = id;
  }

  const tags = Array.isArray(project.tags)
    ? project.tags.map((t) => String(t).toLowerCase().trim()).filter(Boolean)
    : [];
  if (tags.length) {
    card.dataset.projectTags = tags.join(",");
  }

  const title = project.title || "untitled project";
  const label = project.label || "";
  const description =
    project.description ||
    "no description yet, but trust that it does something mildly chaotic.";
  const tech = Array.isArray(project.tech) ? project.tech : [];

  const statusLabel = project.statusLabel || "";
  const statusKind = project.status || "";
  const statusText = statusLabel || (statusKind ? `status: ${statusKind}` : "");

  const url = project.url || "";
  const linkLabel = project.urlLabel || "open project";
  const isExternal =
    project.external === true || /^https?:\/\//.test(url || "");

  let linkHtml = "";
  if (url) {
    const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
    linkHtml = `
      <a href="${url}" class="project-link"${targetAttr}>
        ${escapeHtml(linkLabel)}
        <span class="bento-link-arrow">↗</span>
      </a>
    `;
  }

  let statusHtml = "";
  if (statusText) {
    statusHtml = `
      <span class="project-status-pill">${escapeHtml(statusText)}</span>
    `;
  }

  const techHtml = tech.length
    ? `<ul class="project-tech">
         ${tech
           .map((t) => `<li>${escapeHtml(String(t))}</li>`)
           .join("")}
       </ul>`
    : "";

  const actionsPieces = [];
  if (linkHtml) actionsPieces.push(linkHtml);
  if (statusHtml) actionsPieces.push(statusHtml);

  const actionsHtml = actionsPieces.length
    ? `<div class="project-card-actions">${actionsPieces.join("")}</div>`
    : "";

  card.innerHTML = `
    <div class="project-card-header">
      <h3>${escapeHtml(title)}</h3>
      ${
        label
          ? `<span class="project-label">${escapeHtml(label)}</span>`
          : ""
      }
    </div>
    <p class="project-card-body">${escapeHtml(description)}</p>
    ${techHtml}
    ${actionsHtml}
  `;

  return card;
}

function initProjectsFilter() {
  const root = document.querySelector("[data-projects-root]");
  if (!root) return;

  const filterButtons = root.querySelectorAll("[data-project-filter]");
  if (!filterButtons.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = (btn.dataset.projectFilter || "all").toLowerCase();

      filterButtons.forEach((b) =>
        b.classList.toggle("projects-filter--active", b === btn)
      );

      const cards = root.querySelectorAll("[data-project-card]");
      cards.forEach((card) => {
        const rawTags = card.dataset.projectTags || "";
        const tags = rawTags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);

        const match = value === "all" || tags.includes(value);
        card.style.display = match ? "" : "none";
      });
    });
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ===========================
   SPOTIFY + LRCLIB (PKCE)
   =========================== */

const SPOTIFY_CLIENT_ID = "e0b6c49d7f49401593932b51dc4cbe6b";
const SPOTIFY_SCOPES = "user-read-playback-state user-read-currently-playing";
const SPOTIFY_REDIRECT_URI = "https://sipbuu.me/spotify/"; // must match dashboard exactly
const SPOTIFY_POLL_INTERVAL_MS = 5000; // 5s instead of 1200ms
const SPOTIFY_TOKEN_KEY = "spotify_access_token";
const SPOTIFY_REFRESH_TOKEN_KEY = "spotify_refresh_token";
const SPOTIFY_TOKEN_EXPIRES_KEY = "spotify_token_expires_at";
const SPOTIFY_CODE_VERIFIER_KEY = "spotify_code_verifier";

let spotifyAccessToken = null;
let spotifyPollIntervalId = null;
let spotifyCurrentTrackId = null;
let spotifyCurrentLyrics = [];
let spotifyHasSyncedLyrics = false;

function spotifyLogStatus(message) {
  const el = document.getElementById("spotify-status");
  if (el) el.textContent = message;
}

function formatTimeMs(ms) {
  if (!ms || ms < 0) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes + ":" + String(seconds).padStart(2, "0");
}

/* --- PKCE helpers --- */

function generateRandomString(length = 64) {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (v) => possible[v % possible.length]).join("");
}

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await window.crypto.subtle.digest("SHA-256", data);
}

function base64urlencode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function createCodeChallenge(codeVerifier) {
  const hashed = await sha256(codeVerifier);
  return base64urlencode(hashed);
}

/* --- token storage / refresh helpers --- */

function getStoredSpotifyToken() {
  const token = localStorage.getItem(SPOTIFY_TOKEN_KEY);
  const expiresAt = Number(localStorage.getItem(SPOTIFY_TOKEN_EXPIRES_KEY) || 0);
  if (!token || !expiresAt) return null;
  if (Date.now() > expiresAt) {
    return null;
  }
  return token;
}

function storeSpotifyToken(accessToken, expiresIn, refreshToken) {
  const expiresAt = Date.now() + (expiresIn || 3600) * 1000;
  localStorage.setItem(SPOTIFY_TOKEN_KEY, accessToken);
  localStorage.setItem(SPOTIFY_TOKEN_EXPIRES_KEY, String(expiresAt));
  if (refreshToken) {
    localStorage.setItem(SPOTIFY_REFRESH_TOKEN_KEY, refreshToken);
  }
}

async function spotifyAttemptRefresh() {
  const refreshToken = localStorage.getItem(SPOTIFY_REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    disconnectSpotify();
    return null;
  }

  try {
    const body = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: "refresh_token",
      refresh_token: refreshToken
    });

    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });

    const data = await res.json();
    if (data.error) {
      console.error("spotify refresh error", data);
      disconnectSpotify();
      return null;
    }

    storeSpotifyToken(data.access_token, data.expires_in, data.refresh_token);
    spotifyAccessToken = data.access_token;
    spotifyLogStatus("spotify token refreshed · continuing…");
    return data.access_token;
  } catch (err) {
    console.error("spotify refresh exception", err);
    disconnectSpotify();
    return null;
  }
}

/* --- auth UI & login --- */

function updateSpotifyAuthUI(isConnected) {
  const connectBtn = document.getElementById("spotify-connect");
  const disconnectBtn = document.getElementById("spotify-disconnect");
  const playbackStateEl = document.getElementById("spotify-playback-state");

  if (connectBtn) {
    connectBtn.disabled = isConnected;
  }
  if (disconnectBtn) {
    disconnectBtn.disabled = !isConnected;
  }
  if (playbackStateEl) {
    playbackStateEl.textContent = isConnected ? "connected" : "idle";
  }

  if (!isConnected) {
    spotifyLogStatus(
      "not connected yet. click “connect spotify” to start the auth flow."
    );
  }
}

async function startSpotifyLogin() {
  if (!SPOTIFY_CLIENT_ID) {
    spotifyLogStatus(
      "spotify client id not configured yet. update SPOTIFY_CLIENT_ID in script.js."
    );
    return;
  }

  try {
    const codeVerifier = generateRandomString(64);
    localStorage.setItem(SPOTIFY_CODE_VERIFIER_KEY, codeVerifier);

    const codeChallenge = await createCodeChallenge(codeVerifier);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      scope: SPOTIFY_SCOPES,
      code_challenge_method: "S256",
      code_challenge: codeChallenge
    });

    window.location.href =
      "https://accounts.spotify.com/authorize?" + params.toString();
  } catch (err) {
    console.error("spotify login error", err);
    spotifyLogStatus("couldn’t start spotify login · try again.");
  }
}

async function exchangeSpotifyCodeForToken(code) {
  const codeVerifier = localStorage.getItem(SPOTIFY_CODE_VERIFIER_KEY);
  if (!codeVerifier) {
    spotifyLogStatus("auth flow interrupted · missing code_verifier.");
    return null;
  }

  try {
    const body = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      code_verifier: codeVerifier
    });

    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });

    const data = await res.json();
    if (data.error) {
      console.error("spotify token error", data);
      spotifyLogStatus("spotify login failed · try again.");
      return null;
    }

    storeSpotifyToken(data.access_token, data.expires_in, data.refresh_token);
    localStorage.removeItem(SPOTIFY_CODE_VERIFIER_KEY);

    return data.access_token;
  } catch (err) {
    console.error("spotify token exception", err);
    spotifyLogStatus("couldn’t finish spotify login · try again.");
    return null;
  }
}

async function handleSpotifyRedirectCode() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const error = params.get("error");

  if (error) {
    console.error("spotify auth error:", error);
    spotifyLogStatus("spotify auth error: " + error);
    return null;
  }

  if (!code) return null;

  spotifyLogStatus("finishing spotify login…");

  const token = await exchangeSpotifyCodeForToken(code);
  if (token) {
    spotifyAccessToken = token;
    // clean ?code= etc from URL
    window.history.replaceState({}, document.title, SPOTIFY_REDIRECT_URI);
    spotifyLogStatus("connected · grabbing your current track…");
  }

  return token;
}

function disconnectSpotify() {
  spotifyAccessToken = null;
  localStorage.removeItem(SPOTIFY_TOKEN_KEY);
  localStorage.removeItem(SPOTIFY_TOKEN_EXPIRES_KEY);
  localStorage.removeItem(SPOTIFY_REFRESH_TOKEN_KEY);
  spotifyCurrentTrackId = null;
  spotifyCurrentLyrics = [];
  spotifyHasSyncedLyrics = false;

  if (spotifyPollIntervalId) {
    clearInterval(spotifyPollIntervalId);
    spotifyPollIntervalId = null;
  }

  const titleEl = document.getElementById("spotify-track-title");
  const artistEl = document.getElementById("spotify-track-artist");
  const albumEl = document.getElementById("spotify-track-album");
  const coverImg = document.getElementById("spotify-track-cover");
  const coverSkeleton = document.getElementById("spotify-cover-skeleton");
  const progressFill = document.getElementById("spotify-progress-bar-fill");
  const progressLabel = document.getElementById("spotify-progress-label");
  const lyricsContainer = document.getElementById("lyrics-lines");

  if (titleEl) titleEl.textContent = "no track playing";
  if (artistEl) {
    artistEl.textContent =
      "connect spotify & start playing something on any device.";
  }
  if (albumEl) albumEl.textContent = "—";
  if (coverImg) {
    coverImg.src = "";
    coverImg.style.opacity = "0";
  }
  if (coverSkeleton) {
    coverSkeleton.style.opacity = "1";
  }
  if (progressFill) progressFill.style.width = "0%";
  if (progressLabel) progressLabel.textContent = "0:00 / 0:00";
  if (lyricsContainer) lyricsContainer.innerHTML = "";

  spotifyLogStatus(
    "disconnected from spotify. you can reconnect any time."
  );
  updateSpotifyAuthUI(false);
}

/* --- Spotify API + LRCLIB calls --- */

async function fetchSpotifyCurrentlyPlaying() {
  if (!spotifyAccessToken) return null;

  const res = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing?additional_types=track",
    {
      headers: {
        Authorization: "Bearer " + spotifyAccessToken
      }
    }
  );

  if (res.status === 204 || res.status === 202) {
    return null; // no active track
  }

  if (res.status === 401) {
    // token expired or invalid
    const refreshed = await spotifyAttemptRefresh();
    if (refreshed) {
      return await fetchSpotifyCurrentlyPlaying();
    }
    return null;
  }

  if (!res.ok) {
    console.error("spotify error", res.status, await res.text());
    spotifyLogStatus("error talking to spotify. try again in a bit.");
    return null;
  }

  const data = await res.json();
  return data;
}

async function fetchLyricsForTrack(trackName, artistName, albumName, durationMs) {
  if (!trackName || !artistName || !durationMs) return null;

  const durationSec = Math.round(durationMs / 1000);
  const params = new URLSearchParams({
    track_name: trackName,
    artist_name: artistName,
    album_name: albumName || "",
    duration: String(durationSec)
  });

  // helper to try /api/get-cached and /api/get
  async function trySignatureEndpoint(path) {
    const url = `https://lrclib.net/api/${path}?${params.toString()}`;
    const res = await fetch(url);
    if (res.status === 404) return null;
    if (!res.ok) {
      console.warn("lrclib", path, "error", res.status, await res.text());
      return null;
    }
    return res.json();
  }

  // 1) Fast path: only internal database
  let data = await trySignatureEndpoint("get-cached");
  if (data && (data.syncedLyrics || data.plainLyrics)) {
    return data;
  }

  // 2) Slow path: allow LRCLIB to hit external sources if needed
  data = await trySignatureEndpoint("get");
  if (data && (data.syncedLyrics || data.plainLyrics)) {
    return data;
  }

  // 3) Fallback: search, prefer synced lyrics + duration match
  try {
    const searchParams = new URLSearchParams({
      track_name: trackName,
      artist_name: artistName
    });
    const searchUrl = `https://lrclib.net/api/search?${searchParams.toString()}`;
    const res = await fetch(searchUrl);
    if (!res.ok) {
      console.warn("lrclib search error", await res.text());
      return null;
    }

    const results = await res.json();
    if (!Array.isArray(results) || !results.length) return null;

    const durationTolerance = 2; // seconds
    const durationMatched = results.filter(
      (r) =>
        typeof r.duration === "number" &&
        Math.abs(r.duration - durationSec) <= durationTolerance
    );

    const candidates = (durationMatched.length ? durationMatched : results).slice();

    // sort: prefer syncedLyrics, then closest duration
    candidates.sort((a, b) => {
      const aHasSync = !!a.syncedLyrics;
      const bHasSync = !!b.syncedLyrics;
      if (aHasSync !== bHasSync) return aHasSync ? -1 : 1;

      const da =
        typeof a.duration === "number"
          ? Math.abs(a.duration - durationSec)
          : 9999;
      const db =
        typeof b.duration === "number"
          ? Math.abs(b.duration - durationSec)
          : 9999;
      return da - db;
    });

    const best = candidates[0];
    if (!best) return null;

    // if the search result already has lyrics, just use it
    if (best.syncedLyrics || best.plainLyrics) {
      return best;
    }

    // otherwise, fetch full record by ID
    if (typeof best.id !== "undefined") {
      const byIdRes = await fetch(`https://lrclib.net/api/get/${best.id}`);
      if (!byIdRes.ok) return null;
      return await byIdRes.json();
    }

    return null;
  } catch (err) {
    console.error("lrclib search fallback error", err);
    return null;
  }
}


function parseSyncedLyrics(lrc) {
  if (!lrc || typeof lrc !== "string") return [];
  const lines = lrc.split(/\r?\n/);
  const parsed = [];

  for (const raw of lines) {
    const match = raw.match(/\[(\d+):(\d+)(?:\.(\d+))?](.*)/);
    if (!match) continue;
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    const fraction = match[3] ? parseInt(match[3].slice(0, 2), 10) : 0;
    const timeSec = minutes * 60 + seconds + fraction / 100;
    const text = match[4].trim();
    if (!text) continue;
    parsed.push({ time: timeSec, text });
  }

  return parsed;
}

function buildPlainLyricsLines(plain) {
  if (!plain || typeof plain !== "string") return [];
  const lines = plain.split(/\r?\n/);
  return lines
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => ({ time: null, text }));
}

/* --- Renderers & sync --- */

function renderSpotifyTrack(trackData) {
  const item = trackData && trackData.item;
  const isPlaying = trackData && trackData.is_playing;
  const progressMs = trackData ? trackData.progress_ms || 0 : 0;
  const durationMs = item ? item.duration_ms || 0 : 0;

  const titleEl = document.getElementById("spotify-track-title");
  const artistEl = document.getElementById("spotify-track-artist");
  const albumEl = document.getElementById("spotify-track-album");
  const coverImg = document.getElementById("spotify-track-cover");
  const coverSkeleton = document.getElementById("spotify-cover-skeleton");
  const linkEl = document.getElementById("spotify-track-link");
  const progressFill = document.getElementById("spotify-progress-bar-fill");
  const progressLabel = document.getElementById("spotify-progress-label");
  const stateEl = document.getElementById("spotify-playback-state");

  if (!item) {
    if (titleEl) titleEl.textContent = "no track playing";
    if (artistEl) {
      artistEl.textContent = "start a song on any of your spotify devices.";
    }
    if (albumEl) albumEl.textContent = "—";
    if (linkEl) {
      linkEl.href = "#";
      linkEl.textContent = "open in spotify ↗";
    }
    if (progressFill) progressFill.style.width = "0%";
    if (progressLabel) progressLabel.textContent = "0:00 / 0:00";
    if (stateEl) {
      stateEl.textContent = spotifyAccessToken ? "connected · idle" : "idle";
    }
    return;
  }

  const name = item.name || "unknown track";
  const artists = Array.isArray(item.artists)
    ? item.artists.map((a) => a.name).join(", ")
    : "unknown artist";
  const albumName = item.album && item.album.name ? item.album.name : "";
  const albumImages = item.album && item.album.images ? item.album.images : [];
  const spotifyUrl =
    item.external_urls && item.external_urls.spotify
      ? item.external_urls.spotify
      : "#";

  if (titleEl) titleEl.textContent = name;
  if (artistEl) artistEl.textContent = artists;
  if (albumEl) albumEl.textContent = albumName || "—";
  if (linkEl) {
    linkEl.href = spotifyUrl;
    linkEl.textContent = "open in spotify ↗";
  }

  if (coverImg && albumImages && albumImages.length) {
    const best = albumImages[0];
    coverImg.src = best.url;
    coverImg.onload = () => {
      coverImg.style.opacity = "1";
      if (coverSkeleton) coverSkeleton.style.opacity = "0";
    };
  }

  if (durationMs > 0 && progressFill) {
    const pct = Math.min(100, Math.max(0, (progressMs / durationMs) * 100));
    progressFill.style.width = pct + "%";
  }

  if (progressLabel) {
    progressLabel.textContent =
      formatTimeMs(progressMs) + " / " + formatTimeMs(durationMs);
  }

  if (stateEl) {
    stateEl.textContent = isPlaying ? "playing" : "paused";
  }
}

function renderLyricsLines(lines, hasSynced) {
  const container = document.getElementById("lyrics-lines");
  const noteEl = document.getElementById("lyrics-note");
  if (!container) return;

  container.innerHTML = "";
  if (!lines || !lines.length) {
    const p = document.createElement("p");
    p.className = "lyrics-line";
    p.textContent = "no lyrics found for this track (yet).";
    container.appendChild(p);
    if (noteEl) {
      noteEl.textContent =
        "nothing came back from LRCLIB. if the song is obscure or brand new, it might not be in the database yet.";
    }
    return;
  }

  lines.forEach((line, index) => {
    const div = document.createElement("div");
    div.className = "lyrics-line";
    div.textContent = line.text;
    div.dataset.lyricIndex = String(index);
    if (line.time != null) {
      div.dataset.time = String(line.time);
    }
    container.appendChild(div);
  });

  if (noteEl) {
    noteEl.textContent = hasSynced
      ? "synced lyrics active · the highlighted line follows the track."
      : "plain lyrics only · no timing data for this one.";
  }
}

function highlightCurrentLyric(progressSec) {
  if (!spotifyCurrentLyrics.length || !spotifyHasSyncedLyrics) return;
  const container = document.getElementById("lyrics-lines");
  const scroll = document.getElementById("lyrics-scroll");
  if (!container || !scroll) return;

  let activeIndex = -1;
  for (let i = 0; i < spotifyCurrentLyrics.length; i++) {
    const line = spotifyCurrentLyrics[i];
    if (line.time != null && line.time <= progressSec) {
      activeIndex = i;
    } else if (line.time != null && line.time > progressSec) {
      break;
    }
  }

  const prevActive = container.querySelector(".lyrics-line--active");
  if (prevActive) prevActive.classList.remove("lyrics-line--active");

  if (activeIndex >= 0) {
    const activeEl = container.querySelector(
      `[data-lyric-index="${activeIndex}"]`
    );
    if (activeEl) {
      activeEl.classList.add("lyrics-line--active");
      const rect = activeEl.getBoundingClientRect();
      const scrollRect = scroll.getBoundingClientRect();
      const offset =
        rect.top - scrollRect.top - scrollRect.height / 2 + rect.height / 2;
      scroll.scrollTo({
        top: scroll.scrollTop + offset,
        behavior: "smooth"
      });
    }
  }
}

/* --- polling loop --- */

let spotifyLastProgressMs = 0;

async function spotifyPollTick() {
  const data = await fetchSpotifyCurrentlyPlaying();
  if (!data) {
    renderSpotifyTrack(null);
    return;
  }

  renderSpotifyTrack(data);

  const item = data.item;
  if (!item) return;

  const newTrackId = item.id || item.uri || "";
  const progressMs = data.progress_ms || 0;
  const durationMs = item.duration_ms || 0;
  const progressSec = progressMs / 1000;

  if (newTrackId !== spotifyCurrentTrackId) {
    spotifyCurrentTrackId = newTrackId;
    spotifyCurrentLyrics = [];
    spotifyHasSyncedLyrics = false;
    spotifyLastProgressMs = 0;

    spotifyLogStatus("found new track · asking LRCLIB for lyrics…");
    const trackName = item.name || "";
    const artistName = Array.isArray(item.artists)
      ? item.artists.map((a) => a.name).join(", ")
      : "";
    const albumName = item.album && item.album.name ? item.album.name : "";
    
    const lyricPayload = await fetchLyricsForTrack(
      trackName,
      artistName,
      albumName,
      durationMs
    );


    if (!lyricPayload) {
      spotifyCurrentLyrics = [];
      spotifyHasSyncedLyrics = false;
      renderLyricsLines([], false);
      return;
    }

    const synced = parseSyncedLyrics(lyricPayload.syncedLyrics);
    const plain = buildPlainLyricsLines(lyricPayload.plainLyrics);

    if (synced.length) {
      spotifyCurrentLyrics = synced;
      spotifyHasSyncedLyrics = true;
      renderLyricsLines(synced, true);
      spotifyLogStatus("synced lyrics loaded from LRCLIB.");
    } else {
      spotifyCurrentLyrics = plain;
      spotifyHasSyncedLyrics = false;
      renderLyricsLines(plain, false);
      spotifyLogStatus(
        "only plain lyrics available from LRCLIB · showing unsynced text."
      );
    }
  } else {
    spotifyLastProgressMs = progressMs;
    highlightCurrentLyric(progressSec);
  }
}

function startSpotifyPolling() {
  if (spotifyPollIntervalId) clearInterval(spotifyPollIntervalId);
  spotifyPollIntervalId = setInterval(spotifyPollTick, SPOTIFY_POLL_INTERVAL_MS);
  spotifyPollTick(); // initial call
}

/* --- page bootstrap --- */

async function initSpotifyPage() {
  const root = document.querySelector("[data-spotify-root]");
  if (!root) return;

  const connectBtn = document.getElementById("spotify-connect");
  const disconnectBtn = document.getElementById("spotify-disconnect");

  if (connectBtn) {
    connectBtn.addEventListener("click", () => {
      startSpotifyLogin().catch((err) =>
        console.error("spotify login error", err)
      );
    });
  }

  if (disconnectBtn) {
    disconnectBtn.addEventListener("click", () => {
      disconnectSpotify();
    });
  }

  // try to finish login if we just came back with a code
  const tokenFromCode = await handleSpotifyRedirectCode();

  // or reuse stored token if still valid
  const storedToken = getStoredSpotifyToken();

  spotifyAccessToken = tokenFromCode || storedToken || null;

  updateSpotifyAuthUI(!!spotifyAccessToken);

  if (spotifyAccessToken) {
    spotifyLogStatus("connected · trying to grab your current playback…");
    startSpotifyPolling();
  } else {
    spotifyLogStatus(
      "not connected yet. click “connect spotify” to start the auth flow."
    );
  }

  // entrance animation for spotify cards
  if (typeof gsap !== "undefined") {
    const cards = root.querySelectorAll(".glass-panel");
    gsap.from(cards, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: "power3.out"
    });
  }
}



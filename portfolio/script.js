/* ============================================================
   PORTFOLIO — Vanilla JS interactions
   (THEMA: Sakamoto Days × manga — logika tidak berubah)
   Daftar isi:
   1. CONFIG (GANTI DATA PRIBADI DI SINI)
   2. DATA PROJECTS (project asli: portfolio, AI camera, game store)
   3. Navbar scroll + hamburger + active link
   4. Scroll progress + back-to-top + tahun
   5. Scroll reveal (IntersectionObserver) + stagger
   6. Hero parallax subtle
   7. Render project cards + filter
   8. Project modal (open/close + keyboard)
   9. Contact form validation + WhatsApp URL
   10. Hero Sakamoto animation placement
   ============================================================ */

/* ---------- 1. CONFIG: ganti dengan data pribadi ---------- */
const PORTFOLIO_CONFIG = {
  name: "Fariz",
  whatsapp: "6281234567890", // GANTI: nomor WA tanpa "+" / spasi, cth "62812xxxx"
  email: "halo@fariz.dev",    // GANTI
};

/* ---------- 2. DATA PROJECTS: project asli Fariz ---------- */
const PROJECTS = [
  {
    id: "game-store", no: "01", title: "Game Store",
    category: "web", catLabel: "Web",
    desc: "Katalog/store game modern: search, filter, sorting, wishlist, cart, dan library.",
    tech: ["HTML", "CSS", "JavaScript", "Node.js"],
    gradient: "pv--1", kanji: "店",
    img: "assets/images/project-01.jpg", // GANTI: screenshot project (opsional)
    problem: "Butuh katalog game yang serius: mudah dicari, difilter, dan bisa menyimpan wishlist serta library.",
    solution: "Katalog + game detail + wishlist/cart/library berbasis LocalStorage, didukung JSON API dari server Node.js.",
    role: "Designer + Developer",
    challenges: "Menjaga ID game (game-001 … game-024) konsisten sebagai LocalStorage key di semua fitur.",
    result: "Katalog 24 game dengan search, filter, sorting, dan checkout simulasi yang berjalan penuh.",
    github: "https://github.com/", demo: "https://example.com/",
  },
  {
    id: "hand-blur", no: "02", title: "Hand Blur / AI Camera",
    category: "app", catLabel: "App",
    desc: "Kamera browser yang mendeteksi tangan dan memberi blur hanya pada area tangan, real-time.",
    tech: ["JavaScript", "MediaPipe", "Canvas"],
    gradient: "pv--2", kanji: "手",
    img: "assets/images/project-02.jpg", // GANTI: screenshot project (opsional)
    problem: "Blur menutupi seluruh kamera atau tidak mengikuti posisi tangan.",
    solution: "Hand tracking MediaPipe + blur yang digambar ulang tiap frame hanya di bounding area tangan.",
    role: "Developer",
    challenges: "Tracking yang stabil, blur tepat di tangan, dan performa yang tetap mulus di mobile.",
    result: "Blur mengikuti tangan secara real-time dengan smooth tracking.",
    github: "https://github.com/", demo: "https://example.com/",
  },
  {
    id: "portfolio", no: "03", title: "Personal Portfolio",
    category: "web", catLabel: "Web",
    desc: "Portfolio developer bertema Sakamoto Days × manga: cepat, responsif, tanpa framework.",
    tech: ["HTML", "CSS", "JavaScript"],
    gradient: "pv--0", kanji: "個",
    img: "assets/images/project-03.jpg", // GANTI: screenshot project (opsional)
    problem: "Butuh portfolio yang personal dan memorable, bukan template generik.",
    solution: "Art direction manga: panel border tegas, halftone, speed lines, dan typography bold — tetap clean.",
    role: "Designer + Developer",
    challenges: "Menyeimbangkan estetika action manga dengan kesan profesional.",
    result: "0 dependency frontend, animasi transform/opacity yang ringan, responsif penuh.",
    github: "https://github.com/", demo: "https://example.com/",
  },
];

(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);

  /* ==========================================================
     10. SAKAMOTO ANIMATION BACKGROUND
     ========================================================== */

  (function placeAnimationBackground() {
    const scene =
      document.getElementById(
        "openingScreen"
      );

    const background =
      document.getElementById(
        "bgScene"
      );

    if (!scene || !background) return;

    scene.classList.add("site-background");
    background.after(scene);
  })();

  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Tahun otomatis ---------- */
  const year = new Date().getFullYear();

  const heroYear = $("#heroYear");
  if (heroYear) heroYear.textContent = year;

  const footerYear = $("#footerYear");
  if (footerYear) footerYear.textContent = year;

  /* ---------- 3. Navbar ---------- */
  const navbar = $("#navbar");
  const hamburger = $("#hamburger");
  const navLinks = $("#navLinks");

  const onScrollNav = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 24);
  };

  window.addEventListener("scroll", onScrollNav, {
    passive: true,
  });

  onScrollNav();

  // Hamburger open/close
  const setMenu = (open) => {
    navLinks.classList.toggle("open", open);
    hamburger.classList.toggle("open", open);

    hamburger.setAttribute(
      "aria-expanded",
      String(open)
    );

    hamburger.setAttribute(
      "aria-label",
      open
        ? "Tutup menu navigasi"
        : "Buka menu navigasi"
    );
  };

  hamburger.addEventListener("click", () => {
    setMenu(!navLinks.classList.contains("open"));
  });

  // Tutup menu saat link diklik
  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      setMenu(false);
    }
  });

  // Tutup dengan Escape
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      navLinks.classList.contains("open")
    ) {
      setMenu(false);
      hamburger.focus();
    }
  });

  // Active navigation via IntersectionObserver
  const sections = [
    "home",
    "about",
    "skills",
    "projects",
    "experience",
    "contact",
  ]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const navMap = {};

  $$(".nav-link").forEach((a) => {
    navMap[a.dataset.nav] = a;
  });

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          $$(".nav-link").forEach((a) => {
            a.classList.remove("active");
          });

          const link = navMap[en.target.id];

          if (link) {
            link.classList.add("active");
          }
        }
      });
    },
    {
      rootMargin: "-40% 0px -55% 0px",
    }
  );

  sections.forEach((s) => {
    navObserver.observe(s);
  });

  /* ---------- 4. Scroll progress + back-to-top ---------- */
  const progress = $("#scrollProgress");
  const backToTop = $("#backToTop");

  const onScrollMeta = () => {
    const h = document.documentElement;

    const max =
      h.scrollHeight -
      h.clientHeight;

    const pct =
      max > 0
        ? (h.scrollTop / max) * 100
        : 0;

    progress.style.width = pct + "%";

    const show = h.scrollTop > 600;

    backToTop.hidden = !show;
  };

  window.addEventListener(
    "scroll",
    onScrollMeta,
    {
      passive: true,
    }
  );

  onScrollMeta();

  backToTop.addEventListener(
    "click",
    () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  );

  /* ---------- 5. Scroll reveal ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("visible");

          revealObserver.unobserve(
            en.target
          );
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  $$(".reveal").forEach((el) => {
    revealObserver.observe(el);
  });

  /* ---------- 6. Hero parallax subtle ---------- */
  const heroVisual = $("#heroVisual");
  const heroSection = $("#home");

  if (
    heroVisual &&
    heroSection &&
    !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    heroSection.addEventListener(
      "mousemove",
      (e) => {
        const r =
          heroSection.getBoundingClientRect();

        const x =
          (e.clientX - r.left) /
            r.width -
          0.5;

        const y =
          (e.clientY - r.top) /
            r.height -
          0.5;

        heroVisual.style.transform =
          `translate(${x * 12}px, ${y * 12}px)`;
      }
    );

    heroSection.addEventListener(
      "mouseleave",
      () => {
        heroVisual.style.transform = "";
      }
    );
  }

  /* ==========================================================
     6b. ANIMATED BACKGROUND
     
     Background sekarang:
     - bergerak otomatis terus-menerus
     - tetap memiliki scroll parallax
     - tetap memiliki mouse parallax di desktop
     - lebih lambat di mobile
     - berhenti jika prefers-reduced-motion aktif
     ========================================================== */

  (function bgScene() {
    const scene = $("#bgScene");

    if (!scene) return;

    const reduceMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    const coarse =
      window.matchMedia(
        "(pointer: coarse)"
      ).matches;

    const isMobile =
      coarse ||
      window.innerWidth < 720;

    /* ---------- Tema background berdasarkan section ---------- */

    const themeMap = {
      home: "home",
      about: "about",
      skills: "skills",
      projects: "projects",
      experience: "journey",
      contact: "contact",
    };

    const sceneObs =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              document.body.dataset.scene =
                themeMap[en.target.id] ||
                "home";
            }
          });
        },
        {
          rootMargin:
            "-45% 0px -45% 0px",
        }
      );

    sections.forEach((s) => {
      sceneObs.observe(s);
    });

    /*
      Jika user mengaktifkan reduced motion,
      tema background tetap bekerja tetapi
      gerakan background dimatikan.
    */
    if (reduceMotion) return;

    /* ---------- Ambil semua layer background ---------- */

    const layers = $$(
      "[data-depth]",
      scene
    ).map((el, index) => ({
      el,
      depth:
        parseFloat(
          el.dataset.depth
        ) || 0,
      index,
    }));

    if (!layers.length) return;

    /*
      Mobile dibuat lebih lambat.

      Desktop:
      speedScale = 1

      Mobile:
      speedScale = 0.5
    */
    const speedScale =
      isMobile ? 0.5 : 1;

    /*
      Mouse parallax dimatikan
      pada touchscreen.
    */
    const mouseScale =
      coarse ? 0 : 1;

    /* ---------- State animasi ---------- */

    let mouseX = 0;
    let mouseY = 0;

    let targetMouseX = 0;
    let targetMouseY = 0;

    let time = 0;

    let lastTime =
      performance.now();

    /* ---------- Mouse parallax desktop ---------- */

    if (!coarse) {
      window.addEventListener(
        "mousemove",
        (e) => {
          targetMouseX =
            e.clientX /
              window.innerWidth -
            0.5;

          targetMouseY =
            e.clientY /
              window.innerHeight -
            0.5;
        },
        {
          passive: true,
        }
      );
    }

    /* ==========================================================
       CONTINUOUS ANIMATION

       Ini bagian utama yang sebelumnya belum ada.

       Background TIDAK menunggu scroll.

       Walaupun halaman diam:
       pattern
       halftone
       speed lines
       decoration

       tetap bergerak sangat pelan.
       ========================================================== */

    function animateBackground(now) {
      /*
        Batasi delta agar ketika tab kembali aktif,
        background tidak langsung loncat jauh.
      */
      const delta =
        Math.min(
          now - lastTime,
          32
        );

      lastTime = now;

      /*
        Time berjalan terus.

        0.0008 dibuat kecil supaya
        gerakannya terasa cinematic,
        bukan seperti animasi berlebihan.
      */
      time +=
        delta *
        0.0008 *
        speedScale;

      const scrollY =
        window.scrollY || 0;

      /* ---------- Smooth mouse ---------- */

      mouseX +=
        (targetMouseX - mouseX) *
        0.05;

      mouseY +=
        (targetMouseY - mouseY) *
        0.05;

      /* ---------- Animasi setiap layer ---------- */

      layers.forEach(
        ({
          el,
          depth,
          index,
        }) => {

          /*
            Gerakan otomatis horizontal.

            Setiap layer memiliki
            kecepatan berbeda.
          */
          const autoX =
            Math.sin(
              time *
                (0.65 +
                  index * 0.11)
            ) *
            (7 + index * 3);

          /*
            Gerakan otomatis vertikal.
          */
          const autoY =
            Math.cos(
              time *
                (0.50 +
                  index * 0.09)
            ) *
            (5 +
              index * 2.5);

          /*
            Parallax ketika user scroll.
          */
          const scrollOffset =
            -scrollY *
            depth *
            speedScale;

          /*
            Parallax ketika mouse
            bergerak di desktop.
          */
          const mouseOffsetX =
            -mouseX *
            depth *
            48 *
            mouseScale;

          const mouseOffsetY =
            -mouseY *
            depth *
            30 *
            mouseScale;

          /*
            Gabungkan semua gerakan:
            
            auto movement
            +
            mouse movement
            +
            scroll movement
          */
          const finalX =
            autoX +
            mouseOffsetX;

          const finalY =
            autoY +
            scrollOffset +
            mouseOffsetY;

          /*
            translate3d dipakai agar
            transform dapat ditangani
            GPU dengan lebih ringan.
          */
          el.style.transform =
            `translate3d(` +
            `${finalX.toFixed(2)}px,` +
            `${finalY.toFixed(2)}px,` +
            `0)`;
        }
      );

      /*
        Jalankan frame berikutnya.
        Karena requestAnimationFrame
        selalu dipanggil, background
        sekarang benar-benar bergerak
        terus walaupun user diam.
      */
      requestAnimationFrame(
        animateBackground
      );
    }

    /* ---------- Start animation ---------- */

    requestAnimationFrame(
      animateBackground
    );
  })();

  /* ---------- 7. Render project cards + filter ---------- */
  const grid = $("#projectGrid");

  function cardHTML(p) {
    const badges = p.tech
      .map(
        (t) =>
          `<span>${t}</span>`
      )
      .join("");

    return `
      <article
        class="project-card reveal visible"
        data-category="${p.category}"
        data-id="${p.id}"
        tabindex="0"
        role="button"
        aria-label="Lihat detail ${p.title}"
      >
        <div class="project-visual ${p.gradient}">
          <span
            class="pv-dots"
            aria-hidden="true"
          >
            <i></i>
            <i></i>
            <i></i>
          </span>

          <span
            class="pv-kanji"
            lang="ja"
            aria-hidden="true"
          >
            ${p.kanji}
          </span>

          <img
            class="pv-img"
            src="${p.img}"
            alt=""
            loading="lazy"
            onerror="this.remove()"
          />

          <span
            class="pv-num"
            aria-hidden="true"
          >
            ${p.no}
          </span>

          <span class="pv-cat">
            ${p.catLabel}
          </span>
        </div>

        <div class="project-body">
          <h3>${p.title}</h3>

          <p>
            ${p.desc}
          </p>

          <div class="tech-badges">
            ${badges}
          </div>

          <div class="project-actions">
            <a
              href="${p.github}"
              class="btn-mini"
              target="_blank"
              rel="noopener"
              data-stop
            >
              GitHub
            </a>

            <a
              href="${p.demo}"
              class="btn-mini btn-mini--primary"
              target="_blank"
              rel="noopener"
              data-stop
            >
              Live Demo
            </a>
          </div>
        </div>
      </article>
    `;
  }

  function renderProjects() {
    grid.innerHTML =
      PROJECTS
        .map(cardHTML)
        .join("");
  }

  renderProjects();

  /* ---------- Filter: ALL / WEB / APP ---------- */

  const filterBtns =
    $$(".filter-btn");

  filterBtns.forEach(
    (btn) => {
      btn.addEventListener(
        "click",
        () => {

          filterBtns.forEach(
            (b) => {
              b.classList.remove(
                "active"
              );

              b.setAttribute(
                "aria-pressed",
                "false"
              );
            }
          );

          btn.classList.add(
            "active"
          );

          btn.setAttribute(
            "aria-pressed",
            "true"
          );

          const f =
            btn.dataset.filter;

          $$(".project-card", grid)
            .forEach(
              (card) => {

                const show =
                  f === "all" ||
                  card.dataset.category === f;

                card.classList.add(
                  "filtering-out"
                );

                /*
                  Animasi kecil lalu
                  tampil/sembunyi.
                */
                setTimeout(() => {

                  card.classList.toggle(
                    "hide",
                    !show
                  );

                  requestAnimationFrame(
                    () => {
                      card.classList.remove(
                        "filtering-out"
                      );
                    }
                  );

                }, 160);
              }
            );
        }
      );
    }
  );

  /* ---------- 8. Project modal ---------- */

  const overlay =
    $("#modalOverlay");

  const modalBox =
    $("#modalBox");

  let lastFocus = null;

  function openModal(p) {
    const visual =
      $("#modalVisual");

    visual.className =
      "modal-visual " +
      p.gradient;

    visual.innerHTML =
      `<span class="modal-kanji" lang="ja">${p.kanji}</span>` +
      `<img class="pv-img" src="${p.img}" alt="" onerror="this.remove()" />`;

    $("#modalCat").textContent =
      p.catLabel +
      " — No." +
      p.no;

    $("#modalTitle").textContent =
      p.title;

    $("#modalDesc").textContent =
      p.desc;

    $("#modalProblem").textContent =
      p.problem;

    $("#modalSolution").textContent =
      p.solution;

    $("#modalRole").textContent =
      p.role;

    $("#modalChallenges").textContent =
      p.challenges;

    $("#modalResult").textContent =
      "Hasil: " +
      p.result;

    $("#modalTech").innerHTML =
      p.tech
        .map(
          (t) =>
            `<span>${t}</span>`
        )
        .join("");

    $("#modalGithub").href =
      p.github;

    $("#modalDemo").href =
      p.demo;

    lastFocus =
      document.activeElement;

    overlay.hidden = false;

    overlay.classList.remove(
      "closing"
    );

    document.body.style.overflow =
      "hidden";

    $("#modalClose").focus();
  }

  function closeModal() {
    overlay.classList.add(
      "closing"
    );

    setTimeout(() => {

      overlay.hidden = true;

      overlay.classList.remove(
        "closing"
      );

      document.body.style.overflow =
        "";

      if (lastFocus) {
        lastFocus.focus();
      }

    }, 260);
  }

  // Klik card → buka modal
  grid.addEventListener(
    "click",
    (e) => {

      if (
        e.target.closest(
          "[data-stop]"
        )
      ) {
        return;
      }

      const card =
        e.target.closest(
          ".project-card"
        );

      if (!card) return;

      const p =
        PROJECTS.find(
          (x) =>
            x.id ===
            card.dataset.id
        );

      if (p) {
        openModal(p);
      }
    }
  );

  // Keyboard: Enter/Space pada card
  grid.addEventListener(
    "keydown",
    (e) => {

      if (
        (
          e.key === "Enter" ||
          e.key === " "
        ) &&
        e.target.classList.contains(
          "project-card"
        )
      ) {
        e.preventDefault();

        const p =
          PROJECTS.find(
            (x) =>
              x.id ===
              e.target.dataset.id
          );

        if (p) {
          openModal(p);
        }
      }
    }
  );

  $("#modalClose").addEventListener(
    "click",
    closeModal
  );

  overlay.addEventListener(
    "click",
    (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    }
  );

  document.addEventListener(
    "keydown",
    (e) => {
      if (
        e.key === "Escape" &&
        !overlay.hidden
      ) {
        closeModal();
      }
    }
  );

  /* ---------- 9. Contact form → WhatsApp ---------- */

  const form =
    $("#contactForm");

  const success =
    $("#formSuccess");

  const emailRe =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(
    input,
    msg
  ) {
    const field =
      input.closest(
        ".form-field"
      );

    const err =
      field.querySelector(
        ".form-error"
      );

    err.textContent =
      msg || "";

    field.classList.toggle(
      "invalid",
      Boolean(msg)
    );

    input.setAttribute(
      "aria-invalid",
      msg
        ? "true"
        : "false"
    );
  }

  [
    "fName",
    "fEmail",
    "fSubject",
    "fMessage",
  ].forEach(
    (id) => {

      const input =
        document.getElementById(
          id
        );

      input.addEventListener(
        "input",
        () => {
          setError(
            input,
            ""
          );
        }
      );
    }
  );

  form.addEventListener(
    "submit",
    (e) => {

      e.preventDefault();

      const name =
        $("#fName");

      const email =
        $("#fEmail");

      const subject =
        $("#fSubject");

      const message =
        $("#fMessage");

      let valid = true;

      if (
        name.value.trim()
          .length < 2
      ) {
        setError(
          name,
          "Nama minimal 2 karakter."
        );

        valid = false;
      }

      if (
        !emailRe.test(
          email.value.trim()
        )
      ) {
        setError(
          email,
          "Masukkan email yang valid."
        );

        valid = false;
      }

      if (
        subject.value.trim()
          .length < 3
      ) {
        setError(
          subject,
          "Subject minimal 3 karakter."
        );

        valid = false;
      }

      if (
        message.value.trim()
          .length < 10
      ) {
        setError(
          message,
          "Pesan minimal 10 karakter."
        );

        valid = false;
      }

      if (!valid) return;

      // Susun pesan WhatsApp otomatis
      const text =
        `Halo ${PORTFOLIO_CONFIG.name}! Saya ${name.value.trim()}.\n\n` +
        `Subject: ${subject.value.trim()}\n` +
        `Email: ${email.value.trim()}\n\n` +
        `${message.value.trim()}`;

      const url =
        `https://wa.me/${PORTFOLIO_CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

      success.hidden = false;

      success.textContent =
        "Message ready to send! Membuka WhatsApp…";

      window.open(
        url,
        "_blank",
        "noopener"
      );

      setTimeout(
        () => {
          success.hidden = true;
        },
        6000
      );
    }
  );

})();

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------
     Theme toggle
  ----------------------------------------------------------- */
  function initTheme() {
    const root = document.documentElement;
    const toggle = document.getElementById("theme-toggle");
    const stored = localStorage.getItem("theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const initial = stored || (prefersLight ? "light" : "dark");
    root.setAttribute("data-theme", initial);

    if (toggle) {
      toggle.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
      });
    }
  }

  initTheme();

  /* -----------------------------------------------------------
     Enter gate — blur the site until the visitor clicks Enter
  ----------------------------------------------------------- */
  function initEnterGate() {
    const overlay = document.getElementById("enter-overlay");
    const btn = document.getElementById("enter-btn");
    if (!overlay || !btn) return;

    const alreadyEntered = sessionStorage.getItem("entered") === "true";

    if (alreadyEntered) {
      overlay.classList.add("is-hidden");
      overlay.remove();
      return;
    }

    document.body.classList.add("is-locked");

    btn.addEventListener("click", () => {
      sessionStorage.setItem("entered", "true");
      document.body.classList.remove("is-locked");
      overlay.classList.add("is-hidden");
      setTimeout(() => overlay.remove(), reduceMotion ? 0 : 550);
    });
  }

  initEnterGate();

  /* -----------------------------------------------------------
     Three.js globe — grid-shaded sphere, no texture
  ----------------------------------------------------------- */
  function initGlobe() {
    const canvas = document.getElementById("globe-canvas");
    const stage = document.getElementById("globe-stage");
    const labelsContainer = document.getElementById("orbit-labels");
    if (!canvas || !stage || !window.THREE) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Solid inner sphere for shading/depth
    const sphereGeo = new THREE.SphereGeometry(2, 48, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x0e1016,
      roughness: 0.95,
      metalness: 0.05,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphere);

    // Wireframe grid over the sphere — ties the globe to the page's grid motif
   

    // --- Orbit labels: real 3D points on a sphere around the globe ---
    const labelEls = labelsContainer ? Array.from(labelsContainer.querySelectorAll(".orbit-label")) : [];
    const orbitRadius = 3.0;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const basePositions = labelEls.map((_, i) => {
      const n = labelEls.length;
      const y = n > 1 ? 1 - (i / (n - 1)) * 2 : 0;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;
      return new THREE.Vector3(
        Math.cos(theta) * radiusAtY * orbitRadius,
        y * orbitRadius * 0.8,
        Math.sin(theta) * radiusAtY * orbitRadius
      );
    });

    const yAxis = new THREE.Vector3(0, 1, 0);
    const tmpVec = new THREE.Vector3();

    function updateLabels() {
      const rect = stage.getBoundingClientRect();
      basePositions.forEach((base, i) => {
        const el = labelEls[i];
        if (!el) return;
        tmpVec.copy(base).applyAxisAngle(yAxis, globeGroup.rotation.y);
        const projected = tmpVec.clone().project(camera);
        const leftPct = (projected.x + 1) / 2 * 100;
        const topPct = (1 - projected.y) / 2 * 100;
        const depth = (tmpVec.z + orbitRadius) / (orbitRadius * 2); // 0 (back) .. 1 (front)
        const opacity = 0.35 + depth * 0.65;
        el.style.left = leftPct + "%";
        el.style.top = topPct + "%";
        el.style.opacity = opacity.toFixed(2);
        el.style.zIndex = String(Math.round(depth * 100));
      });
    }

    let last = performance.now();
    function tick(now) {
      const dt = (now - last) / 1000;
      last = now;
      if (!reduceMotion) {
        globeGroup.rotation.y += dt * 0.15;
      }
      updateLabels();
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  initGlobe();

  /* -----------------------------------------------------------
     Work filtering — driven by filter chips (and gallery ?filter=)
  ----------------------------------------------------------- */
  function initFilters() {
    const cards = Array.from(document.querySelectorAll(".project-card"));
    const chips = Array.from(document.querySelectorAll(".filter-chip"));
    if (!cards.length || !chips.length) return;

    function applyFilter(filter) {
      cards.forEach((card) => {
        const cats = (card.dataset.category || "").split(" ");
        const show = filter === "all" || cats.includes(filter);
        card.classList.toggle("is-hidden", !show);
      });
      chips.forEach((chip) => {
        chip.classList.toggle("is-active", chip.dataset.filter === filter);
      });
    }

    chips.forEach((chip) => {
      chip.addEventListener("click", () => applyFilter(chip.dataset.filter));
    });

    const params = new URLSearchParams(window.location.search);
    const initialFilter = params.get("filter");
    if (initialFilter) applyFilter(initialFilter);
  }

  initFilters();
})();

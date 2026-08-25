(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------
     Orbit labels — position around an ellipse tracing the globe
  ----------------------------------------------------------- */
  function layoutOrbitLabels() {
    const container = document.getElementById("orbit-labels");
    if (!container) return;
    const labels = Array.from(container.querySelectorAll(".orbit-label"));
    const count = labels.length;
    const rx = 50; // % of stage width
    const ry = 46; // % of stage height
    const startAngle = -90; // start at top, degrees

    labels.forEach((label, i) => {
      const angle = ((startAngle + (i * 360) / count) * Math.PI) / 180;
      const left = 50 + rx * Math.cos(angle);
      const top = 50 + ry * Math.sin(angle);
      label.style.left = left + "%";
      label.style.top = top + "%";
    });
  }

  layoutOrbitLabels();
  window.addEventListener("resize", layoutOrbitLabels);

  /* -----------------------------------------------------------
     Procedural planet texture (canvas, equirectangular)
  ----------------------------------------------------------- */
  function makePlanetTexture() {
    const w = 512;
    const h = 256;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#0a0d13";
    ctx.fillRect(0, 0, w, h);

    const blobs = [
      { x: 0.22, y: 0.32, r: 70 },
      { x: 0.30, y: 0.55, r: 55 },
      { x: 0.55, y: 0.28, r: 60 },
      { x: 0.66, y: 0.52, r: 50 },
      { x: 0.80, y: 0.35, r: 65 },
      { x: 0.12, y: 0.62, r: 40 },
      { x: 0.46, y: 0.68, r: 45 },
      { x: 0.90, y: 0.60, r: 42 },
    ];

    blobs.forEach((b) => {
      const cx = b.x * w;
      const cy = b.y * h;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, b.r);
      grad.addColorStop(0, "rgba(150, 156, 168, 0.55)");
      grad.addColorStop(0.5, "rgba(90, 96, 110, 0.30)");
      grad.addColorStop(1, "rgba(90, 96, 110, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, b.r, b.r * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    return canvas;
  }

  /* -----------------------------------------------------------
     Three.js globe
  ----------------------------------------------------------- */
  function initGlobe() {
    const canvas = document.getElementById("globe-canvas");
    const stage = document.getElementById("globe-stage");
    if (!canvas || !window.THREE) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const texCanvas = makePlanetTexture();
    const texture = new THREE.CanvasTexture(texCanvas);
    texture.wrapS = THREE.RepeatWrapping;

    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: 0x14161b,
      map: texture,
      bumpMap: texture,
      bumpScale: 0.04,
      roughness: 0.9,
      metalness: 0.05,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const ambient = new THREE.AmbientLight(0x22242c, 0.55);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(-3.2, 3.6, 4.5);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x8fa3ff, 0.35);
    rim.position.set(3, -2, -3);
    scene.add(rim);

    function resize() {
      const rect = stage.getBoundingClientRect();
      const size = Math.max(rect.width, 1);
      renderer.setSize(size, size, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    }

    resize();
    window.addEventListener("resize", resize);

    let last = performance.now();
    function tick(now) {
      const dt = (now - last) / 1000;
      last = now;
      if (!reduceMotion) {
        sphere.rotation.y += dt * 0.12;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  initGlobe();

  /* -----------------------------------------------------------
     Work filtering — driven by orbit labels + filter chips
  ----------------------------------------------------------- */
  function initFilters() {
    const cards = Array.from(document.querySelectorAll(".project-card"));
    const chips = Array.from(document.querySelectorAll(".filter-chip"));

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

    document.querySelectorAll(".orbit-label[data-filter]").forEach((label) => {
      label.addEventListener("click", () => applyFilter(label.dataset.filter));
    });
  }

  initFilters();

  /* -----------------------------------------------------------
     Center badge — scroll to top
  ----------------------------------------------------------- */
  const badge = document.getElementById("globe-badge");
  if (badge) {
    badge.addEventListener("click", () => {
      document.getElementById("top").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  }
})();

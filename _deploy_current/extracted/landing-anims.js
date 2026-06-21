// EduPath BD — Landing animations + Three.js particle constellation
// Loaded once at page load. Defensive — bails out cleanly if libs missing.

(function () {
  // ── 1. Generic scroll reveals + counters ──
  function initScroll() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // Fade-up everything tagged
    gsap.utils.toArray("[data-pf-reveal]").forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true } }
      );
    });

    // Stagger groups
    gsap.utils.toArray("[data-pf-stagger]").forEach(parent => {
      const kids = parent.querySelectorAll("[data-pf-stagger-item]");
      gsap.fromTo(kids,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", stagger: 0.05,
          scrollTrigger: { trigger: parent, start: "top 85%", once: true } }
      );
    });

    // Counter animations
    gsap.utils.toArray("[data-pf-counter]").forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;
      const obj = { n: 0 };
      gsap.to(obj, {
        n: target, duration: 1.6, ease: "power2.out",
        onUpdate: () => { el.textContent = Math.round(obj.n); },
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });

    // 31-dot grid fill (used anywhere still)
    const dotGrid = document.querySelector("[data-pf-dotgrid]");
    if (dotGrid) {
      const dots = dotGrid.querySelectorAll(".pf-dot");
      gsap.from(dots, {
        scale: 0, opacity: 0,
        duration: 0.5, ease: "back.out(1.6)", stagger: 0.025,
        scrollTrigger: { trigger: dotGrid, start: "top 75%", once: true },
      });
    }
  }

  // ── 2. SplitText mask reveal on the editorial hero headline ──
  function initSplitTextHero() {
    if (!window.gsap) return;
    const lines = document.querySelectorAll("[data-pf-split-line]");
    if (!lines.length) return;
    gsap.set(lines, { yPercent: 100 });
    gsap.to(lines, {
      yPercent: 0,
      duration: 1.1,
      ease: "expo.out",
      stagger: 0.12,
      delay: 0.15,
    });
  }

  // ── 3. Pinned "brutal reality" — stats appear sequentially, bg fades to green ──
  function initPinnedReality() {
    if (!window.gsap || !window.ScrollTrigger) return;
    const section = document.querySelector("[data-pf-reality]");
    if (!section) return;
    const pin = section.querySelector(".pf-reality__pin");
    const bg = section.querySelector("[data-pf-reality-bg]");
    const stats = section.querySelectorAll("[data-pf-reality-stat]");
    const rule = section.querySelector("[data-pf-reality-rule]");
    if (!pin || !stats.length) return;

    // Set initial state — only the eyebrow visible
    gsap.set(stats, { opacity: 0, y: 60 });
    gsap.set(rule, { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
      },
    });

    // 0 — 0.15: background fades cream → green
    tl.to(bg, { backgroundColor: "#004D38", duration: 0.15, ease: "power1.inOut" }, 0);
    tl.call(() => pin.setAttribute("data-bg", "green"), null, 0.15);

    // 0.15 — 0.35: first stat
    tl.to(stats[0], { opacity: 1, y: 0, duration: 0.2 }, 0.15);

    // 0.35 — 0.55: stat 1 fades, stat 2 appears
    tl.to(stats[0], { opacity: 0, y: -40, duration: 0.15 }, 0.35);
    tl.to(stats[1], { opacity: 1, y: 0, duration: 0.2 }, 0.40);

    // 0.55 — 0.75: stat 2 fades, stat 3 appears
    tl.to(stats[1], { opacity: 0, y: -40, duration: 0.15 }, 0.60);
    tl.to(stats[2], { opacity: 1, y: 0, duration: 0.2 }, 0.65);

    // 0.85 — 1.0: stat 3 fades, the rule appears
    tl.to(stats[2], { opacity: 0, y: -40, duration: 0.15 }, 0.82);
    tl.to(rule,     { opacity: 1, y: 0,   duration: 0.18 }, 0.86);

    // Listen for the data-bg attribute to flip back if user scrolls past
    ScrollTrigger.create({
      trigger: section,
      start: "bottom 80%",
      onEnterBack: () => pin.setAttribute("data-bg", "green"),
      onLeave:     () => pin.setAttribute("data-bg", "green"),
    });
    ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      onLeaveBack: () => pin.removeAttribute("data-bg"),
    });
  }

  // ── 4. Horizontal scroll for featured subjects ──
  function initHorizontalScroll() {
    if (!window.gsap || !window.ScrollTrigger) return;
    const section = document.querySelector("[data-pf-hscroll]");
    if (!section) return;
    const track = section.querySelector("[data-pf-hscroll-track]");
    if (!track) return;
    if (window.innerWidth < 980) return; // mobile uses native overflow-x scroll

    const distance = () => track.scrollWidth - window.innerWidth + 48;
    gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => "+=" + distance(),
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    // Hide the scroll hint after the user has scrolled into it
    const hint = section.querySelector("[data-pf-hscroll-hint]");
    if (hint) {
      gsap.to(hint, {
        opacity: 0, duration: 0.5,
        scrollTrigger: { trigger: section, start: "top 20%", once: true },
      });
    }
  }

  // ── 5. Masonry voices — parallax offset per cell ──
  function initParallaxMasonry() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.utils.toArray("[data-pf-parallax]").forEach(el => {
      const offset = parseFloat(el.dataset.pfParallax) || 0;
      if (!offset) return;
      gsap.fromTo(el,
        { y: offset },
        { y: -offset,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 },
        }
      );
    });
  }

  // ── 6. Three.js particle constellation — 150 nodes, mouse parallax ──
  function initStarfield() {
    if (!window.THREE) return;
    const host = document.querySelector("[data-pf-starfield]");
    if (!host) return;

    const w = host.clientWidth, h = host.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    // 150 nodes — mix of green (most) and gold (accent, ~12%)
    const N = 150;
    const positions = new Float32Array(N * 3);
    const colors    = new Float32Array(N * 3);
    const sizes     = new Float32Array(N);

    const green = new THREE.Color(0x006A4E);
    const gold  = new THREE.Color(0xF4A823);

    for (let i = 0; i < N; i++) {
      positions[i*3 + 0] = (Math.random() - 0.5) * 28;
      positions[i*3 + 1] = (Math.random() - 0.5) * 18;
      positions[i*3 + 2] = -Math.random() * 10 - 2;
      const isGold = (i % 9 === 0);
      const c = isGold ? gold : green;
      colors[i*3]   = c.r;
      colors[i*3+1] = c.g;
      colors[i*3+2] = c.b;
      sizes[i] = isGold ? 0.22 : 0.09;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color",    new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size",     new THREE.BufferAttribute(sizes, 1));

    // Soft circular sprite
    const tex = (function () {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const g = c.getContext("2d");
      const grad = g.createRadialGradient(32, 32, 0, 32, 32, 28);
      grad.addColorStop(0,   "rgba(255,255,255,1)");
      grad.addColorStop(0.5, "rgba(255,255,255,0.5)");
      grad.addColorStop(1,   "rgba(255,255,255,0)");
      g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
      const t = new THREE.CanvasTexture(c); t.needsUpdate = true; return t;
    })();

    const pointsMat = new THREE.ShaderMaterial({
      uniforms: { uTex: { value: tex }, uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(0, 0) } },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float uTime;
        uniform vec2 uMouse;
        void main() {
          vColor = color;
          vec3 p = position;
          // slow organic drift
          p.x += sin(uTime * 0.22 + position.y * 0.5) * 0.14;
          p.y += cos(uTime * 0.18 + position.x * 0.4) * 0.12;
          // subtle mouse repulsion (keep it very gentle)
          vec2 mouseWorld = uMouse * vec2(14.0, 9.0);
          float dist = length(p.xy - mouseWorld);
          if (dist < 3.0) {
            vec2 dir = normalize(p.xy - mouseWorld);
            p.xy += dir * (3.0 - dist) * 0.08;
          }
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = size * 280.0 / -mv.z;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTex;
        varying vec3 vColor;
        void main() {
          vec4 t = texture2D(uTex, gl_PointCoord);
          if (t.a < 0.015) discard;
          gl_FragColor = vec4(vColor, t.a * 0.85);
        }
      `,
      transparent: true, depthWrite: false, vertexColors: true,
    });
    const points = new THREE.Points(geometry, pointsMat);
    scene.add(points);

    // Connecting lines — only nearby pairs, recalculate once
    const pairs = [];
    const LINK_DIST = 5.5;
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = positions[i*3]   - positions[j*3];
        const dy = positions[i*3+1] - positions[j*3+1];
        const dz = positions[i*3+2] - positions[j*3+2];
        const d = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (d < LINK_DIST) pairs.push([i, j, d]);
      }
    }
    const linePositions = new Float32Array(pairs.length * 6);
    const lineAlphas    = new Float32Array(pairs.length * 2);
    pairs.forEach(([i, j, d], idx) => {
      const a = Math.max(0.02, 0.18 - (d / (LINK_DIST * 1.5)));
      lineAlphas[idx*2]     = a;
      lineAlphas[idx*2 + 1] = a;
    });
    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeom.setAttribute("alpha",    new THREE.BufferAttribute(lineAlphas, 1));
    const lineMat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(0x006A4E) } },
      vertexShader: `
        attribute float alpha; varying float vAlpha;
        void main() { vAlpha = alpha; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
      `,
      fragmentShader: `
        uniform vec3 uColor; varying float vAlpha;
        void main() { gl_FragColor = vec4(uColor, vAlpha * 0.7); }
      `,
      transparent: true, depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeom, lineMat);
    scene.add(lines);

    // Mouse tracking
    let mx = 0, my = 0;
    window.addEventListener("mousemove", e => {
      mx = (e.clientX / window.innerWidth)  * 2 - 1;
      my = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    let frame = 0, running = true;
    const start = performance.now();

    function tick() {
      if (!running) return;
      const t = (performance.now() - start) / 1000;
      pointsMat.uniforms.uTime.value = t;
      pointsMat.uniforms.uMouse.value.set(mx, my);

      // Update line positions with drift applied
      const drift = (i, ax) => {
        if (ax === 0) return Math.sin(t * 0.22 + positions[i*3+1] * 0.5) * 0.14;
        if (ax === 1) return Math.cos(t * 0.18 + positions[i*3]   * 0.4) * 0.12;
        return 0;
      };
      for (let k = 0; k < pairs.length; k++) {
        const [i, j] = pairs[k];
        linePositions[k*6]   = positions[i*3]   + drift(i, 0);
        linePositions[k*6+1] = positions[i*3+1] + drift(i, 1);
        linePositions[k*6+2] = positions[i*3+2];
        linePositions[k*6+3] = positions[j*3]   + drift(j, 0);
        linePositions[k*6+4] = positions[j*3+1] + drift(j, 1);
        linePositions[k*6+5] = positions[j*3+2];
      }
      lineGeom.attributes.position.needsUpdate = true;

      // Very slow global drift + mouse parallax
      const targetRY = mx * 0.04 + Math.sin(t * 0.07) * 0.08;
      const targetRX = my * 0.02 + Math.cos(t * 0.05) * 0.04;
      points.rotation.y += (targetRY - points.rotation.y) * 0.04;
      points.rotation.x += (targetRX - points.rotation.x) * 0.04;
      lines.rotation.copy(points.rotation);

      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    }
    tick();

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) { running = true; tick(); }
      else if (!entry.isIntersecting) { running = false; cancelAnimationFrame(frame); }
    }, { threshold: 0 });
    obs.observe(host);

    window.addEventListener("resize", () => {
      const W = host.clientWidth, H = host.clientHeight;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    }, { passive: true });
  }

  // ── 7. Lenis smooth scrolling — wired to GSAP ticker ──
  function initLenis() {
    if (!window.Lenis) return;
    // Kill existing instance if navigating back to landing
    if (window.__pfLenis) { window.__pfLenis.destroy(); window.__pfLenis = null; }

    const lenis = new Lenis({
      duration: 1.4,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo.out — matches GSAP feel
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8,
    });

    // Sync Lenis scroll position with GSAP ScrollTrigger
    lenis.on("scroll", () => {
      if (window.ScrollTrigger) window.ScrollTrigger.update();
    });

    // Use GSAP's ticker so Lenis and GSAP run on the same frame
    if (window.gsap) {
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      // Fallback RAF loop if GSAP not loaded
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }

    window.__pfLenis = lenis;
  }

  // ── 8. Matcher teaser — GSAP stagger as cards enter viewport ──
  function initMatcherTeaser() {
    if (!window.gsap || !window.ScrollTrigger) return;
    const steps = document.querySelectorAll(".pf-teaser-step");
    if (!steps.length) return;

    gsap.set(steps, { opacity: 0, x: 48 });
    gsap.to(steps, {
      opacity: 1,
      x: 0,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.25,
      scrollTrigger: {
        trigger: steps[0].closest(".pf-teaser-split") || steps[0],
        start: "top 72%",
        once: true,
      },
    });
  }

  // ── Boot ──
  function boot() {
    // Clear any prior ScrollTriggers (when re-entering landing)
    if (window.ScrollTrigger) ScrollTrigger.getAll().forEach(t => t.kill());
    initLenis();
    initSplitTextHero();
    initStarfield();
    initScroll();
    initPinnedReality();
    initHorizontalScroll();
    initParallaxMasonry();
    initMatcherTeaser();
    if (window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 200);
  }
  setTimeout(boot, 80);
  window.__pfReanimate = () => setTimeout(boot, 80);
})();

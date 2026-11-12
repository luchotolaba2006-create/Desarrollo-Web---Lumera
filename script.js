/* =========================================================
   Sitio web de Lumera Consultores — Motor de la presentación
   Navegación por pasos, transiciones y motion graphics (GSAP)
   ========================================================= */
(() => {
  "use strict";

  gsap.registerPlugin(SplitText, DrawSVGPlugin);

  const stage = document.getElementById("stage");
  const slides = Array.from(stage.querySelectorAll(".slide"));
  const total = slides.length;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = (n) => Math.round(n).toLocaleString("es-AR");

  let current = -1;
  let step = 0;
  let stepTween = null;
  let transitionTl = null;
  const built = [];

  /* ---------- Escalado del escenario 1920 × 1080 ---------- */
  let scale = 1;
  function fit() {
    scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = `translate(${-960 * scale}px, ${-540 * scale}px) scale(${scale})`;
  }
  window.addEventListener("resize", fit);
  fit();

  /* ---------- Utilidades de animación ---------- */
  function makeTl() {
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out", duration: 0.9 } });
    tl._n = 0;
    tl.mark = () => { tl.addLabel("L" + tl._n); tl._n += 1; };
    return tl;
  }

  function splitTitle(el) {
    if (!el) return [];
    if (!el._split) {
      el._split = new SplitText(el, { type: "lines", linesClass: "split-line-inner" });
      el._split.lines.forEach((line) => {
        const wrap = document.createElement("span");
        wrap.className = "split-line";
        line.parentNode.insertBefore(wrap, line);
        wrap.appendChild(line);
        line.style.display = "block";
      });
    }
    return el._split.lines;
  }

  function intro(tl, slide, at = 0) {
    const ey = slide.querySelectorAll(".eyebrow.a-up, .slide-head .eyebrow");
    const titles = slide.querySelectorAll(".a-split");
    if (ey.length) tl.from(ey, { x: -30, opacity: 0, duration: 0.7 }, at);
    titles.forEach((t, i) => {
      tl.from(splitTitle(t), { yPercent: 110, duration: 1.05, stagger: 0.09, ease: "power4.out" }, at + 0.1 + i * 0.1);
    });
  }

  function upEls(tl, els, at, opts = {}) {
    if (!els || (els.length === 0)) return;
    tl.from(els, Object.assign({ y: 34, opacity: 0, duration: 0.8, stagger: 0.1 }, opts), at);
  }

  function counter(tl, el, to, at, dur = 1.6, prefix = "", suffix = "") {
    const o = { v: 0 };
    tl.fromTo(o, { v: 0 }, {
      v: to, duration: dur, ease: "power2.out",
      onUpdate: () => { el.textContent = prefix + fmt(o.v) + suffix; },
    }, at);
  }

  function typeText(tl, el, at, dur) {
    const text = el.dataset.text || "";
    const o = { n: 0 };
    el.textContent = "";
    tl.fromTo(o, { n: 0 }, {
      n: text.length, duration: dur, ease: "none",
      onUpdate: () => { el.textContent = text.slice(0, Math.round(o.n)); },
    }, at);
  }

  const $ = (s, root) => root.querySelector(s);
  const $$ = (s, root) => Array.from(root.querySelectorAll(s));

  /* ---------- Constructores por diapositiva ---------- */
  const builders = {
    /* 01 · Portada */
    1(s) {
      const tl = makeTl();
      tl.from($(".band", s), { scaleY: 0, transformOrigin: "50% 0%", duration: 1.2, ease: "expo.inOut" }, 0)
        .from($(".band-2", s), { scaleY: 0, transformOrigin: "50% 100%", duration: 1.2, ease: "expo.inOut" }, 0.15)
        .from($(".logo", s), { clipPath: "inset(0 0 100% 0)", y: 24, duration: 1.1, ease: "power3.out" }, 0.3);
      tl.from(splitTitle($(".h1", s)), { yPercent: 110, duration: 1.1, stagger: 0.1, ease: "power4.out" }, 0.55);
      upEls(tl, $$(".a-up", s), 0.95, { stagger: 0.14 });
      tl.from($(".cover-visual .browser", s), { x: 260, rotateY: -40, opacity: 0, duration: 1.6, ease: "expo.out" }, 0.55);
      tl.mark();
      return tl;
    },

    /* 02 · Punto de partida */
    2(s) {
      const tl = makeTl();
      intro(tl, s);
      const num = $(".years strong", s);
      tl.from($(".years", s), { opacity: 0, y: 40, duration: 0.9 }, 0.35);
      counter(tl, num, 15, 0.35, 1.4, "+");
      tl.mark();
      tl.from($$(".fact", s), { y: 50, opacity: 0, duration: 0.8, stagger: 0.14 }, ">");
      tl.mark();
      tl.from($(".challenge", s), { clipPath: "inset(100% 0 0 0)", duration: 0.9, ease: "expo.out" }, ">")
        .from($$(".challenge > *", s), { y: 24, opacity: 0, stagger: 0.1, duration: 0.7 }, "<0.2");
      tl.mark();
      return tl;
    },

    /* 03 · Objetivo */
    3(s) {
      const tl = makeTl();
      intro(tl, s);
      upEls(tl, [$(".quote", s)], 0.6);
      tl.mark();
      $$(".goal", s).forEach((g, i) => {
        const at = i === 0 ? ">" : "<0.22";
        tl.fromTo($(".bar", g), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, at)
          .from($$(".n, h4, p", g), { y: 26, opacity: 0, stagger: 0.06, duration: 0.6 }, "<0.15")
          .to($(".bar", g), { scaleX: 0, transformOrigin: "100% 50%", duration: 0.5, ease: "power2.in" }, "<0.45");
      });
      tl.mark();
      return tl;
    },

    /* 04 · Benchmarking */
    4(s) {
      const tl = makeTl();
      intro(tl, s);
      upEls(tl, [$(".note", s)], 0.5);
      tl.mark();
      tl.from($$(".card", s), { y: 80, opacity: 0, rotateX: -12, transformPerspective: 1200, transformOrigin: "50% 100%", duration: 1, stagger: 0.16, ease: "expo.out" }, ">");
      tl.set($$(".card .apply", s), { clipPath: "inset(100% 0 0 0)" }, 0);
      tl.mark();
      tl.to($$(".card .apply", s), { clipPath: "inset(0% 0 0 0)", duration: 0.8, stagger: 0.18, ease: "expo.out" }, ">")
        .from($$(".card .apply > *", s), { y: 20, opacity: 0, duration: 0.6, stagger: 0.09 }, "<0.15");
      tl.mark();
      return tl;
    },

    /* 05 · Dos públicos */
    5(s) {
      const tl = makeTl();
      const emp = $(".half--emp", s), pro = $(".half--pro", s), center = $(".center", s);
      tl.set(pro, { xPercent: 100 }, 0);
      tl.set(center, { scale: 0, opacity: 0 }, 0);
      tl.from(emp, { xPercent: -100, duration: 1.1, ease: "expo.inOut" }, 0)
        .from($$(".eyebrow, .h2", emp), { y: 30, opacity: 0, stagger: 0.1, duration: 0.7 }, 0.6)
        .from($$(".row", emp), { x: -30, opacity: 0, stagger: 0.12, duration: 0.7 }, 0.8)
        .from($(".action", emp), { scale: 0.8, opacity: 0, duration: 0.6, ease: "back.out(2)" }, 1.2);
      tl.mark();
      tl.to(pro, { xPercent: 0, duration: 1.1, ease: "expo.inOut" }, ">")
        .from($$(".eyebrow, .h2", pro), { y: 30, opacity: 0, stagger: 0.1, duration: 0.7 }, "<0.6")
        .from($$(".row", pro), { x: 30, opacity: 0, stagger: 0.12, duration: 0.7 }, "<0.2")
        .from($(".action", pro), { scale: 0.8, opacity: 0, duration: 0.6, ease: "back.out(2)" }, "<0.4");
      tl.mark();
      tl.to(center, { scale: 1, opacity: 1, duration: 0.9, ease: "back.out(1.6)" }, ">")
        .from($$(".center > *", s), { y: 16, opacity: 0, stagger: 0.1, duration: 0.5 }, "<0.3");
      tl.mark();
      return tl;
    },

    /* 06 · Arquitectura */
    6(s) {
      const tl = makeTl();
      const svg = $("svg.wires", s);
      const r = (id) => { const e = s.querySelector("#" + id); return { x: e.offsetLeft, y: e.offsetTop, w: e.offsetWidth, h: e.offsetHeight, el: e }; };
      const P = (d, cls = "") => {
        const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
        p.setAttribute("d", d); if (cls) p.setAttribute("class", cls); svg.appendChild(p); return p;
      };
      svg.innerHTML = "";
      const ini = r("n-inicio");
      const busY = 362;
      const top = ["n-emp", "n-pro", "n-nos", "n-con"].map(r);
      const busWires = top.map((t) => P(`M${ini.x + ini.w / 2} ${ini.y + ini.h} V${busY} H${t.x + t.w / 2} V${t.y}`));
      const emp = r("n-emp"), pro = r("n-pro");
      const empKids = ["n-serv", "n-como", "n-recemp"].map(r);
      const proKids = ["n-opo", "n-recpro", "n-cv"].map(r);
      const empW = empKids.map((k) => P(`M${emp.x + 24} ${emp.y + emp.h} V${k.y + 30} H${k.x}`));
      const proW = proKids.map((k) => P(`M${pro.x + 24} ${pro.y + pro.h} V${k.y + 30} H${k.x}`, "p"));
      const tr = ["n-recidx", "n-legal", "n-sys"].map(r);
      const trW = [P(`M${ini.x + ini.w} ${ini.y + ini.h / 2} H${1600} V${tr[0].y}`, "d")];

      intro(tl, s);
      upEls(tl, [$(".legend", s)], 0.5);
      tl.from(ini.el, { scale: 0.6, opacity: 0, duration: 0.7, ease: "back.out(2)" }, 0.5)
        .from(busWires, { drawSVG: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.05 }, 0.9)
        .from($(".menu-label", s), { opacity: 0, duration: 0.5 }, 1.2)
        .from(top.map((t) => t.el), { y: -20, opacity: 0, duration: 0.6, stagger: 0.1 }, 1.4);
      tl.mark();
      tl.from(empW, { drawSVG: 0, duration: 0.8, stagger: 0.12, ease: "power2.inOut" }, ">")
        .from(empKids.map((k) => k.el), { x: -30, opacity: 0, duration: 0.6, stagger: 0.14 }, "<0.4")
        .from($$("#n-serv .svc span", s), { opacity: 0, y: 8, duration: 0.4, stagger: 0.05 }, "<0.3");
      tl.mark();
      tl.from(proW, { drawSVG: 0, duration: 0.8, stagger: 0.12, ease: "power2.inOut" }, ">")
        .from(proKids.map((k) => k.el), { x: -30, opacity: 0, duration: 0.6, stagger: 0.14 }, "<0.4");
      tl.mark();
      tl.from(trW, { opacity: 0, duration: 0.6 }, ">")
        .from(tr.map((t) => t.el), { x: 30, opacity: 0, duration: 0.6, stagger: 0.14 }, "<0.2");
      tl.mark();
      return tl;
    },

    /* 07 · User flows */
    7(s) {
      const tl = makeTl();
      intro(tl, s);
      upEls(tl, $$(".rules .tag", s), 0.5, { x: 30, y: 0, stagger: 0.1 });
      const flows = $$(".flow", s);
      tl.from(flows, { opacity: 0, y: 20, duration: 0.6, stagger: 0.08 }, 0.6);
      tl.set($$(".stepbox", s), { opacity: 0.5 }, 0);
      tl.mark();
      flows.forEach((f) => {
        const track = $(".track", f), line = $(".line", f), fill = $(".fill", f), dot = $(".dot", f);
        const boxes = $$(".stepbox", f);
        const isEmp = f.classList.contains("emp");
        const col = isEmp ? "#173B57" : "#2F6F6A";
        const lw = line.offsetWidth, ll = line.offsetLeft;
        const centers = boxes.map((b) => b.offsetLeft + b.offsetWidth / 2);
        tl.set(dot, { x: centers[0], opacity: 1 }, ">");
        boxes.forEach((b, i) => {
          if (i > 0) {
            tl.to(dot, { x: centers[i], duration: 0.42, ease: "power2.inOut" }, ">")
              .to(fill, { scaleX: Math.min(1, Math.max(0, (centers[i] - ll) / lw)), duration: 0.42, ease: "power2.inOut" }, "<");
          }
          tl.to(b, { opacity: 1, backgroundColor: col, borderColor: col, color: "#F4F0E8", duration: 0.22, ease: "none" }, i > 0 ? ">-0.08" : ">");
        });
        tl.to(dot, { scale: 1.6, duration: 0.25, yoyo: true, repeat: 1, ease: "power1.inOut" }, ">").to(dot, { opacity: 0, duration: 0.25 }, ">");
        tl.mark();
      });
      return tl;
    },

    /* 08 · Diseño visual */
    8(s) {
      const tl = makeTl();
      intro(tl, s);
      tl.from($$(".sw", s), { y: 30, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.5)
        .from($$(".sw i", s), { scaleY: 0, transformOrigin: "50% 100%", duration: 0.7, stagger: 0.08, ease: "expo.out" }, 0.55)
        .from($$(".type > div", s), { y: 30, opacity: 0, duration: 0.6, stagger: 0.12 }, 1.0)
        .from($$(".rules p", s), { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 }, 1.3);
      tl.mark();
      tl.from($(".b1", s), { x: 180, opacity: 0, rotate: 2, duration: 1.1, ease: "expo.out" }, ">")
        .from($(".b2", s), { y: 160, opacity: 0, rotate: -2, duration: 1.1, ease: "expo.out" }, "<0.25");
      tl.mark();
      tl.from($$(".callout", s), { scale: 0.6, opacity: 0, duration: 0.5, stagger: 0.25, ease: "back.out(2.2)" }, ">");
      tl.mark();
      return tl;
    },

    /* 09 · Responsive */
    9(s) {
      const tl = makeTl();
      intro(tl, s);
      const desk = $(".desk", s), phones = $(".phones", s);
      tl.from(desk, { y: 80, opacity: 0, duration: 1.1, ease: "expo.out" }, 0.4);
      tl.set(phones, { clipPath: "inset(100% 0 0 0)" }, 0);
      tl.mark();
      tl.to(desk, { scale: 0.76, x: -10, y: -10, transformOrigin: "0% 0%", duration: 1.1, ease: "expo.inOut" }, ">")
        .to(phones, { clipPath: "inset(0% 0 0 0)", duration: 1.1, ease: "expo.inOut" }, "<0.25")
        .from($("img", phones), { y: 120, duration: 1.2, ease: "expo.out" }, "<");
      tl.mark();
      tl.from($$(".decisions > div", s), { y: 40, opacity: 0, duration: 0.7, stagger: 0.12 }, ">");
      tl.mark();
      return tl;
    },

    /* 10 · Funcionalidades */
    10(s) {
      const tl = makeTl();
      intro(tl, s);
      upEls(tl, [$(".demo", s)], 0.5);
      tl.mark();
      const feats = $$(".feat", s);
      [feats.slice(0, 3), feats.slice(3)].forEach((row) => {
        tl.from(row, { y: 60, opacity: 0, duration: 0.8, stagger: 0.14, ease: "expo.out" }, ">")
          .from(row.map((f) => $(".img", f)), { clipPath: "inset(0 100% 0 0)", duration: 0.9, stagger: 0.14, ease: "expo.inOut" }, "<0.1");
        tl.mark();
      });
      return tl;
    },

    /* 11 · WordPress */
    11(s) {
      const tl = makeTl();
      intro(tl, s);
      upEls(tl, [$(".head .lead", s)], 0.6);
      tl.mark();
      tl.from($$(".layer", s), { y: 60, opacity: 0, duration: 0.8, stagger: 0.22, ease: "expo.out" }, ">");
      tl.mark();
      tl.from($(".plugins .k", s), { opacity: 0, duration: 0.4 }, ">")
        .from($$(".prow", s), { x: 40, opacity: 0, duration: 0.55, stagger: 0.09 }, "<")
        .from($$(".prow .st", s), { scale: 0, duration: 0.4, stagger: 0.09, ease: "back.out(3)" }, "<0.3");
      tl.mark();
      tl.from($(".keys", s), { opacity: 0, y: 10, duration: 0.5 }, ">")
        .from($(".out", s), { y: 30, opacity: 0, duration: 0.7 }, "<0.15");
      tl.mark();
      return tl;
    },

    /* 12 · SEO y SEM */
    12(s) {
      const tl = makeTl();
      intro(tl, s);
      tl.from($(".finds .k", s), { opacity: 0, duration: 0.4 }, 0.5)
        .from($$(".finds p", s), { y: 30, opacity: 0, duration: 0.7, stagger: 0.15 }, 0.6)
        .from($$(".colhead", s), { opacity: 0, y: -10, duration: 0.5, stagger: 0.08 }, 0.9);
      tl.set($$(".lane", s), { opacity: 0 }, 0);
      tl.mark();
      $$(".lane", s).forEach((lane) => {
        tl.set(lane, { opacity: 1 }, ">");
        tl.from($(".q", lane), { scale: 0.9, opacity: 0, duration: 0.45, ease: "back.out(2)" }, ">");
        typeText(tl, $(".typed", lane), ">", 1.1);
        tl.to($(".caret", lane), { opacity: 0, duration: 0.2 }, ">");
        const arrs = $$(".arr", lane);
        const steps = [$(".box.c", lane), $(".box.s", lane), $(".end", lane)];
        steps.forEach((el, i) => {
          tl.from(arrs[i], { scaleX: 0, duration: 0.4, ease: "power2.inOut" }, ">")
            .from(el, { x: -20, opacity: 0, duration: 0.5 }, ">-0.05");
        });
        tl.mark();
      });
      tl.from($(".onpage", s), { y: 20, opacity: 0, duration: 0.6 }, ">")
        .from($(".sem", s), { y: 60, opacity: 0, duration: 0.9, ease: "expo.out" }, "<0.1")
        .from($(".sem .tag", s), { scale: 0.8, opacity: 0, duration: 0.5, ease: "back.out(2)" }, "<0.5");
      tl.mark();
      return tl;
    },

    /* 13 · Captación y medición */
    13(s) {
      const tl = makeTl();
      intro(tl, s);
      tl.mark();
      const boxes = $$(".stage-box", s);
      tl.from($(".rail", s), { opacity: 0, duration: 0.4 }, ">")
        .from(boxes, { y: 50, opacity: 0, duration: 0.7, stagger: 0.12, ease: "expo.out" }, "<");
      tl.mark();
      const runner = $(".runner", s), fill = $(".rail .fill", s), pipeW = $(".pipe", s).offsetWidth;
      const centers = boxes.map((b) => b.offsetLeft + b.offsetWidth / 2);
      tl.set(runner, { x: centers[0], opacity: 1 }, ">");
      centers.forEach((c, i) => {
        if (i > 0) {
          tl.to(runner, { x: c, duration: 0.55, ease: "power2.inOut" }, ">")
            .to(fill, { scaleX: c / pipeW, duration: 0.55, ease: "power2.inOut" }, "<");
        }
        tl.to(boxes[i], { y: -10, duration: 0.25, yoyo: true, repeat: 1, ease: "power1.inOut" }, ">-0.1");
      });
      tl.mark();
      tl.from($(".talent", s), { y: 30, opacity: 0, duration: 0.7 }, ">")
        .from($(".channel", s), { y: 20, opacity: 0, duration: 0.6 }, "<0.2");
      tl.mark();
      tl.from($$(".goals .goal", s), { y: 40, opacity: 0, duration: 0.7, stagger: 0.15 }, ">");
      counter(tl, $(".goals strong[data-count]", s), 50000, "<", 1.6);
      tl.from($(".disclaimer", s), { y: 20, opacity: 0, duration: 0.6 }, "<0.6");
      tl.mark();
      return tl;
    },

    /* 14 · Video */
    14(s) {
      const tl = makeTl();
      upEls(tl, $$(".title .a-up", s), 0.2);
      tl.from($(".player", s), { scale: 0.94, opacity: 0, duration: 1, ease: "expo.out" }, 0.1)
        .from($(".vbar", s), { y: 20, opacity: 0, duration: 0.6 }, 0.5);
      tl.mark();
      return tl;
    },

    /* 15 · Conclusión */
    15(s) {
      const tl = makeTl();
      intro(tl, s);
      tl.from($(".logo", s), { clipPath: "inset(0 0 100% 0)", y: 20, duration: 1 }, 0.5);
      tl.mark();
      tl.from($$(".val", s), { clipPath: "inset(0 100% 0 0)", duration: 0.9, stagger: 0.18, ease: "expo.inOut" }, ">")
        .from($$(".val > *", s), { y: 24, opacity: 0, duration: 0.6, stagger: 0.05 }, "<0.3");
      tl.mark();
      tl.from($(".closing p", s), { y: 30, opacity: 0, duration: 0.9 }, ">")
        .from($(".closing .sig", s), { opacity: 0, x: 20, duration: 0.7 }, "<0.3");
      tl.mark();
      return tl;
    },
  };

  /* ---------- Construcción perezosa ---------- */
  function getTl(i) {
    if (!built[i]) {
      const s = slides[i];
      const tl = (builders[i + 1] || ((x) => { const t = makeTl(); intro(t, x); t.mark(); return t; }))(s);
      // Toda la información aparece de una vez: la animación de entrada
      // recorre la línea completa en un máximo de ~2,6 s y termina legible.
      tl.addLabel("L0", tl.duration());
      tl.timeScale(Math.max(1, tl.duration() / 2.6));
      tl.maxStep = 0;
      built[i] = tl;
    }
    return built[i];
  }

  /* ---------- Navegación ---------- */
  function playTo(tl, k, instant) {
    if (stepTween) stepTween.kill();
    if (instant || reduced) { tl.seek("L" + k, false); return; }
    stepTween = tl.tweenTo("L" + k);
  }

  function updateHud() {
    const pct = ((current + (step + 1) / (getTl(current).maxStep + 1)) / total) * 100;
    document.getElementById("progressBar").style.width = pct + "%";
    document.getElementById("counter").textContent = String(current + 1).padStart(2, "0") + " / " + total;
    if (location.hash !== "#" + (current + 1)) history.replaceState(null, "", "#" + (current + 1));
  }

  function transition(from, to, dir) {
    const a = slides[from], b = slides[to];
    const type = b.dataset.transition || "fade";
    if (transitionTl) transitionTl.progress(1).kill();
    b.classList.add("is-active");
    if (!a) { gsap.fromTo(b, { opacity: 0 }, { opacity: 1, duration: reduced ? 0 : 0.8 }); return 0; }
    a.classList.remove("is-active");
    a.classList.add("is-leaving");
    const done = () => { a.classList.remove("is-leaving"); gsap.set(a, { clearProps: "opacity,transform,clipPath,filter" }); gsap.set(b, { clearProps: "opacity,transform,clipPath,filter" }); };
    if (reduced) { done(); return 0; }
    const tl = gsap.timeline({ onComplete: done });
    transitionTl = tl;
    if (type === "slide") {
      const fromClip = dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
      tl.fromTo(b, { clipPath: fromClip }, { clipPath: "inset(0 0 0 0%)", duration: 1.0, ease: "expo.inOut" }, 0)
        .to(a, { x: -260 * dir, opacity: 0.4, duration: 1.0, ease: "expo.inOut" }, 0);
      return 0.45;
    }
    if (type === "wipe") {
      const w = document.createElement("div");
      w.className = "wipe";
      w.style.background = b.dataset.theme === "azul" ? "#2F6F6A" : "#173B57";
      stage.appendChild(w);
      gsap.set(b, { opacity: 0 });
      tl.fromTo(w, { scaleX: 0, transformOrigin: dir > 0 ? "0% 50%" : "100% 50%" }, { scaleX: 1, duration: 0.55, ease: "expo.in" }, 0)
        .set(b, { opacity: 1 })
        .set(a, { opacity: 0 })
        .to(w, { scaleX: 0, transformOrigin: dir > 0 ? "100% 50%" : "0% 50%", duration: 0.65, ease: "expo.out" })
        .add(() => w.remove());
      tl.eventCallback("onInterrupt", () => w.remove());
      return 0.6;
    }
    // fade + escala
    tl.fromTo(b, { opacity: 0, scale: 1.03 }, { opacity: 1, scale: 1, duration: 0.85, ease: "power2.out" }, 0)
      .to(a, { opacity: 0, scale: 0.985, duration: 0.6, ease: "power2.in" }, 0);
    return 0.2;
  }

  function go(to, dir = 1, landAtEnd = false) {
    if (to < 0 || to >= total || to === current) return;
    const from = current;
    if (from >= 0 && slides[from].hasAttribute("data-video")) pauseVideo();
    current = to;
    const tl = getTl(to);
    if (stepTween) stepTween.kill();
    const delay = transition(from, to, dir);
    if (landAtEnd) {
      step = tl.maxStep;
      tl.seek("L" + step, false);
    } else {
      step = 0;
      tl.seek(0, false);
      if (reduced) tl.seek("L0", false);
      else gsap.delayedCall(delay, () => { if (current === to && step === 0) playTo(tl, 0); });
    }
    updateHud();
  }

  function next() {
    const tl = getTl(current);
    if (step < tl.maxStep) { step += 1; playTo(tl, step); updateHud(); }
    else go(current + 1, 1);
  }
  function prev() {
    const tl = getTl(current);
    if (step > 0) { step -= 1; playTo(tl, step); updateHud(); }
    else go(current - 1, -1, true);
  }

  /* ---------- Video (diapositiva 14) ---------- */
  const video = document.getElementById("tourVideo");
  const bigPlay = document.getElementById("bigPlay");
  const vPlay = document.getElementById("vPlay");
  const vSeek = document.getElementById("vSeek");
  const vTime = document.getElementById("vTime");
  const vEnded = document.getElementById("videoEnded");
  const tFmt = (t) => { t = Math.max(0, t || 0); return Math.floor(t / 60) + ":" + String(Math.floor(t % 60)).padStart(2, "0"); };

  function syncVideoUi() {
    const playing = !video.paused && !video.ended;
    vPlay.querySelector("use").setAttribute("href", playing ? "#i-pause" : "#i-play");
    vPlay.querySelector("span").textContent = playing ? "Pausar" : "Reproducir";
    bigPlay.classList.toggle("is-hidden", playing || video.currentTime > 0.05);
    const d = video.duration || 60;
    vSeek.firstElementChild.style.width = (video.currentTime / d) * 100 + "%";
    vTime.textContent = tFmt(video.currentTime) + " / " + tFmt(d);
  }
  function toggleVideo() {
    vEnded.classList.remove("is-on");
    if (video.paused || video.ended) { if (video.ended) video.currentTime = 0; video.play(); } else video.pause();
  }
  function pauseVideo() { if (!video.paused) video.pause(); }
  bigPlay.addEventListener("click", toggleVideo);
  vPlay.addEventListener("click", toggleVideo);
  video.addEventListener("click", toggleVideo);
  document.getElementById("vRestart").addEventListener("click", () => { vEnded.classList.remove("is-on"); video.currentTime = 0; video.play(); });
  document.getElementById("vMute").addEventListener("click", (e) => {
    video.muted = !video.muted;
    e.currentTarget.querySelector("span").textContent = video.muted ? "Sin sonido" : "Sonido";
  });
  document.getElementById("vFull").addEventListener("click", () => {
    video.controls = true;
    (video.requestFullscreen || video.webkitRequestFullscreen).call(video);
  });
  document.addEventListener("fullscreenchange", () => { if (document.fullscreenElement !== video) video.controls = false; });
  vSeek.addEventListener("click", (e) => {
    const rect = vSeek.getBoundingClientRect();
    video.currentTime = ((e.clientX - rect.left) / rect.width) * (video.duration || 60);
    vEnded.classList.remove("is-on");
  });
  ["play", "pause", "timeupdate", "loadedmetadata", "seeked"].forEach((ev) => video.addEventListener(ev, syncVideoUi));
  video.addEventListener("ended", () => { syncVideoUi(); vEnded.classList.add("is-on"); });

  /* ---------- Controles ---------- */
  const help = document.getElementById("help");
  function toggleFull() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  }
  document.getElementById("btnNext").addEventListener("click", (e) => { e.currentTarget.blur(); next(); });
  document.getElementById("btnPrev").addEventListener("click", (e) => { e.currentTarget.blur(); prev(); });
  document.getElementById("btnFull").addEventListener("click", (e) => { e.currentTarget.blur(); toggleFull(); });
  document.getElementById("btnHelp").addEventListener("click", (e) => { e.currentTarget.blur(); help.classList.toggle("is-open"); });
  help.addEventListener("click", () => help.classList.remove("is-open"));

  let typed = "";
  document.addEventListener("keydown", (e) => {
    if (e.target.closest && e.target.closest("button, [role=slider]") && (e.key === " " || e.key === "Enter")) return;
    if (document.fullscreenElement === video) return;
    const k = e.key;
    if (["ArrowRight", "PageDown", " ", "ArrowDown"].includes(k)) { e.preventDefault(); typed = ""; next(); }
    else if (["ArrowLeft", "PageUp", "ArrowUp", "Backspace"].includes(k)) { e.preventDefault(); typed = ""; prev(); }
    else if (k === "Home") go(0, -1);
    else if (k === "End") go(total - 1, 1);
    else if (k === "f" || k === "F") toggleFull();
    else if (k === "?" || k === "h" || k === "H") help.classList.toggle("is-open");
    else if (k === "Escape") { help.classList.remove("is-open"); }
    else if ((k === "p" || k === "P" || k === "k" || k === "K") && slides[current].hasAttribute("data-video")) toggleVideo();
    else if (/^[0-9]$/.test(k)) { typed += k; }
    else if (k === "Enter" && typed) { const n = parseInt(typed, 10) - 1; typed = ""; if (n >= 0 && n < total) go(n, n > current ? 1 : -1); }
  });

  // Clic en la diapositiva: avanzar (excepto sobre controles o video)
  stage.addEventListener("click", (e) => {
    if (e.target.closest("button, video, .vbar, .player, a")) return;
    if (e.clientX < window.innerWidth * 0.18) prev(); else next();
  });

  // Cursor inactivo y parallax sutil
  let idleT;
  document.addEventListener("mousemove", (e) => {
    document.body.classList.remove("is-idle");
    clearTimeout(idleT);
    idleT = setTimeout(() => document.body.classList.add("is-idle"), 2500);
    if (reduced || current < 0) return;
    const px = e.clientX / window.innerWidth - 0.5, py = e.clientY / window.innerHeight - 0.5;
    slides[current].querySelectorAll("[data-parallax]").forEach((el) => {
      const d = parseFloat(el.dataset.parallax) || 12;
      gsap.to(el, { x: -px * d, y: -py * d, duration: 1.2, ease: "power2.out", overwrite: "auto" });
    });
  });

  /* ---------- Inicio ---------- */
  async function start() {
    try {
      await Promise.all([
        document.fonts.load('500 64px "Lora"'), document.fonts.load('400 64px "Lora"'), document.fonts.load('italic 400 30px "Lora"'),
        document.fonts.load('400 24px "Source Sans 3"'), document.fonts.load('600 24px "Source Sans 3"'), document.fonts.load('700 24px "Source Sans 3"'),
      ]);
      await document.fonts.ready;
    } catch (e) { /* continúa con fuentes de respaldo */ }
    const h = parseInt((location.hash || "#1").slice(1), 10);
    const startAt = Number.isFinite(h) && h >= 1 && h <= total ? h - 1 : 0;
    go(startAt, 1);
    syncVideoUi();
    window.__deck = { go: (n, end) => go(n - 1, 1, end), next, prev, get state() { return { current: current + 1, step, max: getTl(current).maxStep }; } };
  }
  start();
})();

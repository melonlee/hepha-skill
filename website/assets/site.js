// Hepha website: progressive enhancement only. Every section works without this file.
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Header border once the page scrolls. */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Gate animation: RED -> GREEN -> REVIEW -> DONE, looping while visible. */
  const card = document.querySelector("[data-gate-card]");
  if (card && !reduceMotion.matches) {
    const nodes = [...card.querySelectorAll(".node")];
    const fill = card.querySelector(".fill");
    const progress = [0, 0.333, 0.666, 1, 1];
    const delays = [900, 1500, 1500, 1500, 3800]; // time spent in each step before moving on
    let step = 0;
    let timer = null;
    let visible = false;

    const render = () => {
      card.classList.add("anim");
      for (let i = 1; i <= 4; i++) card.classList.toggle(`s${i}`, step >= i);
      nodes.forEach((node, i) => {
        node.classList.toggle("on", step > i);
        node.classList.toggle("active", step === i);
      });
      fill.style.setProperty("--p", progress[step]);
    };
    const tick = () => {
      render();
      timer = setTimeout(() => {
        step = (step + 1) % 5;
        tick();
      }, delays[step]);
    };
    const start = () => { if (!timer && visible && !document.hidden) tick(); };
    const stop = () => { clearTimeout(timer); timer = null; };

    step = 0;
    render();
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visible ? start() : stop();
    }, { threshold: 0.25 }).observe(card);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  }

  /* Accessible tabs: [role=tablist] > [role=tab][aria-controls]. */
  document.querySelectorAll('[role="tablist"]').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(tab, false));
      tab.addEventListener("keydown", (e) => {
        const move = { ArrowRight: 1, ArrowLeft: -1, Home: -i, End: tabs.length - 1 - i }[e.key];
        if (move === undefined) return;
        e.preventDefault();
        select(tabs[(i + move + tabs.length) % tabs.length], true);
      });
    });
    select(tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0], false);
  });

  /* Copy buttons copy the text of the <pre> in the same .code block. */
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback for non-secure contexts (e.g. file://).
      const ta = Object.assign(document.createElement("textarea"), { value: text });
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.append(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    }
  };
  document.querySelectorAll(".code").forEach((block) => {
    const btn = block.querySelector(".copy");
    const pre = block.querySelector("pre");
    if (!btn || !pre) return;
    btn.hidden = false;
    const label = btn.querySelector(".label");
    const idle = label.textContent;
    const done = btn.dataset.copied || "Copied";
    btn.addEventListener("click", async () => {
      const ok = await copyText(pre.innerText.replace(/\n$/, ""));
      if (!ok) return;
      btn.classList.add("ok");
      label.textContent = done;
      setTimeout(() => { btn.classList.remove("ok"); label.textContent = idle; }, 1600);
    });
  });
})();

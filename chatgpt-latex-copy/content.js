(() => {
  const SETTINGS_KEY = "latexCopyEnabled";
  const SOURCE_EVENT = "cg-latex-copy:sources";
  let enabled = true;
  let observer;
  const sourceByFormula = new WeakMap();
  const pendingSourceBatches = [];

  const normalizeLatex = (value) => value
    .replace(/\u00a0/g, " ")
    .replace(/\s+$/g, "")
    .trim();

  function latexFor(formula) {
    const captured = sourceByFormula.get(formula);
    if (captured) return captured;
    // KaTeX and MathJax commonly retain TeX in the accessible MathML tree.
    const annotation = formula.querySelector(
      'annotation[encoding="application/x-tex"], annotation[encoding="application/tex"], annotation[encoding="text/x-tex"]',
    );
    if (annotation) return normalizeLatex(annotation.textContent || "");

    // Some MathJax integrations expose the original source as a data attribute.
    return normalizeLatex(
      formula.getAttribute("data-tex") || formula.getAttribute("data-latex") || "",
    );
  }

  function bindCapturedSources(sources) {
    // New assistant messages are appended at the end. Bind in document order.
    const messages = [...document.querySelectorAll('[data-message-author-role="assistant"]')].reverse();
    const scopes = messages.length ? messages : [document];
    for (const scope of scopes) {
      const formulas = [...scope.querySelectorAll(".katex")]
        .filter((formula) => !sourceByFormula.has(formula));
      if (formulas.length < sources.length) continue;
      formulas.slice(-sources.length).forEach((formula, index) => {
        sourceByFormula.set(formula, sources[index]);
      });
      scan(scope);
      console.info(`[ChatGPT Formula to LaTeX] Bound ${sources.length} source formula(s).`);
      return true;
    }
    console.info(
      "[ChatGPT Formula to LaTeX] Waiting: " + sources.length +
      " captured source formula(s), " +
      document.querySelectorAll(".katex").length + " rendered formula(s).",
    );
    return false;
  }

  function bindPendingSources() {
    while (pendingSourceBatches.length && bindCapturedSources(pendingSourceBatches[0])) {
      pendingSourceBatches.shift();
    }
  }

  async function copyLatex(latex, button) {
    try {
      await navigator.clipboard.writeText(latex);
      button.textContent = "已复制";
      button.classList.add("cg-latex-copied");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = latex;
      textarea.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      button.textContent = "已复制";
      button.classList.add("cg-latex-copied");
    }
    window.setTimeout(() => {
      button.textContent = "复制 LaTeX";
      button.classList.remove("cg-latex-copied");
    }, 1200);
  }

  function addButton(formula) {
    if (formula.dataset.cgLatexReady || formula.closest("pre, code")) return;
    const latex = latexFor(formula);
    if (!latex) return;

    formula.dataset.cgLatexReady = "true";
    const isDisplay = formula.classList.contains("katex-display") ||
      formula.parentElement?.classList.contains("katex-display") ||
      formula.tagName === "MJX-CONTAINER" && formula.getAttribute("display") === "true";
    const host = isDisplay ? (formula.closest(".katex-display, mjx-container[display='true']") || formula) : formula;
    host.classList.add("cg-latex-host");

    const button = document.createElement("button");
    button.type = "button";
    button.className = "cg-latex-copy";
    button.textContent = "复制 LaTeX";
    button.title = "复制此公式的 LaTeX 源码";
    button.setAttribute("aria-label", "复制公式 LaTeX");
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      copyLatex(latex, button);
    });
    host.append(button);
  }

  function scan(root = document) {
    if (!enabled) return;
    const selector = ".katex, mjx-container[data-tex], mjx-container[data-latex], mjx-container";
    if (root.nodeType === Node.ELEMENT_NODE && root.matches?.(selector)) addButton(root);
    root.querySelectorAll?.(selector).forEach(addButton);
  }

  function start() {
    scan();
    observer?.disconnect();
    observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) scan(node);
        }
      }
      bindPendingSources();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  chrome.storage.sync.get({ [SETTINGS_KEY]: true }, (settings) => {
    enabled = settings[SETTINGS_KEY];
    if (enabled) start();
  });

  window.addEventListener(SOURCE_EVENT, (event) => {
    try {
      const sources = JSON.parse(event.detail);
      if (Array.isArray(sources) && sources.length) {
        pendingSourceBatches.push(sources);
        bindPendingSources();
        if (pendingSourceBatches.length) {
          console.info("[ChatGPT Formula to LaTeX] LaTeX source captured; waiting for matching rendered formulas.");
        }
      }
    } catch { /* Ignore malformed page events. */ }
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync" || !changes[SETTINGS_KEY]) return;
    enabled = changes[SETTINGS_KEY].newValue;
    if (enabled) start();
    else {
      observer?.disconnect();
      document.querySelectorAll(".cg-latex-copy").forEach((button) => button.remove());
      document.querySelectorAll(".cg-latex-host").forEach((host) => host.classList.remove("cg-latex-host"));
      document.querySelectorAll("[data-cg-latex-ready]").forEach((node) => delete node.dataset.cgLatexReady);
    }
  });
})();

(() => {
  const EVENT_NAME = "cg-latex-copy:sources";
  const originalFetch = window.fetch.bind(window);

  function collectStrings(value, out, depth = 0) {
    if (depth > 12 || value == null) return;
    if (typeof value === "string") {
      out.push(value);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => collectStrings(item, out, depth + 1));
      return;
    }
    if (typeof value === "object") {
      Object.values(value).forEach((item) => collectStrings(item, out, depth + 1));
    }
  }

  function formulasIn(text) {
    const formulas = [];
    const patterns = [
      /\\\[([\s\S]*?)\\\]/g,
      /\\\(([\s\S]*?)\\\)/g,
      /\$\$([\s\S]*?)\$\$/g,
      /(^|[^\\])\$([^$\n]+?)\$(?!\$)/gm,
    ];
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const latex = (match[2] ?? match[1] ?? "").trim();
        if (latex) formulas.push({ index: match.index, latex });
      }
    }
    return formulas.sort((a, b) => a.index - b.index).map((item) => item.latex);
  }

  function sourcesFromResponse(text) {
    const candidates = [];
    for (const line of text.split(/\r?\n/)) {
      if (!line.startsWith("data: ")) continue;
      try {
        const strings = [];
        collectStrings(JSON.parse(line.slice(6)), strings);
        candidates.push(...strings);
      } catch { /* Non-JSON stream frames are not conversation content. */ }
    }
    // Parsed SSE payloads contain decoded Markdown. Scanning the raw transport
    // text duplicates escaped fragments and makes formula counts unreliable.
    if (!candidates.length) candidates.push(text);
    let best = [];
    for (const candidate of candidates) {
      const formulas = formulasIn(candidate);
      if (formulas.length > best.length) best = formulas;
    }
    return best;
  }

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    const url = String(args[0] instanceof Request ? args[0].url : args[0]);
    if (!/conversation|responses|backend-api/.test(url)) return response;

    response.clone().text().then((text) => {
      const sources = sourcesFromResponse(text);
      if (sources.length) {
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: JSON.stringify(sources) }));
      }
    }).catch(() => {});
    return response;
  };
})();

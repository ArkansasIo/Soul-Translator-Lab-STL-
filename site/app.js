(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const state = { ratio: 100, worldTime: 0, realInput: 1, skills: {}, memories: [], signals: [], log: [], rngSeed: 20261014 };
  const titles = { overview: "Lab overview", simulation: "Virtual world", signals: "Signal studio", agent: "Agent memory", research: "Research library" };
  let toastTimer;

  function toast(message) {
    const node = $("#toast");
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove("show"), 2600);
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }
  function navigate(view) {
    if (!titles[view]) return;
    $$(".view").forEach(node => node.classList.toggle("active", node.id === "view-" + view));
    $$(".nav-item").forEach(node => node.classList.toggle("active", node.dataset.view === view));
    $("#page-title").textContent = titles[view];
    window.location.hash = view === "overview" ? "overview" : view;
  }
  function addLog(message) {
    const item = { message, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) };
    state.log.unshift(item);
    state.log = state.log.slice(0, 20);
    renderLog();
  }
  function renderLog() {
    const container = $("#activity-log");
    if (!state.log.length) {
      container.innerHTML = '<div class="empty-state">The session is quiet. Run a simulation or generate a signal to begin.</div>';
      return;
    }
    container.innerHTML = state.log.map(item => '<div class="activity-item"><span class="bullet"></span><div><p>' + escapeHtml(item.message) + '</p><time>' + escapeHtml(item.time) + '</time></div></div>').join("");
  }
  function renderMetrics() {
    $("#metric-time").innerHTML = state.worldTime.toFixed(1) + ' <small>sec</small>';
    $("#metric-skills").textContent = Object.keys(state.skills).length;
    $("#metric-memories").textContent = state.memories.length;
    $("#metric-samples").textContent = state.signals.length;
    $("#sim-clock").innerHTML = state.worldTime.toFixed(2) + ' <small>seconds</small>';
    $("#detail-time").textContent = state.worldTime.toFixed(2) + " s";
    $("#detail-ratio").textContent = state.ratio + "×";
    $("#ratio-label").textContent = state.ratio + "×";
    $("#ratio-output").textContent = state.ratio + "×";
    $("#detail-skills").textContent = Object.keys(state.skills).length;
    $("#detail-memories").textContent = state.memories.length;
    $("#ratio-range").value = state.ratio;
    const progress = Math.min(100, (state.worldTime % 60) / 60 * 100);
    $("#time-progress").style.width = progress + "%";
  }
  function advance(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) { toast("Enter a valid non-negative time value."); return; }
    if (seconds > 86400) { toast("Maximum input is 86,400 real seconds per action."); return; }
    state.realInput = seconds;
    const elapsed = seconds * state.ratio;
    state.worldTime += elapsed;
    renderMetrics();
    $("#real-input-label").textContent = seconds + (seconds === 1 ? " sec" : " secs");
    addLog("Advanced virtual clock by " + elapsed.toLocaleString(undefined, { maximumFractionDigits: 2 }) + " simulated seconds.");
    toast("Virtual clock advanced.");
  }
  function random() {
    // Deterministic Mulberry32-style PRNG: reproducible synthetic signals; never a sensor feed.
    state.rngSeed |= 0;
    state.rngSeed = state.rngSeed + 0x6D2B79F5 | 0;
    let t = Math.imul(state.rngSeed ^ state.rngSeed >>> 15, 1 | state.rngSeed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  function gaussian() {
    const u = Math.max(Number.EPSILON, random());
    const v = random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function sampleSignal() {
    const base = Number($("#amplitude-range").value);
    const noiseSd = Number($("#noise-range").value);
    const noise = gaussian() * noiseSd;
    const signal = { id: state.signals.length + 1, channel: $("#channel-name").value.trim() || "demo-channel", amplitude: base + noise, noise, time: new Date().toISOString() };
    state.signals.push(signal);
    state.signals = state.signals.slice(-200);
    // Keep visible sample numbering based on overall generated count even after history trimming.
    state.totalSamples = (state.totalSamples || 0) + 1;
    renderSignals();
    renderMetrics();
    addLog("Generated synthetic signal sample " + state.totalSamples + ".");
  }
  function renderSignals() {
    const list = state.signals;
    $("#sample-count").textContent = (state.totalSamples || 0) + ((state.totalSamples || 0) === 1 ? " sample" : " samples");
    if (!list.length) {
      $("#latest-value").textContent = "—"; $("#avg-value").textContent = "—";
      $("#signal-table").innerHTML = '<tr><td colspan="5" class="empty-cell">No samples yet. Generate one above.</td></tr>';
      drawChart();
      return;
    }
    const latest = list[list.length - 1];
    const mean = list.reduce((sum, item) => sum + item.amplitude, 0) / list.length;
    $("#latest-value").textContent = latest.amplitude.toFixed(3);
    $("#avg-value").textContent = mean.toFixed(3);
    $("#signal-table").innerHTML = list.slice().reverse().slice(0, 12).map(item => '<tr><td>' + item.id + '</td><td>' + escapeHtml(item.channel) + '</td><td>' + item.amplitude.toFixed(4) + '</td><td>' + item.noise.toFixed(4) + '</td><td>' + new Date(item.time).toLocaleTimeString() + '</td></tr>').join("");
    drawChart();
  }
  function drawChart() {
    const canvas = $("#signal-chart");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(280, Math.floor(rect.width || 600));
    const height = 235;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    const pad = { left: 34, right: 12, top: 17, bottom: 25 };
    const w = width - pad.left - pad.right;
    const h = height - pad.top - pad.bottom;
    const values = state.signals.slice(-60).map(s => s.amplitude);
    let min = values.length ? Math.min(...values, -0.3) : -1;
    let max = values.length ? Math.max(...values, 1.3) : 1;
    if (max - min < 0.2) { max += 0.1; min -= 0.1; }
    const y = v => pad.top + (max - v) / (max - min) * h;
    const styles = getComputedStyle(document.documentElement);
    ctx.font = "10px monospace";
    for (let i = 0; i <= 4; i++) {
      const val = min + (max - min) * i / 4;
      const yy = y(val);
      ctx.strokeStyle = "#20354a"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(width - pad.right, yy); ctx.stroke();
      ctx.fillStyle = "#788da4"; ctx.textAlign = "right"; ctx.fillText(val.toFixed(1), pad.left - 7, yy + 3);
    }
    if (values.length) {
      ctx.strokeStyle = styles.getPropertyValue("--accent").trim() || "#64d8d0";
      ctx.lineWidth = 2; ctx.beginPath();
      values.forEach((value, index) => {
        const xx = pad.left + (values.length === 1 ? w / 2 : index / (values.length - 1) * w);
        index ? ctx.lineTo(xx, y(value)) : ctx.moveTo(xx, y(value));
      });
      ctx.stroke();
      values.forEach((value, index) => {
        const xx = pad.left + (values.length === 1 ? w / 2 : index / (values.length - 1) * w);
        ctx.fillStyle = "#64d8d0"; ctx.beginPath(); ctx.arc(xx, y(value), index === values.length - 1 ? 3 : 1.8, 0, Math.PI * 2); ctx.fill();
      });
    } else {
      ctx.fillStyle = "#72879d"; ctx.textAlign = "center"; ctx.font = "12px sans-serif"; ctx.fillText("Generate a sample to plot synthetic data", width / 2, height / 2);
    }
    ctx.fillStyle = "#788da4"; ctx.textAlign = "left"; ctx.font = "10px monospace"; ctx.fillText("OLDER", pad.left, height - 7);
    ctx.textAlign = "right"; ctx.fillText("NEWER", width - pad.right, height - 7);
  }
  function renderSkills() {
    const entries = Object.entries(state.skills).sort((a, b) => b[1] - a[1]);
    $("#skill-count-label").textContent = entries.length + (entries.length === 1 ? " skill" : " skills");
    $("#skills-list").innerHTML = entries.length ? entries.map(([name, value]) => '<div class="skill-item"><strong>' + escapeHtml(name) + '</strong><small>' + value.toFixed(2) + '</small><div class="skill-progress"><span style="width:' + Math.max(0, Math.min(100, value * 100)) + '%"></span></div></div>').join("") : '<div class="empty-state">No skills learned in this session.</div>';
  }
  function renderMemories() {
    $("#memory-count-label").textContent = state.memories.length + (state.memories.length === 1 ? " entry" : " entries");
    $("#memories-list").innerHTML = state.memories.length ? state.memories.slice().reverse().map(item => '<article class="memory-item"><p>' + escapeHtml(item.text) + '</p><time>' + escapeHtml(item.time) + '</time></article>').join("") : '<div class="empty-state">No memory records yet.</div>';
  }
  function updateRangeOutputs() {
    $("#amplitude-output").textContent = Number($("#amplitude-range").value).toFixed(1);
    $("#noise-output").textContent = Number($("#noise-range").value).toFixed(2);
    $("#skill-amount-output").textContent = "+" + Number($("#skill-amount").value).toFixed(2);
    $("#ratio-output").textContent = Number($("#ratio-range").value) + "×";
  }
  function exportCsv() {
    if (!state.signals.length) { toast("Generate at least one sample before exporting."); return; }
    const rows = [["id", "channel", "amplitude", "noise", "timestamp"], ...state.signals.map(s => [s.id, s.channel, s.amplitude, s.noise, s.time])];
    const csv = rows.map(row => row.map(value => '"' + String(value).replace(/"/g, '""') + '"').join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "stl-synthetic-signals.csv"; link.click();
    URL.revokeObjectURL(url);
    toast("Synthetic sample CSV exported.");
  }
  function reset() {
    state.ratio = 100; state.worldTime = 0; state.realInput = 1; state.skills = {}; state.memories = []; state.signals = []; state.log = []; state.totalSamples = 0; state.rngSeed = 20261014;
    $("#ratio-range").value = 100; $("#amplitude-range").value = 1; $("#noise-range").value = 0.15; $("#channel-name").value = "demo-channel";
    $("#skill-name").value = ""; $("#memory-text").value = "";
    updateRangeOutputs(); renderMetrics(); renderSkills(); renderMemories(); renderSignals(); renderLog();
    $("#real-input-label").textContent = "1 sec";
    addLog("Demo state reset.");
    toast("Demo state reset.");
  }

  $$(".nav-item").forEach(button => button.addEventListener("click", () => navigate(button.dataset.view)));
  $$("[data-go]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.go)));
  $("#reset-btn").addEventListener("click", reset);
  $("#clear-log").addEventListener("click", () => { state.log = []; renderLog(); });
  $$(".advance").forEach(button => button.addEventListener("click", () => advance(Number(button.dataset.seconds))));
  $("#ratio-range").addEventListener("input", event => { state.ratio = Number(event.target.value); updateRangeOutputs(); renderMetrics(); });
  $("#advance-custom").addEventListener("click", () => advance(Number($("#custom-seconds").value)));
  $("#custom-seconds").addEventListener("keydown", event => { if (event.key === "Enter") advance(Number(event.target.value)); });
  $("#amplitude-range").addEventListener("input", updateRangeOutputs);
  $("#noise-range").addEventListener("input", updateRangeOutputs);
  $("#skill-amount").addEventListener("input", updateRangeOutputs);
  $("#sample-btn").addEventListener("click", sampleSignal);
  $("#sample-batch-btn").addEventListener("click", () => { for (let i = 0; i < 20; i++) sampleSignal(); toast("Generated 20 synthetic samples."); });
  $("#export-signals").addEventListener("click", exportCsv);
  $("#skill-form").addEventListener("submit", event => {
    event.preventDefault();
    const name = $("#skill-name").value.trim();
    if (!name) { toast("Enter a skill name."); return; }
    const amount = Number($("#skill-amount").value);
    state.skills[name] = Math.min(1, (state.skills[name] || 0) + amount);
    renderSkills(); renderMetrics(); addLog('Updated simulated skill "' + name + '" to ' + state.skills[name].toFixed(2) + ".");
    $("#skill-name").value = ""; toast("Simulated skill updated.");
  });
  $("#memory-form").addEventListener("submit", event => {
    event.preventDefault();
    const text = $("#memory-text").value.trim();
    if (!text) { toast("Enter a memory note."); return; }
    state.memories.push({ text, time: new Date().toLocaleString() });
    renderMemories(); renderMetrics(); addLog("Added a local simulated memory entry.");
    $("#memory-text").value = ""; toast("Memory entry added to the toy agent.");
  });
  window.addEventListener("resize", drawChart);
  window.addEventListener("hashchange", () => {
    const view = window.location.hash.slice(1);
    if (titles[view]) navigate(view);
  });
  updateRangeOutputs(); renderMetrics(); renderSkills(); renderMemories(); renderSignals(); renderLog();
  const initialView = window.location.hash.slice(1);
  if (titles[initialView]) navigate(initialView);
  addLog("Local lab initialized. No sensors or external services connected.");
})();
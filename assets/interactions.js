// IOTSIM Manual — shared interactive helpers
// All handlers on window so inline onclick="" works with file:// loads.

// ─── Quick / Full view ─────────────────────────────────────────
window.setView = function(v){
  document.body.classList.toggle("full-view", v === "full");
  document.querySelectorAll(".vt-btn").forEach(b =>
    b.classList.toggle("on", b.dataset.view === v));
  try{ localStorage.setItem("iotsim-view", v); }catch(e){}
};

// ─── Drawers ───────────────────────────────────────────────────
window.toggleDrawer = function(el){
  if(document.body.classList.contains("full-view")) return;
  el.parentElement.classList.toggle("open");
};

// ─── Mirror demo ───────────────────────────────────────────────
// Uses data-* attributes on .mirror-btn buttons so each page can
// drop in the same markup.
window.MIRROR_NOTES = {
  none: "<strong>None (Independent):</strong> Long and Short use completely separate configurations. You control Groups 6–16 for longs and Groups 17–27 for shorts individually. Maximum flexibility; highest setup effort.",
  s2l: "<strong>Shorts Mirror Longs:</strong> Groups 17–27 are ignored. Every long-side change (Model, Entry Level, Targets, SL, modifiers, filters) is copied to the short side automatically. Fastest way to a baseline.",
  l2s: "<strong>Longs Mirror Shorts:</strong> The short side is now the source of truth. Groups 6–16 are ignored; long settings are copied from Groups 17–27."
};
window.LONG_DEFAULT = {model:"FVG", entry:"0.34", tgt:"Auto Calc", sl:"PD Array (D=2)", buf:"ON"};
window.SHORT_DEFAULT = {model:"Order Block", entry:"0.5", tgt:"Swing H/L", sl:"Fixed Devs (1.5x)", buf:"OFF"};

window.setMirror = function(mode){
  document.querySelectorAll(".mirror-btn").forEach(b =>
    b.classList.toggle("on", b.dataset.mode === mode));
  const ls = document.getElementById("side-long"),
        ss = document.getElementById("side-short"),
        arrow = document.getElementById("mirror-arrow"),
        lb = document.getElementById("badge-long"),
        sb = document.getElementById("badge-short");
  if(!ls || !ss) return;
  ls.classList.remove("src","dst-mirrored","dst-indep");
  ss.classList.remove("src","dst-mirrored","dst-indep");
  const set = (id, v) => { const el = document.getElementById(id); if(el) el.textContent = v; };

  if(mode === "none"){
    ls.classList.add("src"); ss.classList.add("dst-indep");
    lb.textContent = "SOURCE"; sb.textContent = "INDEPENDENT";
    set("long-model",LONG_DEFAULT.model); set("long-entry",LONG_DEFAULT.entry);
    set("long-tgt",LONG_DEFAULT.tgt); set("long-sl",LONG_DEFAULT.sl); set("long-buf",LONG_DEFAULT.buf);
    set("short-model",SHORT_DEFAULT.model); set("short-entry",SHORT_DEFAULT.entry);
    set("short-tgt",SHORT_DEFAULT.tgt); set("short-sl",SHORT_DEFAULT.sl); set("short-buf",SHORT_DEFAULT.buf);
    arrow.textContent = "—"; arrow.style.opacity = "0.25";
  } else if(mode === "s2l"){
    ls.classList.add("src"); ss.classList.add("dst-mirrored");
    lb.textContent = "SOURCE"; sb.textContent = "MIRRORED ←";
    set("long-model",LONG_DEFAULT.model); set("long-entry",LONG_DEFAULT.entry);
    set("long-tgt",LONG_DEFAULT.tgt); set("long-sl",LONG_DEFAULT.sl); set("long-buf",LONG_DEFAULT.buf);
    set("short-model",LONG_DEFAULT.model); set("short-entry",LONG_DEFAULT.entry);
    set("short-tgt",LONG_DEFAULT.tgt); set("short-sl",LONG_DEFAULT.sl); set("short-buf",LONG_DEFAULT.buf);
    arrow.textContent = "→"; arrow.style.opacity = "1";
  } else if(mode === "l2s"){
    ss.classList.add("src"); ls.classList.add("dst-mirrored");
    sb.textContent = "SOURCE"; lb.textContent = "MIRRORED →";
    set("short-model",SHORT_DEFAULT.model); set("short-entry",SHORT_DEFAULT.entry);
    set("short-tgt",SHORT_DEFAULT.tgt); set("short-sl",SHORT_DEFAULT.sl); set("short-buf",SHORT_DEFAULT.buf);
    set("long-model",SHORT_DEFAULT.model); set("long-entry",SHORT_DEFAULT.entry);
    set("long-tgt",SHORT_DEFAULT.tgt); set("long-sl",SHORT_DEFAULT.sl); set("long-buf",SHORT_DEFAULT.buf);
    arrow.textContent = "←"; arrow.style.opacity = "1";
  }
  const note = document.getElementById("mirror-note");
  if(note) note.innerHTML = MIRROR_NOTES[mode];
};

// ─── Per-page ON/OFF toggles ──────────────────────────────────
// Pages register toggle text via window.TOGGLE_TEXT[key] = {ON:"...", OFF:"..."}
window.TOGGLE_TEXT = window.TOGGLE_TEXT || {};
window.setToggle = function(key, val){
  const panel = document.getElementById("toggle-panel-" + key);
  if(!panel) return;
  const btns = document.querySelectorAll('.toggle-btn[data-key="' + key + '"]');
  btns.forEach(b => b.classList.toggle("on", b.dataset.v === val));
  if(TOGGLE_TEXT[key] && TOGGLE_TEXT[key][val]){
    panel.innerHTML = TOGGLE_TEXT[key][val];
  }
  panel.classList.toggle("on-state", val === "ON");
  panel.classList.toggle("off-state", val === "OFF");
};

// ─── Per-page dropdowns ────────────────────────────────────────
// Pages register: window.DROPDOWN_DATA[key] = { <val>: {pair, expect, avoid} }
window.DROPDOWN_DATA = window.DROPDOWN_DATA || {};
window.setDropdown = function(key, val){
  const d = DROPDOWN_DATA[key] && DROPDOWN_DATA[key][val];
  if(!d) return;
  const get = id => document.getElementById(id);
  const p = get("dd-pair-" + key), e = get("dd-expect-" + key), a = get("dd-avoid-" + key);
  if(p) p.innerHTML = d.pair;
  if(e) e.innerHTML = d.expect;
  if(a) a.innerHTML = d.avoid;
};

// ─── Leverage/Margin calculator ───────────────────────────────
window.updateCalc = function(){
  const g = id => parseFloat(document.getElementById(id).value) || 0;
  const margin = g("calc-margin"), lev = g("calc-leverage"), entry = g("calc-entry");
  const contracts = g("calc-contracts"), tp = g("calc-tp"), sl = g("calc-sl");
  const bp = margin * lev;
  const pos = entry > 0 ? (bp / entry) * contracts : 0;
  const profitAtTp = tp * pos;
  const lossAtSl = sl * pos;
  const rr = sl > 0 ? tp / sl : 0;
  const fmt = v => "$" + v.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});
  const set = (id, v) => { const el = document.getElementById(id); if(el) el.textContent = v; };
  set("out-bp", fmt(bp));
  set("out-pos", pos.toFixed(4));
  set("out-tp", fmt(profitAtTp));
  set("out-sl", "−" + fmt(lossAtSl));
  set("out-rr", rr.toFixed(2));
};

// ─── Killzone/Macro timeline ──────────────────────────────────
// Draws the 24-hour session timeline and highlights zones currently
// active in the visitor's local time
window.renderKillzoneTimeline = function(containerId, zones){
  const el = document.getElementById(containerId);
  if(!el) return;
  // zones: [{name, start: "02:00", end: "05:00", color}]
  const pct = t => {
    const [h,m] = t.split(":").map(Number);
    return (h + m/60) / 24 * 100;
  };
  const now = new Date();
  const nowPct = (now.getHours() + now.getMinutes()/60) / 24 * 100;

  let html = '<div class="kz-tl-wrap">';
  html += '<div class="kz-tl-scale">';
  for(let h = 0; h <= 24; h += 3){
    html += '<div class="kz-tl-tick" style="left:'+(h/24*100)+'%"><span>'+(h===24?'00':String(h).padStart(2,'0'))+':00</span></div>';
  }
  html += '</div>';
  html += '<div class="kz-tl-rows">';
  zones.forEach((z, i) => {
    const s = pct(z.start), e = pct(z.end);
    const w = e > s ? e - s : (100 - s) + e;
    const isActive = e > s
      ? (nowPct >= s && nowPct <= e)
      : (nowPct >= s || nowPct <= e);
    html += '<div class="kz-tl-row">';
    html += '<div class="kz-tl-label">'+z.name+'</div>';
    html += '<div class="kz-tl-track">';
    if(e > s){
      html += '<div class="kz-tl-bar'+(isActive?' active':'')+'" style="left:'+s+'%;width:'+w+'%;background:'+z.color+'"><span>'+z.start+'–'+z.end+'</span></div>';
    } else {
      // wraps midnight
      html += '<div class="kz-tl-bar'+(isActive?' active':'')+'" style="left:'+s+'%;width:'+(100-s)+'%;background:'+z.color+'"><span>'+z.start+'</span></div>';
      html += '<div class="kz-tl-bar'+(isActive?' active':'')+'" style="left:0;width:'+e+'%;background:'+z.color+'"><span>'+z.end+'</span></div>';
    }
    html += '</div></div>';
  });
  html += '</div>';
  // Now marker
  html += '<div class="kz-tl-now" style="left:'+nowPct+'%"><span>Now (local)</span></div>';
  html += '</div>';
  el.innerHTML = html;
};

// ─── Alert Template builder (Group 45) ─────────────────────────
window.updateAlertTemplate = function(){
  const tpl = (document.getElementById("alert-template") || {}).value || "";
  const sample = {
    symbol: "NQ1!",
    timeframe: "5m",
    direction: "LONG",
    event: "ENTRY_HIT",
    price: "18240.50",
    id: "L-FVG-0417a"
  };
  let out = tpl;
  Object.keys(sample).forEach(k => {
    out = out.split("{" + k + "}").join(sample[k]);
  });
  const el = document.getElementById("alert-output");
  if(el) el.textContent = out || "(empty template)";
};

// ─── Search ────────────────────────────────────────────────────
let SEARCH_TIMER = null;
window.runSearchDebounced = function(q){
  clearTimeout(SEARCH_TIMER);
  SEARCH_TIMER = setTimeout(() => runSearch(q), 120);
};
window.clearSearch = function(){
  const s = document.getElementById("search");
  if(s) s.value = "";
  document.getElementById("sx").classList.remove("show");
  window.SEARCH_MODE = false;
  if(window.buildNav) window.buildNav();
};
window.escapeHtml = function(s){
  return (s||"").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
};
window.escapeRegex = function(s){
  return (s||"").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ─── Init on DOMContentLoaded ──────────────────────────────────
document.addEventListener("DOMContentLoaded", function(){
  // Restore Quick/Full view preference
  try{
    const saved = localStorage.getItem("iotsim-view");
    if(saved === "full") setView("full");
  }catch(e){}

  // Run the calculator on first load if it exists
  if(document.getElementById("calc-margin")) updateCalc();
  // Alert template likewise
  if(document.getElementById("alert-template")) updateAlertTemplate();
});

// ─── Entry Level Fibonacci visualiser (Group 6/17) ─────────────
window.FIB_DESC = {
  "0.0":   "Enters at the edge of the PD array — the shallowest valid retrace inside the structure. Fills almost every time, but produces the worst R:R because your SL is still behind the array. Use only when you're chasing fill rate over edge.",
  "0.1425": "Front Run Shallow (+0.1425). Enters just OUTSIDE the PD array, ahead of price actually touching it. Maximum fill rate but bypasses the structure entirely — you're chasing momentum rather than waiting for a retrace.",
  "0.25":  "Quarter-way into the PD array. A compromise between fill rate and entry quality — front-runs the indicator's default 0.34.",
  "0.34":  "The indicator's default. Front-runs the 0.5 mid-point of FVGs (Consequent Encroachment) and OBs (Mean Threshold) — your fill happens before price reaches the level institutional flow tends to react from. Trades a small amount of theoretical R:R for a meaningful improvement in fill rate.",
  "0.5":   "Equilibrium. The Consequent Encroachment of an FVG, the Mean Threshold of an OB. Where institutional flow most often reacts. Fills less often than 0.34 but pairs with the strongest structural reaction when it does.",
  "0.618": "ICT's textbook Optimal Trade Entry — the golden ratio retracement. Strict ICT methodology by the book. Deep enough to produce strong R:R, with the trade-off that price has to retrace meaningfully into the structure before filling.",
  "0.705": "Between 0.618 and 0.786. A patient entry often seen on deeper institutional retraces.",
  "0.786": "Deep retrace. Used when you want maximum R:R and don't mind missing most setups. High Missed Entries rate.",
  "1.0":   "The far edge of the PD array. Effectively requires price to fully mitigate the array before entering. Very low fill rate; best R:R when filled.",
  "-0.1425": "Front Run Deep (−0.1425). Enters BEYOND the far edge of the array — deeper than full mitigation. Rarely triggers but pairs with tight SL for explosive R:R."
};
window.setFibLevel = function(key, val){
  document.querySelectorAll('.fib-btn[data-fib-key="'+key+'"]').forEach(b =>
    b.classList.toggle("on", b.dataset.fibVal === val));
  const marker = document.getElementById("fib-marker-" + key);
  const lbl = document.getElementById("fib-marker-label-" + key);
  const desc = document.getElementById("fib-desc-" + key);
  const num = parseFloat(val);
  // Map -0.14 to +0.14 beyond track: clamp visually 0..1
  const pct = Math.max(0, Math.min(1, num)) * 100;
  if(marker) marker.style.left = pct + "%";
  if(lbl) lbl.textContent = val;
  if(desc) desc.textContent = FIB_DESC[val] || "";
};

// ─── SL Method selector (Group 11/22) ──────────────────────────
window.SL_METHODS = {};  // populated per-page
window.setSlMethod = function(key, method){
  document.querySelectorAll('.sl-btn[data-sl-key="'+key+'"]').forEach(b =>
    b.classList.toggle("on", b.dataset.slMethod === method));
  const d = SL_METHODS[key] && SL_METHODS[key][method];
  if(!d) return;
  const get = id => document.getElementById(id);
  const how = get("sl-how-" + key),
        why = get("sl-why-" + key),
        when = get("sl-when-" + key);
  if(how) how.innerHTML = d.how;
  if(why) why.innerHTML = d.why;
  if(when) when.innerHTML = d.when;
};

// ─── Alert placeholder inserter ────────────────────────────────
window.insertPlaceholder = function(ph){
  const ta = document.getElementById("alert-template");
  if(!ta) return;
  const start = ta.selectionStart || ta.value.length;
  const end = ta.selectionEnd || ta.value.length;
  ta.value = ta.value.substring(0, start) + "{" + ph + "}" + ta.value.substring(end);
  ta.focus();
  const pos = start + ph.length + 2;
  ta.setSelectionRange(pos, pos);
  updateAlertTemplate();
};

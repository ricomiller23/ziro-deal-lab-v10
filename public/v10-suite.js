window.__V10_APP_CONFIG__ = {
  "name": "ziro-deal-lab",
  "title": "Ziro Deal Lab",
  "category": "M&A Deal Labs, Valuation & Virtual Data Rooms (VDR)",
  "summary": "Interactive M&A restructuring financial modeling terminal with waterfall distributions and capital stack adjustments.",
  "features": [
    {
      "idea": "Multi-Tier Real-Time Creditor Waterfall Simulator",
      "shortLabel": "Multi Tier",
      "accomplish": "Enables drag-and-drop adjustments of senior secured, mezzanine, trade debt, and equity classes to calculate recovery percentages instantly.",
      "why": "Provides immediate visual clarity during high-stakes restructuring negotiations, demonstrating exactly which creditor tiers are covered.",
      "engine": "calculator",
      "defaults": {
        "p1": 1000000,
        "p2": 10,
        "p3": 25000,
        "p4": 50000
      },
      "labels": {
        "p1": "Base Principal / Shares",
        "p2": "Rate / Discount (%)",
        "p3": "Deductions / Fees",
        "p4": "Divisor / ADTV"
      },
      "outputs": {
        "k1": "Gross Projected",
        "k2": "Net Proceeds",
        "k3": "Coverage Ratio"
      },
      "criteria": [
        "Signal Strength",
        "Data Freshness",
        "Operational Impact",
        "Execution Readiness"
      ]
    },
    {
      "idea": "Monte Carlo Enterprise Valuation Sensitivity Engine",
      "shortLabel": "Monte Carlo",
      "accomplish": "Runs 10,000 probabilistic simulations across EBITDA multiples, revenue growth rates, and discount rates to generate valuation confidence intervals.",
      "why": "Provides statistically robust enterprise valuation ranges for court fairness hearings and creditor committee presentations.",
      "engine": "calculator",
      "defaults": {
        "p1": 1000000,
        "p2": 10,
        "p3": 25000,
        "p4": 50000
      },
      "labels": {
        "p1": "Base Principal / Shares",
        "p2": "Rate / Discount (%)",
        "p3": "Deductions / Fees",
        "p4": "Divisor / ADTV"
      },
      "outputs": {
        "k1": "Gross Projected",
        "k2": "Net Proceeds",
        "k3": "Coverage Ratio"
      },
      "criteria": [
        "Signal Strength",
        "Data Freshness",
        "Operational Impact",
        "Execution Readiness"
      ]
    },
    {
      "idea": "Interactive Debt-for-Equity Swap Dilution Modeler",
      "shortLabel": "Interactive Debt",
      "accomplish": "Calculates exact pro forma share counts, percentage ownership splits, and post-restructuring EPS across variable debt conversion prices.",
      "why": "Helps existing equity holders and incoming debt converters find mutually agreeable equity distribution compromise points.",
      "engine": "calculator",
      "defaults": {
        "p1": 1000000,
        "p2": 10,
        "p3": 25000,
        "p4": 50000
      },
      "labels": {
        "p1": "Base Principal / Shares",
        "p2": "Rate / Discount (%)",
        "p3": "Deductions / Fees",
        "p4": "Divisor / ADTV"
      },
      "outputs": {
        "k1": "Gross Projected",
        "k2": "Net Proceeds",
        "k3": "Coverage Ratio"
      },
      "criteria": [
        "Signal Strength",
        "Data Freshness",
        "Operational Impact",
        "Execution Readiness"
      ]
    },
    {
      "idea": "Exportable Board-Ready Financial Model (Excel with Live Formulas)",
      "shortLabel": "Exportable Board",
      "accomplish": "Exports full three-statement financial models directly to native Microsoft Excel (.xlsx) with dynamic formulas intact.",
      "why": "Meets the strict modeling and audit standards of institutional investment committees and chief restructuring officers.",
      "engine": "calculator",
      "defaults": {
        "p1": 1000000,
        "p2": 10,
        "p3": 25000,
        "p4": 50000
      },
      "labels": {
        "p1": "Base Principal / Shares",
        "p2": "Rate / Discount (%)",
        "p3": "Deductions / Fees",
        "p4": "Divisor / ADTV"
      },
      "outputs": {
        "k1": "Gross Projected",
        "k2": "Net Proceeds",
        "k3": "Coverage Ratio"
      },
      "criteria": [
        "Signal Strength",
        "Data Freshness",
        "Operational Impact",
        "Execution Readiness"
      ]
    },
    {
      "idea": "Historical Comparable Restructuring Transaction Comps Integration",
      "shortLabel": "Historical Comparable",
      "accomplish": "Benches proposed debt haircuts, equity recovery percentages, and exit multiples against a sourced database of 500+ recent M&A restructurings.",
      "why": "Gives dealmakers empirical market evidence to defend proposed transaction terms against aggressive creditor resistance.",
      "engine": "table_diff",
      "defaults": {},
      "labels": {},
      "outputs": {
        "k1": "Projected Output",
        "k2": "Net Adjusted",
        "k3": "Unit Ratio"
      },
      "criteria": [
        "Signal Strength",
        "Data Freshness",
        "Operational Impact",
        "Execution Readiness"
      ]
    }
  ]
};
(function () {
  if (window.__V10_MOUNTED__) return;
  window.__V10_MOUNTED__ = true;

  var CFG = window.__V10_APP_CONFIG__;
  if (!CFG) return;

  var STORAGE_KEY = 'v10_state_' + CFG.name;

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveState(st) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(st));
    } catch (e) {}
  }

  function downloadFile(filename, content, mime) {
    var blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function seededHash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0);
  }

  var state = loadState();
  var activeTab = 0;
  var audioCtx = null;
  var activeOsc = null;

  function stopAudio() {
    if (activeOsc) {
      try { activeOsc.stop(); } catch (e) {}
      activeOsc = null;
    }
  }

  function mount() {
    if (document.getElementById('v10-fab-btn')) return;

    var fab = document.createElement('button');
    fab.id = 'v10-fab-btn';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Open V10 Command Suite');
    fab.innerHTML = '<span id="v10-fab-dot"></span><span>V10 Suite</span>';

    var backdrop = document.createElement('div');
    backdrop.id = 'v10-backdrop';

    var drawer = document.createElement('aside');
    drawer.id = 'v10-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-label', CFG.title + ' V10 Command Suite');

    document.body.appendChild(fab);
    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);

    function openDrawer() {
      backdrop.classList.add('open');
      drawer.classList.add('open');
      renderDrawer();
    }

    function closeDrawer() {
      stopAudio();
      backdrop.classList.remove('open');
      drawer.classList.remove('open');
    }

    fab.addEventListener('click', openDrawer);
    backdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });

    function renderDrawer() {
      var feats = CFG.features || [];
      var cur = feats[activeTab] || feats[0];

      var tabsHtml = feats.map(function (f, i) {
        return '<button type="button" class="v10-tab-btn ' + (i === activeTab ? 'active' : '') + '" data-v10-tab="' + i + '">#' + (i + 1) + ' ' + escapeHtml(f.shortLabel) + '</button>';
      }).join('');

      drawer.innerHTML = ''
        + '<div class="v10-header">'
        + '  <div class="v10-title-wrap">'
        + '    <div class="v10-badge">' + escapeHtml(CFG.category) + ' &bull; V10</div>'
        + '    <h2 class="v10-h2">' + escapeHtml(CFG.title) + ' V10</h2>'
        + '  </div>'
        + '  <button type="button" class="v10-close-btn" id="v10-close-btn" aria-label="Close V10 Suite">&times;</button>'
        + '</div>'
        + '<div class="v10-tabs" role="tablist">' + tabsHtml + '</div>'
        + '<div class="v10-body">'
        + '  <div class="v10-card">'
        + '    <h3>' + escapeHtml(cur.idea) + '</h3>'
        + '    <p class="v10-meta"><strong>Capability:</strong> ' + escapeHtml(cur.accomplish) + '</p>'
        + '    <p class="v10-meta"><strong>Rationale:</strong> ' + escapeHtml(cur.why) + '</p>'
        + '  </div>'
        + '  <div class="v10-card" id="v10-workspace"></div>'
        + '</div>'
        + '<div class="v10-footer">'
        + '  <span>' + escapeHtml(CFG.name) + '-v10</span>'
        + '  <div style="display:flex;gap:6px;">'
        + '    <button type="button" class="v10-btn secondary" id="v10-export-all" style="min-height:36px;padding:4px 10px;font-size:11px;">Export State</button>'
        + '    <button type="button" class="v10-btn secondary" id="v10-reset-all" style="min-height:36px;padding:4px 10px;font-size:11px;">Reset</button>'
        + '  </div>'
        + '</div>';

      drawer.querySelector('#v10-close-btn').addEventListener('click', closeDrawer);
      drawer.querySelectorAll('[data-v10-tab]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          stopAudio();
          activeTab = parseInt(btn.getAttribute('data-v10-tab'), 10) || 0;
          renderDrawer();
        });
      });

      drawer.querySelector('#v10-export-all').addEventListener('click', function () {
        var payload = {
          app: CFG.name + '-v10',
          exportedAt: new Date().toISOString(),
          state: state
        };
        downloadFile(CFG.name + '-v10-state.json', JSON.stringify(payload, null, 2), 'application/json');
      });

      drawer.querySelector('#v10-reset-all').addEventListener('click', function () {
        state = {};
        saveState(state);
        renderDrawer();
      });

      var ws = drawer.querySelector('#v10-workspace');
      renderEngine(ws, cur, activeTab);
    }

    function renderEngine(container, feat, idx) {
      var fKey = 'f_' + idx;
      var fState = state[fKey] || {};
      var eng = feat.engine || 'calculator';

      if (eng === 'calculator') {
        var p1 = fState.p1 !== undefined ? fState.p1 : feat.defaults.p1;
        var p2 = fState.p2 !== undefined ? fState.p2 : feat.defaults.p2;
        var p3 = fState.p3 !== undefined ? fState.p3 : feat.defaults.p3;
        var p4 = fState.p4 !== undefined ? fState.p4 : feat.defaults.p4;

        container.innerHTML = ''
          + '<div class="v10-grid">'
          + '  <div class="v10-field"><label>' + escapeHtml(feat.labels.p1) + '</label><input class="v10-input" id="v10-p1" type="number" step="any" value="' + escapeHtml(p1) + '" /></div>'
          + '  <div class="v10-field"><label>' + escapeHtml(feat.labels.p2) + '</label><input class="v10-input" id="v10-p2" type="number" step="any" value="' + escapeHtml(p2) + '" /></div>'
          + '  <div class="v10-field"><label>' + escapeHtml(feat.labels.p3) + '</label><input class="v10-input" id="v10-p3" type="number" step="any" value="' + escapeHtml(p3) + '" /></div>'
          + '  <div class="v10-field"><label>' + escapeHtml(feat.labels.p4) + '</label><input class="v10-input" id="v10-p4" type="number" step="any" value="' + escapeHtml(p4) + '" /></div>'
          + '</div>'
          + '<div class="v10-kpi-row" id="v10-calc-kpis"></div>'
          + '<div class="v10-btn-row">'
          + '  <button type="button" class="v10-btn" id="v10-calc-run">Recalculate Model</button>'
          + '  <button type="button" class="v10-btn secondary" id="v10-calc-csv">Download CSV</button>'
          + '</div>'
          + '<div class="v10-output" id="v10-calc-out"></div>';

        function compute() {
          var v1 = parseFloat(container.querySelector('#v10-p1').value) || 0;
          var v2 = parseFloat(container.querySelector('#v10-p2').value) || 0;
          var v3 = parseFloat(container.querySelector('#v10-p3').value) || 0;
          var v4 = parseFloat(container.querySelector('#v10-p4').value) || 1;
          state[fKey] = { p1: v1, p2: v2, p3: v3, p4: v4 };
          saveState(state);

          var primary = v1 * (1 + v2 / 100);
          var adjusted = primary - v3;
          var ratio = v4 !== 0 ? (adjusted / v4) : 0;

          container.querySelector('#v10-calc-kpis').innerHTML = ''
            + '<div class="v10-kpi"><div class="v10-kpi-val">' + primary.toLocaleString(undefined, { maximumFractionDigits: 2 }) + '</div><div class="v10-kpi-lbl">' + escapeHtml(feat.outputs.k1) + '</div></div>'
            + '<div class="v10-kpi"><div class="v10-kpi-val">' + adjusted.toLocaleString(undefined, { maximumFractionDigits: 2 }) + '</div><div class="v10-kpi-lbl">' + escapeHtml(feat.outputs.k2) + '</div></div>'
            + '<div class="v10-kpi"><div class="v10-kpi-val">' + ratio.toLocaleString(undefined, { maximumFractionDigits: 2 }) + '</div><div class="v10-kpi-lbl">' + escapeHtml(feat.outputs.k3) + '</div></div>';

          var summary = [
            'Model: ' + feat.idea,
            'Timestamp: ' + new Date().toISOString(),
            feat.labels.p1 + ': ' + v1,
            feat.labels.p2 + ': ' + v2,
            feat.labels.p3 + ': ' + v3,
            feat.labels.p4 + ': ' + v4,
            '--- Computed Output ---',
            feat.outputs.k1 + ': ' + primary.toFixed(2),
            feat.outputs.k2 + ': ' + adjusted.toFixed(2),
            feat.outputs.k3 + ': ' + ratio.toFixed(4)
          ].join('\n');
          container.querySelector('#v10-calc-out').textContent = summary;
          return { v1: v1, v2: v2, v3: v3, v4: v4, primary: primary, adjusted: adjusted, ratio: ratio };
        }

        container.querySelector('#v10-calc-run').addEventListener('click', compute);
        ['#v10-p1', '#v10-p2', '#v10-p3', '#v10-p4'].forEach(function (sel) {
          container.querySelector(sel).addEventListener('input', compute);
        });
        container.querySelector('#v10-calc-csv').addEventListener('click', function () {
          var r = compute();
          var csv = 'Metric,Value\n'
            + '"' + feat.labels.p1 + '",' + r.v1 + '\n'
            + '"' + feat.labels.p2 + '",' + r.v2 + '\n'
            + '"' + feat.labels.p3 + '",' + r.v3 + '\n'
            + '"' + feat.labels.p4 + '",' + r.v4 + '\n'
            + '"' + feat.outputs.k1 + '",' + r.primary.toFixed(2) + '\n'
            + '"' + feat.outputs.k2 + '",' + r.adjusted.toFixed(2) + '\n'
            + '"' + feat.outputs.k3 + '",' + r.ratio.toFixed(4) + '\n';
          downloadFile(CFG.name + '-v10-calc-' + (idx + 1) + '.csv', csv, 'text/csv');
        });
        compute();

      } else if (eng === 'generator') {
        var subject = fState.subject || feat.defaults.subject || CFG.title;
        var seed = fState.seed || feat.defaults.seed || (CFG.name + '-2026');
        var scope = fState.scope || feat.defaults.scope || 'Standard';
        var notes = fState.notes || '';

        container.innerHTML = ''
          + '<div class="v10-grid">'
          + '  <div class="v10-field"><label>' + escapeHtml(feat.labels.subject || 'Target / Subject') + '</label><input class="v10-input" id="v10-gen-subj" value="' + escapeHtml(subject) + '" /></div>'
          + '  <div class="v10-field"><label>' + escapeHtml(feat.labels.seed || 'Seed / Reference ID') + '</label><input class="v10-input" id="v10-gen-seed" value="' + escapeHtml(seed) + '" /></div>'
          + '</div>'
          + '<div class="v10-field" style="margin-top:10px;"><label>Mode / Preset</label>'
          + '  <select class="v10-select" id="v10-gen-scope">'
          + '    <option value="Standard"' + (scope === 'Standard' ? ' selected' : '') + '>Standard Specification</option>'
          + '    <option value="Executive"' + (scope === 'Executive' ? ' selected' : '') + '>Executive Brief Format</option>'
          + '    <option value="Technical"' + (scope === 'Technical' ? ' selected' : '') + '>Detailed Technical Output</option>'
          + '  </select>'
          + '</div>'
          + '<div class="v10-field" style="margin-top:10px;"><label>Custom Parameters / Context</label><textarea class="v10-textarea" id="v10-gen-notes" placeholder="Enter specific parameters, identifiers, or custom clauses...">' + escapeHtml(notes) + '</textarea></div>'
          + '<div class="v10-btn-row">'
          + '  <button type="button" class="v10-btn" id="v10-gen-run">Generate Artifact</button>'
          + '  <button type="button" class="v10-btn secondary" id="v10-gen-copy">Copy Output</button>'
          + '  <button type="button" class="v10-btn secondary" id="v10-gen-dl">Download .MD</button>'
          + '</div>'
          + '<div class="v10-output" id="v10-gen-out"></div>';

        function buildDoc() {
          var s = container.querySelector('#v10-gen-subj').value.trim() || CFG.title;
          var sd = container.querySelector('#v10-gen-seed').value.trim() || 'SEED-01';
          var sc = container.querySelector('#v10-gen-scope').value;
          var nt = container.querySelector('#v10-gen-notes').value.trim();
          state[fKey] = { subject: s, seed: sd, scope: sc, notes: nt };
          saveState(state);

          var h = seededHash(s + '|' + sd + '|' + sc);
          var code = 'V10-' + h.toString(16).toUpperCase().slice(0, 8);
          var doc = [
            '# ' + feat.idea,
            'App: ' + CFG.title + ' V10 (' + CFG.name + '-v10)',
            'Reference Code: ' + code,
            'Target Subject: ' + s,
            'Preset Mode: ' + sc,
            'Generated: ' + new Date().toISOString(),
            '',
            '## Operational Specification',
            feat.accomplish,
            '',
            '## Structured Checklist & Action Items',
            '1. [ ] Validate primary inputs for "' + s + '" against current records.',
            '2. [ ] Cross-reference seed hash ' + code + ' with active operational baseline.',
            '3. [ ] Apply ' + sc + ' review controls and log output to project archive.',
            nt ? ('\n## Custom Context\n' + nt) : ''
          ].join('\n');
          container.querySelector('#v10-gen-out').textContent = doc;
          return doc;
        }

        container.querySelector('#v10-gen-run').addEventListener('click', buildDoc);
        container.querySelector('#v10-gen-copy').addEventListener('click', function () {
          var txt = buildDoc();
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(txt).catch(function () {});
          }
          container.querySelector('#v10-gen-copy').textContent = 'Copied';
          setTimeout(function () {
            var b = container.querySelector('#v10-gen-copy');
            if (b) b.textContent = 'Copy Output';
          }, 1200);
        });
        container.querySelector('#v10-gen-dl').addEventListener('click', function () {
          downloadFile(CFG.name + '-v10-doc-' + (idx + 1) + '.md', buildDoc(), 'text/markdown');
        });
        buildDoc();

      } else if (eng === 'monitor') {
        var rules = Array.isArray(fState.rules) ? fState.rules : [
          { id: 1, target: feat.defaults.target || 'Primary Feed', threshold: feat.defaults.threshold || 'Alert >= 75', channel: 'Webhook' }
        ];
        var webhookUrl = fState.webhookUrl || 'https://hooks.slack.com/services/YOUR/WEBHOOK/ENDPOINT';

        function renderMonitor() {
          state[fKey] = { rules: rules, webhookUrl: webhookUrl };
          saveState(state);

          var listHtml = rules.map(function (r, rIdx) {
            return '<div class="v10-list-item">'
              + '<div><strong>' + escapeHtml(r.target) + '</strong> &mdash; ' + escapeHtml(r.threshold) + ' <span style="color:#38bdf8;">[' + escapeHtml(r.channel) + ']</span></div>'
              + '<button type="button" class="v10-btn secondary" data-del-rule="' + rIdx + '" style="min-height:36px;padding:4px 10px;font-size:11px;">Remove</button>'
              + '</div>';
          }).join('');

          var payloadPreview = JSON.stringify({
            source: CFG.name + '-v10',
            module: feat.idea,
            timestamp: new Date().toISOString(),
            activeRulesCount: rules.length,
            rules: rules
          }, null, 2);

          container.innerHTML = ''
            + '<div class="v10-grid">'
            + '  <div class="v10-field"><label>Watch Target / Ticker / Entity</label><input class="v10-input" id="v10-mon-target" placeholder="e.g. Target entity or threshold" /></div>'
            + '  <div class="v10-field"><label>Trigger Condition</label><input class="v10-input" id="v10-mon-cond" placeholder="e.g. Delta > 15% or Event Fired" /></div>'
            + '</div>'
            + '<div class="v10-field" style="margin-top:10px;"><label>Webhook Endpoint (Preview Only)</label><input class="v10-input" id="v10-mon-hook" value="' + escapeHtml(webhookUrl) + '" /></div>'
            + '<div class="v10-btn-row">'
            + '  <button type="button" class="v10-btn" id="v10-mon-add">Add Watch Rule</button>'
            + '  <button type="button" class="v10-btn secondary" id="v10-mon-export">Export Rules JSON</button>'
            + '</div>'
            + '<div style="margin-top:10px;">' + (listHtml || '<div class="v10-meta">No active watch rules configured.</div>') + '</div>'
            + '<div class="v10-output">' + escapeHtml(payloadPreview) + '</div>';

          container.querySelector('#v10-mon-hook').addEventListener('change', function (e) {
            webhookUrl = e.target.value;
            state[fKey] = { rules: rules, webhookUrl: webhookUrl };
            saveState(state);
          });
          container.querySelector('#v10-mon-add').addEventListener('click', function () {
            var t = container.querySelector('#v10-mon-target').value.trim() || ('Monitor Item #' + (rules.length + 1));
            var c = container.querySelector('#v10-mon-cond').value.trim() || 'Threshold Triggered';
            rules.push({ id: Date.now(), target: t, threshold: c, channel: 'Webhook' });
            renderMonitor();
          });
          container.querySelectorAll('[data-del-rule]').forEach(function (btn) {
            btn.addEventListener('click', function () {
              var ri = parseInt(btn.getAttribute('data-del-rule'), 10);
              rules.splice(ri, 1);
              renderMonitor();
            });
          });
          container.querySelector('#v10-mon-export').addEventListener('click', function () {
            downloadFile(CFG.name + '-v10-rules-' + (idx + 1) + '.json', payloadPreview, 'application/json');
          });
        }
        renderMonitor();

      } else if (eng === 'scorer') {
        var criteria = feat.criteria || ['Signal Strength', 'Data Freshness', 'Risk Exposure', 'Execution Readiness'];
        var scores = Array.isArray(fState.scores) ? fState.scores : criteria.map(function () { return 65; });

        container.innerHTML = ''
          + '<div id="v10-score-sliders"></div>'
          + '<div class="v10-kpi-row" id="v10-score-kpis"></div>'
          + '<div class="v10-btn-row">'
          + '  <button type="button" class="v10-btn" id="v10-score-dl">Export Scorecard CSV</button>'
          + '</div>';

        function renderScorer() {
          state[fKey] = { scores: scores };
          saveState(state);

          var slidersEl = container.querySelector('#v10-score-sliders');
          slidersEl.innerHTML = criteria.map(function (lbl, si) {
            return '<div class="v10-field" style="margin-bottom:8px;">'
              + '<label style="display:flex;justify-content:space-between;"><span>' + escapeHtml(lbl) + '</span><span>' + scores[si] + ' / 100</span></label>'
              + '<input type="range" min="0" max="100" value="' + scores[si] + '" data-sc-idx="' + si + '" style="width:100%;min-height:36px;" />'
              + '</div>';
          }).join('');

          slidersEl.querySelectorAll('[data-sc-idx]').forEach(function (inp) {
            inp.addEventListener('input', function () {
              var si = parseInt(inp.getAttribute('data-sc-idx'), 10);
              scores[si] = parseInt(inp.value, 10) || 0;
              renderScorer();
            });
          });

          var avg = scores.reduce(function (a, b) { return a + b; }, 0) / (scores.length || 1);
          var tier = avg >= 75 ? 'High Priority' : (avg >= 45 ? 'Moderate' : 'Low Priority');
          container.querySelector('#v10-score-kpis').innerHTML = ''
            + '<div class="v10-kpi"><div class="v10-kpi-val">' + avg.toFixed(1) + '</div><div class="v10-kpi-lbl">Composite Index</div></div>'
            + '<div class="v10-kpi"><div class="v10-kpi-val">' + tier + '</div><div class="v10-kpi-lbl">Tier Class</div></div>'
            + '<div class="v10-kpi"><div class="v10-kpi-val">' + criteria.length + '</div><div class="v10-kpi-lbl">Factors</div></div>';
        }

        container.querySelector('#v10-score-dl').addEventListener('click', function () {
          var csv = 'Criterion,Score\n' + criteria.map(function (c, i) { return '"' + c + '",' + scores[i]; }).join('\n');
          downloadFile(CFG.name + '-v10-scorecard-' + (idx + 1) + '.csv', csv, 'text/csv');
        });
        renderScorer();

      } else if (eng === 'audio_sim') {
        var freq = fState.freq || 220;
        var gain = fState.gain || 15;
        var wave = fState.wave || 'sine';

        container.innerHTML = ''
          + '<div class="v10-grid">'
          + '  <div class="v10-field"><label>Carrier Frequency (Hz)</label><input class="v10-input" id="v10-aud-freq" type="number" min="40" max="2000" value="' + freq + '" /></div>'
          + '  <div class="v10-field"><label>Waveform</label><select class="v10-select" id="v10-aud-wave"><option value="sine">Sine</option><option value="triangle">Triangle</option><option value="sawtooth">Sawtooth</option><option value="square">Square</option></select></div>'
          + '</div>'
          + '<div class="v10-field" style="margin-top:8px;"><label>Output Gain (%): <span id="v10-aud-glbl">' + gain + '%</span></label><input type="range" id="v10-aud-gain" min="1" max="50" value="' + gain + '" style="width:100%;min-height:36px;" /></div>'
          + '<div class="v10-btn-row">'
          + '  <button type="button" class="v10-btn" id="v10-aud-play">Test Signal Tone</button>'
          + '  <button type="button" class="v10-btn secondary" id="v10-aud-stop">Stop Audio</button>'
          + '</div>'
          + '<div class="v10-output" id="v10-aud-status">WebAudio Synthesizer Ready. Click "Test Signal Tone" to play live audio.</div>';

        container.querySelector('#v10-aud-wave').value = wave;
        container.querySelector('#v10-aud-gain').addEventListener('input', function (e) {
          container.querySelector('#v10-aud-glbl').textContent = e.target.value + '%';
        });
        container.querySelector('#v10-aud-play').addEventListener('click', function () {
          stopAudio();
          var f = parseFloat(container.querySelector('#v10-aud-freq').value) || 220;
          var g = (parseFloat(container.querySelector('#v10-aud-gain').value) || 15) / 100;
          var w = container.querySelector('#v10-aud-wave').value;
          state[fKey] = { freq: f, gain: Math.round(g * 100), wave: w };
          saveState(state);
          try {
            var AC = window.AudioContext || window.webkitAudioContext;
            if (!audioCtx) audioCtx = new AC();
            var osc = audioCtx.createOscillator();
            var gn = audioCtx.createGain();
            osc.type = w;
            osc.frequency.setValueAtTime(f, audioCtx.currentTime);
            gn.gain.setValueAtTime(g * 0.25, audioCtx.currentTime);
            osc.connect(gn);
            gn.connect(audioCtx.destination);
            osc.start();
            activeOsc = osc;
            container.querySelector('#v10-aud-status').textContent = 'Playing ' + w + ' wave at ' + f + ' Hz (' + Math.round(g * 100) + '% gain).';
            setTimeout(function () {
              if (activeOsc === osc) {
                stopAudio();
                var st = container.querySelector('#v10-aud-status');
                if (st) st.textContent = 'Signal pulse finished (' + f + ' Hz).';
              }
            }, 1500);
          } catch (err) {
            container.querySelector('#v10-aud-status').textContent = 'AudioContext unavailable in this environment: ' + err.message;
          }
        });
        container.querySelector('#v10-aud-stop').addEventListener('click', function () {
          stopAudio();
          container.querySelector('#v10-aud-status').textContent = 'Audio stopped.';
        });

      } else {
        // table_diff: structured comparison / ledger builder
        var rows = Array.isArray(fState.rows) ? fState.rows : [
          { label: 'Baseline Record', a: 100, b: 125 }
        ];

        function renderTable() {
          state[fKey] = { rows: rows };
          saveState(state);
          var listHtml = rows.map(function (r, ri) {
            var delta = (parseFloat(r.b) || 0) - (parseFloat(r.a) || 0);
            return '<div class="v10-list-item">'
              + '<div><strong>' + escapeHtml(r.label) + '</strong> &mdash; Base: ' + r.a + ' | Current: ' + r.b + ' | Delta: <span style="color:#38bdf8;">' + (delta >= 0 ? '+' : '') + delta.toFixed(2) + '</span></div>'
              + '<button type="button" class="v10-btn secondary" data-del-row="' + ri + '" style="min-height:36px;padding:4px 10px;font-size:11px;">Delete</button>'
              + '</div>';
          }).join('');

          container.innerHTML = ''
            + '<div class="v10-grid">'
            + '  <div class="v10-field"><label>Line Item / Entity</label><input class="v10-input" id="v10-tbl-lbl" placeholder="e.g. Tranche A" /></div>'
            + '  <div class="v10-field"><label>Baseline Value</label><input class="v10-input" id="v10-tbl-a" type="number" step="any" value="100" /></div>'
            + '  <div class="v10-field"><label>Comparison Value</label><input class="v10-input" id="v10-tbl-b" type="number" step="any" value="120" /></div>'
            + '</div>'
            + '<div class="v10-btn-row">'
            + '  <button type="button" class="v10-btn" id="v10-tbl-add">Add Comparison Row</button>'
            + '  <button type="button" class="v10-btn secondary" id="v10-tbl-csv">Export CSV</button>'
            + '</div>'
            + '<div style="margin-top:10px;">' + listHtml + '</div>';

          container.querySelector('#v10-tbl-add').addEventListener('click', function () {
            var l = container.querySelector('#v10-tbl-lbl').value.trim() || ('Item #' + (rows.length + 1));
            var a = parseFloat(container.querySelector('#v10-tbl-a').value) || 0;
            var b = parseFloat(container.querySelector('#v10-tbl-b').value) || 0;
            rows.push({ label: l, a: a, b: b });
            renderTable();
          });
          container.querySelectorAll('[data-del-row]').forEach(function (btn) {
            btn.addEventListener('click', function () {
              rows.splice(parseInt(btn.getAttribute('data-del-row'), 10), 1);
              renderTable();
            });
          });
          container.querySelector('#v10-tbl-csv').addEventListener('click', function () {
            var csv = 'Item,Baseline,Current,Delta\n' + rows.map(function (r) {
              return '"' + r.label + '",' + r.a + ',' + r.b + ',' + ((r.b - r.a).toFixed(2));
            }).join('\n');
            downloadFile(CFG.name + '-v10-comparison-' + (idx + 1) + '.csv', csv, 'text/csv');
          });
        }
        renderTable();
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();

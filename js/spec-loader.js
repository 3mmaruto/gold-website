async function runSpecsLoader() {
    try {
      const res = await fetch('docs/main_product.txt', { cache: 'no-store' });
      // Try native UTF-8 first (file is now UTF-8). If it looks bad, fall back to manual decoding.
      let text = '';
      try { text = (await res.text()).replace(/^\uFEFF/, ''); } catch(_) { text = ''; }
      const looksArabic = (s) => (s.match(/[\u0600-\u06FF]/g) || []).length;
      const looksMojibake = (s) => (s.match(/[ØÙÃÂâ€]/g) || []).length;
      let needManual = false;
      if (!text || looksMojibake(text) > 10 && looksArabic(text) < looksMojibake(text)) {
        needManual = true;
      }
      let bytes = null;
      if (needManual) {
        const buffer = await res.arrayBuffer();
        bytes = new Uint8Array(buffer);
      }

      // If manual decoding not needed, skip the rest of decoding heuristics
      if (!needManual) {
        console.log('[spec-loader] using native UTF-8 via res.text()');
      } else {
        // Check for BOM to prefer exact decoding
        const hasUTF16LEBOM = bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xFE;
        const hasUTF16BEBOM = bytes.length >= 2 && bytes[0] === 0xFE && bytes[1] === 0xFF;
        const hasUTF8BOM    = bytes.length >= 3 && bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF;

      function scoreArabic(s) {
        // Positive: number of Arabic letters
        const arabicMatches = s.match(/[\u0600-\u06FF]/g);
        const arabicCount = arabicMatches ? arabicMatches.length : 0;
        // Negative: common mojibake markers when Arabic was decoded with wrong charset
        const mojibakeMarkers = /[ØÙÃÂâ€]/g; // includes Ø Ù Ã Â â € and curly apostrophe variants
        const badMatches = s.match(mojibakeMarkers);
        const badCount = badMatches ? badMatches.length * 5 : 0; // strong penalty
        // Small bonus if text has Arabic punctuation/diacritics
        const punct = s.match(/[\u061B\u061F\u0640\u064B-\u0652]/g);
        const punctCount = punct ? punct.length : 0;
        return arabicCount + punctCount - badCount;
      }

      function tryDecode(encoding) {
        try {
          return new TextDecoder(encoding, { fatal: false }).decode(bytes);
        } catch (_) {
          return null;
        }
      }

        let candidates = ['utf-8', 'windows-1256', 'utf-16le', 'utf-16be', 'windows-1252', 'iso-8859-1'];
        if (hasUTF16LEBOM) candidates = ['utf-16le', ...candidates];
        if (hasUTF16BEBOM) candidates = ['utf-16be', ...candidates];
        if (hasUTF8BOM)    candidates = ['utf-8', ...candidates];
        let bestText = '';
        let bestScore = -1;
        let chosen = '';

        // 1) Try strict UTF-8 first; if it works, lock it in to avoid accidental overrides.
        let strictUtf8 = null;
        try { strictUtf8 = new TextDecoder('utf-8', { fatal: true }).decode(bytes); } catch(_) { strictUtf8 = null; }
        if (strictUtf8) {
          const s = scoreArabic(strictUtf8);
          bestText = strictUtf8; bestScore = s; chosen = 'utf-8(strict)';
        } else {
          // 2) Evaluate candidates only if strict UTF-8 failed
          for (const enc of candidates) {
            const t = tryDecode(enc);
            if (t != null) {
              const s = scoreArabic(t);
              if (s > bestScore) { bestScore = s; bestText = t; chosen = enc; }
            }
          }
        }
        text = (bestText || '').replace(/^\uFEFF/, '');
        console.log('[spec-loader] chosen encoding:', chosen, 'score:', bestScore);

        // If strict UTF-8 failed and we used a fallback, only then consider repair
        if (chosen !== 'utf-8(strict)') {
          (function maybeRepairMojibake(){
            const arabicCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
            const mojibakeCount = (text.match(/[ØÙÃÂâ€]/g) || []).length;
            if (mojibakeCount > 10 && arabicCount < mojibakeCount) {
              const cp1252Bytes = new Uint8Array(text.length);
              for (let i = 0; i < text.length; i++) {
                cp1252Bytes[i] = text.charCodeAt(i) & 0xFF;
              }
              try {
                const repaired = new TextDecoder('utf-8', { fatal: false }).decode(cp1252Bytes);
                const repairedArabic = (repaired.match(/[\u0600-\u06FF]/g) || []).length;
                if (repairedArabic > arabicCount) {
                  text = repaired.replace(/^\uFEFF/, '');
                  console.log('[spec-loader] applied mojibake repair (cp1252->utf8)');
                }
              } catch(_) { /* ignore */ }
            }
          })();
        }
      }

      const lines = text.split(/\r?\n/);
      const startIdx = lines.findIndex(l => l.trim().startsWith('مواصفات الجهاز'));
      const dividerIdx = lines.findIndex(l => l.trim().startsWith('////////////////////////////////'));

      const slice = (startIdx >= 0 ? lines.slice(startIdx + 1, dividerIdx > 0 ? dividerIdx : undefined) : lines)
        .map(l => l.trim())
        .filter(l => l.length > 0);

      console.log('[spec-loader] parsed items:', slice.length, { startIdx, dividerIdx });

      const makeLi = (t) => {
        const li = document.createElement('li');
        li.innerHTML = '• <span class="en-only">' + t + '</span><span class="ar-only">' + t + '</span>';
        return li;
      };

      // Try to find container by Arabic heading first, then English, then fallback to first matching UL
      let arHeader = Array.from(document.querySelectorAll('h3.ar-only'))
        .find(h => h.textContent && h.textContent.trim() === 'المواصفات الرئيسية');
      let container = arHeader ? arHeader.parentElement : null;

      if (!container) {
        const enHeader = Array.from(document.querySelectorAll('h3.en-only'))
          .find(h => h.textContent && h.textContent.trim() === 'Key Specifications');
        container = enHeader ? enHeader.parentElement : null;
      }

      // Fallback: nearest ULs anywhere in the document
      let visibleUl, collapsedUl, moreSpecsDiv;
      if (container) {
        visibleUl = container.querySelector('ul.list-unstyled.mb-2');
        moreSpecsDiv = container.querySelector('#moreSpecs');
        collapsedUl = moreSpecsDiv ? moreSpecsDiv.querySelector('ul.list-unstyled') : null;
      }

      if (!visibleUl) {
        visibleUl = document.querySelector('ul.list-unstyled.mb-2');
      }
      if (!collapsedUl) {
        moreSpecsDiv = document.querySelector('#moreSpecs');
        if (moreSpecsDiv) {
          collapsedUl = moreSpecsDiv.querySelector('ul.list-unstyled');
        }
      }

      // If still missing, create the collapsed container structure after the visible UL
      if (visibleUl && !collapsedUl) {
        moreSpecsDiv = document.createElement('div');
        moreSpecsDiv.className = 'collapse';
        moreSpecsDiv.id = 'moreSpecs';
        collapsedUl = document.createElement('ul');
        collapsedUl.className = 'list-unstyled';
        moreSpecsDiv.appendChild(collapsedUl);
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-primary mt-2';
        btn.type = 'button';
        btn.setAttribute('data-bs-toggle', 'collapse');
        btn.setAttribute('data-bs-target', '#moreSpecs');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', 'moreSpecs');
        btn.innerHTML = '<span class="en-only">Show more</span><span class="ar-only">عرض المزيد</span>';
        // Insert after visibleUl's parent if possible, else after UL
        const parent = visibleUl.parentElement;
        parent.appendChild(moreSpecsDiv);
        parent.appendChild(btn);
      }

      if (!visibleUl || !collapsedUl) {
        console.warn('[spec-loader] Could not find target ULs to populate.');
        return;
      }

      // If the page already has items (hand-authored), do NOT override main specs list.
      // But continue to process other targets (e.g., modals) below.
      const hasExistingItems = visibleUl && visibleUl.querySelectorAll('li').length > 0;
      if (!hasExistingItems) {
        // Clear any placeholders or previous items (only when we are populating)
        visibleUl.innerHTML = '';
        collapsedUl.innerHTML = '';

        const first = slice.slice(0, 6);
        const rest = slice.slice(6);

        first.forEach(t => visibleUl.appendChild(makeLi(t)));
        rest.forEach(t => collapsedUl.appendChild(makeLi(t)));

        console.log('[spec-loader] populated main specs. visible:', first.length, 'collapsed:', rest.length);
      } else {
        console.log('[spec-loader] Existing items in main specs; skipping main population.');
      }

      // --- Populate Water Tank modal (#specTank) from section 'water tank:' to next divider ---
      function extractSection(label) {
        const lower = label.toLowerCase();
        let start = -1;
        for (let i = 0; i < lines.length; i++) {
          const l = lines[i].trim();
          const lc = l.toLowerCase();
          // Accept: 'label:', 'label :', or 'label' (no colon)
          if (lc === lower + ':' || lc === lower + ' :' || lc === lower) { start = i + 1; break; }
        }
        if (start < 0) return [];
        let end = lines.length;
        for (let j = start; j < lines.length; j++) {
          const l = lines[j].trim();
          if (/^\/+/u.test(l)) { end = j; break; }
        }
        return lines.slice(start, end).map(s => s.trim()).filter(Boolean);
      }

      try {
        const targets = [
          { selector: '#specTank .modal-body ul', labels: ['water tank'] },
          { selector: '#specExpansion .modal-body ul', labels: ['expantion tank', 'expansion tank'] },
          { selector: '#specHPWH .modal-body ul', labels: ['heat punp water heater', 'heat pump water heater'] },
          { selector: '#specPumpDomestic .modal-body ul', labels: ['water pump speeding for water', 'water pump (domestic)'] },
          { selector: '#specPumpHeating .modal-body ul', labels: ['water pump speeding for heating', 'water pump (heating)'] }
        ];

        function populateUl(ul, items) {
          if (!ul || !items.length) return;
          ul.innerHTML = '';
          items.forEach(txt => {
            const li = document.createElement('li');
            li.textContent = txt;
            ul.appendChild(li);
          });
          ul.setAttribute('dir', 'rtl');
          ul.style.textAlign = 'right';
        }

        targets.forEach(t => {
          const ul = document.querySelector(t.selector);
          if (!ul) return;
          // find first matching label section
          let linesForThis = [];
          for (const lbl of t.labels) {
            linesForThis = extractSection(lbl);
            if (linesForThis.length) break;
          }
          populateUl(ul, linesForThis);
          if (linesForThis.length) {
            console.log('[spec-loader] populated', t.selector, 'with', linesForThis.length, 'items');
          } else {
            console.log('[spec-loader] no items found for', t.selector);
          }
        });
      } catch (e) {
        console.warn('[spec-loader] failed to populate product modals', e);
      }
    } catch (e) {
      console.error('Failed to load main_product.txt', e);
    }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runSpecsLoader);
} else {
  // DOM already ready
  runSpecsLoader();
}

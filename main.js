/* ==========================================================================
   WALTIVE Product Guide — Site Behaviors (assets/js/main.js)
   --------------------------------------------------------------------------
   1.  Active main-nav highlighting (based on <body data-page="…">)
   2.  Mobile menu toggle (hamburger)
   3.  Global product search (reads window.WALTIVE_SEARCH_INDEX from search-data.js)
   4.  Smooth in-page scrolling + sub-nav scrollspy
   5.  Table row filter (auto-injected above spec/packaging tables)
   6.  Back-to-top button
   7.  Footer year
   ========================================================================== */

(() => {
  'use strict';

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. ACTIVE MAIN-NAV HIGHLIGHT
     Each page sets <body data-page="spc-boards"> and each nav link
     carries data-nav="spc-boards". Matching link gets .active.
     ------------------------------------------------------------------ */
  const currentPage = document.body.dataset.page;
  document.querySelectorAll('.site-nav a').forEach((link) => {
    if (link.dataset.nav && link.dataset.nav === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ------------------------------------------------------------------
     2. MOBILE MENU TOGGLE
     ------------------------------------------------------------------ */
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');

  if (navToggle && siteNav) {
    const closeMenu = () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close after choosing a destination
    siteNav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    // Close on Escape
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    // Close when clicking outside the header
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.site-header')) closeMenu();
    });
  }

  /* ------------------------------------------------------------------
     3. GLOBAL SEARCH
     ------------------------------------------------------------------ */
  const searchInput = document.getElementById('site-search');
  const searchResults = document.getElementById('search-results');

  if (searchInput && searchResults && Array.isArray(window.WALTIVE_SEARCH_INDEX)) {
    let matches = [];
    let selected = -1;

    const escapeHtml = (text) => String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    /* Wrap the matched part of a string in <mark> */
    const highlight = (text, query) => {
      const safe = escapeHtml(text);
      if (!query) return safe;
      const index = safe.toLowerCase().indexOf(query.toLowerCase());
      if (index === -1) return safe;
      return safe.slice(0, index) +
        '<mark>' + safe.slice(index, index + query.length) + '</mark>' +
        safe.slice(index + query.length);
    };

    const scoreEntry = (entry, rawQuery) => {
      const query = rawQuery.toLowerCase();
      const title = entry.t.toLowerCase();
      const haystack = ((entry.k || '') + ' ' + (entry.c || '')).toLowerCase();
      if (title.startsWith(query)) return 3;
      if (title.includes(query)) return 2;
      if (haystack.includes(query)) return 1;
      return 0;
    };

    const find = (query) => window.WALTIVE_SEARCH_INDEX
      .map((entry) => ({ entry, score: scoreEntry(entry, query) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((item) => item.entry);

    const moveSelection = (delta) => {
      if (!matches.length) return;
      selected = (selected + delta + matches.length) % matches.length;
      renderList(searchInput.value.trim());
      const active = searchResults.querySelector('.search-result.selected');
      if (active) active.scrollIntoView({ block: 'nearest' });
    };

    const renderList = (query) => {
      if (!matches.length) {
        searchResults.innerHTML =
          '<div class="search-empty">No matches. Try a SKU code (H8112F, GS9025…) or a word like "pallet".</div>';
        return;
      }
      searchResults.innerHTML = matches.map((entry, i) => (
        '<a class="search-result' + (i === selected ? ' selected' : '') + '" href="' + entry.u + '">' +
          '<span class="sr-title">' + highlight(entry.t, query) + '</span>' +
          '<span class="sr-meta">' +
            '<span class="sr-cat">' + escapeHtml(entry.c) + '</span>' +
            (entry.p ? '<span class="sr-price">' + escapeHtml(entry.p) + '</span>' : '') +
          '</span>' +
        '</a>'
      )).join('');
    };

    const open = (query) => {
      matches = find(query);
      selected = matches.length ? 0 : -1;
      renderList(query);
      searchResults.hidden = false;
    };

    const close = () => {
      searchResults.hidden = true;
      matches = [];
      selected = -1;
    };

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      if (query.length < 2) { close(); return; }
      open(query);
    });

    searchInput.addEventListener('keydown', (event) => {
      if (searchResults.hidden) return;
      if (event.key === 'ArrowDown') { event.preventDefault(); moveSelection(1); }
      else if (event.key === 'ArrowUp') { event.preventDefault(); moveSelection(-1); }
      else if (event.key === 'Enter' && matches[selected]) {
        event.preventDefault();
        window.location.href = matches[selected].u;
      }
      else if (event.key === 'Escape') {
        searchInput.value = '';
        close();
        searchInput.blur();
      }
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.global-search')) close();
    });
  }

  /* ------------------------------------------------------------------
     4. SMOOTH SCROLL + SUB-NAV SCROLLSPY
     ------------------------------------------------------------------ */
  const subnavLinks = [...document.querySelectorAll('.subnav a[href^="#"], .hero a[href^="#"], a.scroll-link')];

  subnavLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
      history.replaceState(null, '', '#' + targetId);
    });
  });

  /* Scrollspy: highlight the sub-nav link of the section currently in view.
     Position-based (not IntersectionObserver) because the anchored headings
     are small and sit far apart — the "last section above the fold line"
     approach always has an answer. */
  const spyTargets = [...document.querySelectorAll('.subnav a[href^="#"]')]
    .map((link) => {
      const section = document.getElementById(link.getAttribute('href').slice(1));
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if (spyTargets.length) {
    const setSpy = (id) => {
      spyTargets.forEach(({ link }) => {
        const active = link.getAttribute('href') === '#' + id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };

    // Fold line tracks the real header height (header wraps to two rows on
    // narrower screens) + sticky subnav + a little breathing room.
    const headerEl = document.querySelector('.site-header');
    const subnavEl = document.querySelector('.subnav');
    const measureFold = () =>
      (headerEl ? headerEl.offsetHeight : 60) +
      (subnavEl ? subnavEl.offsetHeight : 44) + 16;
    let foldLine = measureFold();
    window.addEventListener('resize', () => { foldLine = measureFold(); });
    const updateSpy = () => {
      let current = spyTargets[0].section.id;
      spyTargets.forEach(({ section }) => {
        if (section.getBoundingClientRect().top <= foldLine) current = section.id;
      });
      setSpy(current);
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateSpy();
        ticking = false;
      });
    }, { passive: true });

    updateSpy();
  }

  /* ------------------------------------------------------------------
     5. TABLE ROW FILTER
     Auto-inserts a filter bar above the first spec/packaging table and
     filters <tbody> rows on every table in the page.
     ------------------------------------------------------------------ */
  const tables = [...document.querySelectorAll('table.spec-table, table.pack-table')];

  if (tables.length) {
    const filterBar = document.createElement('div');
    filterBar.className = 'table-filter';
    filterBar.innerHTML =
      '<label for="table-filter-input">Filter tables</label>' +
      '<input type="search" id="table-filter-input" placeholder="Type a width, SKU or keyword — e.g. 300mm, gold line, CBM…" autocomplete="off">' +
      '<button type="button" class="filter-clear" hidden>Clear</button>' +
      '<span class="filter-count" aria-live="polite"></span>';

    const firstTable = tables[0];
    firstTable.parentNode.insertBefore(filterBar, firstTable);

    const input = filterBar.querySelector('input');
    const clearBtn = filterBar.querySelector('.filter-clear');
    const count = filterBar.querySelector('.filter-count');

    const allRows = tables.flatMap((table) => [...table.querySelectorAll('tbody tr')]);

    const applyFilter = () => {
      const query = input.value.trim().toLowerCase();
      clearBtn.hidden = !query;

      let visibleCount = 0;
      allRows.forEach((row) => {
        const show = !query || row.textContent.toLowerCase().includes(query);
        row.classList.toggle('row-hidden', !show);
        if (show) visibleCount += 1;
      });

      // Hide tables whose body has no visible rows left
      tables.forEach((table) => {
        const anyVisible = [...table.querySelectorAll('tbody tr')]
          .some((row) => !row.classList.contains('row-hidden'));
        table.classList.toggle('row-hidden', query ? !anyVisible : false);
      });

      count.textContent = query
        ? visibleCount + ' of ' + allRows.length + ' rows'
        : allRows.length + ' rows';
    };

    input.addEventListener('input', applyFilter);
    clearBtn.addEventListener('click', () => {
      input.value = '';
      applyFilter();
      input.focus();
    });
    applyFilter();
  }

  /* ------------------------------------------------------------------
     6. BACK-TO-TOP BUTTON
     ------------------------------------------------------------------ */
  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    const toggleVisibility = () => {
      backToTop.classList.toggle('visible', window.scrollY > 420);
    };
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  /* ------------------------------------------------------------------
     7. FOOTER YEAR
     ------------------------------------------------------------------ */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();

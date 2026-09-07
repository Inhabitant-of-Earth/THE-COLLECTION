// ==========================================================================
// 全ページ共通ロジック（テーマ切替・ページトップへ戻る）
// ==========================================================================

(function () {
  'use strict';

  const themeToggle = document.getElementById('themeToggle');
  const backToTop = document.getElementById('backToTop');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) {
      const icon = themeToggle.querySelector('.theme-icon');
      if (icon) icon.textContent = theme === 'light' ? '☀' : '☾';
    }
  }

  applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  if (backToTop) {
    const updateVisibility = () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();

    backToTop.addEventListener('click', () => {
      const searchBox = document.querySelector('.search-box');
      const header = document.querySelector('.site-header');
      let targetY = 0;
      if (searchBox) {
        const headerHeight = header ? header.offsetHeight : 0;
        targetY = Math.max(searchBox.getBoundingClientRect().top + window.scrollY - headerHeight, 0);
      }
      window.scrollTo({ top: targetY, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }
})();

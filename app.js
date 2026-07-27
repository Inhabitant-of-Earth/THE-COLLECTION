// ==========================================================================
// カタログ描画・検索・フィルタ・モーダル制御（共通ロジック）
// ==========================================================================

(function () {
  'use strict';

  const grid = document.getElementById('appGrid');
  const searchInput = document.getElementById('searchInput');
  const categoryTabs = document.getElementById('categoryTabs');
  const resultCount = document.getElementById('resultCount');
  const modal = document.getElementById('appModal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  const noResult = document.getElementById('noResult');

  let currentCategory = 'すべて';
  let currentQuery = '';

  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    let s = '';
    for (let i = 0; i < 5; i++) {
      if (i < full) s += '★';
      else if (i === full && half) s += '⯨';
      else s += '☆';
    }
    return s;
  }

  function cardTemplate(app) {
    return `
      <article class="app-card" data-id="${app.id}" tabindex="0" role="button" aria-label="${app.name} の詳細を見る">
        <div class="app-icon" style="--hue:${app.hue}"></div>
        <div class="app-info">
          <h3 class="app-name">${app.name}</h3>
          <p class="app-category">${app.category}</p>
          <div class="app-meta">
            <span class="app-rating">${renderStars(app.rating)} <b>${app.rating}</b></span>
            <span class="app-price">${app.price}</span>
          </div>
        </div>
      </article>
    `;
  }

  function modalTemplate(app) {
    return `
      <div class="modal-icon" style="--hue:${app.hue}"></div>
      <h2 class="modal-name">${app.name}</h2>
      <p class="modal-category">${app.category}</p>
      <div class="modal-stats">
        <div class="modal-stat">
          <span class="stat-value">${renderStars(app.rating)}<br><b>${app.rating}</b></span>
          <span class="stat-label">評価</span>
        </div>
        <div class="modal-stat">
          <span class="stat-value">${app.downloads}</span>
          <span class="stat-label">ダウンロード数</span>
        </div>
        <div class="modal-stat">
          <span class="stat-value">${app.price}</span>
          <span class="stat-label">価格</span>
        </div>
      </div>
      <p class="modal-description">${app.description}</p>
      <div class="modal-footer-info">
        <span>バージョン ${app.version}</span>
        <span>${app.reviews.toLocaleString()} 件のレビュー</span>
      </div>
    `;
  }

  function getFiltered() {
    return window.CATALOG_APPS.filter((app) => {
      const matchCat = currentCategory === 'すべて' || app.category === currentCategory;
      const matchQuery =
        currentQuery === '' ||
        app.name.toLowerCase().includes(currentQuery) ||
        app.category.includes(currentQuery) ||
        app.description.includes(currentQuery);
      return matchCat && matchQuery;
    });
  }

  function render() {
    const list = getFiltered();
    resultCount.textContent = list.length;
    grid.innerHTML = list.map(cardTemplate).join('');
    noResult.style.display = list.length === 0 ? 'block' : 'none';
  }

  function openModal(id) {
    const app = window.CATALOG_APPS.find((a) => a.id === id);
    if (!app) return;
    modalBody.innerHTML = modalTemplate(app);
    modal.classList.add('is-open');
    document.body.classList.add('modal-lock');
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-lock');
  }

  function buildCategoryTabs() {
    categoryTabs.innerHTML = window.CATALOG_CATEGORIES.map(
      (cat) => `<button class="tab${cat === 'すべて' ? ' is-active' : ''}" data-category="${cat}">${cat}</button>`
    ).join('');
  }

  // --- イベント ---
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.app-card');
    if (card) openModal(Number(card.dataset.id));
  });

  grid.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.app-card');
      if (card) {
        e.preventDefault();
        openModal(Number(card.dataset.id));
      }
    }
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  categoryTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab');
    if (!btn) return;
    currentCategory = btn.dataset.category;
    [...categoryTabs.children].forEach((c) => c.classList.remove('is-active'));
    btn.classList.add('is-active');
    render();
  });

  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      currentQuery = e.target.value.trim().toLowerCase();
      render();
    }, 150);
  });

  // --- 初期化 ---
  buildCategoryTabs();
  render();
})();

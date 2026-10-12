// ---- MoonMade cart ----
// Draws the shop grid (from products.js), shows a bag's details when it's clicked,
// runs the slide-out cart and remembers the cart between pages.
// Every bag is one of a kind, so the cart holds at most one of each.
// Needs products.js to be loaded first.

const Cart = (() => {
  const STORAGE_KEY = 'moonmade-cart';
  const MOON = '<svg><use href="#moon"/></svg>';
  let items = load(); // a list of bag ids

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      const ids = saved.map(i => (typeof i === 'string' ? i : i.id)); // older carts saved objects
      return [...new Set(ids)].filter(id => isAvailable(findProduct(id))); // drop bags that are gone or sold
    } catch {
      return [];
    }
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
    render();
  }

  function findProduct(id) {
    return PRODUCTS.find(p => p.id === id);
  }

  function isAvailable(p) {
    return Boolean(p) && !p.sold;
  }

  function escape(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatPrice(n) {
    return n > 0 ? '$' + n.toFixed(2) : 'Price TBC';
  }

  function productImage(p, className) {
    return p.image
      ? `<img class="${className}" src="${p.image}" alt="${escape(p.alt || p.name)}">`
      : `<div class="${className} placeholder">${MOON}</div>`;
  }

  // ---- Cart contents ----
  function has(id) {
    return items.includes(id);
  }

  function add(id) {
    if (!has(id) && isAvailable(findProduct(id))) items.push(id);
    save();
  }

  function remove(id) {
    items = items.filter(i => i !== id);
    save();
  }

  function clear() {
    items = [];
    save();
  }

  function count() {
    return items.length;
  }

  // Returns null if any bag in the cart doesn't have a price yet
  function subtotal() {
    let total = 0;
    for (const p of lines()) {
      if (!(p.price > 0)) return null;
      total += p.price;
    }
    return total;
  }

  function subtotalText() {
    const total = subtotal();
    return total === null ? 'To be confirmed' : formatPrice(total);
  }

  // The bags in the cart, used by checkout
  function lines() {
    return items.map(findProduct);
  }

  // The small action under a bag: add it, show it's already in the cart, or mark it sold
  function actionHTML(p, className) {
    if (p.sold) return `<p class="sold-label">Sold</p>`;
    if (has(p.id)) return `<button type="button" class="${className}" data-cart-open>In your cart</button>`;
    return `<button type="button" class="${className}" data-add="${p.id}">Add to cart</button>`;
  }

  // ---- Shop grid ----
  function renderGrid() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = PRODUCTS.map(p => `
      <article class="product${p.sold ? ' is-sold' : ''}">
        <button type="button" class="product-view" data-view="${p.id}" aria-label="View ${escape(p.name)}">
          ${productImage(p, 'product-img')}
          ${p.sold ? '<span class="sold-tag">Sold</span>' : ''}
        </button>
        <div class="product-info">
          <h3><button type="button" class="product-name" data-view="${p.id}">${escape(p.name)}</button></h3>
          <p class="price">${formatPrice(p.price)}</p>
          ${actionHTML(p, 'link-btn add-link')}
        </div>
      </article>`).join('');
  }

  // ---- Bag details pop-up ----
  function buildDialog() {
    document.body.insertAdjacentHTML('beforeend', `
      <dialog class="bag-dialog" id="bag-dialog" aria-label="Bag details">
        <button type="button" class="drawer-close dialog-close" data-dialog-close aria-label="Close">&times;</button>
        <div class="bag-detail" id="bag-detail"></div>
      </dialog>`);
    const dialog = document.getElementById('bag-dialog');
    // Clicking the dark area around the pop-up closes it
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  }

  function renderDialog() {
    const dialog = document.getElementById('bag-dialog');
    if (!dialog || !dialog.open) return;
    const p = findProduct(dialog.dataset.id);
    document.getElementById('bag-detail').innerHTML = `
      ${productImage(p, 'bag-detail-img')}
      <div class="bag-detail-info">
        <p class="eyebrow">One of a kind</p>
        <h2>${escape(p.name)}</h2>
        <p class="price">${formatPrice(p.price)}</p>
        <p class="bag-description">${escape(p.description || '')}</p>
        ${p.sold
          ? '<p class="sold-label">This bag has found its home</p>'
          : actionHTML(p, 'button add-btn')}
        <p class="bag-note">Made by hand, one at a time. There is only one of this bag.</p>
      </div>`;
  }

  function view(id) {
    const dialog = document.getElementById('bag-dialog');
    dialog.dataset.id = id;
    dialog.showModal();
    renderDialog();
    dialog.querySelector('.dialog-close').focus();
  }

  // ---- Slide-out drawer ----
  function buildDrawer() {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="drawer-overlay" data-cart-close></div>
      <aside class="cart-drawer" id="cart-drawer" aria-label="Your cart" aria-hidden="true">
        <div class="drawer-head">
          <p class="eyebrow">Your cart</p>
          <button type="button" class="drawer-close" data-cart-close aria-label="Close cart">&times;</button>
        </div>
        <div class="drawer-body" id="cart-lines"></div>
        <div class="drawer-foot" id="cart-foot">
          <div class="subtotal"><span class="eyebrow">Subtotal</span><span id="cart-subtotal"></span></div>
          <p class="drawer-note">Each bag is one of a kind. Shipping and payment are confirmed by email after you order.</p>
          <a href="checkout.html" class="button">Checkout</a>
        </div>
      </aside>`);
  }

  function lineHTML(p) {
    return `
      <div class="cart-line">
        ${productImage(p, 'cart-thumb')}
        <div class="cart-line-info">
          <p class="cart-line-name">${escape(p.name)}</p>
          <p class="variant">One of a kind</p>
        </div>
        <div class="cart-line-end">
          <p>${p.price > 0 ? formatPrice(p.price) : 'TBC'}</p>
          <button type="button" class="link-btn" data-remove="${p.id}">Remove</button>
        </div>
      </div>`;
  }

  function render() {
    for (const el of document.querySelectorAll('[data-cart-count]')) el.textContent = count();
    renderGrid();
    renderDialog();

    const linesEl = document.getElementById('cart-lines');
    if (!linesEl) return;
    if (items.length === 0) {
      linesEl.innerHTML = `<div class="cart-empty">${MOON}<p>Your cart is empty.</p><a href="index.html#shop" class="link-btn" data-cart-close>Shop the bags</a></div>`;
      document.getElementById('cart-foot').hidden = true;
    } else {
      linesEl.innerHTML = lines().map(lineHTML).join('');
      document.getElementById('cart-subtotal').textContent = subtotalText();
      document.getElementById('cart-foot').hidden = false;
    }
    document.dispatchEvent(new Event('cart:change'));
  }

  function open() {
    closeDialog();
    document.getElementById('cart-drawer').setAttribute('aria-hidden', 'false');
    document.body.classList.add('cart-open');
    document.querySelector('#cart-drawer .drawer-close').focus();
  }

  function close() {
    document.getElementById('cart-drawer').setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cart-open');
  }

  function closeDialog() {
    const dialog = document.getElementById('bag-dialog');
    if (dialog && dialog.open) dialog.close();
  }

  // One click handler for every button the cart draws
  document.addEventListener('click', e => {
    const viewBtn = e.target.closest('[data-view]');
    if (viewBtn) view(viewBtn.dataset.view);
    const addBtn = e.target.closest('[data-add]');
    if (addBtn) { add(addBtn.dataset.add); open(); }
    if (e.target.closest('[data-cart-open]')) { e.preventDefault(); open(); }
    if (e.target.closest('[data-cart-close]')) close();
    if (e.target.closest('[data-dialog-close]')) closeDialog();
    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) remove(removeBtn.dataset.remove);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // Keep carts in sync if the site is open in two tabs
  window.addEventListener('storage', e => { if (e.key === STORAGE_KEY) { items = load(); render(); } });

  document.addEventListener('DOMContentLoaded', () => {
    buildDialog();
    buildDrawer();
    render();
  });

  return { lines, count, clear, subtotalText, formatPrice, productImage, escape };
})();

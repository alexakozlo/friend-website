// ---- MoonMade cart ----
// Draws the shop grid (from products.js), shows a bag's details when it's clicked,
// runs the slide-out cart and remembers the cart between pages.
// Bags are made in small batches, so the cart never holds more of a bag than its stock.
// Needs products.js to be loaded first.

const Cart = (() => {
  const STORAGE_KEY = 'moonmade-cart';
  const MOON = '<svg><use href="#moon"/></svg>';
  let items = load(); // a list of { id, qty }

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      const merged = {};
      for (const i of saved) {
        const id = typeof i === 'string' ? i : i.id; // an older version saved just the id
        merged[id] = (merged[id] || 0) + (Number(i.qty) || 1);
      }
      // Drop bags that are gone or sold out, and never keep more than are in stock
      return Object.entries(merged)
        .filter(([id]) => stockOf(findProduct(id)) > 0)
        .map(([id, qty]) => ({ id, qty: Math.min(qty, stockOf(findProduct(id))) }));
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

  function stockOf(p) {
    return p ? Math.max(0, Number(p.stock) || 0) : 0;
  }

  function escape(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatPrice(n) {
    return n > 0 ? '$' + n.toFixed(2) : 'Price TBC';
  }

  // The square cover photo (or the moon placeholder if there's no photo yet)
  function productImage(p, className) {
    const src = p.cover || (p.photos && p.photos[0]);
    return src
      ? `<img class="${className}" src="${src}" alt="${escape(p.alt || p.name)}" loading="lazy">`
      : `<div class="${className} placeholder">${MOON}</div>`;
  }

  // The pop-up's big photo, with small thumbnails underneath to switch between photos
  function galleryHTML(p, shown) {
    const photos = p.photos || [];
    if (photos.length === 0) return productImage(p, 'bag-detail-img');
    const thumbs = photos.length > 1 ? `
      <div class="bag-thumbs">
        ${photos.map((src, n) => `
          <button type="button" class="bag-thumb${n === shown ? ' active' : ''}" data-photo="${n}" aria-label="Show photo ${n + 1}">
            <img src="${src}" alt="">
          </button>`).join('')}
      </div>` : '';
    return `
      <div class="bag-gallery">
        <img class="bag-detail-img" src="${photos[shown] || photos[0]}" alt="${escape(p.alt || p.name)}">
        ${thumbs}
      </div>`;
  }

  // ---- Cart contents ----
  function qtyInCart(id) {
    const line = items.find(i => i.id === id);
    return line ? line.qty : 0;
  }

  function add(id) {
    const line = items.find(i => i.id === id);
    if (line) setQty(id, line.qty + 1);
    else if (stockOf(findProduct(id)) > 0) { items.push({ id, qty: 1 }); save(); }
  }

  function setQty(id, qty) {
    const line = items.find(i => i.id === id);
    if (!line) return;
    if (qty < 1) items = items.filter(i => i !== line);
    else line.qty = Math.min(qty, stockOf(findProduct(id)));
    save();
  }

  function clear() {
    items = [];
    save();
  }

  function count() {
    return items.reduce((sum, i) => sum + i.qty, 0);
  }

  // Returns null if any bag in the cart doesn't have a price yet
  function subtotal() {
    let total = 0;
    for (const { product, qty } of lines()) {
      if (!(product.price > 0)) return null;
      total += product.price * qty;
    }
    return total;
  }

  function subtotalText() {
    const total = subtotal();
    return total === null ? 'To be confirmed' : formatPrice(total);
  }

  // The cart's lines with product details filled in, used by checkout
  function lines() {
    return items.map(i => ({ ...i, product: findProduct(i.id) }));
  }

  // "Only 1 left", "2 left" or "Sold"
  function stockText(p) {
    const n = stockOf(p);
    if (n === 0) return 'Sold';
    return n === 1 ? 'Only 1 left' : `${n} left`;
  }

  // The small action under a bag: add it, show they're all in the cart, or mark it sold
  function actionHTML(p, className) {
    if (stockOf(p) === 0) return `<p class="sold-label">Sold</p>`;
    if (qtyInCart(p.id) >= stockOf(p)) return `<button type="button" class="${className}" data-cart-open>In your cart</button>`;
    return `<button type="button" class="${className}" data-add="${p.id}">Add to cart</button>`;
  }

  // ---- Shop grid ----
  function renderGrid() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = PRODUCTS.map(p => `
      <article class="product${stockOf(p) === 0 ? ' is-sold' : ''}">
        <button type="button" class="product-view" data-view="${p.id}" aria-label="View ${escape(p.name)}">
          ${productImage(p, 'product-img')}
          ${stockOf(p) === 0 ? '<span class="sold-tag">Sold</span>' : ''}
        </button>
        <div class="product-info">
          <h3><button type="button" class="product-name" data-view="${p.id}">${escape(p.name)}</button></h3>
          <p class="price">${formatPrice(p.price)}</p>
          ${stockOf(p) > 0 ? `<p class="stock-note">${stockText(p)}</p>` : ''}
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
      ${galleryHTML(p, Number(dialog.dataset.photo) || 0)}
      <div class="bag-detail-info">
        <p class="eyebrow">Small batch</p>
        <h2>${escape(p.name)}</h2>
        <p class="price">${formatPrice(p.price)}</p>
        <p class="bag-description">${escape(p.description || '')}</p>
        ${stockOf(p) === 0
          ? '<p class="sold-label">Sold out</p>'
          : actionHTML(p, 'button add-btn')}
        <p class="bag-note">Made by hand in small batches.${stockOf(p) > 0 ? ` ${stockText(p)}.` : ''}</p>
      </div>`;
  }

  function view(id) {
    const dialog = document.getElementById('bag-dialog');
    dialog.dataset.id = id;
    dialog.dataset.photo = 0;
    dialog.showModal();
    renderDialog();
    document.getElementById('bag-detail').scrollTop = 0;
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
          <p class="drawer-note">Shipping and payment are confirmed by email after you order.</p>
          <a href="checkout.html" class="button">Checkout</a>
        </div>
      </aside>`);
  }

  function lineHTML({ product: p, qty }) {
    const atMax = qty >= stockOf(p);
    return `
      <div class="cart-line">
        ${productImage(p, 'cart-thumb')}
        <div class="cart-line-info">
          <p class="cart-line-name">${escape(p.name)}</p>
          <div class="qty">
            <button type="button" data-qty="-1" data-id="${p.id}" aria-label="Decrease quantity">&minus;</button>
            <span>${qty}</span>
            <button type="button" data-qty="1" data-id="${p.id}" aria-label="Increase quantity"${atMax ? ' disabled' : ''}>+</button>
          </div>
          ${atMax ? `<p class="variant">${stockOf(p) === 1 ? 'Only 1' : `All ${stockOf(p)}`} in stock</p>` : ''}
        </div>
        <div class="cart-line-end">
          <p>${p.price > 0 ? formatPrice(p.price * qty) : 'TBC'}</p>
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
    const photoBtn = e.target.closest('[data-photo]');
    if (photoBtn) {
      document.getElementById('bag-dialog').dataset.photo = photoBtn.dataset.photo;
      renderDialog();
    }
    const qtyBtn = e.target.closest('[data-qty]');
    if (qtyBtn) setQty(qtyBtn.dataset.id, qtyInCart(qtyBtn.dataset.id) + Number(qtyBtn.dataset.qty));
    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) setQty(removeBtn.dataset.remove, 0);
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

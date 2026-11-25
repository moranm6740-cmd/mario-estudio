// 1. Efecto dinámico en el header al hacer scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (!header) return;
    if (window.scrollY > 50) {
        header.style.background = 'rgba(18, 18, 18, 0.98)';
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
    } else {
        header.style.background = 'rgba(18, 18, 18, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// 2. Filtro de galería por temática (5 fotos por temática)
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        portfolioItems.forEach((item) => {
            const match = filter === 'all' || item.dataset.category === filter;
            item.classList.toggle('hidden', !match);
        });
    });
});

// 3. Carrito de compras de promociones (válido hasta 31-12-26)
const PROMO_DEADLINE = new Date('2026-12-31T23:59:59');
const STORAGE_KEY = 'mario_moran_promo_cart_2026';

let cart = [];

function isPromoActive() {
    return new Date() <= PROMO_DEADLINE;
}

function loadCart() {
    if (!isPromoActive()) {
        localStorage.removeItem(STORAGE_KEY);
        cart = [];
        return;
    }
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (Array.isArray(saved)) {
            cart = saved;
        }
    } catch (_) {
        cart = [];
    }
}

function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function addToCart(id, name, price) {
    if (!isPromoActive()) {
        alert('La promoción venció el 31-12-2026.');
        renderCart();
        return;
    }
    const existing = cart.find((item) => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, name, price: Number(price), qty: 1 });
    }
    saveCart();
    renderCart();
}

function updateQty(id, delta) {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter((i) => i.id !== id);
    }
    saveCart();
    renderCart();
}

function removeItem(id) {
    cart = cart.filter((i) => i.id !== id);
    saveCart();
    renderCart();
}

function clearCart() {
    cart = [];
    saveCart();
    renderCart();
}

function renderCart() {
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const addButtons = document.querySelectorAll('.add-to-cart');

    if (!cartItemsEl || !cartTotalEl || !checkoutBtn) return;

    const active = isPromoActive();
    addButtons.forEach((btn) => {
        btn.disabled = !active;
        if (!active) btn.textContent = 'Promo vencida';
    });

    if (!active) {
        cartItemsEl.innerHTML = '<p class="cart-empty">Promoción finalizada (venció el 31-12-2026).</p>';
        cartTotalEl.textContent = 'USD 0';
        checkoutBtn.disabled = true;
        return;
    }

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p class="cart-empty">Todavía no agregaste promociones.</p>';
        cartTotalEl.textContent = 'USD 0';
        checkoutBtn.disabled = true;
        return;
    }

    cartItemsEl.innerHTML = '';
    let total = 0;

    cart.forEach((item) => {
        const subtotal = item.price * item.qty;
        total += subtotal;

        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-controls">
                <div class="qty-controls">
                    <button type="button" class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Restar">-</button>
                    <span>${item.qty}</span>
                    <button type="button" class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Sumar">+</button>
                </div>
                <strong>USD ${subtotal}</strong>
                <button type="button" class="remove-btn" data-action="rem" data-id="${item.id}">Quitar</button>
            </div>
        `;
        cartItemsEl.appendChild(row);
    });

    cartTotalEl.textContent = `USD ${total}`;
    checkoutBtn.disabled = false;
}

document.querySelectorAll('.add-to-cart').forEach((btn) => {
    btn.addEventListener('click', () => {
        addToCart(btn.dataset.id, btn.dataset.name, btn.dataset.price);
    });
});

document.getElementById('cart-items')?.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!id) return;

    if (action === 'inc') updateQty(id, 1);
    if (action === 'dec') updateQty(id, -1);
    if (action === 'rem') removeItem(id);
});

document.getElementById('clear-cart-btn')?.addEventListener('click', clearCart);

document.getElementById('checkout-btn')?.addEventListener('click', () => {
    if (cart.length === 0) return;

    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const lines = cart.map(
        (item) => `- ${item.qty}x ${item.name}: USD ${item.price * item.qty}`
    );
    const summary = `Hola Mario, quiero reservar estas promociones (válidas hasta 31-12-26):\n${lines.join('\n')}\nTotal: USD ${total}`;

    const serviceSelect = document.getElementById('service');
    const messageTextarea = document.getElementById('message');

    if (serviceSelect) {
        serviceSelect.value = 'Promocion hasta 31-12-26';
    }
    if (messageTextarea) {
        messageTextarea.value = summary;
    }

    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
});

loadCart();
renderCart();

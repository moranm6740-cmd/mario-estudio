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

// 2. Arreglos de objetos para contenido dinámico
const THEMES = [
    { key: 'retratos', label: 'Retratos', prefix: 'RETRATO' },
    { key: 'bodas', label: 'Bodas', prefix: 'BODA' },
    { key: 'eventos', label: 'Eventos', prefix: 'EVENTO' },
    { key: 'editorial', label: 'Editorial', prefix: 'EDITORIAL' },
    { key: 'quinceaneras', label: 'Quinceañeras', prefix: 'QUINCEANERA' },
    { key: 'producto', label: 'Producto', prefix: 'PRODUCTO' }
];

const GALLERY_ITEMS = THEMES.flatMap((theme) =>
    Array.from({ length: 5 }, (_, idx) => {
        const num = idx + 1;
        return {
            id: `${theme.key}-${num}`,
            category: theme.key,
            categoryLabel: theme.label,
            src: `imagenes/${theme.prefix}-${num}.jpg`,
            alt: `${theme.label} ${num}`
        };
    })
);

const SERVICES_DATA = [
    {
        title: 'Sesiones de Retrato',
        description: 'Capturamos tu personalidad en estudio o locación exterior con iluminación profesional.',
        priceLabel: 'Desde $130 USD'
    },
    {
        title: 'Cobertura de Bodas',
        description: 'Documentamos cada detalle y emoción de tu día especial de principio a fin.',
        priceLabel: 'Desde $700 USD'
    },
    {
        title: 'Fotografía Editorial',
        description: 'Producción visual creativa para marcas de moda, revistas y campañas comerciales.',
        priceLabel: 'Desde $350 USD'
    }
];

const REVIEWS_DATA = [
    {
        quote: '"Mario logró capturar la esencia de nuestra boda de una manera increíble. Las fotos transmiten la misma emoción que sentimos ese día."',
        author: '— Paula & Fernando'
    },
    {
        quote: '"Súper profesional y con un ojo artístico excepcional. La sesión de retratos para mi marca personal superó todas mis expectativas."',
        author: '— Valeria Rossi'
    },
    {
        quote: '"Atención al detalle inigualable. El equipo técnico y la dirección durante la sesión nos hicieron sentir muy cómodos."',
        author: '— Sebastian Chamorro'
    }
];

const PROMOS_DATA = [
    {
        id: 'book-15',
        badge: 'Hasta 31-12-26',
        title: 'Book con 15 fotos editadas',
        description: 'Sesión fotográfica con 15 imágenes retocadas y editadas en alta calidad.',
        price: 65,
        cartName: 'Book con 15 fotos editadas (Promo hasta 31-12-26)'
    },
    {
        id: 'cumple-infantil',
        badge: 'Hasta 31-12-26',
        title: 'Cumpleaños infantil (3 hrs) foto y video',
        description: 'Cobertura completa de 3 horas incluyendo fotografía y registro en video.',
        price: 375,
        cartName: 'Cumpleaños infantil (3 hrs) foto y video (Promo hasta 31-12-26)'
    },
    {
        id: 'egresados',
        badge: 'Hasta 31-12-26',
        title: 'Fiesta de egresados (3 hrs) foto y video',
        description: 'Cobertura de 3 horas para egresados con fotografía y video del evento.',
        price: 450,
        cartName: 'Fiesta de egresados (3 hrs) foto y video (Promo hasta 31-12-26)'
    }
];

// 3. Renderizado dinámico de Inicio (Servicios y Reseñas)
function renderServices() {
    const container = document.getElementById('services-container');
    if (!container) return;

    container.innerHTML = SERVICES_DATA.map(
        (srv) => `
            <article class="service-card">
                <h3>${srv.title}</h3>
                <p>${srv.description}</p>
                <span class="price">${srv.priceLabel}</span>
            </article>
        `
    ).join('');
}

function renderReviews() {
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;

    grid.innerHTML = REVIEWS_DATA.map(
        (rev) => `
            <article class="review-card">
                <p>${rev.quote}</p>
                <h4>${rev.author}</h4>
            </article>
        `
    ).join('');
}

// 4. Renderizado y filtrado dinámico de Portfolio (30 fotos: 5 por temática)
let activeGalleryFilter = 'all';

function renderPortfolioFilters() {
    const filtersEl = document.getElementById('filter-buttons');
    if (!filtersEl) return;

    const buttonsConfig = [
        { key: 'all', text: `Todos (${GALLERY_ITEMS.length})` },
        ...THEMES.map((t) => ({ key: t.key, text: `${t.label} (5)` }))
    ];

    filtersEl.innerHTML = buttonsConfig
        .map(
            (btn) => `
                <button type="button" class="filter-btn ${btn.key === activeGalleryFilter ? 'active' : ''}" data-filter="${btn.key}">
                    ${btn.text}
                </button>
            `
        )
        .join('');

    filtersEl.querySelectorAll('.filter-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            activeGalleryFilter = btn.dataset.filter || 'all';
            renderPortfolioFilters();
            renderPortfolioGrid();
        });
    });
}

function renderPortfolioGrid() {
    const gridEl = document.getElementById('portfolio-grid');
    if (!gridEl) return;

    const visibleItems =
        activeGalleryFilter === 'all'
            ? GALLERY_ITEMS
            : GALLERY_ITEMS.filter((item) => item.category === activeGalleryFilter);

    gridEl.innerHTML = visibleItems
        .map(
            (item) => `
                <div class="portfolio-item" data-category="${item.category}">
                    <img src="${item.src}" alt="${item.alt}" loading="lazy">
                    <div class="overlay"><span>${item.categoryLabel}</span></div>
                </div>
            `
        )
        .join('');
}

// 5. Renderizado dinámico de Promociones + Carrito (hasta 31-12-26)
const PROMO_DEADLINE = new Date('2026-12-31T23:59:59');
const STORAGE_KEY = 'mario_moran_promo_cart_2026';
const PENDING_RESERVATION_KEY = 'mario_moran_pending_reservation_2026';

let cart = [];

function isPromoActive() {
    return new Date() <= PROMO_DEADLINE;
}

function loadCart() {
    if (!isPromoActive()) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(PENDING_RESERVATION_KEY);
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

function renderPromoCards() {
    const promoCardsEl = document.getElementById('promo-cards');
    if (!promoCardsEl) return;

    const active = isPromoActive();
    promoCardsEl.innerHTML = PROMOS_DATA.map(
        (promo) => `
            <article class="promo-card">
                <span class="promo-badge">${promo.badge}</span>
                <h3>${promo.title}</h3>
                <p>${promo.description}</p>
                <div class="promo-footer">
                    <span class="price">USD ${promo.price}</span>
                    <button type="button" class="btn btn-sm add-to-cart"
                        data-id="${promo.id}"
                        data-name="${promo.cartName}"
                        data-price="${promo.price}"
                        ${active ? '' : 'disabled'}>
                        ${active ? 'Agregar al carrito' : 'Promo vencida'}
                    </button>
                </div>
            </article>
        `
    ).join('');

    promoCardsEl.querySelectorAll('.add-to-cart').forEach((btn) => {
        btn.addEventListener('click', () => {
            addToCart(btn.dataset.id, btn.dataset.name, btn.dataset.price);
        });
    });
}

function addToCart(id, name, price) {
    if (!isPromoActive()) {
        alert('La promoción venció el 31-12-2026.');
        renderPromoCards();
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

    if (!cartItemsEl || !cartTotalEl || !checkoutBtn) return;

    const active = isPromoActive();

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

function applyPendingReservationToForm() {
    const pending = localStorage.getItem(PENDING_RESERVATION_KEY);
    if (!pending) return;

    const serviceSelect = document.getElementById('service');
    const messageTextarea = document.getElementById('message');

    if (serviceSelect) {
        serviceSelect.value = 'Promocion hasta 31-12-26';
    }
    if (messageTextarea) {
        messageTextarea.value = pending;
    }
    localStorage.removeItem(PENDING_RESERVATION_KEY);
}

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
        (item) => `- ${item.qty}x ${item.cartName || item.name}: USD ${item.price * item.qty}`
    );
    const summary = `Hola Mario, quiero reservar estas promociones (válidas hasta 31-12-26):\n${lines.join('\n')}\nTotal: USD ${total}`;

    localStorage.setItem(PENDING_RESERVATION_KEY, summary);
    applyPendingReservationToForm();
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
});

// Inicialización
renderServices();
renderReviews();
renderPortfolioFilters();
renderPortfolioGrid();
loadCart();
renderPromoCards();
renderCart();
applyPendingReservationToForm();

const defaultMenu = [
    {
        id: 8,
        title: "Lo Quiero Kiliado (1kg)",
        desc: "1 kg de carnitas estilo kiliado + tortillas + salsas, preparadas con la receta especial de la casa.",
        price: 400.00,
        category: "kiliado",
        badge: "Especial",
        img: "assets/kiliado.png"
    },
    {
        id: 1,
        title: "5 tacos de carnitas",
        desc: "5 tacos de carnitas con cilantro, cebolla y tu salsa favorita.",
        price: 100.00,
        category: "tacos",
        img: "assets/carnitas.jpg"
    },
    {
        id: 2,
        title: "6 tacos de carnitas",
        desc: "6 tacos de carnitas con cilantro, cebolla y tu salsa favorita.",
        price: 120.00,
        category: "tacos",
        badge: "Popular",
        img: "assets/carnitas.jpg"
    },
    {
        id: 3,
        title: "8 tacos de carnitas",
        desc: "8 tacos de carnitas con cilantro, cebolla y tu salsa favorita.",
        price: 160.00,
        category: "tacos",
        badge: "Familiar",
        img: "assets/carnitas.jpg"
    },
    {
        id: 4,
        title: "Torta de Carnitas",
        desc: "Tradicional pan telera relleno de jugosas carnitas preparadas al momento.",
        price: 60.00,
        category: "tortas",
        img: "assets/torta_carnitas.jpg"
    },
    {
        id: 6,
        title: "Refresco 355ml",
        desc: "Bebida fría en lata de 355ml para acompañar tus alimentos.",
        price: 25.00,
        category: "bebidas",
        img: "assets/refresco_355ml.png"
    },
    {
        id: 7,
        title: "Agua Fresca",
        desc: "Agua fresca de sabor natural, la mejor opción para refrescarte.",
        price: 25.00,
        category: "bebidas",
        badge: "⭐ Favorito",
        img: "assets/drinks.jpg"
    },
    {
        id: 9,
        title: "Coca-Cola 600ml",
        desc: "Coca-Cola en botella de 600ml para acompañar tus alimentos.",
        price: 30.00,
        category: "bebidas",
        img: "assets/refresco_355ml.png"
    }
];

let menuData = JSON.parse(localStorage.getItem('tacosMenu')) || defaultMenu;

let cart = [];

const menuGrid = document.getElementById('menuGrid');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.querySelector('.cart-count');
const totalPriceElement = document.querySelector('.total-price');
const cartSidebar = document.getElementById('cartSidebar');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const checkoutBtn = document.querySelector('.checkout-btn');
const catLinks = document.querySelectorAll('.cat-link');

// Initial Render
function renderMenu(category = 'all') {
    menuGrid.innerHTML = '';
    const filtered = category === 'all' ? menuData : menuData.filter(i => i.category === category);

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-item';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        card.innerHTML = `
            <div class="item-img-container">
                <img src="${item.img}" alt="${item.title}" class="item-img" loading="lazy">
                ${item.badge ? `<span class="item-badge">${item.badge}</span>` : ''}
            </div>
            <div class="item-info">
                <h3 class="item-title">${item.title}</h3>
                <p class="item-desc">${item.desc}</p>
                <div class="item-footer">
                    <span class="item-price">$${item.price.toFixed(2)}</span>
                    <button class="add-btn" data-id="${item.id}" data-action="add">
                        <i data-lucide="plus"></i>
                    </button>
                </div>
            </div>
        `;
        menuGrid.appendChild(card);

        // Simple animation delay
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50);
    });
    lucide.createIcons();
}

// Cart Logic
function addToCart(id) {
    const item = menuData.find(i => i.id === id);
    const existing = cart.find(i => i.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    updateCartUI();
    showCart();
}

function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    const notice = document.querySelector('.shipping-notice');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Tu carrito está vacío</p>';
        checkoutBtn.disabled = true;
        if (notice) notice.style.display = 'none';
    } else {
        checkoutBtn.disabled = false;
        if (notice) notice.style.display = 'flex';

        cart.forEach(item => {
            const el = document.createElement('div');
            el.className = 'cart-item-row';
            el.style.padding = '1rem 0';
            el.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
            el.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center">
                    <div>
                        <h4 style="font-family:var(--font-header)">${item.title} x${item.quantity}</h4>
                        <span style="color:var(--accent);font-weight:700">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <button class="remove-btn" data-id="${item.id}" data-action="remove" style="background:none;border:none;color:var(--text-secondary);cursor:pointer">
                         <i data-lucide="trash-2" style="width:18px;"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(el);
        });
    }

    const count = cart.reduce((acc, cur) => acc + cur.quantity, 0);
    let total = cart.reduce((acc, cur) => acc + (cur.price * cur.quantity), 0);

    // Cargo por envío: $20 si el subtotal es <= $300, gratis si es mayor
    if (total > 0 && total <= 300) {
        total += 20;
    }

    cartCount.innerText = count;
    totalPriceElement.innerText = `$${total.toFixed(2)}`;
    lucide.createIcons();
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
}

function showCart() {
    cartSidebar.classList.add('open');
}

function hideCart() {
    cartSidebar.classList.remove('open');
}

// Delegación de eventos: permite clicks reales (y del driver de automatización)
// sobre botones generados dinámicamente, sin depender de onclick inline.
menuGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="add"]');
    if (btn) addToCart(Number(btn.dataset.id));
});
cartItemsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="remove"]');
    if (btn) removeFromCart(Number(btn.dataset.id));
});

// Events
cartToggle.onclick = () => { showCart(); };
closeCart.onclick = hideCart;

catLinks.forEach(link => {
    link.onclick = (e) => {
        catLinks.forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        renderMenu(e.target.dataset.category);
        
        // Show/hide kiliado field
        const kiliadoField = document.getElementById('kiliadoField');
        if (kiliadoField) {
            kiliadoField.style.display = e.target.dataset.category === 'kiliado' ? 'block' : 'none';
        }
    };
});


window.onscroll = () => {
    const btt = document.getElementById('backToTop');
    if (window.scrollY > 300) btt.classList.add('show');
    else btt.classList.remove('show');
};

document.getElementById('backToTop').onclick = () => window.scrollTo(0, 0);

checkoutBtn.onclick = () => {
    const text = cart.map(i => `${i.title} (x${i.quantity})`).join('\n');
    const total = totalPriceElement.innerText;
    const payment = document.querySelector('input[name="payment"]').value;
    const tacoType = document.querySelector('input[name="tacoType"]:checked') ? document.querySelector('input[name="tacoType"]:checked').value : 'Surtido';
    const kiliadoSize = document.querySelector('input[name="kiliadoSize"]:checked') ? document.querySelector('input[name="kiliadoSize"]:checked').value : '1kg';
    const clientName = document.getElementById('clientName').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const address = document.getElementById('deliveryAddress').value;
    const adminPhone = localStorage.getItem('adminPhone') || "521234567890";

    if (!clientName || !clientPhone) {
        alert("Por favor ingresa tu nombre y un teléfono de contacto.");
        return;
    }

    let payMsg = "💵 *Pago:* Efectivo (Contraentrega)";

    const customerMsg = `👤 *Cliente:* ${clientName}\n📞 *Teléfono:* ${clientPhone}`;
    const locMsg = address ? `📍 *Dirección de entrega:* ${address}` : "📍 *Dirección de entrega:* Sin especificar";
    const tacoMsg = `🌮 *Tipo de taco:* ${tacoType}`;
    const kiliadoMsg = cart.some(i => i.category === 'kiliado') ? `🥩 *Kiliado:* ${kiliadoSize}` : '';

    const msg = encodeURIComponent(`¡Hola Tacos Olmedo!\n\n🛍️ *Nuevo Pedido:*\n${text}\n\n💰 *Total del carrito:* ${total}\n${payMsg}\n${tacoMsg}${kiliadoMsg ? '\n' + kiliadoMsg : ''}\n${customerMsg}\n${locMsg}`);

    // Save order for Admin/Repartidor
    const orders = JSON.parse(localStorage.getItem('tacosOrders')) || [];
    const newOrder = {
        id: Date.now(),
        items: cart,
        total: total,
        customerName: clientName,
        customerPhone: clientPhone,
        paymentMethod: payment,
        tacoType: tacoType,
        kiliadoSize: kiliadoSize,
        address: address,
        status: 'Pendiente',
        date: new Date().toLocaleString()
    };
    orders.push(newOrder);
    localStorage.setItem('tacosOrders', JSON.stringify(orders));

    window.open(`https://wa.me/${adminPhone}?text=${msg}`);

    // Optional: Clear cart after checkout
    cart = [];
    localStorage.setItem('tacosCart', JSON.stringify(cart));

    // Clear inputs
    document.getElementById('clientName').value = '';
    document.getElementById('clientPhone').value = '';
    document.getElementById('deliveryAddress').value = '';

    updateCartUI();
};

// Geolocalización nativa (sin mapa externo)
document.getElementById('confirmLocationBtn').onclick = () => {
    const addrField = document.getElementById('deliveryAddress');
    if (!navigator.geolocation) {
        alert("Geolocalización no soportada en este navegador.");
        return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        if (!addrField.value.trim()) {
            addrField.value = `Ubicación actual: ${lat}, ${lng}`;
        }
    }, () => {
        alert("No se pudo obtener tu ubicación. Escribe tu dirección manualmente.");
    });
};

renderMenu();

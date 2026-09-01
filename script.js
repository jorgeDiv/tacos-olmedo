const defaultMenu = [
    {
        id: 8,
        title: "Lo Quiero Kiliado 500g",
        desc: '500g de carnitas "KILIADO" + tortillas + salsas, preparadas con la receta especial de la casa.',
        price: 200.00,
        category: "kiliado",
        img: "assets/kiliado.png"
    },
    {
        id: 9,
        title: "Lo Quiero Kiliado 1kg",
        desc: '1kg de carnitas "KILIADO" + tortillas + salsas, preparadas con la receta especial de la casa.',
        price: 400.00,
        category: "kiliado",
        badge: "Popular",
        img: "assets/kiliado.png"
    },
    {
        id: 10,
        title: "Lo Quiero Kiliado 1 1/2 Kg",
        desc: '1 1/2 Kg de carnitas "KILIADO" + tortillas + salsas, preparadas con la receta especial de la casa.',
        price: 600.00,
        category: "kiliado",
        img: "assets/kiliado.png"
    },
    {
        id: 11,
        title: "Lo Quiero Kiliado 2kg",
        desc: '2kg de carnitas "KILIADO" + tortillas + salsas, preparadas con la receta especial de la casa.',
        price: 800.00,
        category: "kiliado",
        img: "assets/kiliado.png"
    },
    {
        id: 12,
        title: "Lo Quiero Kiliado 3kg",
        desc: '3kg de carnitas "KILIADO" + tortillas + salsas, preparadas con la receta especial de la casa.',
        price: 1200.00,
        category: "kiliado",
        badge: "Familiar",
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
        desc: "Tradicional pan Chapata casero, relleno de jugosas carnitas preparadas al momento acompañadas con sus salsas.",
        price: 60.00,
        category: "tortas",
        img: "assets/torta_carnitas.jpg"
    },
    {
        id: 7,
        title: "Agua Fresca",
        desc: "Agua fresca (400 mL) de sabor natural, la mejor opción para refrescarte.",
        price: 25.00,
        category: "bebidas",
        badge: "⭐ Favorito",
        img: "assets/drinks.jpg"
    },
    {
        id: 6,
        title: "Refresco 355mL",
        desc: "Refreso en su presentacion de 355mL para acompañar tus alimentos.",
        price: 25.00,
        category: "bebidas",
        img: "assets/refresco_355mL.png"
    },
    {
        id: 9,
        title: "Coca-Cola 600mL",
        desc: "Coca-Cola en botella de 600mL para acompañar tus alimentos.",
        price: 30.00,
        category: "bebidas",
        img: "assets/coca_cola_600mL.png"
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
                <div style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem">
                    <div style="flex:1">
                        <h4 style="font-family:var(--font-header)">${item.title}</h4>
                        <span style="color:var(--accent);font-weight:700">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div class="qty-controls" style="display:flex;align-items:center;gap:0.25rem">
                        <button class="qty-btn qty-minus" data-id="${item.id}" data-action="decrease" style="width:28px;height:28px;border-radius:50%;border:1px solid var(--glass-border);background:var(--glass);color:var(--text);cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700">−</button>
                        <span class="qty-num" style="min-width:24px;text-align:center;font-weight:700">${item.quantity}</span>
                        <button class="qty-btn qty-plus" data-id="${item.id}" data-action="increase" style="width:28px;height:28px;border-radius:50%;border:1px solid var(--accent);background:var(--accent);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700">+</button>
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
    const removeBtn = e.target.closest('[data-action="remove"]');
    if (removeBtn) {
        removeFromCart(Number(removeBtn.dataset.id));
        return;
    }
    
    const incBtn = e.target.closest('[data-action="increase"]');
    if (incBtn) {
        const item = cart.find(i => i.id === Number(incBtn.dataset.id));
        if (item) item.quantity += 1;
        updateCartUI();
        showCart();
        return;
    }
    
    const decBtn = e.target.closest('[data-action="decrease"]');
    if (decBtn) {
        const item = cart.find(i => i.id === Number(decBtn.dataset.id));
        if (item) {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                removeFromCart(item.id);
            } else {
                updateCartUI();
                showCart();
            }
        }
        return;
    }
});

// Events
cartToggle.onclick = () => { showCart(); };
closeCart.onclick = hideCart;

catLinks.forEach(link => {
    link.onclick = (e) => {
        catLinks.forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        renderMenu(e.target.dataset.category);
        

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

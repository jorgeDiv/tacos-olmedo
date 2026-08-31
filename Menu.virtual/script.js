const defaultMenu = [
    { id: 1, title: "Orden de 5 tacos", desc: "La orden clasica, deliciosos tacos con cilantro, cebolla y tu salsa favorita.", price: 100.00, category: "tacos", badge: "Popular", img: "assets/tacos.jpg" },
    { id: 2, title: "Orden de 6 tacos", desc: "La orden perfecta para compartir o para los mas hambrientos.", price: 120.00, category: "tacos", img: "assets/tacos.jpg" },
    { id: 3, title: "Orden de 7 tacos", desc: "Excelente porcion de tacos bien servidos.", price: 140.00, category: "tacos", img: "assets/tacos.jpg" },
    { id: 4, title: "Orden de 8 tacos", desc: "La mejor opcion para grupos y familias.", price: 160.00, category: "tacos", badge: "Familiar", img: "assets/tacos.jpg" },
    { id: 5, title: "Torta de Carnitas", desc: "Tradicional pan telera relleno de jugosas carnitas preparadas al momento.", price: 50.00, category: "tortas", img: "assets/carnitas.jpg" },
    { id: 6, title: "Refresco", desc: "Bebida fria en lata o botella para acompanar tus alimentos.", price: 20.00, category: "bebidas", img: "assets/refresco.jpg" },
    { id: 7, title: "Agua Fresca", desc: "Agua fresca de sabor natural, la mejor opcion para refrescarte.", price: 25.00, category: "bebidas", badge: "Favorito", img: "assets/drinks.jpg" }
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
function renderMenu(category = 'all') {
    menuGrid.innerHTML = '';
    const filtered = category === 'all' ? menuData : menuData.filter(i => i.category === category);
    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-item';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.innerHTML = `<div class="item-img-container"><img src="${item.img}" alt="${item.title}" class="item-img" loading="lazy">${item.badge ? `<span class="item-badge">${item.badge}</span>` : ''}</div><div class="item-info"><h3 class="item-title">${item.title}</h3><p class="item-desc">${item.desc}</p><div class="item-footer"><span class="item-price">$${item.price.toFixed(2)}</span><button class="add-btn" data-id="${item.id}" data-action="add"><i data-lucide="plus"></i></button></div></div>`;
        menuGrid.appendChild(card);
        setTimeout(() => { card.style.transition = 'all 0.4s ease'; card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
    });
    lucide.createIcons();
}
function addToCart(id) {
    const item = menuData.find(i => i.id === id);
    const existing = cart.find(i => i.id === id);
    if (existing) { existing.quantity += 1; } else { cart.push({ ...item, quantity: 1 }); }
    updateCartUI(); showCart();
}
function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    const notice = document.querySelector('.shipping-notice');
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Tu carrito esta vacio</p>';
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
            el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><div><h4 style="font-family:var(--font-header)">${item.title} x${item.quantity}</h4><span style="color:var(--accent);font-weight:700">$${(item.price * item.quantity).toFixed(2)}</span></div><button class="remove-btn" data-id="${item.id}" data-action="remove" style="background:none;border:none;color:var(--text-secondary);cursor:pointer"><i data-lucide="trash-2" style="width:18px;"></i></button></div>`;
            cartItemsContainer.appendChild(el);
        });
    }
    const count = cart.reduce((acc, cur) => acc + cur.quantity, 0);
    let total = cart.reduce((acc, cur) => acc + (cur.price * cur.quantity), 0);
    if (total > 0 && total <= 300) { total += 20; }
    cartCount.innerText = count;
    totalPriceElement.innerText = `$${total.toFixed(2)}`;
    lucide.createIcons();
}
function removeFromCart(id) { cart = cart.filter(i => i.id !== id); updateCartUI(); }
function showCart() { cartSidebar.classList.add('open'); }
function hideCart() { cartSidebar.classList.remove('open'); }
menuGrid.addEventListener('click', (e) => { const btn = e.target.closest('[data-action="add"]'); if (btn) addToCart(Number(btn.dataset.id)); });
cartItemsContainer.addEventListener('click', (e) => { const btn = e.target.closest('[data-action="remove"]'); if (btn) removeFromCart(Number(btn.dataset.id)); });
cartToggle.onclick = () => { showCart(); };
closeCart.onclick = hideCart;
catLinks.forEach(link => { link.onclick = (e) => { catLinks.forEach(l => l.classList.remove('active')); e.target.classList.add('active'); renderMenu(e.target.dataset.category); }; });
window.onscroll = () => { const btt = document.getElementById('backToTop'); if (window.scrollY > 300) btt.classList.add('show'); else btt.classList.remove('show'); };
document.getElementById('backToTop').onclick = () => window.scrollTo(0, 0);
checkoutBtn.onclick = () => {
    const text = cart.map(i => `${i.title} (x${i.quantity})`).join('\n');
    const total = totalPriceElement.innerText;
    const payment = document.querySelector('input[name="payment"]:checked').value;
    const clientName = document.getElementById('clientName').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const address = document.getElementById('deliveryAddress').value;
    const adminPhone = localStorage.getItem('adminPhone') || "521234567890";
    if (!clientName || !clientPhone) { alert("Por favor ingresa tu nombre y un telefono de contacto."); return; }
    let payMsg = "*Pago:* Efectivo (Contraentrega)";
    const customerMsg = `*Cliente:* ${clientName}\n*Telefono:* ${clientPhone}`;
    const locMsg = address ? `*Direccion de entrega:* ${address}` : "*Direccion de entrega:* Sin especificar";
    const msg = encodeURIComponent(`Hola Tacos Olmedo!\n\n*Nuevo Pedido:*\n${text}\n\n*Total del carrito:* ${total}\n${payMsg}\n${customerMsg}\n${locMsg}`);
    const orders = JSON.parse(localStorage.getItem('tacosOrders')) || [];
    const newOrder = { id: Date.now(), items: cart, total: total, customerName: clientName, customerPhone: clientPhone, paymentMethod: payment, address: address, status: 'Pendiente', date: new Date().toLocaleString() };
    orders.push(newOrder);
    localStorage.setItem('tacosOrders', JSON.stringify(orders));
    window.open(`https://wa.me/${adminPhone}?text=${msg}`);
    cart = [];
    localStorage.setItem('tacosCart', JSON.stringify(cart));
    document.getElementById('clientName').value = '';
    document.getElementById('clientPhone').value = '';
    document.getElementById('deliveryAddress').value = '';
    updateCartUI();
};
document.getElementById('confirmLocationBtn').onclick = () => {
    const addrField = document.getElementById('deliveryAddress');
    if (!navigator.geolocation) { alert("Geolocalizacion no soportada en este navegador."); return; }
    navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        if (!addrField.value.trim()) { addrField.value = `Ubicacion actual: ${lat}, ${lng}`; }
    }, () => { alert("No se pudo obtener tu ubicacion. Escribe tu direccion manualmente."); });
};
renderMenu();

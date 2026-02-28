/* global product list, cart, auth helpers */

// --- product data -----------------------------------------------------------
var products = [
    {
        id: 1,
        name: 'Smartphone X100',
        description: 'A fast and powerful smartphone with great battery life.',
        price: 499.00,
        image: 'https://via.placeholder.com/250x150?text=Smartphone',
        category: 'phones'
    },
    {
        id: 2,
        name: 'UltraBook Pro',
        description: 'Lightweight laptop with long battery life and full HD screen.',
        price: 999.00,
        image: 'https://via.placeholder.com/250x150?text=Laptop',
        category: 'computers'
    },
    {
        id: 3,
        name: 'Noise-Cancelling Headphones',
        description: 'Comfortable over-ear headphones with active noise cancellation.',
        price: 199.00,
        image: 'https://via.placeholder.com/250x150?text=Headphones',
        category: 'audio'
    }
];

// --- shopping cart ----------------------------------------------------------
var cart = [];

function loadCart() {
    var stored = localStorage.getItem('cart');
    if (stored) {
        try { cart = JSON.parse(stored) || []; } catch(e) { cart = []; }
    }
}
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
function updateCartCount() {
    var countEl = document.getElementById('cartCount');
    if (countEl) {
        var total = cart.reduce(function(sum,item){return sum + item.qty;},0);
        countEl.textContent = total;
    }
}
function getCartItem(id) {
    return cart.find(function(i){return i.id===id;});
}
function addToCart(id, qty) {
    qty = qty || 1;
    var existing = getCartItem(id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({id:id, qty:qty});
    }
    saveCart();
    updateCartCount();
    alert('Added to cart.');
}

// --- product rendering & search -------------------------------------------
function renderProducts(filter) {
    var container = document.getElementById('productList');
    if (!container) return;
    container.innerHTML = '';
    var text = (filter || '').toLowerCase();
    products.forEach(function(p) {
        if (text && p.name.toLowerCase().indexOf(text) === -1 && p.category.toLowerCase().indexOf(text) === -1) {
            return;
        }
        var div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"></a>
            <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
            <p>${p.description}</p>
            <div class="price">$${p.price.toFixed(2)}</div>
            <button onclick="addToCart(${p.id})">Buy Now</button>
        `;
        container.appendChild(div);
    });
}

// --- auth/user account ------------------------------------------------------
function registerUser(name,email,password) {
    var users = JSON.parse(localStorage.getItem('users')||'[]');
    if (users.find(function(u){return u.email===email;})) {
        return false; // already exists
    }
    users.push({name:name,email:email,password:password,orders:[]});
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}
function loginUser(email,password) {
    var users = JSON.parse(localStorage.getItem('users')||'[]');
    var u = users.find(function(u){return u.email===email && u.password===password;});
    if (u) {
        localStorage.setItem('currentUser', email);
        return true;
    }
    return false;
}
function logoutUser() {
    localStorage.removeItem('currentUser');
    updateAuthLink();
}
function getCurrentUser() {
    var email = localStorage.getItem('currentUser');
    if (!email) return null;
    var users = JSON.parse(localStorage.getItem('users')||'[]');
    return users.find(function(u){return u.email===email;}) || null;
}
function updateAuthLink() {
    var authLi = document.getElementById('authLink');
    if (!authLi) return;
    var user = getCurrentUser();
    if (user) {
        authLi.innerHTML = 'Hello, '+user.name+' (<a href="#" id="logoutLink">Logout</a>)';
        document.getElementById('logoutLink').addEventListener('click', function(e){ e.preventDefault(); logoutUser(); });
    } else {
        authLi.innerHTML = '<a href="login.html">Login</a> / <a href="register.html">Register</a>';
    }
}

// --- payment helper (called from checkout.html) ---------------------------
async function createCheckoutSession(cartItems) {
    var response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems })
    });
    return response.json();
}

// cart rendering for checkout page
function renderCart() {
    var list = document.getElementById('cartItems');
    if (!list) return;
    list.innerHTML = '';
    var totalCost = 0;
    cart.forEach(function(item) {
        var prod = products.find(p=>p.id===item.id);
        if (!prod) return;
        var li = document.createElement('li');
        li.innerHTML = `
            ${prod.name} - $${prod.price.toFixed(2)} x ${item.qty}
            <button onclick="changeQty(${item.id},-1)">-</button>
            <button onclick="changeQty(${item.id},1)">+</button>
            <button onclick="removeItem(${item.id})">Remove</button>
        `;
        list.appendChild(li);
        totalCost += prod.price * item.qty;
    });
    var totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = 'Total: $' + totalCost.toFixed(2);
}

function payCart() {
    if (!getCurrentUser()) {
        alert('You must be logged in to proceed to payment.');
        window.location.href = 'login.html';
        return;
    }
    createCheckoutSession(cart.map(i=>{
        var p = products.find(p=>p.id===i.id);
        return {name: p.name, price: p.price, qty: i.qty};
    })).then(function(data){
        if (data.url) {
            window.location.href = data.url;
        } else {
            alert('Error creating payment session');
        }
    }).catch(function(e){
        console.error(e);
        alert('Payment error');
    });
}

// --- FAQ: initialization for pages ----------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // global
    loadCart();
    updateCartCount();
    updateAuthLink();

    // if on index page, render products & wire search
    if (document.getElementById('productList')) {
        renderProducts();
        var search = document.getElementById('searchInput');
        if (search) {
            search.addEventListener('input', function(e){ renderProducts(e.target.value); });
        }
    }

    // contact form (AJAX)
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e){
            e.preventDefault();
            var data = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                message: contactForm.message.value
            };
            fetch(contactForm.action, {
                method: contactForm.method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(function(res){
                return res.json();
            }).then(function(json){
                var notice = document.getElementById('formNotice');
                if (notice) {
                    notice.textContent = json.message || 'Message sent; thank you!';
                    notice.style.display = 'block';
                }
                contactForm.reset();
            }).catch(function(err){
                console.error(err);
            });
        });
    }
    // login form
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e){
            e.preventDefault();
            var email = document.getElementById('loginEmail').value;
            var pass = document.getElementById('loginPassword').value;
            if (loginUser(email,pass)) {
                window.location.href = 'index.html';
            } else {
                document.getElementById('loginNotice').textContent = 'Invalid credentials.';
                document.getElementById('loginNotice').style.display = 'block';
            }
        });
    }
    var regForm = document.getElementById('registerForm');
    if (regForm) {
        regForm.addEventListener('submit', function(e){
            e.preventDefault();
            var name = document.getElementById('regName').value;
            var email = document.getElementById('regEmail').value;
            var pass = document.getElementById('regPassword').value;
            if (registerUser(name,email,pass)) {
                alert('Registration successful, please log in.');
                window.location.href = 'login.html';
            } else {
                document.getElementById('regNotice').textContent = 'Email already in use.';
                document.getElementById('regNotice').style.display = 'block';
            }
        });
    }
    // checkout page logic
    if (document.getElementById('cartItems')) {
        renderCart();
        var payBtn = document.getElementById('payButton');
        if (payBtn) payBtn.addEventListener('click', payCart);
    }
});

// mobile nav toggle
var navToggle = document.querySelector('.nav-toggle');
if (navToggle) {
    navToggle.addEventListener('click', function() {
        var nav = document.getElementById('navList');
        nav.classList.toggle('show');
    });
}

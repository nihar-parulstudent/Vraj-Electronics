// shopping cart implementation using localStorage
var cart = [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    var stored = localStorage.getItem('cart');
    if (stored) {
        try { cart = JSON.parse(stored) || []; } catch(e) { cart = []; }
    }
}

function updateCartCount() {
    var countEl = document.getElementById('cartCount');
    if (countEl) {
        countEl.textContent = cart.length;
    }
}

function addToCart(item) {
    cart.push(item);
    saveCart();
    updateCartCount();
    // optionally, redirect to checkout automatically:
    // window.location.href = 'checkout.html';
    alert(item + ' has been added to your cart.');
}

// form feedback (Formspree posts directly to your email)
// show a notice once submitted successful, Formspree redirects to the same page
(function() {
    var form = document.getElementById('contactForm');
    var notice = document.getElementById('formNotice');
    if (window.location.search.indexOf('success=true') !== -1 && notice) {
        notice.style.display = 'block';
    }
})();

// mobile nav toggle
document.querySelector('.nav-toggle').addEventListener('click', function() {
    var nav = document.getElementById('navList');
    nav.classList.toggle('show');
});

// initialize cart count
window.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartCount();
});
# Vraj Electronics Website

This is a simple electronics storefront built with HTML, CSS and JavaScript. It now includes the following features:

- Product detail pages with dynamic URLs (`product.html?id=...`).
- Search/filter bar on the products section.
- Shopping cart with quantity controls, item removal and total calculation.
- Basic user account support (register/login/logout) stored in `localStorage`.
- Stripe checkout integration via a minimal Node.js backend.
- AJAX contact form that posts to the server.

## Getting Started

1. **Install dependencies** (Node.js required):
   ```powershell
   cd "c:\Users\nihar\OneDrive\Desktop\vraj electronics"
   npm install express body-parser stripe
   ```
   (You may also install nodemailer if you want email support.)

2. **Set environment variable** for Stripe secret key (use test key):
   ```powershell
   $env:STRIPE_SECRET_KEY="sk_test_your_test_key"
   ```

3. **Run the server**:
   ```powershell
   node server.js
   ```
   This will serve the static files and handle `/contact` and `/create-checkout-session`.

4. **Open the site** in your browser at `http://localhost:3000/index.html`.

## How to Use

- Browse products or search by name/category.
- Click a product to view details and add a quantity to the cart.
- Register and log in to be able to proceed to the payment step.
- The checkout page loads the cart, allows modifying quantities and sends the order to Stripe (test mode).
- After a successful payment you'll see a thank-you message and the cart will be cleared.
- Contact form sends data to the server, which currently logs it to the console.

## Notes

- This is a demo; user credentials and cart are stored in `localStorage` and are **not secure**.
- The Stripe integration is minimal and for real use you'd need proper order handling and security on the server.
- You can also deploy the PHP `contact.php` if you prefer a PHP backend.

Feel free to extend or refactor as needed.

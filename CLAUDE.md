# Website project

This is the website for MoonMade, a handmade bag brand. It is a simple static website (plain HTML + CSS, no build step) hosted free on GitHub Pages.
Every push to the `main` branch automatically updates the live site within about a minute.

- `index.html` is the page content
- `style.css` holds colors, fonts and layout (colors and fonts are set at the top in `:root`)
- `images/` is where photos and logos go

## Guidelines for Claude
- The person editing may not be technical. Explain changes in plain language and avoid jargon.
- Keep it plain HTML/CSS. Don't add frameworks, build tools or npm packages unless asked.
- Keep the site mobile-friendly.
- When asked to "publish", "push" or "make it live": commit with a clear message, run `git push`,
  then tell the user the site will update at the live URL in about a minute.
- Before making changes, run `git pull` so you have the latest version.

## Design direction
- Clean, chic and minimal (inspired by le-febour.com): serif type, near-black on white/warm gray,
  small uppercase labels with wide letter-spacing, lots of white space, square product photos.
- Subtle moon/astrology touches (crescent logo, moon-phase divider). Keep them understated.
- Brand colors and fonts live in the `:root` block at the top of `style.css`.
- Product photos go in `images/` and are linked from `products.js`: `cover` is a square crop of the bag for the shop grid and cart (crop close on the bag at a similar size to the other covers so the grid flows), and `photos` are the full photos shown in the pop-up. Resize photos to about 1200px wide before adding them.

## Shop, cart and checkout
- Bags are made in small batches (not one of a kind): no colour options; each bag has a `stock` count and the cart never allows more than that. Stock does not go down automatically after an order; lower it by hand in `products.js`.
- `products.js` is the single list of bags (name, price, description, photo, `stock`) plus `ORDER_EMAIL`. The shop grid, bag details pop-up, cart and checkout all read from it. To add, remove or change a bag, edit only this file. At `stock: 0` a bag stays on the site marked "Sold".
- `cart.js` draws the shop grid, the bag details pop-up (opens when a bag is clicked), runs the slide-out cart drawer and saves the cart in the browser (localStorage) so it carries between pages.
- `checkout.html` is the checkout form. Orders are emailed to `ORDER_EMAIL` through FormSubmit.co (free, no account). The first order after changing the email triggers an activation email that must be clicked once.
- No payment is taken online (owner's choice for now); the owner emails the customer to confirm and arrange payment.
- Brand domain: moon-made.ca (not connected to GitHub Pages yet). Contact/order email: info@moon-made.ca.

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
- Product photos go in `images/` and are linked from `products.json`: `photos` are the full photos shown in the pop-up, and `cover` (optional) is a hand-made square crop of the bag for the shop grid and cart. When Claude adds a bag, make a `cover` cropped close on the bag at a similar size to the other covers so the grid flows. Without a `cover`, the grid crops the first photo automatically using `crop` (top / center / bottom). Resize photos to about 1200px wide before adding them.

## Shop, cart and checkout
- Bags are made in small batches (not one of a kind): no colour options; each bag has a `stock` count and the cart never allows more than that. Stock does not go down automatically after an order; lower it in `products.json` (or in the admin).
- `products.json` is the single list of bags (name, price, stock, description, photos, cover, crop, alt, hidden). The shop grid, bag details pop-up, cart and checkout all read from it (`cart.js` loads it when the page opens). To add, remove or change a bag, edit only this file. At `stock: 0` a bag stays on the site marked "Sold"; `hidden: true` keeps it off the site. Keep it valid JSON.
- `settings.js` holds `ORDER_EMAIL`.
- **Shop admin:** Jess edits bags herself through Pages CMS (https://app.pagescms.org), set up by `.pages.yml`. Her saves are commits to `main`, so always `git pull` first. Keep `.pages.yml` fields in sync if the bag fields change. Bigger design changes come through Claude.
- **Local preview:** because the bags are loaded from `products.json`, opening `index.html` directly won't show them. Run `python3 -m http.server 8000` in the project folder and open http://localhost:8000.
- `cart.js` draws the shop grid, the bag details pop-up (opens when a bag is clicked), runs the slide-out cart drawer and saves the cart in the browser (localStorage) so it carries between pages.
- `checkout.html` is the checkout form. Orders are emailed to `ORDER_EMAIL` through FormSubmit.co (free, no account). The first order after changing the email triggers an activation email that must be clicked once.
- No payment is taken online (owner's choice for now); the owner emails the customer to confirm and arrange payment.
- Brand domain: moon-made.ca (not connected to GitHub Pages yet). Contact/order email: info@moon-made.ca.

// ---- MoonMade products ----
// This is the one place to add, remove or edit bags. The shop grid, cart and checkout all read from here.
// Bags are made in small batches. Each entry is one design, with a stock count.
//
// id:          short unique name, no spaces (used internally by the cart)
// name:        shown on the site
// price:       in dollars, e.g. 245. Use 0 while the price isn't decided yet (shows as "Price TBC")
// description: a few sentences shown when someone clicks the bag (materials, size, details)
// cover:       the square photo shown in the shop grid and cart, e.g. 'images/ivory-cover.jpg'.
//              Leave it out to use the first of the photos below. Use null for photos and cover to show the moon placeholder.
// photos:      the photos shown when someone clicks the bag (the first one shows first)
// alt:         a short description of the bag, for screen readers
// stock:       how many of this bag are available. Lower it by hand after each sale (the site can't do it by itself).
//              At 0 the bag stays on the site marked "Sold" and can't be added to the cart.

const PRODUCTS = [
  {
    id: 'ivory',
    name: 'The Ivory Knot Bag',
    price: 0,
    description: 'A soft ivory satin wristlet with a knotted handle and a long, hand-knotted macramé fringe that sways as you move.',
    cover: 'images/ivory-cover.jpg',
    photos: ['images/ivory-1.jpg', 'images/ivory-2.jpg'],
    alt: 'Ivory satin knot bag with a long knotted fringe',
    stock: 2,
  },
  {
    id: 'lavender',
    name: 'The Lavender Blossom Bag',
    price: 0,
    description: 'A pale lavender brocade wristlet woven with delicate blossoms, finished with a full black fringe.',
    cover: 'images/lavender-cover.jpg',
    photos: ['images/lavender-1.jpg'],
    alt: 'Lavender floral brocade knot bag with black fringe',
    stock: 2,
  },
  {
    id: 'yellow',
    name: 'The Golden Blossom Bag',
    price: 0,
    description: 'A golden yellow satin brocade wristlet with black blossom branches, a knotted handle and a long black fringe.',
    cover: 'images/yellow-cover.jpg',
    photos: ['images/yellow-1.jpg', 'images/yellow-2.jpg'],
    alt: 'Golden yellow floral brocade knot bag with black fringe',
    stock: 2,
  },
  {
    id: 'midnight',
    name: 'The Midnight Fringe Bag',
    price: 0,
    description: 'A glossy black satin wristlet with a knotted handle and a soft black fringe. Simple, elegant and goes with everything.',
    cover: 'images/midnight-cover.jpg',
    photos: ['images/midnight-1.jpg'],
    alt: 'Black satin knot bag with black fringe',
    stock: 2,
  },
  {
    id: 'eclipse',
    name: 'The Eclipse Bag',
    price: 0,
    description: 'Black satin with a bright white fringe, like the edge of the moon in an eclipse. A wristlet with a knotted handle.',
    cover: 'images/eclipse-cover.jpg',
    photos: ['images/eclipse-1.jpg'],
    alt: 'Black satin knot bag with white fringe',
    stock: 2,
  },
  {
    id: 'stardust',
    name: 'The Stardust Bag',
    price: 0,
    description: 'A black sequin wristlet that sparkles like a night sky, with a knotted handle and a fine black fringe.',
    cover: 'images/stardust-cover.jpg',
    photos: ['images/stardust-1.jpg', 'images/stardust-2.jpg'],
    alt: 'Black sequin knot bag with black fringe',
    stock: 2,
  },
];

// Where orders are emailed (via FormSubmit.co, free, no account).
// The very first order sends an activation email to this address. Click the link in it once.
const ORDER_EMAIL = 'info@moon-made.ca';

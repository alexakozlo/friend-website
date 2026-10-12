// ---- MoonMade products ----
// This is the one place to add, remove or edit bags. The shop grid, cart and checkout all read from here.
// Every bag is one of a kind, so each entry is a single bag.
//
// id:          short unique name, no spaces (used internally by the cart)
// name:        shown on the site
// price:       in dollars, e.g. 245. Use 0 while the price isn't decided yet (shows as "Price TBC")
// description: a few sentences shown when someone clicks the bag (materials, size, details)
// image:       a photo in the images/ folder, e.g. 'images/crescent.jpg'. Use null for the moon placeholder.
// alt:         a short description of the photo, for screen readers
// sold:        change to true once the bag has sold. It stays on the site marked "Sold" and can't be added to the cart.

const PRODUCTS = [
  {
    id: 'crescent',
    name: 'The Crescent Bag',
    price: 0,
    description: 'A soft, curved shoulder bag shaped like a waxing moon. Write the materials, size and little details of this bag here.',
    image: null,
    alt: 'The Crescent Bag',
    sold: false,
  },
  {
    id: 'eclipse',
    name: 'The Eclipse Pouch',
    price: 0,
    description: 'A small, round pouch for the everyday essentials. Write the materials, size and little details of this bag here.',
    image: null,
    alt: 'The Eclipse Pouch',
    sold: false,
  },
  {
    id: 'tide',
    name: 'The Tide Bag',
    price: 0,
    description: 'A roomy tote with a gentle, wave-like shape. Write the materials, size and little details of this bag here.',
    image: null,
    alt: 'The Tide Bag',
    sold: false,
  },
];

// Where orders are emailed (via FormSubmit.co, free, no account).
// The very first order sends an activation email to this address. Click the link in it once.
const ORDER_EMAIL = 'info@moon-made.ca';

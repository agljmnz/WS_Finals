const productsData = [
  { id: 1, name: 'Cinnamon Roll', price: 5.00, image: 'Cinnamon rolls.png' },
  { id: 2, name: 'Cookies', price: 3.50, image: 'cookies.png' },
  { id: 3, name: 'Macaron', price: 2.50, image: 'macaron.png' },
  { id: 4, name: 'Donut', price: 3.00, image: 'donut.png' },
  { id: 5, name: 'Croissant', price: 3.89, image: 'croissant.png' },
  { id: 6, name: 'Chocolate Brownies', price: 4.50, image: 'Chocolate Brownies.png' }
];

let cart = [];

const productsContainer = document.querySelector('.products');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalEl = document.querySelector('.cart-total');
const cartCounter = document.querySelector('.cart-counter');
const checkoutBtn = document.getElementById('checkoutBtn');
const emptyMessage = document.querySelector('.empty-message');
const clearCartBtn = document.querySelector('.clear-cart');

// Load cart from localStorage
function loadCart() {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    cart = JSON.parse(storedCart);
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function renderProducts() {
  productsData.forEach(product => {
    const productEl = document.createElement('div');
    productEl.classList.add('product');
    productEl.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image" />
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;
    productsContainer.appendChild(productEl);
  });
}

function updateCart() {
  cartItemsContainer.innerHTML = '';
  if (cart.length === 0) {
    emptyMessage.style.display = 'block';
    document.querySelector('.cart-total').textContent = '';
    cartCounter.textContent = '0';
    return;
  } else {
    emptyMessage.style.display = 'none';
  }

  let total = 0;
  let totalItems = 0;

  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';

    const subtotal = item.price * item.quantity;
    total += subtotal;
    totalItems += item.quantity;

    cartItem.innerHTML = `
      <div>${item.name}</div>
      <div>$${item.price.toFixed(2)}</div>
      <div>
        <button class="decrease" data-index="${index}">-</button>
        ${item.quantity}
        <button class="increase" data-index="${index}">+</button>
      </div>
      <div>$${subtotal.toFixed(2)}</div>
      <button class="remove" data-index="${index}">Remove</button>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  document.querySelector('.cart-total').textContent = `\$${total.toFixed(2)}`;
  cartCounter.textContent = totalItems;
}

function addToCart(productId) {
  const product = productsData.find(p => p.id === parseInt(productId));
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    alert('Item already in cart.');
    return;
  }
  cart.push({ ...product, quantity: 1 });
  saveCart();
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

function changeQuantity(index, delta) {
  const item = cart[index];
  item.quantity += delta;
  if (item.quantity < 1) item.quantity = 1;
  saveCart();
  updateCart();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCart();
}

document.querySelector('.products').addEventListener('click', (e) => {
  if (e.target.classList.contains('add-to-cart')) {
    const id = e.target.dataset.id;
    addToCart(id);
  }
});

document.querySelector('.cart-items').addEventListener('click', (e) => {
  const index = e.target.dataset.index;
  if (e.target.classList.contains('remove')) {
    removeFromCart(index);
  } else if (e.target.classList.contains('decrease')) {
    changeQuantity(index, -1);
  } else if (e.target.classList.contains('increase')) {
    changeQuantity(index, 1);
  }
});

document.querySelector('.clear-cart').addEventListener('click', () => {
  clearCart();
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
  alert(`You have ${cart.reduce((sum, item) => sum + item.quantity, 0)} items in your cart.`);
});

loadCart();
renderProducts();
updateCart();


document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const cartCount = document.getElementById('cart-count');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function updateCart() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = '';
      cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-3');
        cartItem.innerHTML = `
          <div>
            <h5>${item.name}</h5>
            <p>$${item.price.toFixed(2)}</p>
          </div>
          <div>
            <input type="number" value="${item.quantity}" min="1" class="form-control quantity-input" data-index="${index}">
            <button class="btn btn-danger btn-sm remove-from-cart" data-index="${index}">Remove</button>
          </div>
        `;
        cartItemsContainer.appendChild(cartItem);
      });

      const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);
      cartTotal.textContent = total.toFixed(2);

      // Add event listeners for remove buttons and quantity inputs
      const removeButtons = document.querySelectorAll('.remove-from-cart');
      removeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
          const index = event.target.dataset.index;
          cart.splice(index, 1);
          saveCart();
          updateCart();
        });
      });

      const quantityInputs = document.querySelectorAll('.quantity-input');
      quantityInputs.forEach(input => {
        input.addEventListener('change', (event) => {
          const index = event.target.dataset.index;
          const newQuantity = parseInt(event.target.value);
          if (newQuantity > 0) {
            cart[index].quantity = newQuantity;
          } else {
            cart.splice(index, 1);
          }
          saveCart();
          updateCart();
        });
      });
    }
  }

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  addToCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const card = event.target.closest('.card');
      const name = card.querySelector('.card-title').textContent;
      const price = parseFloat(card.querySelector('.card-text strong').textContent.replace('$', ''));

      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      saveCart();
      updateCart();

      alert(`${name} has been added to your cart.`);
    });
  });

  updateCart();
});
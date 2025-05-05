const socket = io();

const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');

productForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(productForm);
  const product = {
    title: formData.get('title'),
    description: formData.get('description'),
    price: parseFloat(formData.get('price')),
  };
  socket.emit('addProduct', product);
  productForm.reset();
});

socket.on('productsList', (products) => {
  productList.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `${p.title} - $${p.price}
      <button onclick="deleteProduct(${p.id})">Eliminar</button>`;
    productList.appendChild(li);
  });
});

function deleteProduct(id) {
  socket.emit('deleteProduct', id);
}

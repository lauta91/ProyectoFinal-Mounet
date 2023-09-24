// Cargar productos desde un archivo JSON
async function cargarProductosDesdeJSON() {
  try {
      const response = await fetch('productos.json');
      const productos = await response.json();
      return productos;
  } catch (error) {
      console.error('Error al cargar los productos:', error);
      throw error; // Propagar el error
  }
}

// Función para mostrar productos en el DOM
async function mostrarProductos() {
  try {
      const productos = await cargarProductosDesdeJSON(); // Cargar productos
      const productosDiv = document.getElementById('productos');
      productosDiv.innerHTML = '';

      productos.forEach((producto, index) => {
          const productoDiv = document.createElement('div');
          productoDiv.classList.add('producto');
          productoDiv.innerHTML = `
              <img src="${producto.imagen}" alt="${producto.nombre}">
              <h3>${producto.nombre}</h3>
              <p>Precio: $${producto.precio}</p>
              <button class="agregar" data-index="${index}">Agregar al Carrito</button>
          `;
          productosDiv.appendChild(productoDiv);
      });
  } catch (error) {
      console.error('Error al mostrar productos:', error);
  }
}

// Actualizar carrito en el DOM
function actualizarCarrito() {
  const carritoUl = document.getElementById('carrito-lista');
  const totalSpan = document.getElementById('total');
  let carritoTotal = 0;
  carritoUl.innerHTML = '';

  carrito.forEach((producto) => {
      const productoLi = document.createElement('li');
      productoLi.textContent = `${producto.nombre} - $${producto.precio}`;
      carritoUl.appendChild(productoLi);
      carritoTotal += producto.precio;
  });

  totalSpan.textContent = carritoTotal;
}

// Guardar carrito en el almacenamiento local (LocalStorage)
function guardarCarritoEnStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Cargar carrito desde el almacenamiento local (LocalStorage)
function cargarCarritoDesdeStorage() {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
      carrito.push(...JSON.parse(carritoGuardado));
      actualizarCarrito();
  }
}

const carrito = [];

// Evento click en el botón "Agregar al Carrito"
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('agregar')) {
      const index = event.target.dataset.index;
      carrito.push(productos[index]);
      actualizarCarrito();
      guardarCarritoEnStorage();
  }
});

// Evento click en el botón "Finalizar Compra"
document.getElementById('finalizar').addEventListener('click', () => {
  if (carrito.length === 0) {
      alert('No ha agregado productos al carrito.');
  } else {
      const confirmacion = confirm('¿Desea finalizar la compra?');
      if (confirmacion) {
          alert(`¡Compra finalizada! Total a pagar: $${totalSpan.textContent}`);
          carrito.length = 0;
          actualizarCarrito();
          guardarCarritoEnStorage();
      }
  }
});

// Cargar productos y carrito al cargar la página
mostrarProductos();
cargarCarritoDesdeStorage();
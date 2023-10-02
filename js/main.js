var productos = [];

async function cargarProductos() {
  try {
    const response = await fetch("data/productos.json");
    if (!response.ok) {
      throw new Error(response.status);
    }
    productos = await response.json();
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const selectProd = document.querySelector("#SelectProd");

  await cargarProductos();

  productos.forEach((producto) => {
    selectProd.innerHTML += `
      <option value="${producto.id}">
        ${producto.producto} |  $${producto.precio}  
      </option>
    `;
  });
});

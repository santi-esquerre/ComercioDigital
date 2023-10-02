async function fetchProducts() {
  let productos = [];
  try {
    const response = await fetch("data/productos.json");
    if (!response.ok) {
      throw new Error(response.status);
    }
    productos = await response.json();
  } catch (error) {
    console.log(error);
  }
  return productos;
}
async function chargeProducts(select) {
  let productos = await fetchProducts();

  productos.forEach((producto) => {
    select.innerHTML += `
      <option value="${producto.id}">
        ${producto.producto} |  $${producto.precio}  
      </option>
    `;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const selectProd = document.querySelector("#SelectProd");
  await chargeProducts(selectProd);

  const productos = await fetchProducts();

  const clientName = document.querySelector("#clienteNombre");
  const clientRUT = document.querySelector("#clienteRUT");
  const quantity = document.querySelector("#Cantidad");
  const addButton = document.querySelector("#addButton"); // Boton para agregar productos
  const clearButton = document.querySelector("#clearButton"); // Boton para limpiar la tabla
  const tableBody = document.querySelector("#tablaProductos"); // Cuerpo de la tabla
  const total = document.querySelector("#precioTotal"); // Total de la compra

  addButton.addEventListener("click", () => {
    if (clientName.value.trim == "") {
      alert("Debe ingresar el nombre del cliente");
      return;
    }
    if (selectProd.value.trim == "") {
      alert("Debe seleccionar un producto");
      return;
    }
    let producto = productos.find(
      (producto) => producto.id == selectProd.value
    );
    let cantidad = quantity.value;
    tableBody.innerHTML += `
      <tr>
        <td>${producto.producto}</td>
        <td>${Intl.NumberFormat("en-US").format(
          producto.precio.toFixed(2)
        )}</td>
        <td>${cantidad}</td>
        <td>${Intl.NumberFormat("en-US").format(
          (producto.precio * cantidad).toFixed(2)
        )}</td>
        <td><button class="btn btn-danger"><i class="fa fa-solid fa-trash"></i></button></td>
      </tr>
    `;

    let totalCompra = 0;

    tableBody.querySelectorAll("tr").forEach((tr) => {
      let totalProducto = tr.cells[3].innerText.replace(/,/g, "");
      totalCompra += parseFloat(totalProducto);
      tr.cells[4].addEventListener("click", () => {
        tr.remove();
        let totalProducto = tr.cells[3].innerText.replace(/,/g, "");
        totalCompra -= parseFloat(totalProducto);
        total.innerHTML = `$${Intl.NumberFormat("en-US").format(
          totalCompra.toFixed(2)
        )}`;
      });
    });

    total.innerHTML = `$${Intl.NumberFormat("en-US").format(
      totalCompra.toFixed(2)
    )}`;
  });

  clearButton.addEventListener("click", () => {
    clientName.value = "";
    clientRUT.value = "";
    quantity.value = "";
    selectProd.selectedIndex = 0;
    tableBody.innerHTML = "";
    total.innerHTML = "$0";
  });
});

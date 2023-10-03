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
    if (clientName.value.trim() == "") {
      alert("Debe ingresar el nombre del cliente");
      return;
    }
    if (selectProd.value.trim() === "Selecciona un producto...") {
      alert("Debe seleccionar un producto");
      return;
    }
    let producto = productos.find((producto) => producto.id == selectProd.value);
    let cantidad = parseInt(quantity.value);
    
  
    // Buscar si el producto ya está en la tabla
    let existingRow = null;
    tableBody.querySelectorAll("tr").forEach((tr) => {
      if (tr.cells[0].innerText === producto.producto) {
        existingRow = tr;
      }
    });
  
    if (existingRow) {
      // Si el producto ya está en la tabla, actualiza la cantidad
      let existingCantidad = parseInt(existingRow.cells[2].innerText);
      existingRow.cells[2].innerText = existingCantidad + cantidad;
  
      let totalProducto = producto.precio * (existingCantidad + cantidad);
      existingRow.cells[3].innerText = `$${Intl.NumberFormat("en-US").format(
        totalProducto.toFixed(2)
      )}`;
    } else {
      // Si el producto no está en la tabla, se agrega como una nueva fila
      tableBody.innerHTML += `
        <tr>
          <td>${producto.producto}</td>
          <td>${Intl.NumberFormat("en-US").format(producto.precio.toFixed(2))}</td>
          <td>${cantidad}</td>
          <td>${Intl.NumberFormat("en-US").format(
            (producto.precio * cantidad).toFixed(2)
          )}</td>
          <td><button class="btn btn-danger"><i class="fa fa-solid fa-trash"></i></button></td>
        </tr>
      `;

      const deleteButtons = document.querySelectorAll(".btn-danger");

      deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener("click", () => {
          const row = deleteButton.closest("tr");
      
          if (row) {
            row.remove();
            actualizarTotal();
          }
        });
      });
    }
    actualizarTotal();
  
    // Actualizar el total
    function actualizarTotal() {
      let totalCompra = 0;
      tableBody.querySelectorAll("tr").forEach((tr) => {
        let totalProducto = parseFloat(tr.cells[3].innerText.replace(/\$|,/g, ""));
        if (!isNaN(totalProducto)) {
          totalCompra += totalProducto;
        }
      });
      total.innerHTML = `$${Intl.NumberFormat("en-US").format(totalCompra.toFixed(2))}`;
    }

  clearButton.addEventListener("click", () => {
    clientName.value = "";
    clientRUT.value = "";
    quantity.value = "";
    selectProd.selectedIndex = 0;
    tableBody.innerHTML = "";
    total.innerHTML = "$0";
    });
  });

  const comprarButton = document.querySelector("#comprarButton");
  comprarButton.addEventListener("click", () => {
    // Calcular el precio total
    const cuotas = document.getElementById("cuotas").value
    if(cuotas >= 1 && cuotas <= 6){
    let totalCompra = 0;
    tableBody.querySelectorAll("tr").forEach((tr) => {
      let totalProducto = parseFloat(tr.cells[3].innerText.replace(/\$|,/g, ""));
      if (!isNaN(totalProducto)) {
        totalCompra += totalProducto;
      }
    });

    // Abre una ventana emergente con el mensaje de compra realizada y el precio total
    const ventanaEmergente = window.open("", "VentanaEmergente", "width=350,height=300");
    const cuotas = document.getElementById("cuotas").value
    const totalValue = totalCompra/cuotas
    const nombreCliente = clientName.value
    const RUTcliente = clientRUT.value

    ventanaEmergente.document.write(`
      <html>
        <head>
          <style>
            body {
              font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            }
          </style>
        </head>
        <body>
        <h1>Compra realizada correctamente</h1>
        <h3>Cliente: ${nombreCliente}</h3>
        <h3>RUT: ${RUTcliente}</h3>
        <p>Precio total:<span style="color:green">$${totalCompra.toFixed(2)}</p>
        <p></span><strong>${cuotas}</strong> cuotas de: <span style="color:blue">$${totalValue.toFixed(2)}</span> </p>
        </body>
      </html>
    `);} else {
      let cuotasError = document.getElementById("cuotasError");
      cuotasError.style.display = "block";
    }
  });
})

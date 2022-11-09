function Producto(id, nombre, precio, stock, img){
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
    this.img = img
}

// Funcion constructora de objetos

let producto1 = new Producto(1, "Libro", 4000, 3200, "../media/Libro Logo.png")
let producto2 = new Producto(2, "Ta-Te-Ti", 1500, 300, "../Media/juegos de madera.jpg")
let producto3 = new Producto(3, "Remera", 2500, 350, "../Media/Palo astilla.jpg")
let producto4 = new Producto(4, "Almanaque", 1800, 250, "../Media/Almanaque.jpg")
let producto5 = new Producto(5, "Autito", 2900, 380, "../Media/Autitos madera.jpg")
let producto6 = new Producto(6, "Remeras", 5000, 440, "../Media/Remera padre madre hijo.jpg")
let producto7 = new Producto(7, "Planificado", 1000, 600, "../Media/Planificador.jpg")
let producto8 = new Producto(8, "Juguete", 3000, 340, "../Media/Torre madera.jpg")
let producto9 = new Producto(9, "Libros de cuentos", 7000, 280, "../Media/Cuentos infantiles.jpg")

let listaDeProductos = [producto1, producto2, producto3, producto4, producto5, producto6, producto7, producto8, producto9]



let catalogo = document.getElementById('items')
let listaCarrito = document.getElementById('carrito')
let botonVaciar = document.getElementById('boton-vaciar')
let valorTotal = document.getElementById('total')
let valorDolar = document.getElementById('dolar')
let carrito = []


botonVaciar.addEventListener('click', handlerBotonVaciar)
cargarCarritoDelAlmacenamiento()
renderizarCarrito()


listaDeProductos.forEach((prod) => {
    let container = document.createElement('div')
    container.classList.add('card', 'col-sm-4')
    catalogo.append(container)
    
    //Image
    let cardImage = document.createElement("img")
    cardImage.classList.add('card-img-top')
    cardImage.src= `${prod.img}`
    container.append(cardImage)

    //Body
    let cardBody = document.createElement("div")
    cardBody.classList.add('card-body')
    container.append(cardBody)

    //Title
    let cardTitle = document.createElement("h5")
    cardTitle.classList.add('card-title')
    cardTitle.innerText = prod.nombre
    cardBody.append(cardTitle)

    //Precio
    let cardPrice = document.createElement("p")
    cardPrice.classList.add('card-text')
    cardPrice.innerText = `$${prod.precio}`
    cardBody.append(cardPrice)

    //Stock
    let cardStock = document.createElement("p")
    cardStock.classList.add('card-text')
    cardStock.innerText = `Stock: ${prod.stock}`
    cardBody.append(cardStock)

    //Boton
    let cardButton = document.createElement("button")
    cardButton.classList.add('btn', 'btn-primary')
    cardButton.innerText = `Comprar`
    cardButton.setAttribute('mark', prod.id)
    cardButton.addEventListener('click', agregarAlCarrito)
    cardBody.append(cardButton)
})


    //Funcion para agregar al carrito
function agregarAlCarrito(event){
    let id = event.target.getAttribute('mark')
    carrito.push(id)
    renderizarCarrito()
}

    //Funcion para renderizar el carrito
function renderizarCarrito(){

    guardarCarritoAlStorage()

    listaCarrito.innerHTML = ''

    let carritoSinElementosRepetidos = [...new Set(carrito)]

    carritoSinElementosRepetidos.forEach((itemId) => {
        let item = listaDeProductos.filter((producto) => {
            return producto.id === parseInt(itemId)
        })
        let cantidad = carrito.reduce((total, id) => {
            return id === itemId ? total += 1 : total
        }, 0)
    

    let linea = document.createElement('li')
    linea.classList.add('list-group-item', 'text-right', 'mx-2')
    linea.innerText = `${cantidad} x ${item[0].nombre} - $${item[0].precio}`

    let botonEliminar = document.createElement('button')
    botonEliminar.classList.add('btn', 'btn-danger', 'mx-5')
    botonEliminar.innerText = 'X'
    botonEliminar.dataset.item = itemId
    botonEliminar.addEventListener('click', eliminarProducto)

    linea.append(botonEliminar)
    listaCarrito.append(linea)
    })

    valorTotal.innerText = calcularPrecioTotal()
}

    //Funcion para eliminar productos
function eliminarProducto(event){
    Swal.fire({
        icon: 'warning',
        title: '¿Quiere eliminar una sola unidad o todas las del producto?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Eliminar todo',
        denyButtonText: `Eliminar una unidad`,
      }).then((result) => {
        if (result.isConfirmed) {
            let id = event.target.dataset.item
            carrito = carrito.filter((idCarrito) => {
               return idCarrito != id
            })  
            renderizarCarrito()
            Swal.fire('Producto eliminado', '', 'success')
      Swal.fire('Se eliminaron los productos', '', 'success')
        } else if (result.isDenied) {
            let id = event.target.dataset.item
            let indice = carrito.indexOf(id)
            carrito.splice(indice,1)
            renderizarCarrito()
            Swal.fire('Se elimino un producto', '', 'success')
        }
      })
}

    //Funcion para vaciar el carrito
function handlerBotonVaciar(){
    Swal.fire({
        icon: 'warning',
        title: '¿Está seguro de que quiere eliminar todos los productos del carrito?',
        showDenyButton: true,
        confirmButtonText: 'Eliminar',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
            carrito = []
            listaCarrito.innerHTML = ''
            valorTotal.innerText = 0
            renderizarCarrito()
          Swal.fire('Se vació el carrito', '', 'success')
        } else if (result.isDenied) {
          Swal.fire('El producto no se elimino', '', 'info')
        }
      })

}

    //Funcion para calcular el precio total
function calcularPrecioTotal(){
    return carrito.reduce((total, itemId) => {
        let item = listaDeProductos.filter((producto) => {
            return producto.id === parseInt(itemId)
        })

        return total + item[0].precio
    }, 0)
}

    //Funcion para guardar el carrito al storage local
function guardarCarritoAlStorage(){
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

    //Funcion para traer el carrito del storage local
function cargarCarritoDelAlmacenamiento(){
    if(localStorage.getItem('carrito') !== null){
        carrito = JSON.parse(localStorage.getItem('carrito'))
    }
}


// API para indicar el valor del dolar

fetch(`https://www.dolarsi.com/api/api.php?type=valoresprincipales`)
.then((response) => response.json())
.then((data) => mostrarCotizacion(data))

function mostrarCotizacion (dato){
    
    valorDolar.append(`${dato[6].casa.venta})`)

}


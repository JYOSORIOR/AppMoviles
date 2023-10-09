import { Component, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';





@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  productos: any[] = [];
  nombreCompleto: string = '';
  direccion: string = '';
  aptoCasa: string = '';
  metodoPago: string = '';
  total: number = 0;

  constructor() {

    
  }

  ngOnInit() {
    const carritoLocalStorage = localStorage.getItem('carrito');
    if (carritoLocalStorage) {
      this.productos = JSON.parse(carritoLocalStorage);
      console.log("prueba carrito", carritoLocalStorage)
    } else {
      this.productos = [];
    }

    const datosCompra = localStorage.getItem('datosCompra');
    if (datosCompra) {
      const datos = JSON.parse(datosCompra);
      this.nombreCompleto = datos.nombreCompleto;
      this.direccion = datos.direccion;
      this.aptoCasa = datos.aptoCasa;
      this.metodoPago = datos.metodoPago;
    }
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.productos.reduce((subtotal, producto) => subtotal + (producto.precio * producto.cantidad), 0);
  }

  eliminarProducto(index: number) {
    this.productos.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(this.productos));
    console.log('Producto eliminado del carrito.');
  }

  calcularSubtotal(producto: any) {
    return producto.precio * producto.cantidad;
  }

  confirmarCompra() {
    const datosCompra = {
      productos: this.productos,
      nombreCompleto: this.nombreCompleto,
      direccion: this.direccion,
      aptoCasa: this.aptoCasa,
      metodoPago: this.metodoPago,
    };
  
    localStorage.setItem('datosCompra', JSON.stringify(datosCompra));
    console.log("datos de compra pr", datosCompra)
  }

  borrarTodo() {
    localStorage.removeItem('carrito');
    localStorage.removeItem('datosCompra');
    this.productos = [];
  }

  generarPDF() {

    const pdfFonts = {
      Roboto: {
        normal: 'assets/fonts/Roboto-Regular.ttf',
        bold: 'assets/fonts/Roboto-Bold.ttf',
        italics: 'assets/fonts/Roboto-Italic.ttf',
        bolditalics: 'assets/fonts/Roboto-BoldItalic.ttf'
      }
    };
    
    const pdfDefinition = {
      content: [
        { text: 'Resumen de Compra', style: 'header' },
        { text: `Nombre Completo: ${this.nombreCompleto}` },
        { text: `Dirección: ${this.direccion}` },
        { text: `Apto/Casa: ${this.aptoCasa}` },
        { text: `Método de Pago: ${this.metodoPago}` },
        { text: 'Productos Comprados:', style: 'subheader' },
        this.productos.map((producto) => ({
          text: `${producto.nombre}, Cantidad: ${producto.cantidad}, Subtotal: ${producto.precio * producto.cantidad}`,
        })),
        { text: `Total: ${this.total}` },
      ],
      font: pdfFonts.Roboto,
    };
    
    
    
     
    pdfMake.createPdf(pdfDefinition).download('resumen-compra.pdf');
      
    
  }
}
import { Component, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AlertController } from '@ionic/angular';
import { CarritoService } from 'src/app/carrito.service';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;




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

  constructor(private alertController: AlertController, private carritoService: CarritoService) {}


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
    
    this.carritoService.carritoObservable.subscribe(() => {
      this.actualizarCarrito();
      this.calcularTotal();
    });
    
    
  }
  private actualizarCarrito() {
    const carritoLocalStorage = localStorage.getItem('carrito');
    if (carritoLocalStorage) {
      this.productos = JSON.parse(carritoLocalStorage);
    } else {
      this.productos = [];
    }
    this.calcularTotal();
  }
  calcularTotal() {
    this.total = this.productos.reduce((subtotal, producto) => subtotal + (producto.precio * producto.cantidad), 0);
  }

  eliminarProducto(index: number) {
    const productoEliminado = this.productos.splice(index, 1)[0]; 
    localStorage.setItem('carrito', JSON.stringify(this.productos)); 
    console.log('Producto eliminado del carrito.');
  
    
    this.total -= productoEliminado.precio * productoEliminado.cantidad;
    this.total = Math.max(0, this.total);
    this.calcularTotal();
  }
  

  calcularSubtotal(producto: any) {
    return producto.precio * producto.cantidad;
  }

  async confirmarCompra() {
    const datosCompra = {
      productos: this.productos,
      nombreCompleto: this.nombreCompleto,
      direccion: this.direccion,
      aptoCasa: this.aptoCasa,
      metodoPago: this.metodoPago,
    };
  
    localStorage.setItem('datosCompra', JSON.stringify(datosCompra));
    console.log("datos de compra pr", datosCompra)
    const alert = await this.alertController.create({
      header: 'Generar Factura',
      message: '¿Desea generar una factura para esta compra?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.mostrarAgradecimiento();
            this.borrarTodo();
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.generarPDF();
            this.borrarTodo();
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  async mostrarAgradecimiento() {
    const alert = await this.alertController.create({
      header: 'Gracias por su compra',
      message: 'Su compra ha sido confirmada. Gracias por elegir a Sorella.',
      buttons: ['OK']
      
    });
  
    await alert.present();
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
  
    const styles = {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 10, 0, 10] // márgenes [arriba, izquierda, abajo, derecha]
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 5, 0, 10] // márgenes [arriba, izquierda, abajo, derecha]
      },
      content: {
        fontSize: 12,
        margin: [0, 0, 0, 5] // márgenes [arriba, izquierda, abajo, derecha]
      }
    };
  
    const pdfDefinition = {
      content: [
        { text: 'Resumen de Compra', style: 'header' },
        { text: `Nombre Completo: ${this.nombreCompleto}`, style: 'content' },
        { text: `Dirección: ${this.direccion}`, style: 'content' },
        { text: `Apto/Casa: ${this.aptoCasa}`, style: 'content' },
        { text: `Método de Pago: ${this.metodoPago}`, style: 'content' },
        { text: 'Productos Comprados:', style: 'subheader' },
        this.productos.map((producto) => ({
          text: `${producto.nombre}, Cantidad: ${producto.cantidad}, Subtotal: ${producto.precio * producto.cantidad}`,
          style: 'content'
        })),
        { text: `Total: ${this.total}`, style: 'content' },
      ]
      
    };
  
    pdfMake.createPdf(pdfDefinition).download('resumen-compra.pdf');
  }
  
  
}
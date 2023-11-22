import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AlertController } from '@ionic/angular';
import { CarritoService } from 'src/app/carrito.service';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';
import { NativeGeocoder} from '@awesome-cordova-plugins/native-geocoder/ngx';
import { GoogleMap} from '@capacitor/google-maps';
import * as L from 'leaflet';
const apiKey = 'AIzaSyDjwvcUH0nmv9bAWJARmCboGSic42kbhbg';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
declare var google: any;
@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  map: any;
  ubicacion: string = '';
  coordenadas: any[] = [];
  productos: any[] = [];
  nombreCompleto: string = '';
  direccion: string = '';
  aptoCasa: string = '';
  metodoPago: string = '';
  total: number = 0;



  constructor(private alertController: AlertController, private carritoService: CarritoService, private nativegeocoder: NativeGeocoder) { }

  ngOnInit() {
    const carritoLocalStorage = localStorage.getItem('carrito');
    if (carritoLocalStorage) {
      this.productos = JSON.parse(carritoLocalStorage);
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

    //  this.createMap();
  }

  //  async createMap() {
  //    const location =  await Geolocation.getCurrentPosition();
  //      this.coordenadas[0] = location.coords.latitude;
  //      this.coordenadas[1] = location.coords.longitude;
  //    this.map = L.map('map').setView([this.coordenadas[0], this.coordenadas[1] ], 8);
  
  //    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //      attribution: '© OpenStreetMap contributors',
  //    }).addTo(this.map);
  
  //    this.map.on('click', (e: L.LeafletMouseEvent) => this.handleMapClick(e));
  //  }
  
  //  handleMapClick(event: L.LeafletMouseEvent) {
  //    const latLng = event.latlng;
  
  //    if (!latLng) {
  //      console.log('Coordenadas no definidas.');
  //      return;
  //    }
  

  //    this.coordenadas[0] = latLng.lat;
  //    this.coordenadas[1] = latLng.lng;

  //    const geocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.coordenadas[0]}&lon=${this.coordenadas[1]}&zoom=18&addressdetails=1`;

  //   fetch(geocodingUrl)
  //      .then((response) => response.json())
  //      .then((data) => {
  //        if (data && data.display_name) {
  //          this.ubicacion = data.display_name;
  //          this.direccion = this.ubicacion;

  //          this.map.panTo(new L.LatLng(this.coordenadas[0], this.coordenadas[1]));
  //        } else {
  //          console.log('No se pudo obtener la dirección.');
  //        }
  //      })
  //      .catch((error) => {
  //        console.error('Error al obtener la ubicación:', error);
  //      });
  //  }

  async obtenerUbicacion() {
    try {
      const location = await Geolocation.getCurrentPosition();
      this.coordenadas[0] = location.coords.latitude;
      this.coordenadas[1] = location.coords.longitude;

      const geocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.coordenadas[0]}&lon=${this.coordenadas[1]}&zoom=18&addressdetails=1`;

      const response = await fetch(geocodingUrl);
      const data = await response.json();

      if (data && data.display_name) {
        this.ubicacion = data.display_name;
        this.direccion = this.ubicacion;
      } else {
        console.log('No se pudo obtener la dirección.');
      }
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
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
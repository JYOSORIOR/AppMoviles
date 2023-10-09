import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MongodbService } from '../services/mongodb.service';
import { DataSharingService } from '../services/data-sharing.service';
import { CarritoService } from 'src/app/carrito.service';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.page.html',
  styleUrls: ['./detalles.page.scss'],
})
export class DetallesPage implements OnInit {
  producto: any = {};
  coloresDisponibles: string[] = [];
  selectedColor: string = ''; 
  carrito: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private mongodb: MongodbService,
    private dataSharingService: DataSharingService,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    const itemId = this.dataSharingService.getProductId();
    if (itemId) {
      this.cargarDetalleProducto(itemId);
    }

    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.carrito = JSON.parse(carritoGuardado);
    }
  }

  cargarDetalleProducto(id: string) {
    this.mongodb.getDetalleProductoPorId(id).subscribe(
      (res: any) => {
        this.producto = res;
        this.coloresDisponibles = this.producto.colores;
        this.producto.cantidad = 1;
        console.log('DETALLE DEL PRODUCTO', this.producto);
      },
      (error: any) => {
        console.error('Error al obtener detalles del producto', error);
      }
    );
  }

  seleccionarColor(color: string) {
    this.selectedColor = color;
  }

  agregarAlCarrito() {
    const productoAgregado = {
      id: this.producto.id,
      nombre: this.producto.nombre,
      precio: this.producto.precio,
      descripcion: this.producto.descripcion,
      imagen: this.producto.imagen,
      color: this.producto.colorSeleccionado,
      cantidad: this.producto.cantidad
    };
  
    const productoExistente = this.carrito.find(item => item.id === productoAgregado.id && item.color === productoAgregado.color);
    if (productoExistente) {
      productoExistente.cantidad += productoAgregado.cantidad;
    } else {

      this.carrito.push(productoAgregado);
    }


  
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
    this.carritoService.actualizarCarrito(this.carrito);
    console.log('Datos productoAgregado', productoAgregado);
    console.log('Datos carrito ', this.carrito);
    alert('Producto agregado al carrito');
  
    console.log('Datos de compra recuperados del localStorage:', this.carrito);
  
    // this.router.navigate(['/carrito']);
  }
  
}

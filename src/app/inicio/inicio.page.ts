import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MongodbService } from '../services/mongodb.service';
import { register } from 'swiper/element/bundle';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { DataSharingService } from '../services/data-sharing.service';
import { ToastController } from '@ionic/angular';

register();

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  titulo: string = 'Mi Titulo';

  imagenes = [1, 2, 3, 4, 5, 6];

  misProductos: any = [];

  constructor( private toastController: ToastController, private router: Router, private mongodb: MongodbService, private dataSharingService: DataSharingService) {}

  ngOnInit() {
    this.cargarTodosProductos();   
  }

  async checkCameraPermission() {
    try {
        const status = await BarcodeScanner.checkPermission({ force: true });

        if (status.granted) {
            // El permiso de la cámara ya está concedido, puedes llamar a scanBarcode() aquí.
            this.scanBarcode();
        } else {
            // El permiso no está concedido, muestra un mensaje al usuario o maneja la situación de otra manera.
            console.warn('Permiso de cámara no concedido');
        }
    } catch (error) {
        console.error('Error al verificar permiso de cámara', error);
    }
}



  async scanBarcode() {    
    try {
            const result = await BarcodeScanner.startScan();
            if (result.hasContent) {
                console.log(result.content);
                this.redirigirQR(result.content);
            }
        
    } catch (error) {
        console.log("Error al escanear el código");
        console.error('Error', error);
    }
}

  async redirigirQR(idProducto: string) {
    try {
      const res = await this.mongodb.getDetalleProductoPorId(idProducto).toPromise();
  
      if (res) {
        const toast = await this.toastController.create({
          message: 'El producto existe',
          duration: 5000,
          position: 'top',
          color: 'success', 
        });
  
        await toast.present();
  
        this.dataSharingService.setProductId(idProducto);
        this.router.navigate(['/detalles'], { queryParams: { producto: idProducto } });
      } 
    } catch (error) {
      console.error('Error al obtener detalles del producto', error);
  
      const toast = await this.toastController.create({
        message: 'Error al obtener detalles del producto',
        duration: 5000,
        position: 'top',
        color: 'danger', 
      });
  
      await toast.present();
    }
  }

  cargarTodosProductos(){

    this.mongodb.getTodosProductos().subscribe(
      (res: any) => {
        this.misProductos = res.productos; // Accede al array
        console.log('PRODUCTOS DESDE TS', this.misProductos);
      },
      (error: any) => {
        // Manejar errores aquí
        console.error('Error al obtener categorias', error);
      }
    );
  }
}
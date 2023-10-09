import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MongodbService } from '../services/mongodb.service';
import { register } from 'swiper/element/bundle';


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

  constructor(private router: Router, private mongodb: MongodbService) {}

  ngOnInit() {
    this.cargarTodosProductos();   
    
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

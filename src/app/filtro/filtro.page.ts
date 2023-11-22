import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MongodbService } from '../services/mongodb.service';
import { NavController } from '@ionic/angular';
import { DataSharingService } from '../services/data-sharing.service';



interface Producto {
  nombre: string;
  estado: boolean;
  usuario: string;
  descripcion: string;
  precio: number;
  imagen: string;
  disponible: boolean;
}

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.page.html',
  styleUrls: ['./filtro.page.scss'],
})
export class FiltroPage implements OnInit {
  items: any = [];
  term: string = '';
  categoriaSeleccionada: string = '';
  itemdId: string = '';
  
  constructor(private route: ActivatedRoute,private router: Router,  private mongodb: MongodbService, private navCtrl: NavController, private dataSharingService: DataSharingService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.categoriaSeleccionada = params['categoria'] || '';
      this.cargarProductosPorCategoria();
    });
  }

  cargarProductosPorCategoria() {
    if (this.categoriaSeleccionada === '') {
      this.cargarTodosProductos();

    } else {

      this.mongodb.getTodosProductos().subscribe(
        (res: any) => {
          this.items = res.productos.filter(
            (item: any) => item.categoria.nombre === this.categoriaSeleccionada
          );
        },
        (error: any) => {
          console.error('Error al obtener productos por categoría', error);
        }
      );
    }
  }

  cargarTodosProductos(){
    this.mongodb.getTodosProductos().subscribe(
      (res: any) => {
        this.items = res.productos; // Accede al array
        console.log('PRODUCTOS DESDE TS', this.items);
      },
      (error: any) => {
        // Manejar errores aquí
        console.error('Error al obtener categorias', error);
      }
    );
  }


   obtenerDetalles(itemId: string) {
    this.dataSharingService.setProductId(itemId);
    this.router.navigate(['/detalles'], { queryParams: { producto: itemId } });
  }
  
}
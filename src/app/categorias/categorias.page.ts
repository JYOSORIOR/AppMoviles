import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MongodbService } from '../services/mongodb.service';



@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {
  misCategorias: any = [];
  myInput: string = '';

  constructor(private router: Router, private mongodb: MongodbService) {}

  ngOnInit() {
    this.cargarTodasCategorias();
  }

  cargarTodasCategorias() {
    this.mongodb.getTodasCategorias().subscribe(
      (res: any) => {
        this.misCategorias = res.categorias;
      },
      (error: any) => {
        console.error('Error al obtener categorías', error);
      }
    );
  }


  

  onInput(event:Event){
    if (this.myInput.length > 0) {
      this.cargarCategoriasComo();
    }
  }

  cargarCategoriasComo() {
    this.mongodb.getCategoriasComo(this.myInput).subscribe(
      (res: any) => {
        this.misCategorias = res.results; // Acceder al campo 'results'
        console.log('CATEGORIAS DESDE TS', this.misCategorias);
      },
      (error: any) => {
        // Manejar errores aquí
        console.error('Error al obtener categorias', error);
      }
    );
  }

  onCancel(event: Event) {
    this.myInput = ''; // Borra la búsqueda
    this.cargarTodasCategorias(); // Vuelve a cargar todas las categorías
  }

  mostrarProductos(categoria: string) {
    this.router.navigate(['/tabs/filtro'], { queryParams: { categoria: categoria } });
  }
}

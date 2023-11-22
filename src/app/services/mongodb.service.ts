import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { URL_SERVICIOS } from 'src/config/url.servicios';

@Injectable({
  providedIn: 'root'
})
export class MongodbService {

  constructor(private http: HttpClient) { }


  getDetalleProductoPorId(id: string) {
    return this.http.get(`${URL_SERVICIOS}/productos/${id}`).pipe(
      map((res: any) => {
        console.log('DETALLE DEL PRODUCTO', res);
        return res;
      })
    );
  }
  
  getProductosComo(unComo:string){
    return this.http.get(`${URL_SERVICIOS}/buscar/productos/${unComo}`, {}).pipe(
      map((res: any) => {
        console.log('Productos',res);
        return res;
      })
    );
  }

  getCategoriasComo(unComo:string){
    return this.http.get(`${URL_SERVICIOS}/buscar/categorias/${unComo}`, {}).pipe(
      map((res: any) => {
        console.log('Categorias',res);
        return res;
      })
    );
  }
  
  

  getTodosProductos(){
    return this.http.get(`${URL_SERVICIOS}/productos/`).pipe(
      map((res: any) => {
        console.log('TODOSPRODUCTOSMONGODB',res);
        return res;
      })
    );   
  }

 

  getTodasCategorias(){
    return this.http.get(`${URL_SERVICIOS}/categorias/`).pipe(
      map((res: any) => {
        console.log('TODASCATEGORIASMONGODB',res);
        return res;
      })
    );   
  }

}

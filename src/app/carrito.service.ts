import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoSubject = new BehaviorSubject<any[]>([]);
  carritoObservable = this.carritoSubject.asObservable();

  actualizarCarrito(carrito: any[]) {
    this.carritoSubject.next(carrito);
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private productId: string = '';

  setProductId(id: string) {
    this.productId = id;
  }

  getProductId() {
    return this.productId;
  }
}

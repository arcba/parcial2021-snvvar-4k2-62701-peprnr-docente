import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    this.resourceUrl = 'https://pymesbackend.azurewebsites.net/api/productos/';
  }

  get() {
    return this.httpClient.get(this.resourceUrl);
  }

  post(obj: Producto) {
    return this.httpClient.post(this.resourceUrl, obj);
  }
}

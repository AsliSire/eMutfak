import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private router: Router) { }
  errorHandler(error: Response) {
    console.log('hatakodu = ' + error);
    return throwError(error);
  }

  Currency() {
    return this.http.post(environment.api_url + '/api/default/currency', { responseType: 'json' })
  }

  SaveProduct(product: Product) {
    var header = new HttpHeaders();
    header.append('Content-Type', 'application/json');

    return this.http.post(environment.api_url + '/api/default/saveproduct', product, { headers: header })
      .pipe(
        map(res => res),
        catchError(this.errorHandler)
      );
  }

  DeleteProduct(Id) {
    return this.http.post(environment.api_url + '/api/default/deleteproduct?Id=', Id, { responseType: 'text' })
  }

  ProductDetail(Id) {
    return this.http.get(environment.api_url + '/api/default/productdetail?Id=' + Id, { responseType: 'json' })
  }

  GetProduct() {
    return this.http.get(environment.api_url + '/api/default/products', { responseType: 'json' })
  }

}

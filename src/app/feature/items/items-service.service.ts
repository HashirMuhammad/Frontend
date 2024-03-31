import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ItemsServiceService {

  inventoryproductsByID = [
    {
      id: "1000",
      code: "f230fh0g3",
      name: "Bamboo Watch",
      image: "https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg",
      price: 65,
      quantity: 0
    }
  ];

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getClientsByIdandName(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clients-id-name`);
  }

   // Define a method to add a product to the backend
   addProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create_product`, product);
  }

  getbillproducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-cart`);
  }
  
  getbillproductsItems(id:any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-cart-items/${id}`);
  }

  getinventoryproducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  getinventoryproductsByID(): Observable<any[]> {
    return this.http.get<any[]>("your-api-endpoint");
  }

  getQrCode(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productForTable`);
  }

  getProductStockZero(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products/zero-stock`);
  }

  updateProductStock(productId: string, newStock: string): Observable<any> {
    // Adjust the URL and request payload as per your backend API endpoint
    const apiUrl = `${this.apiUrl}/products/${productId}/stock`;
    const payload = { stock: newStock };
    return this.http.put(apiUrl, payload);
  }

  updateProduct(product: any,productId: string): Observable<any> {
    // Adjust the URL as per your backend API endpoint
    const apiUrl = `${this.apiUrl}/products/${productId}`;
    return this.http.put(apiUrl, product);
  }

  deleteProduct(productId: number): Observable<any> {
    const apiUrl = `${this.apiUrl}/products/${productId}`;
    return this.http.delete(apiUrl);
  }

  removebill(id: number): Observable<any> {
    const apiUrl = `${this.apiUrl}/cart/${id}`;
    return this.http.delete(apiUrl);
  }

  saveCartData(cartData: any): Observable<any> {
    // Replace 'your_backend_api_url' with the actual URL of your backend API endpoint
    const apiUrl = `${this.apiUrl}/save-cart`;
    return this.http.post(apiUrl, cartData);
  }
}

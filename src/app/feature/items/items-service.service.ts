import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ItemsServiceService {
  billproducts = [
    {
      id: 1,
      items: [
        {
          id: 1,
          name: "Bamboo Watch",
          price: 65,
          quantity: 1,
          code: "f230fh0g3",
          totalItemPrice: 65
        }
      ],
      totalQuantity: 1,
      totalPrice: 65,
      clientName: "abc",
      date: "21/02/2024",
      paymentReceived: 0,
      remainingPayment: -65
    },
    {
      id: 2,
      items: [
        {
          id: 1,
          name: "Bamboo Watch",
          price: 65,
          quantity: 1,
          code: "f230fh0g3",
          totalItemPrice: 65
        },
        {
          id: 1,
          name: "Bamboo Watch",
          price: 65,
          quantity: 1,
          code: "f230fh0g3",
          totalItemPrice: 65
        }
      ],
      totalQuantity: 1,
      totalPrice: 65,
      clientName: "",
      date: "21/02/2024",
      paymentReceived: 0,
      remainingPayment: -65
    }
  ];
  billproductsById = [
    {
      id: 2,
      items: [
        {
          id: 1,
          name: "Bamboo Watch",
          price: 65,
          quantity: 1,
          code: "f230fh0g3",
          totalItemPrice: 65
        },
        {
          id: 2,
          name: "Bamboo Watch",
          price: 65,
          quantity: 1,
          code: "f230fh0g3",
          totalItemPrice: 65
        }
      ],
      totalQuantity: 1,
      totalPrice: 65,
      clientName: "",
      date: "21/02/2024",
      paymentReceived: 65,
      remainingPayment: -65
    }
  ]
  inventoryproducts = [
    {
      id: "1000",
      code: "A123BC",
      name: "Pen",
      image: "bamboo-watch.jpg",
      price: 65,
      quantity: 0
    },
    {
      id: "1000",
      code: "f230fh0g3",
      name: "Bamboo Watch",
      image: "bamboo-watch.jpg",
      price: 65,
      quantity: 4
    },
    {
      id: "1000",
      code: "f230fh0g3",
      name: "Bamboo Watch",
      image: "bamboo-watch.jpg",
      price: 65,
      quantity: 24
    },
    {
      id: "1000",
      code: "f230fh0g3",
      name: "Bamboo Watch",
      image: "bamboo-watch.jpg",
      price: 65,
      quantity: 24
    },
    {
      id: "1000",
      code: "f230fh0g3",
      name: "Bamboo Watch",
      image: "bamboo-watch.jpg",
      price: 65,
      quantity: 24
    },
    {
      id: "1000",
      code: "f230fh0g3",
      name: "Bamboo Watch",
      image: "bamboo-watch.jpg",
      price: 65,
      quantity: 24
    },
    {
      id: "1000",
      code: "f230fh0g3",
      name: "Bamboo Watch",
      image: "bamboo-watch.jpg",
      price: 65,
      quantity: 24
    }
  ];
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

   // Define a method to add a product to the backend
   addProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create_product`, product);
  }

  getbillproducts(): Observable<any[]> {
    return this.http.get<any[]>("your-api-endpoint");
  }

  getinventoryproducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  getinventoryproductsByID(): Observable<any[]> {
    return this.http.get<any[]>("your-api-endpoint");
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

  saveCartData(cartData: any): Observable<any> {
    // Replace 'your_backend_api_url' with the actual URL of your backend API endpoint
    const apiUrl = 'your_backend_api_url/saveCart';
    return this.http.post(apiUrl, cartData);
  }
}

import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ItemsServiceService } from "../items-service.service";

interface ProductInterface {
  id: number;
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    code: string;
    totalItemPrice: number;
  }[];
  totalQuantity: number;
  totalPrice: number;
  clientName: string;
  date: string;
  paymentReceived: number;
  remainingPayment: number;
}
@Component({
  selector: "app-bills",
  templateUrl: "./bills.component.html",
  styleUrls: ["./bills.component.scss"]
})
export class BillsComponent {
  billproducts = [
    {
      id: 1,
      items:[
      {
        id:1,
        name:"",
        price:65,
        quantity:1,
        code:"",
        totalItemPrice:65
      }
    ],
    totalQuantity:1,
    totalPrice:65,
    clientName:"",
    date:"",
    paymentReceived:0,
    remainingPayment:1
  },
  ];
  selectedProduct: boolean;
  viewproduct :ProductInterface[] = []

  constructor(
    private router: Router,
    private itemsService: ItemsServiceService
  ) {}

  ngOnInit() {
    this.billproducts = this.itemsService.billproducts;
  }

  getProductById(id: number) {
    return this.billproducts.find(product => product.id === id);
  }

  ViewtUser(id: any){
    console.log(id);

    this.viewproduct = [this.getProductById(id)];
    console.log(this.viewproduct);
    this.selectedProduct = true
  }

  print(id: number) {
    const productToPrint = this.getProductById(id);
    const printContent = `
      <style>
        /* CSS styles for the printed table */
        .print-table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 20px;
        }
        
        .print-table th,
        .print-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        
        .print-table th {
            background-color: #f2f2f2;
        }
        
        .print-table tbody tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        
        .print-table tbody tr:hover {
            background-color: #ddd;
        }
      </style>
      <h1>Product Details</h1>
      <p>ID: ${productToPrint.id}</p>
      <p>Client Name: ${productToPrint.clientName}</p>
      <p>Date: ${productToPrint.date}</p>
      <p>Total Quantity: ${productToPrint.totalQuantity}</p>
      <p>Total Price: ${productToPrint.totalPrice}</p>
      <p>Payment Received: ${productToPrint.paymentReceived}</p>
      <p>Remaining Payment: ${productToPrint.remainingPayment}</p>
      <h2>Items</h2>
      <table class="print-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Code</th>
          </tr>
        </thead>
        <tbody>
          ${productToPrint.items.map(item => `
            <tr>
              <td>${item.id}</td>
              <td>${item.name}</td>
              <td>${item.price}</td>
              <td>${item.quantity}</td>
              <td>${item.code}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    const popupWindow = window.open('', '_blank');
    popupWindow.document.open();
    popupWindow.document.write(printContent);
    popupWindow.document.close();
    popupWindow.print();
  }
  
  edit(id: any){
    this.router.navigate([`items/checkout/${id}`])
  }

  getData() {
    this.itemsService.getbillproducts().subscribe(
      (data) => {
        this.billproducts = data;
      },
      (error) => {
        console.error("Error fetching clients:", error);
      }
    );
  }
}

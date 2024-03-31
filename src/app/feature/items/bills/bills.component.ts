import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ItemsServiceService } from "../items-service.service";

interface ViewUserData {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: any;
  UserID: number;
  clientName: string;
  date: string;
  items: {
    ID: number;
    CartDataID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: any;
    code: string;
    id: number;
    name: string;
    price: string;
    quantity: number;
    totalItemPrice: number;
  }[];
  totalQuantity: number;
  totalPrice: number;
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
      items: [
        {
          id: 1,
          name: "",
          price: 65,
          quantity: 1,
          code: "",
          totalItemPrice: 65
        }
      ],
      totalQuantity: 1,
      totalPrice: 65,
      clientName: "",
      date: "",
      paymentReceived: 0,
      remainingPayment: 1
    }
  ];
  selectedProduct: boolean;
  productToPrint = {
    ID: 0,
    CreatedAt: "",
    UpdatedAt: "",
    DeletedAt: null,
    UserID: 2,
    clientName: "",
    date: "",
    items: [
      {
        ID: 9,
        CartDataID: 0,
        CreatedAt: "",
        UpdatedAt: "",
        DeletedAt: null,
        code: "0",
        id: 2,
        name: "",
        price: "0",
        quantity: 4,
        totalItemPrice: 0
      }
    ],
    totalQuantity: 0,
    totalPrice: 0,
    paymentReceived: 0,
    remainingPayment: 0
  };
  viewproduct = {
    ID: 0,
    CreatedAt: "",
    UpdatedAt: "",
    DeletedAt: null,
    UserID: 2,
    clientName: "",
    date: "",
    items: [
      {
        ID: 9,
        CartDataID: 0,
        CreatedAt: "",
        UpdatedAt: "",
        DeletedAt: null,
        code: "0",
        id: 2,
        name: "",
        price: "0",
        quantity: 4,
        totalItemPrice: 0
      }
    ],
    totalQuantity: 0,
    totalPrice: 0,
    paymentReceived: 0,
    remainingPayment: 0
  };

  constructor(private router: Router, private itemsService: ItemsServiceService) {}

  ngOnInit() {
    this.itemsService.getbillproducts().subscribe(
      (data) => {
        this.billproducts = data;
        console.log(data);
      },
      (error) => {
        console.error("Error fetching clients:", error);
      }
    );
  }

  getProductById(id: number) {
    return this.billproducts.find((product) => product.id === id);
  }

  ViewtUser(id: any) {
    console.log(id);
    this.itemsService.getbillproductsItems(id).subscribe(
      (data: any) => {
        // Parse received JSON data and assign it to viewproduct
        this.viewproduct = data as ViewUserData;
        console.log("ViewUserData received:", this.viewproduct);
      },
      (error) => {
        console.error("Error fetching:", error);
      }
    );
    console.log(this.viewproduct);
    this.selectedProduct = true;
  }

  print(id: number) {
    this.itemsService.getbillproductsItems(id).subscribe(
      (data: any[]) => {
        debugger;
        if (data && data.length > 0) {
          // Access the first element of the array
          const productData = data[0];
          // Parse received JSON data and assign it to productToPrint
          this.productToPrint = productData as ViewUserData;
          console.log("ViewUserData received:", this.productToPrint);

          // Check if productToPrint and its items are defined
          if (this.productToPrint && this.productToPrint.items) {
            setTimeout(() => {
              this.printContent();
            }, 100); // Delay execution for 100 milliseconds
          } else {
            console.error("Product data or items are undefined");
          }
        } else {
          console.error("No data received");
        }
      },
      (error) => {
        console.error("Error fetching:", error);
      }
    );
  }

  printContent() {
    // const productToPrint = this.getProductById(id);
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
      <p>ID: ${this.productToPrint.ID}</p>
      <p>Client Name: ${this.productToPrint.clientName}</p>
      <p>Date: ${this.productToPrint.date}</p>
      <p>Total Quantity: ${this.productToPrint.totalQuantity}</p>
      <p>Total Price: ${this.productToPrint.totalPrice}</p>
      <p>Payment Received: ${this.productToPrint.paymentReceived}</p>
      <p>Remaining Payment: ${this.productToPrint.remainingPayment}</p>
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
          ${this.productToPrint.items
            .map(
              (item) => `
            <tr>
              <td>${item.id}</td>
              <td>${item.name}</td>
              <td>${item.price}</td>
              <td>${item.quantity}</td>
              <td>${item.code}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    const popupWindow = window.open("", "_blank");
    popupWindow.document.open();
    popupWindow.document.write(printContent);
    popupWindow.document.close();
    popupWindow.print();
  }

  edit(id: any) {
    this.router.navigate([`items/checkout/${id}`]);
  }

  getData() {
    this.itemsService.getbillproducts().subscribe(
      (data) => {
        this.billproducts = data;
      },
      (error) => {
        console.error("Error fetching :", error);
      }
    );
  }

  removeUser(id: any) {
    console.log(id);
    this.itemsService.removebill(id).subscribe(
      () => {
        console.log(`ID ${id} removed successfully.`);
        this.getData();
        // Optionally, perform any additional action upon successful removal
      },
      (error) => {
        console.error(`Error removing user with ID ${id}:`, error);
        // Handle error appropriately, e.g., display an error message to the user
      }
    );
  }
}

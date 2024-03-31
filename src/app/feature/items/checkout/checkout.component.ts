import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/api";
import { ItemsServiceService } from "../items-service.service";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
  providers: [MessageService]
})
export class CheckoutComponent {
  products = [
    {
      images: "",
      product: {
        ID: 3,
        CreatedAt: "",
        UpdatedAt: "",
        DeletedAt: null,
        UserID: 2,
        code: "",
        productname: "",
        price: "",
        stock: ""
      }
    }
  ];
  cart: any[] = [];
  OUTOFSTOCK = "OUTOFSTOCK";
  hoveredItemId: string | null = null;
  nameSearchQuery: string = "";
  barcodeSearchQuery: string = "";
  filteredProducts: any[] = [];
  showInStockOnly: boolean = false;
  visible: boolean;
  regularUser: boolean;
  paymentReceived = "";
  ClientID = 0;
  ClientName = "";
  formattedDate = "";
  quantityinCart: any;
  clients = [
    {
      id: 1,
      name: ""
    }
  ];
  id: any;
  billproductsById: any;

  constructor(private messageService: MessageService, private activatedRoute: ActivatedRoute, private itemService: ItemsServiceService) {}

  // Assuming this.products contains the original list of products
  ngOnInit() {
    // Retrieve the id parameter from the route snapshot
    this.id = this.activatedRoute.snapshot.params["id"];

    if (this.id != null) {
      debugger;
      this.billproductsById = this.itemService.billproductsById;
      // Clear the products array before populating it with new items
      this.products = [];

      // Iterate over the items in billproductsById and push them into the products array
      this.billproductsById.forEach((bill) => {
        debugger;
        bill.items.forEach((item) => {
          this.products.push({
            images: item.image, // Assuming item.image contains image URLs
            product: {
              ID: item.id,
              CreatedAt: "", // Set appropriate values if available
              UpdatedAt: "",
              DeletedAt: null, // Assuming item is not deleted
              UserID: 2, // Assuming UserID is obtained elsewhere
              code: item.code,
              productname: item.name, // Assuming item name corresponds to product name
              price: item.price,
              stock: item.quantity.toString() // Assuming item quantity corresponds to product stock
            }
          });
        });
      });

      if (this.billproductsById.length > 0) {
        const bill = this.billproductsById[0];
        this.ClientName = bill.clientName;
        this.paymentReceived = bill.paymentReceived;
        this.formattedDate = bill.date;
      }
      // this.products = this.itemService.inventoryproducts;
      this.getData();
    } else {
      // this.products = this.itemService.inventoryproducts;
      this.getData();
    }
    // this.filteredProducts = this.products;
    this.getClientsIdandName();
  }

  getBase64Image(base64Image: string): string {
    // Prefix the base64 data with the appropriate MIME type
    return "data:image/png;base64," + base64Image;
  }

  getClientsIdandName() {
    // Initialize filteredProducts with all products
    this.itemService.getClientsByIdandName().subscribe(
      (data) => {
        this.clients = data;
        console.log(data);
      },
      (error) => {
        console.error("Error fetching clients:", error);
      }
    );
    // this.items = this.products.length;
  }
  getData() {
    // Initialize filteredProducts with all products
    this.itemService.getinventoryproducts().subscribe(
      (data) => {
        this.products = data;
        console.log(data);
        this.filteredProducts = this.products;
      },
      (error) => {
        console.error("Error fetching products:", error);
      }
    );
    // this.items = this.products.length;
  }

  // Function to filter products based on search queries
  searchProductsByName() {
    this.filteredProducts = this.products.filter((product) => {
      const nameMatch = product.product.productname.toLowerCase().includes(this.nameSearchQuery.toLowerCase());
      return nameMatch;
    });
  }

  // Function to filter products based on search queries
  searchProductsByCode() {
    this.filteredProducts = this.products.filter((product) => {
      const barcodeMatch = product.product.code.toLowerCase().includes(this.barcodeSearchQuery.toLowerCase());
      return barcodeMatch;
    });
  }

  // Function to filter products based on search queries and checkbox state
  filterProducts() {
    this.filteredProducts = this.products.filter((product) => {
      const isInStock = parseInt(product.product.stock) > 0;

      // Apply filtering based on search queries and checkbox state
      return !this.showInStockOnly || isInStock;
    });
  }

  showDeleteIcon(itemId: string) {
    this.hoveredItemId = itemId;
  }

  hideDeleteIcon() {
    this.hoveredItemId = null;
  }

  getTotalQuantity(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  addToCart(product: any) {
    const index = this.cart.findIndex((item) => item.id === product.product.ID);
    if (index !== -1) {
      const availableStock = parseInt(product.product.stock);
      const currentQuantity = parseInt(this.cart[index].quantity);
      if (currentQuantity < availableStock) {
        this.cart[index].quantity++;
      } else {
        this.messageService.add({ severity: "danger", summary: "Danger", detail: "Insufficient stock" });
      }
    } else {
      // Add the necessary properties to the cart item
      const { ID, code, productname, price, stock } = product.product;
      this.cart.push({ id: ID, code, name: productname, price, stock, quantity: 1 });
    }
  }

  alreadyaddToCart(products: any[]) {
    products.forEach((product) => {
      const index = this.cart.findIndex((item) => item.id === product.product.ID);
      if (index !== -1) {
        if (this.cart[index].quantity < product.product.stock) {
          this.cart[index].quantity++;
        } else {
          this.messageService.add({ severity: "danger", summary: "Danger", detail: "Insufficient stock" });
        }
      } else {
        this.cart.push({ ...product, quantity: 1 });
      }
    });
  }

  removeFromCart(product: any) {
    const index = this.cart.findIndex((item) => item.id === product.product.ID);
    if (index !== -1) {
      if (this.cart[index].quantity > 0) {
        this.cart[index].quantity--;
        if (this.cart[index].quantity === 0) {
          this.cart.splice(index, 1);
        }
      }
    }
  }

  removeItemFromCart(item: any) {
    const index = this.cart.findIndex((cartItem) => cartItem.id === item.id);
    if (index !== -1) {
      this.cart.splice(index, 1);
    }
  }

  selectedClient(id: number, name: string) {
    console.log(id, name);
    this.ClientID = id;
    this.ClientName = name;
  }

  // increaseQuantity(item: any) {
  //   const index = this.products.findIndex((product) => product.id === item.id);
  //   let quantity = 0;
  //   if (index !== -1) {
  //     quantity = this.products[index].quantity;
  //   }
  //   console.log(quantity);

  //   if (index !== -1) {
  //     if (item.quantity < quantity) {
  //       item.quantity++;
  //     } else {
  //       this.messageService.add({ severity: "danger", summary: "Danger", detail: "insufficient stock" });
  //     }
  //   }
  // }

  // decreaseQuantity(item: any) {
  //   if (item.quantity > 0) {
  //     item.quantity--;
  //     if (item.quantity === 0) {
  //       const index = this.cart.findIndex((cartItem) => cartItem.id === item.id);
  //       if (index !== -1) {
  //         this.cart.splice(index, 1);
  //       }
  //     }
  //   }
  // }

  getTotalItemPrice(item: any): number {
    return item.price * item.quantity;
  }

  getTotalItems(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cart.reduce((total, item) => total + this.getTotalItemPrice(item), 0);
  }

  submitCart() {
    const cartResponse = this.cart.map((item) => ({ id: item.id, code: item.code, totalQuantity: item.quantity }));
    const totalQuantity = this.getTotalItems();
    const totalPrice = this.getTotalPrice();
    console.log({ cartResponse, totalQuantity, totalPrice });

    this.printCart();
  }

  printCart() {
    // Convert paymentReceived to a number
    const paymentReceivedNumber = Number(this.paymentReceived);

    // Calculate remaining payment
    const remainingPayment = paymentReceivedNumber - this.getTotalPrice();

    // Format cart information for printing
    let printContent = `
        <style>
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                padding: 8px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            th {
                background-color: #f2f2f2;
            }
            .item-number {
                width: 30px;
            }
        </style>
        <table>
            <thead>
                <tr>
                    <th class="item-number">#</th>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>BarCode</th>
                    <th>Total Price</th>
                </tr>
            </thead>
            <tbody>
    `;
    this.cart.forEach((item) => {
      printContent += `
            <tr>
                <td class="item-number">${item.id}</td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.quantity}</td>
                <td>${item.code}</td>
                <td>${this.getTotalItemPrice(item)}</td>
            </tr>
        `;
    });
    printContent += `
            </tbody>
        </table>
        <p>Total Quantity: ${this.getTotalItems()}</p>
        <p>Total Price: ${this.getTotalPrice()}</p>
        <p>Date: ${this.getFormatedDate()}</p>
        <p>Client Name: ${this.ClientName}</p>
        <p>Payment Received: ${paymentReceivedNumber}</p>
        <p>Remaining Payment: ${remainingPayment}</p>
    `;

    // Create a hidden iframe and print the content
    const iframe = document.createElement("iframe");
    iframe.setAttribute("style", "display: none;");
    document.body.appendChild(iframe);
    iframe.contentWindow.document.write(printContent);
    iframe.contentWindow.document.close();
    iframe.contentWindow.print();

    // Remove the iframe after printing
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }

  showDialog() {
    this.visible = true;
  }

  saveCartToJson() {
    // Create an object to store the cart data
    const cartData = {
      items: [],
      totalQuantity: this.getTotalItems(),
      totalPrice: this.getTotalPrice(),
      clientId: this.ClientID,
      clientName: this.ClientName,
      date: this.getFormatedDate(),
      paymentReceived: Number(this.paymentReceived),
      remainingPayment: Number(this.paymentReceived) - this.getTotalPrice()
    };

    // Add each item in the cart to the items array
    this.cart.forEach((item) => {
      cartData.items.push({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        code: item.code,
        totalItemPrice: this.getTotalItemPrice(item)
      });
    });

    // Convert the cart data object to a JSON string
    const jsonData = JSON.stringify(cartData);

    // Save the JSON data (you can customize this part based on your requirement)
    // Call the service method to send the cart data to the backend
    this.itemService.saveCartData(cartData).subscribe(
      (response) => {
        console.log("Cart data saved successfully:", response);
        // Optionally, perform any other action upon successful save
        this.cart = [];
        this.visible = false;
        this.getData();
      },
      (error) => {
        console.error("Error saving cart data:", error);
        // Handle error appropriately, e.g., display an error message to the user
      }
    );
    // For example, you can save it to local storage or send it to a server
    console.log(jsonData); // Print JSON data to console for demonstration

    // Example of saving to local storage
    // localStorage.setItem('cartData', jsonData);
  }

  saveProduct() {
    this.saveCartToJson();
    this.printCart();
  }

  getFormatedDate() {
    // Get the current date
    const currentDate = new Date();

    // Format the current date to "dd/mm/yyyy"
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();
    this.formattedDate = `${day}/${month}/${year}`;

    return this.formattedDate;
  }
}

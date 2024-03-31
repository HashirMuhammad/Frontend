import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { MenuItem, SelectItem } from "primeng/api";
import { ItemsServiceService } from "../items-service.service";
import * as QRCode from "qrcode";
import { HttpClient } from "@angular/common/http";

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: "app-inventory",
  templateUrl: "./inventory.component.html",
  styleUrls: ["./inventory.component.scss"]
})
export class InventoryComponent {
  visible = false;
  viewVisible = false;
  updateVisible = false;
  layout: string = "list";
  sortOptions!: SelectItem[];
  sortOrder!: number;
  sortField!: string;
  StockValid: string;
  StockVal: number;
  INSTOCK = "INSTOCK";
  OUTOFSTOCK = "OUTOFSTOCK";
  LOWSTOCK = "LOWSTOCK";
  inventoryproducts = [
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
  items: any;
  // inventoryproductsByID = [
  //   {
  //     id: "",
  //     code: "",
  //     name: "",
  //     image: "",
  //     price: 1,
  //     quantity: 0
  //   }
  // ];
  productName: string;
  productPrice: number;
  productStock: number;
  productBarcode: string;
  UpdateImgToogle: boolean = true;
  showOutOfStock: boolean = false;
  filteredProducts: any[];
  productToSearch: string;
  searchTerm: string = "";
  updateStock: string;
  selectedWidth = 2;
  selectedHeight = 70;
  selectedFontSize = 16;
  uploadedFiles: File;
  stepsitems: MenuItem[] | undefined;
  activeIndex: number = 0;
  productId: any;
  url: any;
  QrCode = [
    {
      productName: "",
      code: ""
  }
  ]

  ngOnInit() {
    // Initialize filteredProducts with all products
    this.getData();
    // this.inventoryproductsByID = this.items.inventoryproductsByID;
    this.stepsitems = [
      {
        label: "Details"
      },
      {
        label: "Image"
      }
    ];
  }

  constructor(private itemsService: ItemsServiceService, private http: HttpClient) {}

  getData(){
    // Initialize filteredProducts with all products
    this.itemsService.getinventoryproducts().subscribe(
      (data) => {
        this.inventoryproducts = data;
        console.log(data);
        this.filteredProducts = this.inventoryproducts;
      },
      (error) => {
        console.error("Error fetching clients:", error);
      }
    );
    this.items = this.inventoryproducts.length;
  }

  getBase64Image(base64Image: string): string {
    // Prefix the base64 data with the appropriate MIME type
    return "data:image/png;base64," + base64Image;
  }

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }

  handleUpload(event: any) {
    for (const file of event.files) {
      console.log(file);
    }
    // Now you can use the response data as required
    // For example, you can update your component state with the response
  }

  handleFileSelect($event: UploadEvent) {
    // Process the file objects and metadata
    console.log("Selected files:", $event.files);
  }

  getinventoryproductsData() {
    this.itemsService.getinventoryproducts().subscribe(
      (data) => {
        this.inventoryproducts = data;
      },
      (error) => {
        console.error("Error fetching clients:", error);
      }
    );
  }

  // getinventoryproductsByIDData() {
  //   this.itemsService.getinventoryproductsByID().subscribe(
  //     (data) => {
  //       this.inventoryproductsByID = data;
  //     },
  //     (error) => {
  //       console.error("Error fetching clients:", error);
  //     }
  //   );
  // }

  filterProductsByName(): void {
    // Perform the filter operation
    this.filteredProducts = this.inventoryproducts.filter((product) =>
    product.product.productname.toLowerCase().includes(this.productToSearch.toLowerCase())
    );
  }

  StockProductsChange() {
    if (this.showOutOfStock == true) {
      this.filterProducts();
    } else {
      this.filteredProducts = this.inventoryproducts;
    }
  }

  filterProducts() {
    if (this.showOutOfStock) {
      this.filteredProducts = this.inventoryproducts.filter((product) => parseInt(product.product.stock) === 0);
    } else {
      this.filteredProducts = this.inventoryproducts;
    }
  }

  showDialog() {
    this.visible = true;
  }

  showViewDialog(id: string, Val: number) {
    this.StockValid = id;
    this.StockVal = Val;
    console.log(id);
    console.log(Val);
    this.viewVisible = true;
  }

  showUpdateDialog(product: any) {
    console.log(product);
    this.productId = product.ID;
    this.updateVisible = true;
  }

  saveProduct() {
    // Create a JSON object from the form data

    const formData = {
      productname: this.productName,
      price: this.productPrice.toString(),
      stock: this.productStock.toString(),
      code: this.productBarcode.toString()
    };

    this.itemsService.addProduct(formData).subscribe(
      (response) => {
        console.log("Product added successfully:", response);
        this.productId = response.ID;
        this.activeIndex = 1;
        this.url = `http://localhost:8080/upload/${this.productId}`;
        this.getData();
        // Optionally, close the dialog or perform any other action upon successful addition
        // this.visible = false;
      },
      (error) => {
        console.error("Error adding product:", error);
        // Handle error appropriately, e.g., display an error message to the user
      }
    );
  }

  updateProductStock(id: any) {
    const updatedStock = this.updateStock.toString(); // Calculate the updated stock
    const productId = this.StockValid; // Replace with the actual product ID

    // Call the service method to update the product stock
    this.itemsService.updateProductStock(productId, updatedStock).subscribe(
      (response) => {
        console.log("Stock updated successfully", response);
        // Optionally, close the dialog or perform any other action upon successful update
        this.viewVisible = false;
        this.getData();
      },
      (error) => {
        console.error("Error updating stock:", error);
        // Handle error appropriately, e.g., display an error message to the user
      }
    );

    this.viewVisible = false;
  }

  updateProduct() {
    // Gather product data from form fields
    const Product = {
      productname: this.productName,
      price: this.productPrice.toString(),
      stock: this.productStock.toString(),
      code: this.productBarcode.toString()
    };

    // Call the service method to add the product to the backend
    this.itemsService.updateProduct(Product, this.productId).subscribe(
      (response) => {
        console.log("Product added successfully:", response);
        this.getData();
        // Optionally, close the dialog or perform any other action upon successful addition
        this.updateVisible = false;
      },
      (error) => {
        console.error("Error adding product:", error);
        // Handle error appropriately, e.g., display an error message to the user
      }
    );
  }

  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf("!") === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  UpdateImgToogleFunc() {
    this.UpdateImgToogle = false;
  }

  deleteDialog(id: any) {
    // Call the ProductService to delete the product
    this.itemsService.deleteProduct(id).subscribe(
      () => {
        console.log("Product deleted successfully");
        this.getData();
        // Optionally, perform any other action upon successful deletion
      },
      (error) => {
        console.error("Error deleting product:", error);
        // Handle error appropriately, e.g., display an error message to the user
      }
    );
  }

  printBarcode(code: string, qty: string) {
    const combinedString = `barcode:${code},Stock:${qty}`;
    // Generate QR code image as base64 data URL
    QRCode.toDataURL(combinedString, { errorCorrectionLevel: "M", width: 100 }, (err, url) => {
      if (err) {
        console.error("Error generating QR code:", err);
        return;
      }

      // Create a new window to display the QR code and code value
      const qrWindow = window.open("", "_blank");
      qrWindow.document.write(`
      <div style="text-align: center;">
        <img src="${url}" style="margin-bottom: 10px;"><br/>
        <p style="font-size: 18px; margin-bottom: 10px;">Code: ${code}</p><br/>
        <p style="font-size: 18px; margin-bottom: 10px;">Stock: ${qty}</p>
      </div>
    `);
      qrWindow.document.close();

      // Print the QR code and code value after a delay to ensure they are rendered
      setTimeout(() => {
        qrWindow.print();
      }, 1000);
    });
  }

  printQr() {
    this.itemsService.getQrCode().subscribe(
      (data: any[]) => {
        console.log("QR codes successfully retrieved:", data);
        // Prepare HTML content for all QR codes
        const qrCodeHTML = data.map(product => this.generateQRCodeHTML(product)).join("");
        // Open a new window with the HTML content
        const popupWindow = window.open("", "_blank");
        if (popupWindow) {
          popupWindow.document.open();
          // Write the QR code HTML content to the new window
          popupWindow.document.write(qrCodeHTML);
          popupWindow.document.close();
          // Print the window
          popupWindow.print();
        } else {
          console.error("Failed to open popup window.");
        }
      },
      (error) => {
        console.error("Error getting QR codes:", error);
        // Handle error appropriately, e.g., display an error message to the user
      }
    );
  }
  
  generateQRCodeHTML(product: any): string {
    const combinedString = `${product.code}`;
    let qrCodeHTML = `<div style="margin: 20px;display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">`;
    // Generate QR code for the combined string
    QRCode.toDataURL(combinedString, { errorCorrectionLevel: "M", width: 100 }, (err, url) => {
      if (err) {
        console.error("Error generating QR code:", err);
        return;
      }
      // Add the QR code image and product name to the HTML content
      qrCodeHTML += `<div>`;
      qrCodeHTML += `<img src="${url}" alt="QR Code">`;
      qrCodeHTML += `<h4 style="margin-left:20px">${product.productName}</h4>`;
      qrCodeHTML += `</div>`;
    });
    qrCodeHTML += `</div>`;
    return qrCodeHTML;
  }
  
  
  
}

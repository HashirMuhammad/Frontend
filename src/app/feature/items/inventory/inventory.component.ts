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
      image: "",
      product: {
        ID: 3,
        CreatedAt: "2024-03-27T18:55:23.733Z",
        UpdatedAt: "2024-03-27T18:55:23.733Z",
        DeletedAt: null,
        UserID: 2,
        code: "132",
        productname: "first test",
        price: "789",
        stock: "465"
      },
    }
  ];
  items: any;
  inventoryproductsByID = [
    {
      id: "",
      code: "",
      name: "",
      image: "",
      price: 1,
      quantity: 0
    }
  ];
  productName: string;
  productPrice: number;
  productStock: number;
  productBarcode: string;
  UpdateImgToogle = true;
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

  ngOnInit() {
    // Initialize filteredProducts with all products
    this.itemsService.getinventoryproducts().subscribe(
      (data) => {
        this.inventoryproducts = data;
        console.log(data);
      },
      (error) => {
        console.error("Error fetching clients:", error);
      }
    );
    this.items = this.inventoryproducts.length;
    this.filteredProducts = this.inventoryproducts;
    this.inventoryproductsByID = this.items.inventoryproductsByID;
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

  getinventoryproductsByIDData() {
    this.itemsService.getinventoryproductsByID().subscribe(
      (data) => {
        this.inventoryproductsByID = data;
      },
      (error) => {
        console.error("Error fetching clients:", error);
      }
    );
  }

  filterProductsByName(): void {
    // Perform the filter operation
    // this.filteredProducts = this.inventoryproducts.filter((product) =>
    //   product.name.toLowerCase().includes(this.productToSearch.toLowerCase())
    // );
  }

  StockProductsChange() {
    if (this.showOutOfStock == true) {
      this.filterProducts();
    } else {
      this.filteredProducts = this.inventoryproducts;
    }
  }

  filterProducts() {
    // if (this.showOutOfStock) {
    //   this.filteredProducts = this.inventoryproducts.filter((product) => product.quantity === 0);
    // } else {
    //   this.filteredProducts = this.inventoryproducts;
    // }
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

  showUpdateDialog(id: number) {
    console.log(id);
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
        // Optionally, close the dialog or perform any other action upon successful addition
        this.visible = false;
      },
      (error) => {
        console.error("Error adding product:", error);
        // Handle error appropriately, e.g., display an error message to the user
      }
    );
  }

  updateProductStock(StockVal: any) {
    const updatedStock = StockVal + this.updateStock; // Calculate the updated stock
    const productId = this.StockValid; // Replace with the actual product ID

    // Call the service method to update the product stock
    this.itemsService.updateProductStock(productId, updatedStock).subscribe(
      () => {
        console.log("Stock updated successfully");
        // Optionally, close the dialog or perform any other action upon successful update
        this.viewVisible = false;
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
      productName: this.productName,
      price: this.productPrice,
      stock: this.productStock,
      barcode: this.productBarcode,
      file: this.uploadedFiles // Assuming selectedFile is the File object
    };

    // Call the service method to add the product to the backend
    this.itemsService.updateProduct(Product).subscribe(
      (response) => {
        console.log("Product added successfully:", response);
        // Optionally, close the dialog or perform any other action upon successful addition
        this.visible = false;
      },
      (error) => {
        console.error("Error adding product:", error);
        // Handle error appropriately, e.g., display an error message to the user
      }
    );

    this.visible = false;
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
}

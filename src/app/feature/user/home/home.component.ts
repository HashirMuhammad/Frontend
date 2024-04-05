import { Component, OnInit, Type } from "@angular/core";
import { HomeServiceService } from "../home-service.service";
import { HttpClient } from "@angular/common/http";
import { ItemsServiceService } from "../../items/items-service.service";

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
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
  dashboardData = [
    {
      total_quantity: 0,
      total_price: 0,
      total_payment_received: 0,
      total_remaining_payment: 0
    }
  ];
  dashboardData2 = [
    {
      total_records: 1,
      total_remaining_payment: 0
    }
  ];
  layout: string = "grid";
  filteredProducts: any[];
  StockVal = 0;
  viewVisible = false;
  dailyGraphSale: any;
  monthlyGraphSale: any;
  dailybasicOptions: any;
  monthlybasicOptions: any;
  dailySale: any;
  monthlySale: number[] = [];
  updateStock: any;
  StockValid: string;
  productLength: number;

  // fileSelected : File;
  // imageUrl: string | ArrayBuffer | null = null;
  // imageLoaded: boolean = false;

  constructor(
    private homeService: HomeServiceService,
    private itemsService: ItemsServiceService // private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.filterProducts();
    this.weeklySale();
    this.monthSale();
    this.dashboardCardData();
    this.dashboardCardData2();
  }

  dashboardCardData() {
    this.homeService.getDashboarddata().subscribe(
      (data) => {
        console.log("Data recieved successfully");
        this.dashboardData = data;

        // Optionally, perform any other action upon successful deletion
      },
      (error) => {
        console.error("Error deleting product:", error);
        // Handle error appropriately, e.g., display an error message to the user
      }
    );
  }

  dashboardCardData2() {
    this.homeService.getDashboarddata2().subscribe(
      (data) => {
        console.log("Data recieved successfully");
        this.dashboardData2 = data;

        // Optionally, perform any other action upon successful deletion
      },
      (error) => {
        console.error("Error deleting product:", error);
        // Handle error appropriately, e.g., display an error message to the user
      }
    );
  }

  monthSale() {
    this.homeService.getMonthlySales().subscribe(
      (data) => {
        console.log("Daily Sale successfully");
        this.monthlySale = data;
        this.chartmonthly();

        // Optionally, perform any other action upon successful deletion
      },
      (error) => {
        console.error("Error deleting product:", error);
        // Handle error appropriately, e.g., display an error message to the user
      }
    );
  }

  weeklySale() {
    this.homeService.getDailySales().subscribe(
      (data) => {
        console.log("Daily Sale successfully");
        this.dailySale = data;
        this.chartDaily();

        // Optionally, perform any other action upon successful deletion
      },
      (error) => {
        console.error("Error deleting product:", error);
        // Handle error appropriately, e.g., display an error message to the user
      }
    );
  }

  // onUpload(event: UploadEvent) {
  //   console.log(event.files)
  // }

  // getImage(imageId: number) {
  //   const backendUrl = `http://localhost:8080/getImage?id=${imageId}`;

  //   this.http.get(backendUrl, { responseType: 'blob' }).subscribe(
  //     (response: Blob) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(response);
  //       reader.onloadend = () => {
  //         this.imageUrl = reader.result;
  //         this.imageLoaded = true;
  //       };
  //     },
  //     error => {
  //       console.error('Error fetching image:', error);
  //     }
  //   );
  // }

  getBase64Image(base64Image: string): string {
    // Prefix the base64 data with the appropriate MIME type
    return "data:image/png;base64," + base64Image;
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
        this.filterProducts();
      },
      (error) => {
        console.error("Error updating stock:", error);
        // Handle error appropriately, e.g., display an error message to the user
      }
    );

    this.viewVisible = false;
  }

  chartDaily() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    this.dailyGraphSale = {
      labels: ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Daily Sales",
          data: this.dailySale,
          backgroundColor: ["rgba(255, 159, 64, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(153, 102, 255, 0.2)"],
          borderColor: ["rgb(255, 159, 64)", "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)"],
          borderWidth: 1
        }
      ]
    };

    this.dailybasicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  chartmonthly() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    this.monthlyGraphSale = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Monthly Sales",
          data: this.monthlySale,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(153, 102, 255)",
            "rgb(255, 159, 64)",
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(153, 102, 255)",
            "rgb(255, 159, 64)"
          ],
          borderWidth: 1
        }
      ]
    };

    this.monthlybasicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  filterProducts() {
    // this.filteredProducts = this.products.filter((product) => product.quantity === 0);
    this.itemsService.getProductStockZero().subscribe(
      (data) => {
        this.filteredProducts = data;
        this.productLength = this.filteredProducts.length;
      },
      (error) => {
        console.error("Error fetching clients:", error);
      }
    );
  }

  showViewDialog(id: string, Val: number) {
    this.StockValid = id;
    this.StockVal = Val;
    console.log(id);
    console.log(Val);
    this.viewVisible = true;
  }

  saveProduct() {
    this.viewVisible = false;
  }

  deleteDialog(id: any) {
    // Call the ProductService to delete the product
    this.itemsService.deleteProduct(id).subscribe(
      () => {
        console.log("Product deleted successfully");
        this.filterProducts();
        // Optionally, perform any other action upon successful deletion
      },
      (error) => {
        console.error("Error deleting product:", error);
        // Handle error appropriately, e.g., display an error message to the user
      }
    );
  }
}

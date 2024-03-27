import { Component, OnInit, Type } from "@angular/core";
import { HomeServiceService } from "../home-service.service";
import { HttpClient } from "@angular/common/http";

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
  bills = [
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
      clientName: "",
      date: "21/02/2024",
      paymentReceived: 0,
      remainingPayment: -65
    },
    {
      id: 2,
      items: [
        {
          id: 2,
          name: "Digital Camera",
          price: 150,
          quantity: 2,
          code: "g456dh0j5",
          totalItemPrice: 300
        }
      ],
      totalQuantity: 2,
      totalPrice: 300,
      clientName: "John Doe",
      date: "22/02/2024",
      paymentReceived: 100,
      remainingPayment: 200
    },
    {
      id: 3,
      items: [
        {
          id: 3,
          name: "Smartphone",
          price: 500,
          quantity: 1,
          code: "h789ij0k2",
          totalItemPrice: 500
        }
      ],
      totalQuantity: 1,
      totalPrice: 500,
      clientName: "Alice Smith",
      date: "23/02/2024",
      paymentReceived: 300,
      remainingPayment: 200
    },
    {
      id: 4,
      items: [
        {
          id: 4,
          name: "Laptop",
          price: 800,
          quantity: 1,
          code: "j123kl4m6",
          totalItemPrice: 800
        }
      ],
      totalQuantity: 1,
      totalPrice: 800,
      clientName: "Bob Johnson",
      date: "24/02/2024",
      paymentReceived: 500,
      remainingPayment: 300
    },
    {
      id: 5,
      items: [
        {
          id: 5,
          name: "Headphones",
          price: 50,
          quantity: 2,
          code: "k567mn8o0",
          totalItemPrice: 100
        }
      ],
      totalQuantity: 2,
      totalPrice: 100,
      clientName: "Emily Brown",
      date: "25/02/2024",
      paymentReceived: 0,
      remainingPayment: 100
    },
    {
      id: 6,
      items: [
        {
          id: 6,
          name: "Tablet",
          price: 300,
          quantity: 1,
          code: "l901op2q4",
          totalItemPrice: 300
        }
      ],
      totalQuantity: 1,
      totalPrice: 300,
      clientName: "",
      date: "26/02/2024",
      paymentReceived: 0,
      remainingPayment: 300
    },
    {
      id: 7,
      items: [
        {
          id: 7,
          name: "Smartwatch",
          price: 200,
          quantity: 1,
          code: "m345np6q8",
          totalItemPrice: 200
        }
      ],
      totalQuantity: 1,
      totalPrice: 200,
      clientName: "David Wilson",
      date: "27/02/2024",
      paymentReceived: 150,
      remainingPayment: 50
    },
    {
      id: 8,
      items: [
        {
          id: 8,
          name: "Printer",
          price: 150,
          quantity: 1,
          code: "n678qr0s2",
          totalItemPrice: 150
        }
      ],
      totalQuantity: 1,
      totalPrice: 150,
      clientName: "",
      date: "28/02/2024",
      paymentReceived: 0,
      remainingPayment: 150
    },
    {
      id: 9,
      items: [
        {
          id: 9,
          name: "Wireless Mouse",
          price: 20,
          quantity: 3,
          code: "o901rs2t4",
          totalItemPrice: 60
        }
      ],
      totalQuantity: 3,
      totalPrice: 60,
      clientName: "Sophia Garcia",
      date: "29/02/2024",
      paymentReceived: 30,
      remainingPayment: 30
    },
    {
      id: 10,
      items: [
        {
          id: 10,
          name: "External Hard Drive",
          price: 100,
          quantity: 1,
          code: "p234st6u8",
          totalItemPrice: 100
        }
      ],
      totalQuantity: 1,
      totalPrice: 100,
      clientName: "Michael Miller",
      date: "01/03/2024",
      paymentReceived: 50,
      remainingPayment: 50
    }
  ];
  products = [
    {
      id: "1",
      code: "f230fh0g3",
      name: "Pen",
      image: "bamboo-watch.jpg",
      price: 65,
      quantity: 0
    },
    {
      id: "2",
      code: "f240fh0g3",
      name: "Bamboo Watch",
      image: "bamboo-watch.jpg",
      price: 65,
      quantity: 4
    },
    {
      id: "3",
      code: "f230fh0g3",
      name: "Bamboo Watch",
      image: "bamboo-watch.jpg",
      price: 65,
      quantity: 24
    },
    {
      id: "4",
      code: "f230fh0g3",
      name: "Bamboo Watch",
      image: "bamboo-watch.jpg",
      price: 65,
      quantity: 24
    },
    {
      id: "5",
      code: "f230fh0g3",
      name: "Bamboo Watch",
      image: "bamboo-watch.jpg",
      price: 65,
      quantity: 24
    },
    {
      id: "6",
      code: "f230fh0g3",
      name: "Bamboo Watch",
      image: "bamboo-watch.jpg",
      price: 65,
      quantity: 24
    },
    {
      id: "7",
      code: "f230fh0g3",
      name: "Bamboo Watch",
      image: "bamboo-watch.jpg",
      price: 65,
      quantity: 24
    }
  ];
  totalSale: number = 1;
  remainingPayment: number = 1;
  totalQuantity: number = 1;
  billsLength = this.bills.length;
  layout: string = "grid";
  filteredProducts: any[];
  StockVal = 0;
  viewVisible = false;
  dailyGraphSale: any;
  monthlyGraphSale: any;
  dailybasicOptions: any;
  monthlybasicOptions: any;
  dailySale: number[] = [];
  monthlySale: number[] = [];

  fileSelected : File;
  imageUrl: string | ArrayBuffer | null = null;
  imageLoaded: boolean = false;
  
  constructor(
    private homeService: HomeServiceService,
    private http: HttpClient
  ) {
    this.Calculatebil();
    this.dailySale = this.homeService.dailySale;
    this.monthlySale = this.homeService.monthlySale;
  }

  ngOnInit(): void {
    this.filterProducts();
    this.calculateTotals();
    this.chartDaily();
    this.chartmonthly();
  }

  onUpload(event: UploadEvent) {
    console.log(event.files)
  }

  getImage(imageId: number) {
    // Replace 'your_backend_url' with the actual URL of your Golang backend endpoint
    const backendUrl = `http://localhost:8080/getImage?id=${imageId}`;
  
    this.http.get(backendUrl, { responseType: 'blob' }).subscribe(
      (response: Blob) => {
        // Convert the Blob to data URL
        const reader = new FileReader();
        reader.readAsDataURL(response);
        reader.onloadend = () => {
          this.imageUrl = reader.result;
          this.imageLoaded = true;
        };
      },
      error => {
        console.error('Error fetching image:', error);
      }
    );
  }
  
  Calculatebil() {
    // Calculate totalSale, remainingPayment, and totalQuantity
    this.bills.forEach((bill) => {
      this.totalSale += bill.totalPrice;
      this.remainingPayment += bill.remainingPayment;
      this.totalQuantity += bill.totalQuantity;
    });
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

  calculateTotals() {
    this.totalSale = 0;
    this.remainingPayment = 0;
    this.totalQuantity = 0;

    this.bills.forEach((bill) => {
      this.totalSale += bill.totalPrice;
      this.remainingPayment += bill.remainingPayment;
      this.totalQuantity += bill.totalQuantity;
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter((product) => product.quantity === 0);
  }

  showViewDialog(val: number) {
    debugger;
    this.StockVal = val;
    console.log(val);
    this.viewVisible = true;
  }

  saveProduct() {
    this.viewVisible = false;
  }

  
}

import { Component } from "@angular/core";
import { ClientServiceService } from "../client-service.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-clients",
  templateUrl: "./clients.component.html",
  styleUrls: ["./clients.component.css"]
})
export class ClientsComponent {
  searchClients = [
    {
      ID: 1,
      name: "",
      emailaddress: "",
      phoneno: "",
      country: "",
      city: "",
      bussniessname: "",
      description: ""
    }
  ];

  constructor(
    private ClientService: ClientServiceService,
    private router: Router
    ) {
    // this.searchClients = this.ClientService.searchClients
    this.getData();
  }

  ngOnInit() {
    
  }

  getData() {
    this.ClientService.getClients().subscribe(
      (data) => {
        this.searchClients = data;
        console.log(data)
      },
      (error) => {
        console.error("Error fetching clients:", error);
      }
    );
  }

  editUser(id: any){
    this.router.navigate([`manage_clients/add_client/${id}`]);
  }

  removeUser(id: any){
    console.log(id)
    this.ClientService.removeUser(id)
    .subscribe(
      () => {
        console.log(`User with ID ${id} removed successfully.`);
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

import { Component } from "@angular/core";
import { ClientServiceService } from "../client-service.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-add-clients",
  templateUrl: "./add-clients.component.html",
  styleUrls: ["./add-clients.component.css"]
})
export class AddClientsComponent {
  Name = "";
  EmailAddress = "";
  PhoneNo = 0;
  Country = "";
  City = "";
  BussniessName = "";
  Description = "";
  id: number;
  getClientById: any;

  constructor(private ClientService: ClientServiceService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // Retrieve the id parameter from the route snapshot
    this.id = this.activatedRoute.snapshot.params["id"];

    if (this.id != null) {
      this.getClient(this.id);
    } else{ 
      this.id = 0;
    }
  }

  getClient(id: number): void {
    this.ClientService.getClientById(id).subscribe((data) => {
      // this.getClientById = data;
      this.Name = data.name;
      this.EmailAddress = data.emailaddress;
      this.PhoneNo = data.phoneno;
      this.Country = data.country;
      this.City = data.city;
      this.BussniessName = data.bussniessname;
      this.Description = data.description;
    });
  }

  cancel() {
    this.Name = "";
    this.EmailAddress = "";
    this.PhoneNo = 0;
    this.Country = "";
    this.City = "";
    this.BussniessName = "";
    this.Description = "";
  }

  save() {
    if (
      this.Name == "" &&
      this.EmailAddress == "" &&
      this.PhoneNo == 0 &&
      this.Country == "" &&
      this.City == "" &&
      this.BussniessName == "" &&
      this.Description == ""
    ) {
      alert("Please Fill Fields properly.");
    } else {
      const data = {
        name: this.Name,
        emailaddress: this.EmailAddress,
        phoneno: this.PhoneNo,
        country: this.Country,
        city: this.City,
        bussniessname: this.BussniessName,
        description: this.Description
      };

      if(this.id > 0 ){
        this.ClientService.updateData(data, this.id).subscribe(
          (response) => {
            console.log('Response from backend:', response);
  
            this.cancel()
            // Handle success response
          },
          (error) => {
            console.log('Error sending data to backend:', error);
            // Handle error response
          }
        );
      } else {
        this.ClientService.sendData(data).subscribe(
          (response) => {
            console.log('Response from backend:', response);
  
            this.cancel()
            // Handle success response
          },
          (error) => {
            console.log('Error sending data to backend:', error);
            // Handle error response
          }
        );
      }
      }
      
  }
}

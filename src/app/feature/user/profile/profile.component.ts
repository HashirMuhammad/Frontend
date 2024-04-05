import { Component, OnInit } from "@angular/core";
import { UserService } from "../../../core/services/user.service";
import { User } from "../../../core/models/user.interface";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HomeServiceService } from "../home-service.service";
import { LoginService } from "../login.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {
  passwordForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private loginservice: LoginService,
    // private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      email: ['', Validators.required], // Assuming you want to display the user's name
      currentpassword: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

    updatePassword() {
      if (this.passwordForm.invalid) {
        return;
      }
  
      const formData = {
        email: this.passwordForm.value.email, // Get user's email from somewhere or pass it as a parameter
        current_password: this.passwordForm.value.currentpassword,
        new_password: this.passwordForm.value.newPassword
      };
  
      this.loginservice.updatePassword(formData).subscribe(
        (data) => {
          console.log(data);
        localStorage.removeItem('currentUser')
          this.router.navigate(['login'])
  
          // Optionally, perform any other action upon successful deletion
        },
        (error) => {
          console.error("Error deleting product:", error);
          // Handle error appropriately, e.g., display an error message to the user
        }
      );
    }
  
  
  resetPasswordForm() {
    this.passwordForm.reset();
  }
  
}

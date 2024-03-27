import { Component, OnInit } from "@angular/core";
import { UserService } from "../../../core/services/user.service";
import { User } from "../../../core/models/user.interface";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
// import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { ValidationService } from "../../../core/components/validation-errors/validation-messages.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {
  user: User;
  passwordForm: UntypedFormGroup;
  constructor(
    private usreService: UserService,
    private formBuilder: UntypedFormBuilder,
    private validationService: ValidationService,
    // private toastrService: ToastrService,
    private router: Router
  ) {}
  createPasswordForm() {
    this.passwordForm = this.formBuilder.group(
      {
        name: ["", Validators.required],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required]
      },
      {
        validator: this.validationService.MustMatch("password", "confirmPassword")
      }
    );
  }


  resetPasswordForm() {
    this.passwordForm.reset();
    this.passwordForm.get("name").patchValue(this.user.name);
  }
  updatePassword() {
    this.usreService.changePassword(this.user._id, this.passwordForm.get("password").value).subscribe(
      (data) => {
        // this.toastrService.success("Profile updated successful");
        this.router.navigate(["/login"]);
      },
      (error) => {}
    );
  }

  ngOnInit(): void {
    this.getCurrentuser();
    this.createPasswordForm();
    this.user = this.usreService.getCurrentUser();
    this.passwordForm.get("name").patchValue(this.user.name);

  }
  getCurrentuser(){
    this.usreService.getCurrentUserProfile().subscribe(
      (data) => {
       console.log("User Profile", data);
      },
      (error) => {}
    );
  }
}

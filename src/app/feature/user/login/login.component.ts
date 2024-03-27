import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from "../login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  submitted: any = false;
  error: any = '';
  returnUrl: string;
  model: any = {};
  loading = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: UntypedFormBuilder, 
    private router: Router,
    private loginService: LoginService,
    ) { }

    ngOnInit(): void {
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      });
    }
  
    get f() { return this.loginForm.controls; }
  
    login(): void {
      this.submitted = true;
  
      if (this.loginForm.invalid) {
        return;
      }
  
      // Send the email and password to the backend service
      this.loginService.login(this.loginForm.value).subscribe(
        response => {
          console.log('Response from backend:', response);
          localStorage.setItem("currentUser",response.token)
          localStorage.setItem("currentUserName",response.name)
          this.router.navigate(['home'])
          // Handle response from backend if needed
        },
        error => {
          console.log('Error sending data to backend:', error);
          // Handle error if needed
        }
      );
    }
}

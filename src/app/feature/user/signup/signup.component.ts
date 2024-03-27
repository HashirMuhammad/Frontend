import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: UntypedFormGroup;
  submitted: any = false;
  error: any = '';
  successmsg: any = false;

  constructor(
    private formBuilder: UntypedFormBuilder, 
    private loginService: LoginService,
    private router: Router, 
    ) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;
  
      if (this.signupForm.invalid) {
        return;
      }
  
      // Send the email and password to the backend service
      this.loginService.signup(this.signupForm.value).subscribe(
        response => {
          console.log('Response from backend:', response);
          this.router.navigate(['login'])
          // Handle response from backend if needed
        },
        error => {
          console.log('Error sending data to backend:', error);
          // Handle error if needed
        }
      );
  }
}

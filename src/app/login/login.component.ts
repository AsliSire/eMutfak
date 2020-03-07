import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../entity/service/authentication.service';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Employee } from '../entity/model/employee';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  returnUrl: string;
  error: string = "";
  control: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    localStorage.removeItem('currentUser');
    // redirect to home if already logged in
    // if (this.authenticationService.currentUserValue) {
    //   this.router.navigate(["/"]);
    // }
  }


  ngOnInit() {
    localStorage.removeItem('currentUser');

    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
      password_control: ["", Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  // convenience getter for easy access to form fields
  get f(): FormGroup["controls"] {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    if(this.f.password.value != this.f.password_control.value){this.control = true; this.loading=false;}
    else{
    this.authenticationService
      .login(this.f.username.value, this.f.password.value, this.f.password_control.value)
      .pipe(first())
      .subscribe(
        (employee: Employee) => {
          let url1 = window.location.origin + '/' + '';
          if (environment.base_url != '') url1 = window.location.origin + environment.base_url + '';
          console.log('URL1 = ' + url1);
          window.location.href = url1;

          //this.router.navigate(['/index.html']);
        },
        error => {
          this.error = error;
          this.loading = false;
        }
      );}
  }

  passcontrol(){
    this.control = false;
  }
}

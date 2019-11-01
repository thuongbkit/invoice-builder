import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  authForm: FormGroup;
  title = '';
  isResultsLoading = false;
  constructor(private fb: FormBuilder, private authService: AuthService,
    private jwtService: JwtService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.initForm();
    this.title = this.router.url === '/login' ? 'Login' : 'Signup';
  }

  private initForm() {
    this.authForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      name: ['']
    });
  }

  googleAuthHandler() {
    this.authService.googleAuth()
      .subscribe(data => {
        console.log(data);
      }, err => this.errorHandler(err, 'Opps, something went wrong'));
  }

  forgotPasswordHandler() {
    this.router.navigate(['/forgot-password']);
  }

  onSubmit() {
    this.isResultsLoading = true;
    if (this.title === 'Signup') {
      this.authService.signup(this.authForm.value)
        .subscribe(data => {
          this.snackBar.open('Signup successful', 'Success', { duration: 3000 });
          this.router.navigate(['/login']);
        }, err => {
          this.errorHandler(err, 'Opps, something went wrong');
        }, () => this.isResultsLoading = false);
    } else {
      let { email, password } = this.authForm.value;
      let user: User = { email, password };
      this.authService.login(user)
        .subscribe(data => {
          this.jwtService.setToken(data.token);
          this.router.navigate(['/dashboard', 'invoices']);
        }, err => {
          this.errorHandler(err, 'Opps, something went wrong');
        }, () => this.isResultsLoading = false);
    }
  }

  private errorHandler(error: any, message: string) {
    console.log(error);
    this.isResultsLoading = false;
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }



}

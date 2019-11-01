import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup;
  isResultsLoading = false;
  private token = '';
  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.initForm();
    this.token = this.route.snapshot.params['token'];
  }

  private initForm() {
    this.form = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    const { password, confirmPassword } = this.form.value;
    if (password !== confirmPassword) {
      this.snackBar.open('Both password should match', 'Warning', {
        duration: 2000
      });
      return;
    }
    this.authService.resetPassword({ token: this.token, password })
      .subscribe(data => {
        this.snackBar.open('Password updated succcessfully', 'Success', {
          duration: 2000
        });
        this.router.navigate(['/login']);
      }, err => this.errorHandler(err, 'Opps, something went wrong!'),
        () => this.isResultsLoading = false);
  }
  private errorHandler(error, message) {
    this.isResultsLoading = false;
    console.error(error);
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }
}

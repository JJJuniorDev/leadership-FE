import { Component } from '@angular/core';
import { AuthService } from '../authService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  form: any = { value: {} }; // Replace with actual form initialization

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (this.form && this.form.value) {
      this.authService.login(this.form.value).subscribe(res => {
        localStorage.setItem('token', res.jwt);
        this.router.navigate(['/dashboard']);
      });
    }
  }
}

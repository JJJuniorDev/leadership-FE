// src/app/home/home.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../../model/User.model';
import { Router } from '@angular/router';
import { UserStateService } from '../../services/UserStateService.service';
import { AuthService } from '../../services/Auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
user: User | null = null;
email= '';
password= '';
loggedIn: boolean | null = null;
  selectedFile?: File;
  contractType = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private userStateService: UserStateService
  ) {
  }

  ngOnInit() {
    this.userStateService.currentUser$.subscribe(user => {
      this.user = user;
      this.loggedIn = !!user;
      console.log('🏠 LandingPage - User:', user?.email);
    });
    
     this.loadInitialUser();
  }


    private loadInitialUser() {
    if (this.authService.isLoggedIn()) {
      const cachedUser = this.userStateService.getUser();
      if (!cachedUser) {
        // Ricarica dall'API se necessario
        this.authService.getCurrentUser().subscribe({
          next: (user) => this.userStateService.setUser(user),
          error: () => this.authService.logout()
        });
      }
    }
  }



  
  login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: res => {
        this.authService.saveToken(res.token);
        this.userStateService.setUser(res.user);
      const savedToken = localStorage.getItem('auth_token');
        // Reindirizza al generatore dopo il login
        this.router.navigate(['/dashboard']);
      },
      error: () =>console.log('Login fallito ⚠️')
    });
  }

  signup() {
    this.authService.signup({ email: this.email, password: this.password }).subscribe({
      next: res => {
        console.log('Registrazione completata! 📧 Controlla la tua mail per confermare.');
      },
      error: () => console.log('Email già registrata ⚠️')
    });
  }

 

 logout() {
    this.authService.logout();
    this.loggedIn = false;
    this.email = '';
    this.password = '';
  }
  
}

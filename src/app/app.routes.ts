import { Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { HomeComponent } from './contract/home/home';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

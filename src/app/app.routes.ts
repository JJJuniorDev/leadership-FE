import { Routes } from '@angular/router';


import { HomeComponent } from './contract/home/home';
import { DashboardComponent } from './dashboard/dashboard';
import { Onboarding } from './onboarding/onboarding';
import { DailyPulse } from './daily-pulse/daily-pulse';
import { Goal } from './goal/goal';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'onboarding', component: Onboarding },
  {path: 'dashboard', component: DashboardComponent},
   { path: 'daily-pulses/new', component: DailyPulse }, // 🔥 NUOVA ROTTA
  { path: 'daily-pulses', component: DailyPulse },
  {path: 'goals', component: Goal},
   { path: '**', redirectTo: '' }
  // { path: 'login', component: Login },
  // { path: 'register', component: Register },
   
  // { path: '', redirectTo: 'home', pathMatch: 'full' }
];

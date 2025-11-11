// services/onboarding.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeadershipPath } from '../model/LeadershipPath.model';
import { OnboardingRequest } from '../model/OnboardingRequest.model';
import { User } from '../model/User.model';


@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private apiUrl = 'http://localhost:8080/api/onboarding';

  constructor(private http: HttpClient) { }

  getLeadershipPaths(): Observable<LeadershipPath[]> {
    return this.http.get<LeadershipPath[]>(`${this.apiUrl}/paths`);
  }

  completeOnboarding(request: OnboardingRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/complete`, request);
  }
}
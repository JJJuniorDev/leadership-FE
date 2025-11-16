import { Observable } from "rxjs";
import { User } from "../model/User.model";
import { DailyPulseDTO } from "../model/DailyPulseDTO.model";
import { WeeklyReflectionDTO } from "../model/WeeklyReflectionDTO.model";
import { LeadershipGoalDTO } from "../model/LeadershipGoalDTO.model";
import { ImprovementAreaDTO } from "../model/ImprovementAreaDTO.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

// user.service.ts
@Injectable({
  providedIn: 'root'
})
export class UserService {
 private baseUrl = `${environment.apiUrl}`;

    constructor(private http: HttpClient) {}
  // Carica solo dati base utente
  getUserProfile(userId: string): Observable<User> {
    return this.http.get<User>(`/api/users/${userId}/profile`);
  }

  getRecentWeeklyReflections(userId: string, limit: number = 5): Observable<WeeklyReflectionDTO[]> {
    return this.http.get<WeeklyReflectionDTO[]>(
      `/api/users/${userId}/weekly-reflections/recent?limit=${limit}`
    );
  }

  getActiveLeadershipGoals(userId: string): Observable<LeadershipGoalDTO[]> {
     const headers = new HttpHeaders({
    'X-User-ID': userId,
    'Content-Type': 'application/json'
  });
  
  return this.http.get<LeadershipGoalDTO[]>(
    `${this.baseUrl}/leadership-goals/active`,
    { headers }
  );
  }

  getActiveImprovementAreas(userId: string): Observable<ImprovementAreaDTO[]> {
    return this.http.get<ImprovementAreaDTO[]>(
      `${this.baseUrl}/users/${userId}/improvement-areas/active`
    );
  }
}
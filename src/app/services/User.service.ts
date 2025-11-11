import { Observable } from "rxjs";
import { User } from "../model/User.model";
import { DailyPulseDTO } from "../model/DailyPulseDTO.model";
import { WeeklyReflectionDTO } from "../model/WeeklyReflectionDTO.model";
import { LeadershipGoalDTO } from "../model/LeadershipGoalDTO.model";
import { ImprovementAreaDTO } from "../model/ImprovementAreaDTO.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

// user.service.ts
@Injectable({
  providedIn: 'root'
})
export class UserService {

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
    return this.http.get<LeadershipGoalDTO[]>(
      `/api/users/${userId}/leadership-goals/active`
    );
  }

  getActiveImprovementAreas(userId: string): Observable<ImprovementAreaDTO[]> {
    return this.http.get<ImprovementAreaDTO[]>(
      `/api/users/${userId}/improvement-areas/active`
    );
  }
}
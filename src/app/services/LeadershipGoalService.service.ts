// services/leadership-goal.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeadershipGoalDTO } from '../model/LeadershipGoalDTO.model';

@Injectable({
  providedIn: 'root'
})
export class LeadershipGoalService {
  private apiUrl = 'http://localhost:8080/api/leadership-goals';

  constructor(private http: HttpClient) {}

  // Ottieni tutti i goal attivi dell'utente
  getActiveGoals(userId: string): Observable<LeadershipGoalDTO[]> {
    return this.http.get<LeadershipGoalDTO[]>(`${this.apiUrl}/active`, {
      headers: { 'X-User-ID': userId }
    });
  }

  // Ottieni goal per categoria
  getGoalsByCategory(userId: string, category: string): Observable<LeadershipGoalDTO[]> {
    return this.http.get<LeadershipGoalDTO[]>(`${this.apiUrl}/category/${category}`, {
      headers: { 'X-User-ID': userId }
    });
  }

  // Crea un nuovo goal
  createGoal(userId: string, goal: LeadershipGoalDTO): Observable<LeadershipGoalDTO> {
    return this.http.post<LeadershipGoalDTO>(this.apiUrl, goal, {
      headers: { 'X-User-ID': userId }
    });
  }

  // Aggiorna un goal esistente
  updateGoal(userId: string, goalId: string, goal: LeadershipGoalDTO): Observable<LeadershipGoalDTO> {
    return this.http.put<LeadershipGoalDTO>(`${this.apiUrl}/${goalId}`, goal, {
      headers: { 'X-User-ID': userId }
    });
  }

  // Elimina un goal
  deleteGoal(userId: string, goalId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${goalId}`, {
      headers: { 'X-User-ID': userId }
    });
  }
}
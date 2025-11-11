// services/daily-pulse.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DailyPulseDTO } from '../model/DailyPulseDTO.model';
import { DailyPulseResponseDTO } from '../model/DailyPulseResponseDTO.model';

@Injectable({
  providedIn: 'root'
})
export class DailyPulseService {
  private apiUrl = 'http://localhost:8080/api/daily-pulses';

  constructor(private http: HttpClient) {}

  // Ottieni pulse random per l'utente corrente
  getRandomPulsesForUser(userId: string, count: number = 3): Observable<DailyPulseDTO[]> {
    return this.http.get<DailyPulseDTO[]>(`${this.apiUrl}/random?count=${count}`, {
      headers: { 'X-User-ID': userId }
    });
  }

  // Ottieni pulse per categoria specifica
  getPulsesByCategory(category: string, count: number = 5): Observable<DailyPulseDTO[]> {
    return this.http.get<DailyPulseDTO[]>(`${this.apiUrl}/category/${category}?count=${count}`);
  }

  // Crea un nuovo pulse
  createPulse(userId: string, pulse: DailyPulseDTO): Observable<DailyPulseDTO> {
    return this.http.post<DailyPulseDTO>(this.apiUrl, pulse, {
      headers: { 'X-User-ID': userId }
    });
  }

    // Salva una RISPOSTA
  createResponse(userId: string, response: DailyPulseResponseDTO): Observable<DailyPulseResponseDTO> {
    return this.http.post<DailyPulseResponseDTO>(`${this.apiUrl}/responses`, response, {
      headers: { 'X-User-ID': userId }
    });
  }
}
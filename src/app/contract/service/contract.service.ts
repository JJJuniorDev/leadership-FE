// src/app/services/contract.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contract } from '../model/contract.model';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/contracts';

  listContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(this.baseUrl);
  }

  uploadContract(file: File, contractType: string): Observable<Contract> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contractType', contractType);
    return this.http.post<Contract>(this.baseUrl + '/upload', formData);
  }

   getContractTypes(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + '/types');
  }
}

// src/app/home/home.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ContractService } from '../service/contract.service';
import { Contract } from '../model/contract.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  private contractService = inject(ContractService);

  contracts: Contract[] = [];
  selectedFile?: File;
  contractType = '';

 contractTypes: string[] = [];

  ngOnInit() {
    this.loadContractTypes();
  }

  loadContractTypes() {
  this.contractService.getContractTypes().subscribe({
    next: types => this.contractTypes = types,
    error: err => console.error('Errore caricamento tipi contratto', err)
  });
}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  loadContracts() {
    this.contractService.listContracts().subscribe({
      next: contracts => this.contracts = contracts,
      error: err => console.error('Errore caricamento contratti', err)
    });
  }

  uploadContract() {
    if (!this.selectedFile || !this.contractType) {
      alert('Seleziona un tipo di contratto e un file!');
      return;
    }

    this.contractService.uploadContract(this.selectedFile, this.contractType)
      .subscribe({
        next: contract => {
          this.contracts.push(contract);
          this.selectedFile = undefined;
          this.contractType = '';
        },
        error: err => {
          console.error(err);
          alert('Errore durante upload contratto.');
        }
      });
  }
}

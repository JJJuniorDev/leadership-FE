import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DailyPulseDTO } from '../model/DailyPulseDTO.model';
import { UserStateService } from '../services/UserStateService.service';
import { Router } from '@angular/router';
import { DailyPulseService } from '../services/DailyPulse.service';
import { Subject, takeUntil } from 'rxjs';
import { DailyPulseResponseDTO } from '../model/DailyPulseResponseDTO.model';

@Component({
  selector: 'app-daily-pulse',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './daily-pulse.html',
  styleUrl: './daily-pulse.css'
})
export class DailyPulse implements OnInit {
  pulseForm: FormGroup;
  availablePulses: DailyPulseDTO[] = [];
  currentPulseIndex = 0;
  currentPage = 1;
  totalPages = 4; // 1 metriche + 3 domande
  loading = false;
  user: any;
  private destroy$ = new Subject<void>();
  
  constructor(
    private fb: FormBuilder,
    private pulseService: DailyPulseService,
    private userState: UserStateService,
    private router: Router
  ) {
    this.pulseForm = this.createForm();
  }

  ngOnInit() {
    this.userState.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.user = user;
        console.log('Current user in DailyPulse:', user);
        if (user) {
          this.loadRandomPulses();
        }
      });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createForm(): FormGroup {
    return this.fb.group({
      whatILearnedResponse: ['', Validators.required],
      howIInspiredResponse: ['', Validators.required],
      whereToImproveResponse: ['', Validators.required],
      energyLevel: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      focusLevel: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      teamConnectionLevel: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      dailyMood: ['NEUTRAL', Validators.required]
    });
  }

  loadRandomPulses() {
    this.loading = true;
    this.pulseService.getRandomPulsesForUser(this.user.id, 5).subscribe({
      next: (pulses) => {
        this.availablePulses = pulses;
        this.loading = false;
        this.currentPage = 1; // Ricomincia dalla prima pagina
      },
      error: (error) => {
        console.error('Error loading pulses:', error);
        this.loading = false;
      }
    });
  }

  get currentPulse(): DailyPulseDTO | null {
    return this.availablePulses[this.currentPulseIndex] || null;
  }

  nextPage() {
    if (this.currentPage < this.totalPages && this.isCurrentPageValid()) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  isCurrentPageValid(): boolean {
    switch (this.currentPage) {
      case 1: // Metriche e mood
        return this.pulseForm.get('energyLevel')!.valid &&
               this.pulseForm.get('focusLevel')!.valid &&
               this.pulseForm.get('teamConnectionLevel')!.valid &&
               this.pulseForm.get('dailyMood')!.valid;
      
      case 2: // Prima domanda
        return this.pulseForm.get('whatILearnedResponse')!.valid;
      
      case 3: // Seconda domanda
        return this.pulseForm.get('howIInspiredResponse')!.valid;
      
      case 4: // Terza domanda
        return this.pulseForm.get('whereToImproveResponse')!.valid;
      
      default:
        return false;
    }
  }

  // Navigazione tra pulse diverse (se necessario)
  nextPulse() {
    if (this.currentPulseIndex < this.availablePulses.length - 1) {
      this.currentPulseIndex++;
      this.currentPage = 1; // Torna alla prima pagina
      this.pulseForm.reset({
        energyLevel: 5,
        focusLevel: 5,
        teamConnectionLevel: 5,
        dailyMood: 'NEUTRAL'
      });
    }
  }

  previousPulse() {
    if (this.currentPulseIndex > 0) {
      this.currentPulseIndex--;
      this.currentPage = 1; // Torna alla prima pagina
      this.pulseForm.reset({
        energyLevel: 5,
        focusLevel: 5,
        teamConnectionLevel: 5,
        dailyMood: 'NEUTRAL'
      });
    }
  }

  onSubmit() {
    if (this.pulseForm.valid && this.user && this.currentPulse) {
      this.loading = true;
       const formValue = this.pulseForm.value;
      const response: DailyPulseResponseDTO = {
       questionId: this.currentPulse.id!,
        pulseDate: new Date().toISOString().split('T')[0],
        // RISPOSTE
        whatILearnedResponse: formValue.whatILearnedResponse,
        howIInspiredResponse: formValue.howIInspiredResponse,
        whereToImproveResponse: formValue.whereToImproveResponse,       
        // METRICHE
        energyLevel: formValue.energyLevel,
        focusLevel: formValue.focusLevel,
        teamConnectionLevel: formValue.teamConnectionLevel,
        dailyMood: formValue.dailyMood
      };

      this.pulseService.createResponse(this.user.id, response).subscribe({
        next: (savedResponse) => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error saving pulse:', error);
          this.loading = false;
        }
      });
    }
  }

  getCategoryDisplayName(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'SVILUPPO_COMPETENZE': 'Sviluppo Competenze',
      'COSTRUZIONE_TEAM': 'Costruzione Team',
      'CRESCITA_PERSONALE': 'Crescita Personale',
      'IMPATTO_STRATEGICO': 'Impatto Strategico',
      'ECCELLENZA_OPERATIVA': 'Eccellenza Operativa',
      'COSTRUZIONE_RELAZIONI': 'Costruzione Relazioni'
    };
    return categoryMap[category] || category;
  }
}
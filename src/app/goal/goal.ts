// goal.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LeadershipGoalDTO } from '../model/LeadershipGoalDTO.model';
import { UserStateService } from '../services/UserStateService.service';
import { LeadershipGoalService } from '../services/LeadershipGoalService.service';

@Component({
  selector: 'app-goal',
  imports: [CommonModule, RouterModule],
  templateUrl: './goal.html',
  styleUrl: './goal.css'
})
export class Goal implements OnInit, OnDestroy {
  activeGoals: LeadershipGoalDTO[] = [];
  loading = false;
  error = '';
  user: any;
  
  private destroy$ = new Subject<void>();

  constructor(
    private goalService: LeadershipGoalService,
    private userState: UserStateService
  ) {}

  ngOnInit() {
    this.userState.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.user = user;
        if (user) {
          this.loadActiveGoals();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadActiveGoals() {
    this.loading = true;
    this.error = '';
    
    this.goalService.getActiveGoals(this.user.id).subscribe({
      next: (goals) => {
        this.activeGoals = goals;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading goals:', error);
        this.error = 'Errore nel caricamento dei goal';
        this.loading = false;
      }
    });
  }

  getCategoryDisplayName(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'SKILL_DEVELOPMENT': 'Sviluppo Competenze',
      'TEAM_BUILDING': 'Costruzione Team', 
      'PERSONAL_GROWTH': 'Crescita Personale',
      'STRATEGIC_IMPACT': 'Impatto Strategico',
      'OPERATIONAL_EXCELLENCE': 'Eccellenza Operativa',
      'RELATIONSHIP_BUILDING': 'Costruzione Relazioni',
      'SVILUPPO_COMPETENZE': 'Sviluppo Competenze',
      'COSTRUZIONE_TEAM': 'Costruzione Team',
      'CRESCITA_PERSONALE': 'Crescita Personale',
      'IMPATTO_STRATEGICO': 'Impatto Strategico',
      'ECCELLENZA_OPERATIVA': 'Eccellenza Operativa',
      'COSTRUZIONE_RELAZIONI': 'Costruzione Relazioni'
    };
    return categoryMap[category] || category;
  }

  getStatusDisplayName(status: string): string {
    const statusMap: { [key: string]: string } = {
      'ACTIVE': 'Attivo',
      'ATTIVO': 'Attivo',
      'COMPLETED': 'Completato',
      'COMPLETATO': 'Completato',
      'PAUSED': 'In Pausa',
      'IN_PAUSA': 'In Pausa'
    };
    return statusMap[status] || status;
  }

  getProgressColor(progress: number): string {
    if (progress >= 80) return 'progress-high';
    if (progress >= 50) return 'progress-medium';
    return 'progress-low';
  }

  getDaysRemaining(targetDate: string): number {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isOverdue(targetDate: string): boolean {
    return this.getDaysRemaining(targetDate) < 0;
  }

  refreshGoals() {
    this.loadActiveGoals();
  }
}
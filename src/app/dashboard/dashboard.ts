import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { UserStateService } from '../services/UserStateService.service';
import { DailyPulseDTO } from '../model/DailyPulseDTO.model';
import { WeeklyReflectionDTO } from '../model/WeeklyReflectionDTO.model';
import { LeadershipGoalDTO } from '../model/LeadershipGoalDTO.model';
import { ImprovementAreaDTO } from '../model/ImprovementAreaDTO.model';
import { User } from '../model/User.model';
import { DailyPulseService } from '../services/DailyPulse.service';
import { UserService } from '../services/User.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  user: User | null = null;
  recentPulses: DailyPulseDTO[] = [];
  activeGoals: LeadershipGoalDTO[] = [];
  activeImprovements: ImprovementAreaDTO[] = [];
  recentReflections: WeeklyReflectionDTO[] = [];
  
  loading = {
    profile: true,
    pulses: false,
    goals: false,
    improvements: false,
    reflections: false,
    all: false
  };

  stats = {
    totalPulses: 0,
    completedGoals: 0,
    activeImprovements: 0,
    weeklyScore: 0
  };

  constructor(
    private userStateService: UserStateService,
    private dailyPulseService: DailyPulseService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData(): void {
    this.userStateService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.user = user;
         if (user) {
         // Controlla se il questionario è completato
        if (!user!.questionnaireCompleted) {
           console.log('User needs to complete questionnaire, redirecting to onboarding...');
          this.router.navigate(['/onboarding']);
        } 
        else {
          this.loadDashboardData();
       }
       } else {
          this.handleNoUser();
        }
      });
  }

  private loadDashboardData(): void {
    if (!this.user) return;

    this.loading.all = true;
    
    // Carica tutto in parallelo per performance migliore
    forkJoin({
      pulses: this.dailyPulseService.getRandomPulsesForUser(this.user.id),
      goals: this.userService.getActiveLeadershipGoals(this.user.id),
      improvements: this.userService.getActiveImprovementAreas(this.user.id),
      reflections: this.userService.getRecentWeeklyReflections(this.user.id, 3)
    }).subscribe({
      next: (results) => {
        this.recentPulses = results.pulses;
        this.activeGoals = results.goals;
        this.activeImprovements = results.improvements;
        this.recentReflections = results.reflections;
        
        this.calculateStats();
        this.loading.all = false;
        
        console.log('📊 Dashboard data loaded successfully');
      },
      error: (error) => {
        console.error('❌ Error loading dashboard data:', error);
        this.loading.all = false;
      }
    });
  }

  private calculateStats(): void {
    this.stats.totalPulses = this.recentPulses.length;
    this.stats.completedGoals = this.activeGoals.filter(g => g.status === 'COMPLETED').length;
    this.stats.activeImprovements = this.activeImprovements.filter(i => i.isActive).length;
    
    if (this.recentReflections.length > 0) {
      const lastReflection = this.recentReflections[0];
      this.stats.weeklyScore = Math.round(
        (lastReflection.productivityScore + 
         lastReflection.teamSatisfactionScore + 
         lastReflection.personalGrowthScore + 
         lastReflection.workLifeBalanceScore) / 4
      );
    }
  }

  private handleNoUser(): void {
    this.user = null;
    this.recentPulses = [];
    this.activeGoals = [];
    this.activeImprovements = [];
    this.recentReflections = [];
    this.resetStats();
  }

  private resetStats(): void {
    this.stats = {
      totalPulses: 0,
      completedGoals: 0,
      activeImprovements: 0,
      weeklyScore: 0
    };
  }

  refreshData(): void {
    if (this.user) {
      this.loadDashboardData();
    }
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }

  getMoodEmoji(mood: string): string {
    const moodMap: { [key: string]: string } = {
      'EXCELLENT': '😊',
      'GOOD': '🙂',
      'NEUTRAL': '😐',
      'LOW': '😔',
      'STRESSED': '😥'
    };
    return moodMap[mood] || '❓';
  }

  getProgressPercentage(goal: LeadershipGoalDTO): number {
    return goal.currentProgress || 0;
  }

  getSkillLevelText(level: number): string {
    const levels = ['Beginner', 'Developing', 'Proficient', 'Advanced', 'Expert'];
    return levels[Math.min(Math.floor(level / 2), 4)] || 'Beginner';
  }
}
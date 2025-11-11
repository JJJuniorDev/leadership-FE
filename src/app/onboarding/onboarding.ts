import { Component, OnInit } from '@angular/core';
import { LeadershipPath } from '../model/LeadershipPath.model';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OnboardingService } from '../services/Onboarding.service';
import { UserStateService } from '../services/UserStateService.service';
import { Router } from '@angular/router';
import { OnboardingRequest } from '../model/OnboardingRequest.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-onboarding',
  imports: [CommonModule, 
    FormsModule, 
    ReactiveFormsModule],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css'
})
export class Onboarding implements OnInit {
  currentStep = 1;
  totalSteps = 4;
  leadershipPaths: LeadershipPath[] = [];
  loading = false;

  // Sfide predefinite per il frontend
  availableChallenges = [
    "Communication with team",
    "Effective delegation", 
    "Time management",
    "Constructive feedback",
    "Team motivation",
    "Conflict resolution",
    "Strategic planning",
    "Decision making",
    "Meeting management",
    "Team member development"
  ];

  onboardingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private onboardingService: OnboardingService,
    private userStateService: UserStateService,
    private router: Router
  ) {
    this.onboardingForm = this.createForm();
  }

  ngOnInit() {
    this.loadLeadershipPaths();
  }

  createForm(): FormGroup {
    return this.fb.group({
      // Step 1: Contesto
      leadershipRole: ['', Validators.required],
      teamSize: [0, [Validators.required, Validators.min(1)]],
      company: ['', Validators.required],
      yearsOfExperience: [0, Validators.required],
      
      // Step 2: Sfide
      identifiedChallenges: this.fb.array([], Validators.required),
      
      // Step 3: Percorso
      primaryLeadershipPath: ['', Validators.required],
      
      // Step 4: Goal personalizzato
      customGoal: ['']
    });
  }

  get challengesArray(): FormArray {
    return this.onboardingForm.get('identifiedChallenges') as FormArray;
  }

  loadLeadershipPaths() {
    this.loading = true;
    this.onboardingService.getLeadershipPaths().subscribe({
      next: (paths) => {
        this.leadershipPaths = paths;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading leadership paths:', error);
        this.loading = false;
      }
    });
  }

  toggleChallenge(challenge: string) {
    const index = this.challengesArray.controls.findIndex(c => c.value === challenge);
    if (index >= 0) {
      this.challengesArray.removeAt(index);
    } else {
      this.challengesArray.push(this.fb.control(challenge));
    }
  }

  isChallengeSelected(challenge: string): boolean {
    return this.challengesArray.value.includes(challenge);
  }

  isStepValid(step: number): boolean {
    switch(step) {
      case 1:
        return this.onboardingForm.get('leadershipRole')!.valid &&
               this.onboardingForm.get('teamSize')!.valid &&
               this.onboardingForm.get('company')!.valid;
      case 2:
        return this.challengesArray.length > 0;
      case 3:
        return this.onboardingForm.get('primaryLeadershipPath')!.valid;
      case 4:
        return true; // Opzionale
      default:
        return false;
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  completeOnboarding() {
    if (this.onboardingForm.valid) {
      this.loading = true;
      
      const formValue = this.onboardingForm.value;
      const request: OnboardingRequest = {
        leadershipRole: formValue.leadershipRole,
        teamSize: Number(formValue.teamSize),
        company: formValue.company,
        identifiedChallenges: formValue.identifiedChallenges,
        primaryLeadershipPath: formValue.primaryLeadershipPath,
        customGoal: formValue.customGoal,
        yearsOfExperience: Number(formValue.yearsOfExperience)
      };

      this.onboardingService.completeOnboarding(request).subscribe({
        next: (user) => {
       //   this.userStateService.updateUser(user);
          this.router.navigate(['/dashboard']);
          this.loading = false;
        },
        error: (error) => {
          console.error('Onboarding completion failed:', error);
          this.loading = false;
        }
      });
    }
  }

  getSelectedPath(): LeadershipPath | undefined {
    const selectedPath = this.onboardingForm.get('primaryLeadershipPath')?.value;
    return this.leadershipPaths.find(p => p.path === selectedPath);
  }

  // Helper per il template
  getStepLabel(step: number): string {
    const labels = ['', 'Context', 'Challenges', 'Focus Area', 'Goal'];
    return labels[step] || '';
  }

  getStepClass(step: number): string {
    let cls = 'step-indicator';
    if (this.currentStep === step) cls += ' active';
    if (this.currentStep > step) cls += ' completed';
    return cls;
  }
}
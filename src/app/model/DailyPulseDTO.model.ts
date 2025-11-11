export interface DailyPulseDTO {
  id: string;
  userId: string;
  pulseDate: string;
  whatILearned: string;
  howIInspired: string;
  whereToImprove: string;
  energyLevel: number;
  focusLevel: number;
  teamConnectionLevel: number;
  dailyMood: string;
  tags: string[];
  createdAt: string;
   goalCategory: string;
}
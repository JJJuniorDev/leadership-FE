import { DailyPulseDTO } from "./DailyPulseDTO.model";
import { WeeklyReflectionDTO } from "./WeeklyReflectionDTO.model";
import { ImprovementAreaDTO } from "./ImprovementAreaDTO.model";
import { LeadershipGoalDTO } from "./LeadershipGoalDTO.model";

export interface User {
  id: string;
  email: string;
  plan: string;
  firstName: string;
  lastName: string;
  primaryFocus: string;
  leadershipRole: string;
  company: string;
  teamSize: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  dailyPulses: DailyPulseDTO[];
  weeklyReflections: WeeklyReflectionDTO[];
  leadershipGoals: LeadershipGoalDTO[];
  improvementAreas: ImprovementAreaDTO[];
  stripeCustomerId?: string;
  questionnaireCompleted: boolean;
}

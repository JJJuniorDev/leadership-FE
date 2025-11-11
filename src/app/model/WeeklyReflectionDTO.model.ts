export interface WeeklyReflectionDTO {
  id: string;
  userId: string;
  weekStartDate: string;
  weekEndDate: string;
  biggestAchievement: string;
  keyChallenge: string;
  lessonLearned: string;
  nextWeekFocus: string;
  productivityScore: number;
  teamSatisfactionScore: number;
  personalGrowthScore: number;
  workLifeBalanceScore: number;
  createdAt: string;
}
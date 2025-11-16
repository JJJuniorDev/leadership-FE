export interface LeadershipGoalDTO {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  status: string;
  startDate: string;
  targetDate: string;
  completedDate: string;
  currentProgress: number;
  progressNotes: string;
  createdAt: string;
  updatedAt: string;
  currentDay: number;
}
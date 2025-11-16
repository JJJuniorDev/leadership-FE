export interface GoalRelatedTaskDTO {
  id: string;
  goalId: string;
  title: string;
  description: string;
  taskType: string; // 'DAILY' | 'WEEKLY' | 'SPECIFIC' | 'LEARNING' | 'PRACTICE'
  status: string; // 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED'
  relatedSkill: string; // LeadershipSkill enum
  estimatedMinutes: number;
  points: number;
  dueDate: string; // ISO date string
  completedDate?: string; // ISO date string
  createdAt: string; // ISO date string
}

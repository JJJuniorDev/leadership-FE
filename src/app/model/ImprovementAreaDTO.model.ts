export interface ImprovementAreaDTO {
  id: string;
  userId: string;
  title: string;
  skill: string;
  description: string;
  currentSkillLevel: number;
  targetSkillLevel: number;
  isActive: boolean;
  createdAt: string;
}
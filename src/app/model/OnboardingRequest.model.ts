export interface OnboardingRequest {
  leadershipRole: string;
  teamSize: number;
  company: string;
  identifiedChallenges: string[];
  primaryLeadershipPath: string;
  customGoal?: string;
  yearsOfExperience?: number;
}
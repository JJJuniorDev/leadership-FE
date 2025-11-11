// model/DailyPulseResponseDTO.model.ts
export interface DailyPulseResponseDTO {
  id?: string;
  userId?: string;
  questionId: string;  // Riferimento alla domanda
  pulseDate: string;
  
  // RISPOSTE
  whatILearnedResponse: string;
  howIInspiredResponse: string;
  whereToImproveResponse: string;
  
  // METRICHE
  energyLevel: number;
  focusLevel: number;
  teamConnectionLevel: number;
  dailyMood: string;
  
  // Info domanda (opzionale, per comodità)
  questionWhatILearned?: string;
  questionHowIInspired?: string;
  questionWhereToImprove?: string;
  goalCategory?: string;
  
  createdAt?: string;
}
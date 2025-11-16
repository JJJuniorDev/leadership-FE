import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GoalRelatedTaskDTO } from '../model/Goal-tasks/GoalRelatedTaskDTO.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-daily-task-component',
  imports: [CommonModule],
  templateUrl: './daily-task-component.html',
  styleUrl: './daily-task-component.css'
})
export class DailyTaskComponent {
@Input() isVisible: boolean = false;
  @Input() task: GoalRelatedTaskDTO | null = null;
  @Input() isLoading: boolean = false;
  @Input() currentDay: number = 1;
  @Output() closed = new EventEmitter<void>();
  @Output() taskCompleted = new EventEmitter<string>();

  close() {
    this.closed.emit();
  }

  completeTask() {
    if (this.task) {
      this.taskCompleted.emit(this.task.id);
    }
  }

  getPhaseText(): string {
    if (this.currentDay <= 30) return 'Fase: Fondamentali';
    if (this.currentDay <= 60) return 'Fase: Applicazione';
    return 'Fase: Maestria';
  }

  getSkillDisplayName(skill: string): string {
    const skillMap: { [key: string]: string } = {
      'ACTIVE_LISTENING': 'Ascolto Attivo',
      'FEEDBACK_DELIVERY': 'Feedback Costruttivo',
      'PRESENTATION_SKILLS': 'Comunicazione Efficace',
      'COMMUNICATION': 'Comunicazione',
      'CONFLICT_RESOLUTION': 'Risoluzione Conflitti'
    };
    return skillMap[skill] || skill;
  }
}
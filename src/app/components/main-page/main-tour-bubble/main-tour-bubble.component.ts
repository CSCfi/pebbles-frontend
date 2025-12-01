import { Component, Input } from '@angular/core';

interface TourStep {
  id: number;
  icon?: string;
  title?: string;
  content?: string;
  size?: number;
}

@Component({
  selector: 'app-main-tour-bubble',
  templateUrl: './main-tour-bubble.component.html',
  styleUrl: './main-tour-bubble.component.scss',
  standalone: false
})
export class MainTourBubbleComponent {

  @Input() isTourStepOn: boolean = true;
  @Input() tourSteps: TourStep[] = [
    {
      id: 1,
      icon: 'face',
      title: 'Test 1',
      content: 'Pellentesque habitant morbi.'
    },
    {
      id: 2,
      icon: 'mood',
      title: 'Test 2',
      content: 'Pellentesque habitant morbi tristique senectus et netus.'
    },
    {
      id: 3,
      icon: 'sentiment_satisfied',
      title: 'Test 3',
      content: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.'
    },
  ];

  currentStepIndex: number = 0;

  constructor() { }

  get currentStepNumber(): number {
    return this.currentStepIndex + 1;
  }

  get totalSteps(): number {
    return this.tourSteps.length;
  }

  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    } else {
      this.currentStepIndex = this.tourSteps.length;
    }
  }

  nextStep(): void {
    if (this.currentStepIndex < this.totalSteps - 1) {
      this.currentStepIndex++;
    } else {
      this.currentStepIndex = 0;
    }
  }
}

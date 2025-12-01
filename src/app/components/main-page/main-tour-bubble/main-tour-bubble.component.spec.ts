import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTourBubbleComponent } from './main-tour-bubble.component';

describe('MainTourBubbleComponent', () => {
  let component: MainTourBubbleComponent;
  let fixture: ComponentFixture<MainTourBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainTourBubbleComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MainTourBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

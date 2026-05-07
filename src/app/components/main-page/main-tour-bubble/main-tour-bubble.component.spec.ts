import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainTourBubbleComponent } from './main-tour-bubble.component';
import { MatIconModule } from '@angular/material/icon';

describe('MainTourBubbleComponent', () => {
  let component: MainTourBubbleComponent;
  let fixture: ComponentFixture<MainTourBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainTourBubbleComponent],
      imports: [MatIconModule],
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

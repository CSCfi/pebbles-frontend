import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from '../../../../environments/environment';

import { CardDescriptionComponent } from './card-description.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MaterialModule } from '../../../material.module';

describe('CardDescriptionComponent', () => {
  let component: CardDescriptionComponent;
  let fixture: ComponentFixture<CardDescriptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CardDescriptionComponent],
      imports: [MaterialModule],
      providers: [
        provideHttpClient(withInterceptors(ENVIRONMENT_SPECIFIC_INTERCEPTORS)),
        provideHttpClientTesting(),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exposes a unique id per instance for aria-controls', () => {
    const other = TestBed.createComponent(CardDescriptionComponent).componentInstance;
    expect(component.descriptionId).toBeTruthy();
    expect(component.descriptionId).not.toEqual(other.descriptionId);
  });

  it('toggles the expanded state and stops event propagation', () => {
    const event = new MouseEvent('click');
    const stopSpy = spyOn(event, 'stopPropagation');

    expect(component.isExpanded).toBeFalse();
    component.toggle(event);
    expect(component.isExpanded).toBeTrue();
    expect(stopSpy).toHaveBeenCalled();

    component.toggle(event);
    expect(component.isExpanded).toBeFalse();
  });

  it('does not update overflow after the view is destroyed', () => {
    fixture.destroy();
    expect(() => component['updateOverflow']()).not.toThrow();
    expect(component.isOverflowing).toBeFalse();
  });
});

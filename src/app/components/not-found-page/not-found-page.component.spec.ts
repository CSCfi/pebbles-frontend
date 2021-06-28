import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MaterialModule } from 'src/app/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NotFoundPageComponent } from './not-found-page.component';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';

describe('NotFoundPageComponent', () => {
  let component: NotFoundPageComponent;
  let fixture: ComponentFixture<NotFoundPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        RouterTestingModule
      ],
      declarations: [NotFoundPageComponent],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

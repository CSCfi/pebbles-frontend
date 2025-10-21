import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MainContentHeaderComponent } from '../main-content-header/main-content-header.component';
import { MainHelpComponent } from './main-help.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from 'src/environments/environment';

describe('MainHelpComponent', () => {
  let component: MainHelpComponent;
  let fixture: ComponentFixture<MainHelpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainHelpComponent,
        MainContentHeaderComponent,
      ],
      imports: [
        RouterModule.forRoot([]),
        MaterialModule,
        ReactiveFormsModule,
      ],
      providers: [
        provideHttpClient(withInterceptors(ENVIRONMENT_SPECIFIC_INTERCEPTORS)),
        provideHttpClientTesting(),
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

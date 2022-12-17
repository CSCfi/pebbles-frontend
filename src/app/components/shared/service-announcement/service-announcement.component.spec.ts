import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from '../../../../environments/environment';
import { MaterialModule } from '../../../material.module';
import { ServiceAnnouncementComponent } from './service-announcement.component';

describe('ServiceAnnouncementComponent', () => {
  let component: ServiceAnnouncementComponent;
  let fixture: ComponentFixture<ServiceAnnouncementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceAnnouncementComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MaterialModule
      ],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create announcement', () => {
    expect(component).toBeTruthy();
  });
});

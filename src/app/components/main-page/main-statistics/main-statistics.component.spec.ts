import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MainContentHeaderComponent } from '../main-content-header/main-content-header.component';
import { MainStatisticsComponent } from './main-statistics.component';

describe('MainStatisticsComponent', () => {
  let component: MainStatisticsComponent;
  let fixture: ComponentFixture<MainStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainStatisticsComponent,
        MainContentHeaderComponent
       ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

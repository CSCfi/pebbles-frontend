import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MaterialModule } from 'src/app/material.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { DialogComponent } from './dialog.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        ClipboardModule
      ],
      declarations: [ DialogComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA,
          useValue: {
            dialogTitle: 'test title',
            dialogContent: 'test content',
            dialogClipboard: 'test text',
            dialogActions: ['close']
          }
        },
        { provide: MatDialogRef,
          useValue: {}
        }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditPreviewComponent } from './admin-edit-preview.component';

describe('AdminEditPreviewComponent', () => {
  let component: AdminEditPreviewComponent;
  let fixture: ComponentFixture<AdminEditPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEditPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

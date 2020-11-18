import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFlowComponent } from './admin-flow.component';

describe('AdminFlowComponent', () => {
  let component: AdminFlowComponent;
  let fixture: ComponentFixture<AdminFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

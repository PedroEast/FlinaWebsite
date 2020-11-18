import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelevopLogFormComponent } from './delevop-log-form.component';

describe('DelevopLogFormComponent', () => {
  let component: DelevopLogFormComponent;
  let fixture: ComponentFixture<DelevopLogFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelevopLogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelevopLogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

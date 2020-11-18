import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopLogComponent } from './develop-log.component';

describe('DevelopLogComponent', () => {
  let component: DevelopLogComponent;
  let fixture: ComponentFixture<DevelopLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevelopLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevelopLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

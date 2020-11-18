import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoderMenuComponent } from './coder-menu.component';

describe('CoderMenuComponent', () => {
  let component: CoderMenuComponent;
  let fixture: ComponentFixture<CoderMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoderMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoderMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

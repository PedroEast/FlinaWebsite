import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterBlockComponent } from './router-block.component';

describe('RouterBlockComponent', () => {
  let component: RouterBlockComponent;
  let fixture: ComponentFixture<RouterBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouterBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouterBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

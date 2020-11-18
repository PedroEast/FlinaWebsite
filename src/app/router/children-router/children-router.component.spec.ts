import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildrenRouterComponent } from './children-router.component';

describe('ChildrenRouterComponent', () => {
  let component: ChildrenRouterComponent;
  let fixture: ComponentFixture<ChildrenRouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildrenRouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildrenRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

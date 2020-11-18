import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnNavComponent } from './column-nav.component';

describe('ColumnNavComponent', () => {
  let component: ColumnNavComponent;
  let fixture: ComponentFixture<ColumnNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

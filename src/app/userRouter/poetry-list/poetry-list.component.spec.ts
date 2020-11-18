import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoetryListComponent } from './poetry-list.component';

describe('PoetryListComponent', () => {
  let component: PoetryListComponent;
  let fixture: ComponentFixture<PoetryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoetryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoetryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

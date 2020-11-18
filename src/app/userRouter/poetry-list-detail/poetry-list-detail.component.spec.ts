import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoetryListDetailComponent } from './poetry-list-detail.component';

describe('PoetryListDetailComponent', () => {
  let component: PoetryListDetailComponent;
  let fixture: ComponentFixture<PoetryListDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoetryListDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoetryListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

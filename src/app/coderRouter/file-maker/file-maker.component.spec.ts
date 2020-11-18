import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileMakerComponent } from './file-maker.component';

describe('FileMakerComponent', () => {
  let component: FileMakerComponent;
  let fixture: ComponentFixture<FileMakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileMakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

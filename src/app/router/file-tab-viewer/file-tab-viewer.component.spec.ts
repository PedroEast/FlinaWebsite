import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTabViewerComponent } from './file-tab-viewer.component';

describe('FileTabViewerComponent', () => {
  let component: FileTabViewerComponent;
  let fixture: ComponentFixture<FileTabViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileTabViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTabViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

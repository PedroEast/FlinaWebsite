import { TestBed } from '@angular/core/testing';

import { CoderGuard } from './coder.guard';

describe('CoderGuard', () => {
  let guard: CoderGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CoderGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { UiKitService } from './ui-kit.service';

describe('UiKitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UiKitService = TestBed.get(UiKitService);
    expect(service).toBeTruthy();
  });
});

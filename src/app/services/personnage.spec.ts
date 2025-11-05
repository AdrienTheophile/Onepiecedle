import { TestBed } from '@angular/core/testing';

import { PersonnageService } from './personnage';

describe('Personnage', () => {
  let service: Personnage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Personnage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

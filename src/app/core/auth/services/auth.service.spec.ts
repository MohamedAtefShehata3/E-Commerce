import { AuthService } from './auth.service';
import { TestBed } from '@angular/core/testing';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('Should Be Created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { FlowbiteService } from './flowbite.service';

describe('FlowbiteService', () => {
  let service: FlowbiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowbiteService);
  });

  it('Should Be Created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesService);
  });

  it('Should Be Created', () => {
    expect(service).toBeTruthy();
  });
});

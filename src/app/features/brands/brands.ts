import { Component, inject, OnInit, signal } from '@angular/core';
import { BrandsService } from './brands.service';
import { RouterLink } from '@angular/router';
import { Brands as IBrand } from './brands.interface';

@Component({
  imports: [RouterLink],
  selector: 'app-brands',
  styleUrl: './brands.css',
  templateUrl: './brands.html',
})
export class Brands implements OnInit {
  private readonly brandsService = inject(BrandsService);

  brandsList = signal<IBrand[]>([]);

  ngOnInit(): void {
    this.getAllBrandsData();
  }

  getAllBrandsData(): void {
    this.brandsService.getAllBrands().subscribe({
      next: (res) => {
        this.brandsList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}

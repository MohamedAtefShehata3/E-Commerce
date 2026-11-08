import { Component } from '@angular/core';
import { SliderHomeComponent } from './components/slider-home/slider-home.component';
import { CategoryHomeComponent } from './components/category-home/category-home.component';
import { ProductHomeComponent } from './components/product-home/product-home.component';

@Component({
  imports: [SliderHomeComponent, CategoryHomeComponent, ProductHomeComponent],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}

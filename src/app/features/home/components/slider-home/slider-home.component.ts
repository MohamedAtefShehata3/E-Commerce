import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

register();

@Component({
  imports: [RouterLink],
  selector: 'app-slider-home',
  styleUrl: './slider-home.component.css',
  templateUrl: './slider-home.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SliderHomeComponent {
  private platform_id = inject(PLATFORM_ID);

  slides = [
    {
      title: 'Fresh Products Delivered to your Door',
      desc: 'Get 20% off your first order',
      image: 'assets/images/slider-2.jpeg',
      btnText: 'Shop Now',
      color: 'from-primary-600/90 to-primary-400/50',
    },
    {
      title: 'Premium Quality Guaranteed',
      desc: 'Fresh from farm to your table',
      image: 'assets/images/slider-1.jpeg',
      btnText: 'View Deals',
      color: 'from-secondary/90 to-secondary/50',
    },
  ];

  constructor() {
    if (isPlatformBrowser(this.platform_id)) {
      register();
    }
  }
}

import { Component, signal, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layouts/navbar/navbar';
import { Footer } from './layouts/footer/footer';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  imports: [RouterOutlet, Navbar, Footer, NgxSpinnerComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('E-Commerce');

  constructor() {
    afterNextRender(() => {
      import('flowbite').then(({ initFlowbite }) => {
        initFlowbite();
      });
    });
  }
}

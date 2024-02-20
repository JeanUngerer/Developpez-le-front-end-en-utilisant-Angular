import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  getScreenWidth = 1200;
  getScreenHeight = 0;
  constructor() {
    this.onWindowResize();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  ngOnInit(): void {
  }

}

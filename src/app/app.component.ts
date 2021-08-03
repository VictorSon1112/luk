import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  show = true;
  light = false;
  fbLink = 'https://www.facebook.com/luckystd/';
  public appPages = [
    { title: 'Game', url: 'game', icon: 'game' },
    { title: 'Trade', url: 'trade', icon: 'trade' },
    { title: 'Invest', url: 'invest', icon: 'invest' },
    { title: 'Market', url: 'market', icon: 'market' },
  ];
  constructor(public api: ApiService) {}
  ngOnInit() {
    document.body.setAttribute('color-theme', 'dark');
  }
  changeMode(event) {
    this.light = !this.light;
    if (!this.light) {
      document.body.setAttribute('color-theme', 'dark');
    } else {
      document.body.setAttribute('color-theme', 'light');
    }
  }

  showMenu() {
    if (this.show) {
      document.querySelector('.setMenu').classList.add('hiddenMN');
    } else {
      document.querySelector('.setMenu').classList.remove('hiddenMN');
    }
    this.show = !this.show;
  }
}

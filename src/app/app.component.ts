import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  light = true;
  fbLink = 'https://www.facebook.com/luckystd/';
  public appPages = [
    { title: 'Game', url: 'game', icon: 'mail' },
    { title: 'Trade', url: 'trade', icon: 'paper-plane' },
    { title: 'Invest', url: 'invest', icon: 'heart' },
    { title: 'Market', url: 'market', icon: 'heart' },
  ];
  constructor() {}
  changeMode(event) {
    this.light = !this.light;
    if (this.light) {
      document.body.setAttribute('color-theme', 'light');
    } else {
      document.body.setAttribute('color-theme', 'dark');
    }
  }
}

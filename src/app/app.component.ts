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
    { title: 'Home', url: '/folder/Inbox', icon: 'mail' },
    { title: 'Trade', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'Farms', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Pools', url: '/folder/Archived', icon: 'archive' },
    { title: 'Prediction', url: '/folder/Trash', icon: 'trash' },
    { title: 'Lottery', url: '/folder/Spam', icon: 'warning' },
    { title: 'Collectibles', url: '/folder/Spam11', icon: 'warning' },
    { title: 'Team Battle', url: '/folder/Spam2', icon: 'warning' },
    { title: 'Team Profile', url: '/folder/Spam3', icon: 'warning' },
    { title: 'Info', url: '/folder/Spam4', icon: 'warning' },
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

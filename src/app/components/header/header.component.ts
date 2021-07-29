import { Component, OnInit } from "@angular/core";

import { ApiService } from "../../api.service";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  adId = "0";
  reward = 0;
  config: any;
  url_reward = "user?action=reward";
  opened_reward = false;
  bannerAd = {
    link: `https://www.google.com.vn/`,
    description: `Join the world's largest crypto exchange - Buy Crypto with AUD Exchange the world`,
    img: "https://i.ibb.co/NjCm2L1/Ads-Binance.gif",
    heightAd: 50,
  };
  constructor(public api: ApiService) {}
  // linkTo() {
  //   this.launchReview.launch().catch((e) => {
  //     window.open(this.bannerLink, "_blank", "location=yes");
  //   });
  // }

  ngOnInit() {
    this.api.get("user?action=get_config").subscribe((r) => {
      this.bannerAd = r.data_admob;
    });
  }
  openReward() {
    if (this.api.user.reward) {
      this.api.presentLoading("Waiting", 5000);

      if (this.api.adId == "0") {
        this.api.post(this.url_reward, { get: 1 }).subscribe();
      } else {
        this.api.showReward();
      }
    }
  }
}

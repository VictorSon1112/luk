import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-button-back',
  templateUrl: './button-back.component.html',
  styleUrls: ['./button-back.component.scss'],
})
export class ButtonBackComponent implements OnInit {

  constructor(public api: ApiService) { }

  ngOnInit() {}

}

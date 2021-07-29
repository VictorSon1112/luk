import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
	@Input() data: any;
	@Input() page: any;
	@Input() api: any;
  history: any;
	show_data:any = {};
  search = '';
  faqs: any = [];

  constructor() { }

  ngOnInit() {
  	this.show_data.user = [
  		{name: 'id', type: 'text', icon: 'fa fa-fw fa-id-card', color: 'warning'},
  		{name: 'name', type: 'text', icon: 'fa fa-fw fa-info-circle', color: 'success'},
  		{name: 'balance', type: 'number', icon: 'fa fa-fw fa-gem'},
  		{name: 'total_play', type: 'number', icon: 'fa fa-fw fa-star', color: 'warning'},
  	]
    this.api.translate.getTranslation(this.api.user.lang || 'en').subscribe(r=>{
      for(let k in r){
        if(k.includes('faq_')){
          this.faqs[k] = {q: r[k]};
        }else if(k.includes('ans_')){
          this.faqs[(k.replace('ans', 'faq'))].a = r[k];
        }
      }
    })
  }
  ionViewWillEnter(){
    if(this.page == 'history' && this.data.name){
      this.api.post('user?action=history', {name: this.data.name}).subscribe(r=>{
        if(r.history){
          this.history = r.history;
        }
      })
    }
  }
  check(k, v){
    let s = (this.search).toLowerCase();
    if( !(k.toLowerCase()).includes(s) && !(v.toLowerCase()).includes(s)){
      return false;
    }
    return true;
  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


/**
 * Generated class for the ExpressionTimeFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-expression-time-form',
  templateUrl: 'expression-time-form.html',
})
export class ExpressionTimeFormPage {
  babyid: any;
  form: any;
  date:any;
  items: any = [];
  itemHeight: number = 0;
  shownGroup = null;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
   
    this.babyid = this.navParams.get("param");
    this.date = this.navParams.get("date");  
   
    this.items = [
      {expanded: false,time:'7:10'},
      {expanded: false,time:'7:10'},
      {expanded: false,time:'7:10'},
      {expanded: false,time:'7:10'},
      {expanded: false,time:'7:10'},
      {expanded: false,time:'7:10'},
      {expanded: false,time:'7:10'},
      {expanded: false,time:'7:10'},
      {expanded: false,time:'7:10'}
  ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpressionTimeFormPage');
  }


toggleGroup(group) {
  if (this.isGroupShown(group)) {
      this.shownGroup = null;
  } else {
      this.shownGroup = group;
  }
};
isGroupShown(group) {
  return this.shownGroup === group;
};

}

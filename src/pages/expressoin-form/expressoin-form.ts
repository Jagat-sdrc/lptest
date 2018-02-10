import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ExpressionTimeFormPage } from '../expression-time-form/expression-time-form';
/**
 * Generated class for the ExpressoinFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-expressoin-form',
  templateUrl: 'expressoin-form.html',
})
export class ExpressoinFormPage {

  babyid: any;
  form: any;
  items: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.babyid = this.navParams.get("param1");
    this.form = this.navParams.get("param2");
    this.items = [
      {slno: '1', date: '02/06/2018', time: '19:14'},
      {slno: '2', date: '02/06/2018', time: '19:14'},
      {slno: '3', date: '02/06/2018', time: '19:14'},
      {slno: '4', date: '02/06/2018', time: '19:14'},
      {slno: '5', date: '02/06/2018', time: '19:14'},
      {slno: '6', date: '02/06/2018', time: '19:14'}    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpressoinFormPage');
  }
  goToBabyExBfTimeView(babyId: any,date:any){
    this.navCtrl.push(ExpressionTimeFormPage,{
      param: babyId,
      date:date
    });
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CreateNewAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-new-account',
  templateUrl: 'create-new-account.html',
})
export class CreateNewAccountPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  getCountry(){
    alert("hiiii");
  }

  getState(){

  }

  getDistrict(){

  }

  getInstitutionName(){
    
  }

}

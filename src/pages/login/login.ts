import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { CreateNewAccountPage } from '../create-new-account/create-new-account';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  login(){
    this.navCtrl.setRoot(HomePage);
  }

  forgotPassword(){

  }

  signUp(){
    this.navCtrl.push(CreateNewAccountPage);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}

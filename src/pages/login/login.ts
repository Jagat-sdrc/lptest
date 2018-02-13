import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { CreateNewAccountPage } from '../create-new-account/create-new-account';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../../providers/constant/constant';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage) {
  }

  login(){
    this.storage.set(ConstantProvider.dbKeyNames.country,"INDIA");
    this.storage.set(ConstantProvider.dbKeyNames.state,"TELENGANA");
    this.storage.set(ConstantProvider.dbKeyNames.institution,"SEVEN HILLS");
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

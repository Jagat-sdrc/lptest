import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { CreateNewAccountPage } from '../create-new-account/create-new-account';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../../providers/constant/constant';
import { UserServiceProvider } from '../../providers/user-service/user-service';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {


  loginData: ILoginData;

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage,
  private userService: UserServiceProvider, private alertCtrl: AlertController) {}

  ngOnInit(){
    this.loginData = {
      username: 'jagat@sdrc.co.in',
      password: 'ja@123#!'
    }
  }

  login(){
    this.storage.set(ConstantProvider.dbKeyNames.country,"INDIA");
    this.storage.set(ConstantProvider.dbKeyNames.state,"TELENGANA");
    this.storage.set(ConstantProvider.dbKeyNames.institution,"SEVEN HILLS");

    //this.userService.setUserId(this.loginData.username)

    this.navCtrl.setRoot(HomePage);
  }

  forgotPassword(){
    let confirm = this.alertCtrl.create({
      enableBackdropDismiss: false,
      title: 'Info',
      message: 'Send an email to abc@ahi.com from your email requesting for your password. ',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
              
          }
        }
      ]
    });
    confirm.setCssClass('modalDialog');
    confirm.present();
  }

  signUp(){
    this.navCtrl.push(CreateNewAccountPage);
  }
  

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Platform } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { MessageProvider } from '../../providers/message/message';
import { AppVersion } from '@ionic-native/app-version';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {


  loginData: ILoginData;
  appVersionNumber: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private userService: UserServiceProvider,
  private messageService: MessageProvider, private events: Events,
  private appVersion: AppVersion, private platform: Platform) {
    this.platform.ready().then((readySource) => {
      if(this.platform.is('android') && this.platform.is('cordova')){
        this.appVersion.getVersionNumber()
        .then(data=>{
          this.appVersionNumber = data
        })
      }

    });
  }

  ngOnInit(){
    this.loginData = {
      // username: 'naseem@sdrc.co.in',
      // password: 'na@123#!'
      username: '',
      password: ''
    }
  }

  login(){
    if(this.loginData.username == ""){
      this.messageService.showErrorToast("Please enter valid username")
    }else if(this.loginData.password == ""){
      this.messageService.showErrorToast("Please enter valid password")
    }else{
      this.userService.getUserValidation(this.loginData.username)
        .then(data=> {
        if(this.loginData.password === (this.loginData.username).substring(0,2)+ConstantProvider.passwordFormat){
          this.events.publish('user', data);
          this.userService.setUser(data)
          this.navCtrl.setRoot('HomePage');
        }else{
          this.messageService.showErrorToast(ConstantProvider.messages.invalidCredentials);
        }
      })
        .catch(err =>{
        this.messageService.showErrorToast(err);
      })
    }

  }

  forgotPassword(){
    this.messageService.showOkAlert(ConstantProvider.messages.info,ConstantProvider.messages.forgotPasswordMessage);
  }

  signUp(){
    this.loginData = {
      username: '',
      password: ''
    }
    this.navCtrl.push('CreateNewAccountPage');
  }
}

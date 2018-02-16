import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { CreateNewAccountPage } from '../create-new-account/create-new-account';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../../providers/constant/constant';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { MessageProvider } from '../../providers/message/message';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {


  loginData: ILoginData;

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage,
  private userService: UserServiceProvider, private alertCtrl: AlertController,
  private messageService: MessageProvider) {}

  ngOnInit(){
    this.loginData = {
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
          this.messageService.showSuccessToast("Login successful!");
          this.navCtrl.setRoot(HomePage);
        }else{
          this.messageService.showErrorToast("Invalid Credential");
        }
      })
        .catch(err =>{
        this.messageService.showErrorToast(err);
      })
    }

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

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Platform } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { MessageProvider } from '../../providers/message/message';
import { AppVersion } from '@ionic-native/app-version';

/**
 * This is used for Login page
 *
 * @author Jagat Bandhu
 * @since 0.0.1
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {


  loginData: ILoginData;
  appVersionNumber: string;
  type:string = 'password';
  showPass:boolean = false;

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

  /**
   * This method will initilize the username and password variables.
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  ngOnInit(){
    this.loginData = {
      username: '',
      password: ''
    }
  }

  /**
   * This method will check the login credential for validation of user and login to the app.
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  login(){
    if(this.loginData.username == ""){
      this.messageService.showErrorToast("Please enter the email")
    }else if(this.loginData.password == ""){
      this.messageService.showErrorToast("Please enter the password")
    }else{
      //this method will return the valid user details, if the user is already exist.
      this.userService.getUserValidation(this.loginData.username)
        .then(data=> {
        if(this.loginData.password.toLowerCase() === (this.loginData.username).substring(0,2).toLowerCase()+ConstantProvider.passwordFormat){
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

  /**
   * This method will show a alert message for forgot password
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  forgotPassword(){
    this.messageService.showOkAlert(ConstantProvider.messages.info,ConstantProvider.messages.forgotPasswordMessage);
  }

  /**
   * This method will navigate the user for Creating a New Account to the CreateNewAccountPage.
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  signUp(){
    this.loginData = {
      username: '',
      password: ''
    }
    this.navCtrl.push('CreateNewAccountPage');
  }

  /**
   * This method will show/hide the password to the user
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  showPassword() {
    this.showPass = !this.showPass;

    if(this.showPass){
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
}

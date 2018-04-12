import { MessageProvider } from './../../providers/message/message';
import { Component } from '@angular/core';
import { NavController, MenuController, IonicPage, Platform } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { UserServiceProvider } from '../../providers/user-service/user-service';

/**
 * This page is used for Home page
 *
 * @export
 * @class HomePage
 * @author Ratikanta
 * @since 0.0.1
 */
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  pppPage: any;
  public unregisterBackButtonAction: any;
  user: IUser;
  constructor(public navCtrl: NavController, public menuCtrl: MenuController,
  private messageService: MessageProvider,private platform: Platform, private userService: UserServiceProvider) {

  }

  /**
   * This method call up the initial load of add patient page.
   * Get all the details of the respective user.
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  ngOnInit(){
    this.pppPage = 'PppPage';
    this.user = this.userService.getUser();
  }

  /**
   * This method will navigate the user to RegisteredPatientPage
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  registeredPatientPage(){
    this.navCtrl.push('RegisteredPatientPage',{
      param: "RegisteredPatientPage"
    });
  }

  /**
   * This method will navigate the user to SinglePatientSummaryPage
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  singlePatientSummaryPage(){
    this.navCtrl.push('RegisteredPatientPage',{
      param: "SinglePatientSummaryPage"
    });
  }

  /**
   * This method will navigate the user to AddPatientPage
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  goToAddNewPatient(){
    this.navCtrl.push('AddPatientPage',{
      param: "Add New Patient"
    });
  }
  /**
   * Fired when entering a page, after it becomes the active page.
   * Register the hardware backbutton
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  ionViewDidEnter() {
    this.initializeBackButtonCustomHandler();
  }

  /**
   * Fired when you leave a page, before it stops being the active one
   * Unregister the hardware backbutton
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  ionViewWillLeave() {
      // Unregister the custom back button action for this page
      this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  /**
   * This method will initialize the hardware backbutton
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  public initializeBackButtonCustomHandler(): void {
      this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
          this.customHandleBackButton();
      }, 10);
  }

  /**
   * This method will show a confirmation popup to exit the app, when user click on the hardware back button
   * in the home page
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  private customHandleBackButton(): void {
      this.messageService.showAlert(ConstantProvider.messages.warning,ConstantProvider.messages.exitApp)
      .then((data)=>{
        if(data){
          //exit the app
          this.platform.exitApp();
        }else{
          //stay in home page
          this.navCtrl.setRoot(HomePage);
        }
      });
  }

}

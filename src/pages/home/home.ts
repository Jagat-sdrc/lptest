import { MessageProvider } from './../../providers/message/message';
import { Component } from '@angular/core';
import { NavController, MenuController, IonicPage, Platform } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
/**
 *
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

  vurnerableBabies : any;
  public unregisterBackButtonAction: any;
  constructor(public navCtrl: NavController, public menuCtrl: MenuController,
  private messageService: MessageProvider,private platform: Platform) {

  }

  ngOnInit(){
    this.vurnerableBabies = 'VurnerableBabiesPage';
  }

  registeredPatientPage(){
    this.navCtrl.push('RegisteredPatientPage',{
      param: "RegisteredPatientPage"
    });
  }

  singlePatientSummaryPage(){
    this.navCtrl.push('RegisteredPatientPage',{
      param: "SinglePatientSummaryPage"
    });
  }

  goToAddNewPatient(){
    this.navCtrl.push('AddPatientPage',{
      param: "Add New Patient"
    });
  }


  /**
   * This method will just show the action under construction message
   *
   * @memberof HomePage
   */
  underConstruction(){
    this.messageService.showErrorToast(ConstantProvider.messages.userConstruction)
  }


  ionViewDidEnter() {
    this.initializeBackButtonCustomHandler();
  }

  ionViewWillLeave() {
      // Unregister the custom back button action for this page
      this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  public initializeBackButtonCustomHandler(): void {
      this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
          this.customHandleBackButton();
      }, 10);
  }

  private customHandleBackButton(): void {
      this.messageService.showAlert(ConstantProvider.messages.warning,ConstantProvider.messages.exitApp)
      .then((data)=>{
        if(data){
          this.platform.exitApp();
        }else{
          this.navCtrl.setRoot(HomePage);
        }
      });
  }

}

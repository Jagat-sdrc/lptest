import { MessageProvider } from './../../providers/message/message';
import { Component } from '@angular/core';
import { NavController, MenuController, IonicPage } from 'ionic-angular';
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

  registeredPatientPage : any;
  singlePatientSummary : any;
  vurnerableBabies : any;
  constructor(public navCtrl: NavController, public menuCtrl: MenuController,
  private messageService: MessageProvider) {

  }

  ngOnInit(){
    this.registeredPatientPage = 'RegisteredPatientPage';
    this.singlePatientSummary = 'SinglePatientSummaryPage';
    this.vurnerableBabies = 'VurnerableBabiesPage';
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

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessageProvider } from '../../providers/message/message';
import { ConstantProvider } from '../../providers/constant/constant';

/**
 * Generated class for the BabyDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-baby-dashboard',
  templateUrl: 'baby-dashboard.html',
})
export class BabyDashboardPage {

  feedDateListPage;
  feedPage;
  bfExpressionDateListPage;
  addPatientPage;
  bfspDateListPage;
  bfPostDischargeMenuPage;

  paramToExpressionPage: IParamToExpresssionPage;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private messageService: MessageProvider) {    
  }

  ngOnInit(){
    this.feedDateListPage = 'FeedDateListPage'
    this.bfExpressionDateListPage = 'BFExpressionDateListPage';
    this.addPatientPage = 'AddPatientPage';
    this.bfspDateListPage = 'BfSupportivePracticeDateListPage';
    this.bfPostDischargeMenuPage = 'BfPostDischargeMenuPage';

    this.paramToExpressionPage = {
      babyCode: this.navParams.get("babyCode"),
      babyCodeByHospital: this.navParams.get("babyCodeByHospital"),
      deliveryDate: this.navParams.get('deliveryDate')
    }
  }

  goToHome(){
    this.navCtrl.setRoot('HomePage');
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

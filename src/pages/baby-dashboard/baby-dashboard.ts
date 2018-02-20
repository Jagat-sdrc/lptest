import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  expressoinFormPage;
  addPatientPage;
  bfspDateListPage;
  bfPostDischargeMenuPage;

  paramToExpressionPage: IParamToExpresssionPage;
  constructor(public navCtrl: NavController, public navParams: NavParams) {    
  }

  ngOnInit(){
    this.feedDateListPage = 'FeedDateListPage'
    this.expressoinFormPage = 'ExpressoinFormPage';
    this.addPatientPage = 'AddPatientPage';
    this.bfspDateListPage = 'BfSupportivePracticeDateListPage';
    this.bfPostDischargeMenuPage = 'BfPostDischargeMenuPage';

    this.paramToExpressionPage = {
      babyCode: this.navParams.get("babyCode"),
      babyCodeByHospital: this.navParams.get("babyCodeByHospital")
    }
  }

  goToHome(){
    this.navCtrl.setRoot('HomePage');
  }

}

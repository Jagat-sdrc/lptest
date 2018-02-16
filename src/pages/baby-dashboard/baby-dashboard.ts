import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ExpressoinFormPage } from '../expressoin-form/expressoin-form';
import { HomePage } from '../home/home';
import { AddPatientPage } from '../add-patient/add-patient';
import { FeedDateListPage } from '../feed-date-list/feed-date-list';
import { FeedPage } from '../feed/feed';

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

  paramToExpressionPage: IParamToExpresssionPage;
  constructor(public navCtrl: NavController, public navParams: NavParams) {    
  }

  ngOnInit(){
    this.feedDateListPage = FeedDateListPage
    this.feedPage = FeedPage;
    this.expressoinFormPage = ExpressoinFormPage;
    this.addPatientPage = AddPatientPage;

    this.paramToExpressionPage = {
      babyCode: this.navParams.get("babyCode"),
      babyCodeByHospital: this.navParams.get("babyCodeByHospital")
    }

    console.log(this.paramToExpressionPage.babyCode);
    console.log(this.paramToExpressionPage.babyCodeByHospital);
  }

  goToHome(){
    this.navCtrl.setRoot(HomePage);
  }

}

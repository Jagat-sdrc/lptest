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

  babyid: any;
  feedDateListPage;
  // feedPage;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.babyid = navParams.get("param");
  }

  ngOnInit(){
    this.feedDateListPage = FeedDateListPage
    // this.feedPage = FeedPage
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BabyDashboardPage');
  }

  goToForm(page){
      switch (page) {
        case "Patient Profile":
          this.navCtrl.push(AddPatientPage,{
            param: "Profile"
          });
        break
        case "Exp/BF":
        this.navCtrl.push(ExpressoinFormPage,{
          param1: this.babyid,
          param2: "Exp/BF"
        });
        break;
        case "BFSP":
        this.navCtrl.push(ExpressoinFormPage,{
          param1: this.babyid,
          param2: "BFSP"
        });
        break;
        case "BF-Post Discharge":
        this.navCtrl.push(ExpressoinFormPage,{
          param1: this.babyid,
          param2: "BF-Post Discharge"
        });
        break;
      }
  }

  goToHome(){
    this.navCtrl.setRoot(HomePage);
  }

}

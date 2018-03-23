import { Component } from '@angular/core';
import { PppServiceProvider } from '../../providers/ppp-service/ppp-service';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SinglePatientSummaryServiceProvider } from '../../providers/single-patient-summary-service/single-patient-summary-service';

/**
 * Generated class for the PppPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ppp',
  templateUrl: 'ppp.html',
})
export class PppPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private spsService: SinglePatientSummaryServiceProvider) {
  }

  ionViewWillEnter(){
    this.spsService.getAllPPPDetails();
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SinglePatientSummaryServiceProvider } from '../../providers/single-patient-summary-service/single-patient-summary-service';
import { MessageProvider } from '../../providers/message/message';

/**
 * Generated class for the SpsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sps',
  templateUrl: 'sps.html'
})
export class SpsPage {

  basicRoot = 'BasicPage'
  motherRelatedRoot = 'MotherRelatedPage'
  togetherRoot = 'TogetherPage'
  infantRelatedRoot = 'InfantRelatedPage'
  exclusiveBfRoot = 'ExclusiveBfPage'
  babyAllDetails: IPatient;

  constructor(public navCtrl: NavController, private navParams: NavParams,
    public spsService: SinglePatientSummaryServiceProvider, public messageService: MessageProvider) {}

  ngOnInit(){
    this.babyAllDetails = this.navParams.get('babyDetails');
    this.messageService.showLoader("Generating Single  Patient Summary, please wait...")
  }

}

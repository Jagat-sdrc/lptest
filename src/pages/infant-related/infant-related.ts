import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SinglePatientSummaryServiceProvider } from '../../providers/single-patient-summary-service/single-patient-summary-service';

/**
 * Generated class for the InfantRelatedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-infant-related',
  templateUrl: 'infant-related.html',
})
export class InfantRelatedPage {

  infantRelatedDataList: IInfantRelated[];
  babyDetails: IBabyBasicDetails;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public spsService: SinglePatientSummaryServiceProvider) {
  }

  ngOnInit(){
    this.babyDetails = this.spsService.getBabyDetails();
    this.getInfantRelated();
  }

  async getInfantRelated(){
    this.infantRelatedDataList = await this.spsService.getInfantRelatedData(this.babyDetails.deliveryDate,this.babyDetails.dischargeDate,this.babyDetails.babyCode,this.babyDetails.weight);
  }

}

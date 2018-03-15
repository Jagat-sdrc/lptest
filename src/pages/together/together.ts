import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SinglePatientSummaryServiceProvider } from '../../providers/single-patient-summary-service/single-patient-summary-service';

/**
 * Generated class for the TogetherPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-together',
  templateUrl: 'together.html',
})
export class TogetherPage {

  togetherDataList: ITogetherData[];
  babyDetails: IBabyBasicDetails;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public spsService: SinglePatientSummaryServiceProvider) {
  }

  ngOnInit(){
    this.babyDetails = this.spsService.getBabyDetails();
    this.getTogetherDataList();
  }

  async getTogetherDataList(){
    this.togetherDataList = await this.spsService.getTogetherData(this.babyDetails.deliveryDate,this.babyDetails.dischargeDate,this.babyDetails.babyCode);
  }

}

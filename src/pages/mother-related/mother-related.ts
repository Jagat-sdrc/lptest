import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SinglePatientSummaryServiceProvider } from '../../providers/single-patient-summary-service/single-patient-summary-service';
import { ConstantProvider } from '../../providers/constant/constant';

/**
 * Generated class for the MotherRelatedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mother-related',
  templateUrl: 'mother-related.html',
})
export class MotherRelatedPage {

  motherRelatedDataList: IMotherRelatedData[];
  babyDetails: IBabyBasicDetails;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public spsService: SinglePatientSummaryServiceProvider) {
  }

  ngOnInit(){
    
  }

  ionViewWillEnter(){
    this.babyDetails = this.spsService.getBabyDetails();
    this.getMotherRelatedDataList();
  }

  async getMotherRelatedDataList(){
    this.motherRelatedDataList = await this.spsService.getMotherRelatedData(this.babyDetails.deliveryDate,this.babyDetails.dischargeDate,this.babyDetails.babyCode);
  }

  getBackgroundColor(data){
    if(data){
      if(data === '-' || data === 'No')
        return ConstantProvider.messages.spsContentColorRed
      else if(data === 'Yes')
        return ConstantProvider.messages.spsContentColorGreen
    }
  }

}

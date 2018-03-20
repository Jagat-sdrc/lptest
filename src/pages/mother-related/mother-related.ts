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

  motherRelatedDataList: IMotherRelatedData[]
  babyDetails: IBabyBasicDetails
  comeToVolume7Day: string
  comeToVolume14Day: string

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public spsService: SinglePatientSummaryServiceProvider) {
  }

  ionViewWillEnter(){
    this.babyDetails = this.spsService.getBabyDetails();
    this.getMotherRelatedDataList();
  }

  async getMotherRelatedDataList(){
    let obj  = await this.spsService.getMotherRelatedData(this.babyDetails.deliveryDate,this.babyDetails.dischargeDate,this.babyDetails.babyCode);
    this.motherRelatedDataList = obj.motherRelatedList
    this.comeToVolume7Day = obj.comeToVolume7Day
    this.comeToVolume14Day = obj.comeToVolume14Day
  }

  getBackgroundColor(data){
    if(data){
      if(data === 'No')
        return ConstantProvider.messages.spsContentColorRed
      else if(data === 'Yes')
        return ConstantProvider.messages.spsContentColorGreen
    }
  }

  getComeToVolumeBgColor(data){
    if(data){
      if(data === 'No' || data === '-')
        return ConstantProvider.messages.spsContentColorRed
      else if(data === 'Yes')
        return ConstantProvider.messages.spsContentColorGreen
    }
  }

  getTotalVolumeBgColor(data: string, index: number){
    if(index <=4 && (data && data != '-')) {
      let yesOrNo = data.split(' ')
      return yesOrNo[0] === 'Yes' ? ConstantProvider.messages.spsContentColorGreen : 
        ConstantProvider.messages.spsContentColorRed
    }
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SinglePatientSummaryServiceProvider } from '../../providers/single-patient-summary-service/single-patient-summary-service';
import { ConstantProvider } from '../../providers/constant/constant';

/**
 * @author - Naseem Akhtar
 * @since - 1.0.0
 * 
 * This component is of single patient summary - Mother Related.
 * 
 * All mother related module is being done in this file.
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

  /**
   * We have used ionViewWillEnter instead of ngOnInit because ngOnInit is called only when the component is not in the
   * component stack and needs to be initialized. On the other hand ionViewWillEnter will be called each and every time the
   * component is brought to the top of the stack.
   */
  ionViewWillEnter(){
    //fetching basic baby details from the single patient summary service for further computation.
    this.babyDetails = this.spsService.getBabyDetails();
    this.getMotherRelatedDataList();
  }

  /**
   * @author - Naseem Akhtar (naseem@sdrc.co.in)
   * This method is made async because it needs to wait till the sps service has returned the mother related data to this method.
   * By default when promises or observeables are called the code doesn't wait for the response and executes the next line, which in
   * turn creates error because the next line of code are dependant on the response of the first line.
   * 
   * In this method we are fetching mother related data from the service of single patient summary.
   * The response is being store in the following three variables:-
   * 1. motherRelatedDataList - which is of type {@see IMotherRelatedData[]} , it stores the list to be displayed to the user.
   * 2. comeToVolume7Day - type {@see string} , this returns the the value for come to volume after 7 days which will be shown after the
   *    7th record of the motherRelatedDataList.
   * 3. comeToVolume14Day - type {@see string} , this returns the the value for come to volume after 14 days which will be shown after the
   *    14th record of the motherRelatedDataList.
   */
  async getMotherRelatedDataList(){
    let obj  = await this.spsService.getMotherRelatedData();
    this.motherRelatedDataList = obj.motherRelatedList
    this.comeToVolume7Day = obj.comeToVolume7Day
    this.comeToVolume14Day = obj.comeToVolume14Day
  }

  /**
   * @author - Naseem Akhtar (naseem@sdrc.co.in)
   * @param data - this will return yes or no according to which the color of the columns are being set
   * @param slNo - this indicates whether the column for which the color is to be set is for come to volume or 
   * other records in the list.
   * 
   * If it is for other records then only this method will set the color of the column.
   * This method is called for each row.
   */
  getBackgroundColor(data: string, slNo: number) {
    if(data && slNo){
      if(data === 'No')
        return ConstantProvider.messages.spsContentColorRed
      else if(data === 'Yes')
        return ConstantProvider.messages.spsContentColorGreen
    }
  }

  /**
   * @author - Naseem Akhtar (naseem@sdrc.co.in)
   * @param data 
   * 
   * This method decides the color of the come to volume row w.r.t the value of the come to volumen
   */
  getComeToVolumeBgColor(data: string) {
    if(data){
      if(data === 'No' || data === '-')
        return ConstantProvider.messages.spsContentColorRed
      else if(data === 'Yes')
        return ConstantProvider.messages.spsContentColorGreen
    }
  }

  /**
   * @author - Naseem Akhtar (naseem@sdrc.co.in)
   * @param data 
   * @param slNo 
   * 
   * This method decides the color of the column for the first 4 rows.
   * The first 4 column have values as (Yes (value in number)), so the value is being split
   * by space and then checked whether the value is Yes or No, accordingly the color is being set.
   */
  getTotalVolumeBgColor(data: string, slNo: number) {
    if((slNo && slNo <=4) && (data && data != '-')) {
      let yesOrNo = data.split(' ')
      return yesOrNo[0] === 'Yes' ? ConstantProvider.messages.spsContentColorGreen :
        ConstantProvider.messages.spsContentColorRed
    }
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SinglePatientSummaryServiceProvider } from '../../providers/single-patient-summary-service/single-patient-summary-service';
import { ConstantProvider } from '../../providers/constant/constant';

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

  /**
   * This method will get the all infant related data
   *
   * @author Jagat Bandhu
   * @since 1.1.0
   */
  async getInfantRelated(){
    this.infantRelatedDataList = await this.spsService.getInfantRelatedData(this.babyDetails.deliveryDate,this.babyDetails.dischargeDate,this.babyDetails.babyCode,this.babyDetails.weight);
  }

  /**
   * This method will return color to html page based on the value
   *
   * @author Jagat Bandhu
   * @since 1.1.0
   * @param value
   */
  getBgColorForDailyOmm(value){
    if(value != null && value != "-")
    if(value < 51)
      return ConstantProvider.messages.spsContentColorRed;
  }

  /**
   * This method will return color to html page based on the value
   *
   * @author Jagat Bandhu Sahoo
   * @since 1.1.0
   * @param value
   */
  getBgColor(value,days){
    if(value != null && value != "-" && days < 15)
      return ConstantProvider.messages.spsContentColorRed;
  }

  /**
   * This method will return color to html page based on the value
   *
   * @author Jagat Bandhu Sahoo
   * @since 1.1.0
   * @param value
   */
  getBgColorForWeight(value){
    if(value != null && value != "-")
    if(value < 1500 && value >= 1000)
      return ConstantProvider.messages.spsContentColorYellow;
    if(value < 1000)
      return ConstantProvider.messages.spsContentColorRed;
  }

}

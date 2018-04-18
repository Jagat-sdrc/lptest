import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SinglePatientSummaryServiceProvider } from '../../providers/single-patient-summary-service/single-patient-summary-service';
import { MessageProvider } from '../../providers/message/message';
import { ConstantProvider } from '../../providers/constant/constant';
import 'rxjs/add/operator/toPromise';

/**
 * This component will be used for basic tab of single patient summary.
 * 
 * @author - Naseem Akhtar
 * @since - 1.0.1
 */

@IonicPage()
@Component({
  selector: 'page-basic',
  templateUrl: 'basic.html',
})
export class BasicPage {

  babyDetails: IBabyBasicDetails;
  typeDetails: ITypeDetails[];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public spsService: SinglePatientSummaryServiceProvider, public messageService: MessageProvider) {
  }

  /**
   * This method call up the initial load of basic tab.
   * stop the loader
   *
   * @author Jagat Badhu
   * @since 1.1.0
   */
  ngOnInit(){
    setTimeout(d => this.messageService.stopLoader(), 2000)
  }

  /**
   * This method will call sps service to compute the baby basic details
   * @author - Naseem Akhtar - naseem@sdrc.co.in
   * @since 1.1.0
   */
  ionViewWillEnter(){
    this.getBasicData()
  }

  /**
   * This method will decide the colour of individual columns, depending on
   * their volume.
   * @author - Naseem Akhtar (naseem@sdrc.in)
   * @since 1.1.0
   */
  getBgColorForTypeOfPatient(){
    if(this.babyDetails.inpatientOrOutPatient != null
      && this.babyDetails.inpatientOrOutPatient != 'Inpatient')
      return ConstantProvider.messages.spsContentColorRed;
  }

  /**
   * Get the color code for Time till First Expression for identification of ppp
   *
   * @author Jagat Bandhu
   * @since 1.1.0
   */
  getBgColorForTypeOfTimeTillFirstExp(){
    let timeInHrs = Number(this.babyDetails.timeTillFirstExpression.split(':')[0])
    let timeInMinutes = Number(this.babyDetails.timeTillFirstExpression.split(':')[1])
    if(timeInHrs > 0 && timeInHrs < 7){
      if(timeInHrs === 6 && timeInMinutes > 0)
        return ConstantProvider.messages.spsContentColorRed
      else
        return ConstantProvider.messages.spsContentColorYellow
    }
    else if(timeInHrs > 6)
      return ConstantProvider.messages.spsContentColorRed
  }

  /**
   * This method will call to get the Basic details
   *
   * @author Jagat Bandhu
   * @since 1.1.0
   */
  async getBasicData(){
    this.typeDetails = await this.spsService.fetchTypeDetails().toPromise()

    //made a async call to get the data from sps table
    await this.spsService.findSpsInDb(this.navParams.data, this.typeDetails)
    //on completion of async call set get the baby details from spsService and set it to babyDetails
    this.babyDetails = this.spsService.getBabyDetails();
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SinglePatientSummaryServiceProvider } from '../../providers/single-patient-summary-service/single-patient-summary-service';
import { MessageProvider } from '../../providers/message/message';

/**
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
   * This method will call sps service to compute the baby basic details
   * @author - Naseem Akhtar - naseem@sdrc.co.in
   * 
   */
  ionViewWillEnter(){
    this.messageService.showLoader("Generating Single  Patient Summary, please wait...")
    this.spsService.fetchTypeDetails()
      .subscribe(data => {
        this.typeDetails = data
        this.babyDetails = this.spsService.setBabyDetails(this.navParams.data, this.typeDetails)
        this.messageService.stopLoader()
      }, err => {
        this.messageService.showErrorToast(err)
      })
  }

  /**
   * This method will decide the colour of individual columns, depending on
   * their volume.
   * @author - Naseem Akhtar (naseem@sdrc.in)
   */
  getBgColorForTypeOfPatient(){
    if(this.babyDetails.inpatientOrOutPatient != null 
      && this.babyDetails.inpatientOrOutPatient != 'Inpatient')
      return 'red';
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SinglePatientSummaryServiceProvider } from '../../providers/single-patient-summary-service/single-patient-summary-service';
import { MessageProvider } from '../../providers/message/message';
import { ConstantProvider } from '../../providers/constant/constant';

/**
 * This component is used for single patient summary
 *
 * @author Jagat Bandhu
 * @since 1.1.0
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

  /**
   * This method call up the initial load of sps page.
   * show the loader
   *
   * @author Jagat Bandhu
   * @since 1.1.0
   */
  ngOnInit(){
    this.babyAllDetails = this.navParams.get('babyDetails');
    this.messageService.showLoader(ConstantProvider.messages.loading)
  }

}

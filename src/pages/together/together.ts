import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SinglePatientSummaryServiceProvider } from '../../providers/single-patient-summary-service/single-patient-summary-service';

/**
 * This component is of single patient summary - Together.
 * All together module is being done in this file.
 *
 * @author Jagat Bandhu
 * @since 1.1.0
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

  /**
   * This method call up the initial load of together tab.
   *
   * @author Jagat Bandhu
   * @since 1.1.0
   */
  ngOnInit(){
    this.babyDetails = this.spsService.getBabyDetails();
    this.getTogetherDataList();
  }

  /**
   * This method will get the all together data
   *
   * @author Jagat Bandhu
   * @since 1.1.0
   */
  async getTogetherDataList(){
    this.togetherDataList = await this.spsService.getTogetherData();
  }

}

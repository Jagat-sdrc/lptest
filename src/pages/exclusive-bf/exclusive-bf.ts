import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BfPostDischargeMenuServiceProvider } from '../../providers/bf-post-discharge-menu-service/bf-post-discharge-menu-service';
import { MessageProvider } from '../../providers/message/message';
import { SinglePatientSummaryServiceProvider } from '../../providers/single-patient-summary-service/single-patient-summary-service';
import { BfPostDischargeServiceProvider } from '../../providers/bf-post-discharge-service/bf-post-discharge-service';

/**
 * @author - Naseem Akhtar
 * @since - 1.0.1
 */

@IonicPage()
@Component({
  selector: 'page-exclusive-bf',
  templateUrl: 'exclusive-bf.html',
})
export class ExclusiveBfPage {

  exclusiveBfList: IExclusiveBf[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private bfPostDischargeMenuService: BfPostDischargeMenuServiceProvider,
    public spsService: SinglePatientSummaryServiceProvider,
    public bfpdService: BfPostDischargeServiceProvider,
    public messageService: MessageProvider) {
  }

  ngOnInit(){
    //fetching the types of bf post discharge
    this.bfPostDischargeMenuService.getPostDischargeMenu()
      .subscribe(data => {
        this.fetchDataForExclusiveBfPage(data)
      }, error => {
        this.messageService.showErrorToast(error);
      })
  }

  fetchDataForExclusiveBfPage(bfpdList: ITypeDetails[]){
    //fetching the records for the particular baby and then calling service to 
    //re-structure it for display in exclusive bf
    let babyDetails: IPatient = this.navParams.data
    this.bfpdService.findByBabyCode(babyDetails.babyCode)
      .then(bfpdBabyData => {
        this.exclusiveBfList = this.spsService.fetchSpsExclusiveBfData(bfpdList, bfpdBabyData, babyDetails);
      }).catch(error => {
        this.messageService.showErrorToast(error);
      });
  }


}

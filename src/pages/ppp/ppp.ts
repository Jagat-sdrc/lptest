import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController } from 'ionic-angular';
import { SinglePatientSummaryServiceProvider } from '../../providers/single-patient-summary-service/single-patient-summary-service';
import { MessageProvider } from '../../providers/message/message';
import { ConstantProvider } from '../../providers/constant/constant';

/**
 * Generated class for the PppPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ppp',
  templateUrl: 'ppp.html',
})
export class PppPage {

  pppPatients: IPatient[] = [];
  sortBy: string;
  singlePatientSummary;
  uiStatus: boolean = false;

  constructor(public navCtrl: NavController,
    private messageService: MessageProvider,
    private menuCtrl: MenuController,
    private spsService: SinglePatientSummaryServiceProvider) {
  }

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
  }

  ngOnInit(){
    this.messageService.showLoader(ConstantProvider.messages.loading)
    setTimeout(d => this.messageService.stopLoader(), 1000)
    this.getAllPPPPatient()
  }

  /**
   * This method will get the all ppp patient list
   *
   * @author Jagat Bandhu
   * @since 1.1.0
   */
  async getAllPPPPatient(){
    await this.spsService.getAllPPPDetails();
    this.pppPatients = await this.spsService.getAllFilterPPPDetails()
    if(this.pppPatients === undefined || this.pppPatients.length === 0){
      this.uiStatus = await true;
    }else{
      this.uiStatus = await false;
    }
  }

  /**
   * This method will go to the sps page to show the sps details
   *
   * @author Jagat Bandhu
   * @since 1.1.0
   * @param babyDetails
   */
  goToBabyDashBoard(babyDetails: any){
    this.navCtrl.push('SpsPage',{
      babyDetails: babyDetails
    });
  }
}

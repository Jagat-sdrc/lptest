import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController } from 'ionic-angular';
import { SinglePatientSummaryServiceProvider } from '../../providers/single-patient-summary-service/single-patient-summary-service';
import { MessageProvider } from '../../providers/message/message';
import { ConstantProvider } from '../../providers/constant/constant';

/**
 * This component is of poorly performing patient.
 * All poorly performing patient related module is being done in this file.
 *
 * @author Jagat Bandhu
 * @since 1.2.0
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

  /**
   * Fired when you leave a page, after it stops being the active one.
   * disable the swipe for the side menu
   *
   * @author Jagat Bandhu
   * @since 1.2.0
   */
  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  /**
   * Fired when you leave a page, before it stops being the active one.
   * enable the swipe for the side menu
   *
   * @author Jagat Bandhu
   * @since 1.2.0
   */
  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
  }

  /**
   * This method call up the initial load of add patient page.
   * Show loder
   * get all Poorly performing patient list
   *
   * @author Jagat Bandhu
   * @since 1.2.0
   */
  ngOnInit(){
    this.messageService.showLoader(ConstantProvider.messages.loading)
    setTimeout(d => this.messageService.stopLoader(), 1000)
    this.getAllPPPPatient()
  }

  /**
   * This method will get the all ppp patient list
   *
   * @author Jagat Bandhu
   * @since 1.2.0
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
   * @since 1.2.0
   * @param babyDetails
   */
  goToBabyDashBoard(babyDetails: any){
    this.navCtrl.push('SpsPage',{
      babyDetails: babyDetails
    });
  }
}

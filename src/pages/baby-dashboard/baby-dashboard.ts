import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessageProvider } from '../../providers/message/message';
import { AddNewPatientServiceProvider } from '../../providers/add-new-patient-service/add-new-patient-service';

/**
 * This page is used for baby dashboard page.
 *
 * @export
 * @class BabyDashboardPage
 * @implements {OnInit}
 * @author Jagat Bandhu
 * @since 0.0.1
 */
@IonicPage()
@Component({
  selector: 'page-baby-dashboard',
  templateUrl: 'baby-dashboard.html',
})
export class BabyDashboardPage {

  feedDateListPage;
  feedPage;
  bfExpressionDateListPage;
  addPatientPage;
  bfspDateListPage;
  bfPostDischargeMenuPage;
  babyDetails: IPatient;
  paramToExpressionPage: IParamToExpresssionPage;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private messageService: MessageProvider, private patientService: AddNewPatientServiceProvider) {
  }

  /**
   * Fired when you leave a page, before it stops being the active one
   * Find latest baby data based on the baby code
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  ionViewWillEnter(){
    this.findLatestBabyData(this.babyDetails.babyCode)
  }

  /**
   * This method call up the initial load of baby dashboard page.
   * get the data from navParams and set it to babyDetails
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  ngOnInit(){
    this.feedDateListPage = 'FeedDateListPage'
    this.bfExpressionDateListPage = 'BFExpressionDateListPage';
    this.addPatientPage = 'AddPatientPage';
    this.bfspDateListPage = 'BfSupportivePracticeDateListPage';
    this.bfPostDischargeMenuPage = 'BfPostDischargeMenuPage';
    this.babyDetails = this.navParams.data
  }

  /**
   * This method will navigate the user to HomePage
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  goToHome(){
    this.navCtrl.setRoot('HomePage');
  }

  /**
   * This method will navigate the user to SpsPage with babyDetails
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  goToSinglePatientSummary(){
    this.navCtrl.push('SpsPage',{
      babyDetails: this.babyDetails
    });
  }

  /**
   * Find latest baby data based on the baby code
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  findLatestBabyData(babyCode: string){
    this.patientService.findByBabyCode(babyCode)
      .then((data: IPatient) => {
        this.babyDetails = data
        //sets to the data to the navParam
        this.paramToExpressionPage = {
          babyCode: this.babyDetails.babyCode,
          babyCodeByHospital: this.babyDetails.babyCodeHospital,
          deliveryDate: this.babyDetails.deliveryDate,
          deliveryTime: this.babyDetails.deliveryTime,
          dischargeDate: this.babyDetails.dischargeDate
        }
      })
      .catch(error => {
        this.messageService.showErrorToast(error)
      })
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessageProvider } from '../../providers/message/message';
import { ConstantProvider } from '../../providers/constant/constant';
import { AddNewPatientServiceProvider } from '../../providers/add-new-patient-service/add-new-patient-service';

/**
 * Generated class for the BabyDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
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

  ionViewWillEnter(){
    this.findLatestBabyData(this.babyDetails.babyCode)
  }

  ngOnInit(){
    this.feedDateListPage = 'FeedDateListPage'
    this.bfExpressionDateListPage = 'BFExpressionDateListPage';
    this.addPatientPage = 'AddPatientPage';
    this.bfspDateListPage = 'BfSupportivePracticeDateListPage';
    this.bfPostDischargeMenuPage = 'BfPostDischargeMenuPage';
    this.babyDetails = this.navParams.data
  }

  goToHome(){
    this.navCtrl.setRoot('HomePage');
  }

  /**
   * This method will just show the action under construction message
   *
   * @memberof HomePage
   */
  underConstruction(){
    this.messageService.showErrorToast(ConstantProvider.messages.userConstruction)
  }

  goToSinglePatientSummary(){
    this.navCtrl.push('SpsPage',{
      babyDetails: this.babyDetails
    });
  }

  findLatestBabyData(babyCode: string){
    this.patientService.findByBabyCode(babyCode)
      .then((data: IPatient) => {
        this.babyDetails = data
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

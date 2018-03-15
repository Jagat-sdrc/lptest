import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SinglePatientSummaryServiceProvider } from '../../providers/single-patient-summary-service/single-patient-summary-service';
import { MessageProvider } from '../../providers/message/message';
import { FeedExpressionServiceProvider } from '../../providers/feed-expression-service/feed-expression-service';

/**
 * Generated class for the SinglePatientSummaryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-single-patient-summary',
  templateUrl: 'single-patient-summary.html',
})
export class SinglePatientSummaryPage {

  babyAllDetails: IPatient;
  babyId: any;
  gestationalAge: any;
  deliveryMethod: any;
  inputOutputPatient: any;
  parentsKnowledgeOnHmAndLactation: any;
  tillTillFirstExpression: any;
  tillTillFirstEnteralFeed: any;
  admissionDate: any;
  mothersPrenatalIntent: any;
  babyAdmittedTo: any;
  nicuAdmissionReason = '';
  typeDetails: ITypeDetails[];
  motherRelatedDataList: IMotherRelatedData[];
  togetherDataList: ITogetherData[];
  infantRelatedDataList: IInfantRelated[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public messageService: MessageProvider,
    public spsService: SinglePatientSummaryServiceProvider,
    private feedExpressionServiceProvider: FeedExpressionServiceProvider) {
  }

  ngOnInit(){

    this.babyAllDetails = (this.navParams.get('babyAllDetails'))
    console.log(this.babyAllDetails)

    this.spsService.fetchTypeDetails()
    .subscribe(data => {
      this.typeDetails = data
      console.log(this.typeDetails);
      this.babyId = this.babyAllDetails.babyCode;
      this.gestationalAge = this.babyAllDetails.gestationalAgeInWeek;
      this.deliveryMethod = (this.babyAllDetails.deliveryMethod.toString.length > 0)?this.typeDetails[this.typeDetails.findIndex(d => d.id === this.babyAllDetails.deliveryMethod)].name:"";
      this.inputOutputPatient = (this.babyAllDetails.inpatientOrOutPatient.toString.length > 0)?this.typeDetails[this.typeDetails.findIndex(d => d.id === this.babyAllDetails.inpatientOrOutPatient)].name:"";
      this.parentsKnowledgeOnHmAndLactation  = (this.babyAllDetails.parentsKnowledgeOnHmAndLactation.toString.length > 0)?this.typeDetails[this.typeDetails.findIndex(d => d.id === this.babyAllDetails.parentsKnowledgeOnHmAndLactation)].name:"";
      this.admissionDate = this.babyAllDetails.admissionDateForOutdoorPatients;
      this.mothersPrenatalIntent  = (this.babyAllDetails.mothersPrenatalIntent.toString.length > 0)?this.typeDetails[this.typeDetails.findIndex(d => d.id === this.babyAllDetails.mothersPrenatalIntent)].name:"";
      this.tillTillFirstExpression = this.babyAllDetails.timeTillFirstExpressionInHour+":"+this.babyAllDetails.timeTillFirstExpressionInMinute;
      this.babyAdmittedTo = (this.babyAllDetails.babyAdmittedTo.toString.length > 0)?this.typeDetails[this.typeDetails.findIndex(d => d.id === this.babyAllDetails.babyAdmittedTo)].name:"";
      let x = (this.babyAllDetails.nicuAdmissionReason != null)?this.babyAllDetails.nicuAdmissionReason.toString().split(','):"";
      if(this.babyAllDetails.nicuAdmissionReason != null){
        for (let index = 0; index < x.length; index++) {
          this.nicuAdmissionReason += this.typeDetails[this.typeDetails.findIndex(d => d.id === +x[index])].name + ",";
        }
        this.nicuAdmissionReason = this.nicuAdmissionReason.slice(0,this.nicuAdmissionReason.length - 1);
      }
      this.feedExpressionServiceProvider.getTimeTillFirstEnteralFeed(this.babyAllDetails.babyCode,this.babyAllDetails.deliveryDate,
      this.babyAllDetails.deliveryTime)
      .then(data=>{
        if(data != ""){
          this.tillTillFirstEnteralFeed = data
        }
      })
    }, err => {
      this.messageService.showErrorToast(err)
    });

    this.getMotherRelatedDataList();
    this.getTogetherDataList();
    // this.getInfantRelated();
  }

  async getMotherRelatedDataList(){
    this.motherRelatedDataList = await this.spsService.getMotherRelatedData(this.babyAllDetails.deliveryDate,this.babyAllDetails.dischargeDate,this.babyAllDetails.babyCode);
  }

  async getTogetherDataList(){
    this.togetherDataList = await this.spsService.getTogetherData(this.babyAllDetails.deliveryDate,this.babyAllDetails.dischargeDate,this.babyAllDetails.babyCode);
  }

  // async getInfantRelated(){
  //   this.infantRelatedDataList = await this.spsService.getInfantRelatedData(this.babyAllDetails.deliveryDate,this.babyAllDetails.dischargeDate,this.babyAllDetails.babyCode);
  // }



}

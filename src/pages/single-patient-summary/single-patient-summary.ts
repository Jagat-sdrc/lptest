import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SinglePatientSummaryServiceProvider } from '../../providers/single-patient-summary-service/single-patient-summary-service';
import { MessageProvider } from '../../providers/message/message';

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
  admissionDate: any;
  mothersPrenatalIntent: any;
  babyAdmittedTo: any;
  nicuAdmissionReason = '';
  typeDetails: ITypeDetails[];
  dates : Date[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,public messageService: MessageProvider,
    public singlePatientSummaryServiceProvider: SinglePatientSummaryServiceProvider) {
  }

  ngOnInit(){

    this.babyAllDetails = (this.navParams.get('babyAllDetails'))
    console.log(this.babyAllDetails)

    this.singlePatientSummaryServiceProvider.getTypeDetails()
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
    }, err => {
      this.messageService.showErrorToast(err)
    });

    this.singlePatientSummaryServiceProvider.getAllDatesTillDate(this.babyAllDetails.deliveryDate,this.babyAllDetails.dischargeDate)
    .then(data =>{
      if(data.length > 0){
        this.dates = data;
      }
    })
  }

}

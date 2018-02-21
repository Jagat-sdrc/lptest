import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BfSupportivePracticeServiceProvider } from '../../providers/bf-supportive-practice-service/bf-supportive-practice-service';
import { MessageProvider } from '../../providers/message/message';
import { ConstantProvider } from '../../providers/constant/constant';

/**
 * This page will be used to enter the data of breast feeding supportive practice
 * for a particular baby.
 * @author - Naseem Akhtar
 * @since - 0.0.1
 */

@IonicPage()
@Component({
  selector: 'page-bf-supportive-practice',
  templateUrl: 'bf-supportive-practice.html',
})
export class BfSupportivePracticePage {

  supportivePracticeForm: FormGroup;
  maxDate:any;
  maxTime:any;
  forEdit: boolean;
  autoBabyId: string;
  bfspList: IBFSP[];
  bpspForm: IBFSP;
  bfSupportivePracticePerformedList: ITypeDetails[];
  personWhoPerformedBSFPList: ITypeDetails[];
  dataForBfspPage: IDataForBfspPage;
  onlyNumberRegex: RegExp = /^[0-9]*$/;
  shownGroup: any;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private messageService: MessageProvider,
    public formBuilder: FormBuilder, private datePipe: DatePipe,
    private bfspService: BfSupportivePracticeServiceProvider,
    ) {
      this.maxDate = this.datePipe.transform(new Date(),"yyyy-MM-dd");
      this.maxTime = this.datePipe.transform(new Date(),"HH:mm");
    }

  /**
   * This method call up the initial load of breastfeeding supportive practice.
   * date will be initialize
   * get all the options for all the dropdowns.
   * form control validation
   * @author Naseem Akhtar
   */
  ngOnInit() {
    this.dataForBfspPage = this.navParams.get('dataForBfspPage');

    this.findExpressionsByBabyCodeAndDate();

    this.bfspService.getBreastfeedingSupportivePractice()
      .subscribe(data => {
        this.bfSupportivePracticePerformedList = data;
      }, err => {
        this.messageService.showErrorToast(err)
      });

    this.bfspService.getPersonWhoPerformedBSFP()
      .subscribe(data => {
        this.personWhoPerformedBSFPList = data;
      }, err => {
        this.messageService.showErrorToast(err)
      });
  };

  toggleGroup(group, i) {    
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };

  isGroupShown(group) {
    return this.shownGroup === group;
  };

  /**
   * For creating or resetting breastfeedign supportive practice form
   */
  newBFSPForm() {
    let day = parseInt(this.dataForBfspPage.selectedDate.split('-')[0]);
    let month = parseInt(this.dataForBfspPage.selectedDate.split('-')[1]);
    let year = parseInt(this.dataForBfspPage.selectedDate.split('-')[2]);

    this.bfspList = this.bfspService.appendNewRecordAndReturn(this.bfspList, this.dataForBfspPage.babyCode,
      new Date(year, month, day));
  };

  


  ionViewDidEnter() {
    if (!(this.navParams.get('babyCode') == undefined)) {
      this.forEdit = true;
      this.autoBabyId = this.supportivePracticeForm.get('babyCode').value;
      // this.setFetchedDataToUi();
    } else {
      this.autoBabyId = "IND" + this.datePipe.transform(new Date(), "ddMMyyyy") +
        new Date().getMilliseconds();
    }
  };

  save(bfsp: IBFSP){
    if(bfsp.bfspPerformed == null){
      this.messageService.showErrorToast(ConstantProvider.messages.supportivePracticeBfsp);
    }else if(bfsp.personWhoPerformedBFSP == null){
      this.messageService.showErrorToast(ConstantProvider.messages.personWhoPerformedBfsp);
    }else if(bfsp.bfspDuration === null || !this.onlyNumberRegex.test(bfsp.bfspDuration.toString())) {
      this.messageService.showErrorToast(ConstantProvider.messages.durationOfBfsp);
    }else{
      this.bfspService.saveNewBreastFeedingSupportivePracticeForm(bfsp)
      .then(data => {
        this.messageService.showSuccessToast("save successful!")
      })
      .catch(err => {
        this.messageService.showErrorToast(err)
      })
    }
  }


    /**
   * This method will help in getting existing feed expression for given baby code and date
   * @author Ratikanta
   * @since 0.0.1
   */
  findExpressionsByBabyCodeAndDate(){
    //getting existing feed expression for given baby code and date

    this.bfspService.findByBabyCodeAndDate(this.dataForBfspPage.babyCode,
      this.dataForBfspPage.selectedDate, this.dataForBfspPage.isNewBfsp)
      .then(data => {
        this.bfspList = data;
      })
      .catch(err => {
        this.messageService.showErrorToast(err)
        this.bfspList = []
      });
  }




  /**
   * This method will delete the given bf expression
   * @author Ratikanta
   * @since 0.0.1
   * @param {IBFExpression} bfExpression The expression which needs to be deleted
   * @memberof ExpressionTimeFormPage
   */
  delete(bfsp: IBFSP){
    this.bfspService.delete(bfsp.id)
    .then(()=>{
      //refreshing the list 
      this.findExpressionsByBabyCodeAndDate();
      this.messageService.showSuccessToast(ConstantProvider.messages.deleted)
    })
    .catch(err=>{
      this.messageService.showErrorToast(err)
    })
  }

}


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
    // this.newBFSPForm();

    this.bfspService.findByBabyCodeAndDate(this.dataForBfspPage.babyCode,
      this.dataForBfspPage.selectedDate, this.dataForBfspPage.isNewBfsp)
      .then(data => {
        this.bfspList = data;
      })
      .catch(err => {
        this.messageService.showErrorToast(err)
      });

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
    // this.methodOfBfExpObject = this.bFExpressions[i].methodOfExpression;
    // this.locOfExpressionObject = this.bFExpressions[i].locationOfExpression;

    // //getting the id of selected method of expression.
    // for (let j = 0; j < this.bfExpressionMethods.length; j++) {
    //     let id =''+this.bfExpressionMethods[j].id
    //     if (this.bFExpressions[i].methodOfExpression === id) {
    //       this.methodOfBfExpObject= '' + this.bfExpressionMethods[i].name;
    //       break;
    //     }
         
    // }
    //  //getting the id of selected location of expression.

    //  for (let k = 0; k < this.locationOfexpressionMethods.length; k++) {
    //   let id =''+this.locationOfexpressionMethods[k].id
    //   if (this.bFExpressions[i].locationOfExpression === id) {
    //     this.locOfExpressionObject = '' + this.locationOfexpressionMethods[i].name;
    //     break;
    //   }
    // }
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };

  isGroupShown(group) {
    return this.shownGroup === group;
  };

  saveExpression(bfExpression: IBFExpression) {

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

    // this.supportivePracticeForm = this.formBuilder.group({
    //   id: [this.bfspService.getNewBfspId(this.dataForBfspPage.babyCode)],
    //   babyCode: [this.dataForBfspPage.babyCode],
    //   dateOfBFSP: [new Date().toISOString],
    //   timeOfBFSP: [this.bfspService.getTime(new Date(year, month, day)), [Validators.required]],
    //   bfspPerformed: ['', [Validators.required]],
    //   personWhoPerformedBFSP: ['', [Validators.required]],
    //   bfspDuration: ['', [Validators.required, Validators.pattern(this.onlyNumberRegex)]],
    //   userId: this.userService.getUser().email
    // });
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
    console.log(bfsp.babyCode);
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
        this.messageService.showErrorToast((err as IDBOperationStatus).message)
      })
    }
    // if(!this.supportivePracticeForm.valid){
    //   Object.keys(this.supportivePracticeForm.controls).forEach(field => {
    //     const control = this.supportivePracticeForm.get(field);
    //     control.markAsTouched({ onlySelf: true });
    //   });
    // } else {
    //   this.bfspService.saveNewBreastFeedingSupportivePracticeForm(this.supportivePracticeForm.value)
    //   .then(data=> {
    //     this.messageService.showSuccessToast("save successful!");
    //     this.navCtrl.pop();
    //   })
    //   .catch(err =>{
    //     this.messageService.showErrorToast((err as IDBOperationStatus).message)
    //   })
    // }
  }

}


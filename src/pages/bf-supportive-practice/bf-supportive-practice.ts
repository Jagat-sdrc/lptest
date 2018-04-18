import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BfSupportivePracticeServiceProvider } from '../../providers/bf-supportive-practice-service/bf-supportive-practice-service';
import { MessageProvider } from '../../providers/message/message';
import { ConstantProvider } from '../../providers/constant/constant';
import { DatePicker } from '@ionic-native/date-picker';

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
  forEdit: boolean;
  autoBabyId: string;
  bfspList: IBFSP[];
  bpspForm: IBFSP;
  bfSupportivePracticePerformedList: ITypeDetails[];
  personWhoPerformedBSFPList: ITypeDetails[];
  dataForBfspPage: IDataForBfspPage;
  onlyNumberRegex: RegExp = /^[0-9]*$/;
  shownGroup: any;
  existingDate:string;
  existingTime:string;
  deliveryDate: Date;
  dischargeDate: Date;
  defaultSelectedDate: Date;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private messageService: MessageProvider,
    public formBuilder: FormBuilder, private datePipe: DatePipe,
    private bfspService: BfSupportivePracticeServiceProvider,
    private datePicker: DatePicker
    ) { }

  /**
   * @author Naseem Akhtar (naseem@sdrc.co.in)
   * @since - 0.0.1
   * This method gets invoked during initial load of breastfeeding supportive practice.
   * date will be initialize
   * get all the options for all the dropdowns.
   * form control validation
   * fetch all the records for the selected baby and for the selected date
   */
  ngOnInit() {
    this.dataForBfspPage = this.navParams.get('dataForBfspPage');
    //splitting delivery date to use it new date for min date of datepicker
    let x = this.dataForBfspPage.deliveryDate.split('-')
    this.deliveryDate = new Date(+x[2],+x[1]-1,+x[0])
    let check90Days = new Date(+x[2],+x[1]-1,+x[0])
    check90Days.setDate(check90Days.getDate() + ConstantProvider.messages.threeMonthsOfLife)
    if(this.dataForBfspPage.dischargeDate != null){
      let y = this.dataForBfspPage.dischargeDate.split('-')
      this.dischargeDate = new Date(+y[2],+y[1]-1,+y[0])
      this.defaultSelectedDate = new Date() > this.dischargeDate ? this.deliveryDate : new Date()
    }else{
      if(new Date() > check90Days) {
        this.dischargeDate = check90Days
        this.defaultSelectedDate = this.deliveryDate
      }
      else{
        this.dischargeDate = new Date()
        this.defaultSelectedDate = new Date()
      }
    }


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

  /**
   * @author - Naseem Akhtar (naseem@sdrc.co.in)
   * @since - 0.0.1
   * The following two methods is used to open the selected entry accordion and
   * close the previously selected entry accordion.
   * If same accordion is tapped again and again, then the same accordion will close and
   * open alternatively.
  */
  toggleGroup(group: IBFSP) {
    this.existingDate = group.dateOfBFSP === null ? null : group.dateOfBFSP;
    this.existingTime = group.timeOfBFSP === null ? null : group.timeOfBFSP;
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
   * @author - Naseem Akhtar
   * @since - 0.0.1
   * This method documen.getElement is called to scroll to the latest accordion
   * For creating or resetting breastfeedign supportive practice form
   */
  newBFSPForm() {
    this.bfspList = this.bfspService.appendNewRecordAndReturn(this.bfspList, this.dataForBfspPage.babyCode,
      this.dataForBfspPage.selectedDate);
    setTimeout( data => this.toggleGroup(this.bfspList[0]), 100);
    document.getElementById('scrollHere').scrollIntoView({behavior: 'smooth'})
  };

  save(bfsp: IBFSP, index) {
    let newData = bfsp.id === null ? true : false
    if(bfsp.dateOfBFSP === null) {
      this.messageService.showErrorToast(ConstantProvider.messages.enterDateOfBfsp);
    }else if(bfsp.timeOfBFSP === null) {
      this.messageService.showErrorToast(ConstantProvider.messages.enterTimeOfBfsp);
    }else if(bfsp.bfspDuration === undefined || !this.checkForOnlyNumber(bfsp.bfspDuration)) {
      this.messageService.showErrorToast(ConstantProvider.messages.durationOfBfsp);
    }else{
      this.bfspService.saveNewBreastFeedingSupportivePracticeForm(bfsp, this.existingDate, this.existingTime)
      .then(data => {
        this.findExpressionsByBabyCodeAndDate();
        if(newData)
          this.messageService.showSuccessToast(ConstantProvider.messages.saveSuccessfull);
        else
          this.messageService.showSuccessToast(ConstantProvider.messages.updateSuccessfull);
      })
      .catch(err => {
        bfsp.createdDate = null
        this.messageService.showOkAlert('Warning', err);
      })
    }
  }


    /**
   * This method will help in getting existing feed expression for given baby code and date
   * @author Ratikanta
   * @since 0.0.1
   */
  findExpressionsByBabyCodeAndDate() {
    //getting existing feed expression for given baby code and date

    this.bfspService.findByBabyCodeAndDate(this.dataForBfspPage.babyCode,
      this.dataForBfspPage.selectedDate, this.dataForBfspPage.isNewBfsp)
      .then(data => {
        this.bfspList = data;
        if(this.bfspList.length === 0){
          this.newBFSPForm();
          // setTimeout(d => this.toggleGroup(this.bfspList[0], 0), 200);
        }
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
    this.messageService.showAlert(ConstantProvider.messages.warning,ConstantProvider.messages.deleteForm).
    then((data)=>{
      if(data){
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
    })
  }

  /**
   * This function will be used to check the validation for bfspPerformed question, accordingly the next
   * field is disabled or enabled.
   * @author - Naseem Akhtar
   * @param bfsp - the object in the front-end for which the user is entering the data
   * @since - 0.0.1
   */
  setPersonWhoPerformed(bfsp: IBFSP){
    bfsp.personWhoPerformedBFSP = null;
    if(bfsp.bfspPerformed === 54){
      setTimeout(d => bfsp.personWhoPerformedBFSP = 56, 100)
    }
  }

  /**
   * This following two methods i.e datepicker dialog and timepicker dialog will
   * help in opening the native date and time picker respectively.
   * @author - Naseem Akhtar
   * @since - 0.0.1
   */

  datePickerDialog(bfsp: IBFSP){
    this.datePicker.show({
    date: this.defaultSelectedDate,
    minDate: this.deliveryDate.valueOf(),
    maxDate: this.dischargeDate.valueOf(),
    mode: 'date',
    androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => {
        bfsp.dateOfBFSP = this.datePipe.transform(date,"dd-MM-yyyy")
        this.validateTime(bfsp.timeOfBFSP, bfsp)
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  timePickerDialog(bfsp: IBFSP){
    this.datePicker.show({
    date: this.defaultSelectedDate,
    mode: 'time',
    is24Hour: true,
    androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    })
    .then(time => {
      this.validateTime(this.datePipe.transform(time, 'HH:mm'), bfsp)
    },
    err => this.messageService.showErrorToast('Error occurred while getting date: ' + err)
    );
  }

  /**
   * @author - Naseem Akhtar (naseem@sdrc.co.in)
   * This method will check whether the passed parameter is number or not.
   */
  checkForOnlyNumber(forValidation){
    if(forValidation === null)
      return true;
    else{
      if(this.onlyNumberRegex.test(forValidation))
        return true;
      else
        return false;
    }
  }

  /**
   * This method will validate time selected by the user, if it is current date,
   * then future time will not be allowed.
   * @author - Naseem Akhtar
   * @since - 0.0.1
  */
  validateTime(time: string, bfsp: IBFSP){
    if(bfsp.dateOfBFSP === this.datePipe.transform(new Date(),'dd-MM-yyyy')
      && time != null && time > this.datePipe.transform(new Date(),'HH:mm')){
        this.messageService.showErrorToast(ConstantProvider.messages.futureTime)
        bfsp.timeOfBFSP = null;
    }else if (bfsp.dateOfBFSP === this.dataForBfspPage.deliveryDate && time != null &&
      time < this.dataForBfspPage.deliveryTime){
        this.messageService.showErrorToast(ConstantProvider.messages.pastTime)
        bfsp.timeOfBFSP = null;
    }else{
      bfsp.timeOfBFSP = time
    }
  }

}


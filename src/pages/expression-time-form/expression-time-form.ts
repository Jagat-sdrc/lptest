import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddNewExpressionBfServiceProvider } from '../../providers/add-new-expression-bf-service/add-new-expression-bf-service';
import { MessageProvider } from '../../providers/message/message';
import { SaveExpressionBfProvider } from '../../providers/save-expression-bf/save-expression-bf';
import { DatePipe } from '@angular/common';
import { ConstantProvider } from '../../providers/constant/constant';
import { BFExpressionDateListProvider } from '../../providers/bf-expression-date-list-service/bf-expression-date-list-service';
import { DatePicker } from '@ionic-native/date-picker';

/**
 * This page will be used to enter the data of log expression breastfeed form
 * for a particular baby.
 * @author - Naseem Akhtar
 * @since - 0.0.1
 */

@IonicPage()
@Component({
  selector: 'page-expression-time-form',
  templateUrl: 'expression-time-form.html',
})
export class ExpressionTimeFormPage {
  bFExpressions: IBFExpression[];
  bfExpression: IBFExpression;
  bfExpressionMethods: ITypeDetails[];
  locationOfexpressionMethods: ITypeDetails[];
  shownGroup: any;
  dataForBFEntryPage: IDataForBFEntryPage
  methodOfBfExpObject: any;
  locOfExpressionObject: any;
  maxDate:any;
  existingDate: string;
  existingTime: string;
  deliveryDate: Date;
  dischargeDate: Date;
  defaultSelectedDate: Date;
  onlyNumberRegex: RegExp = /^[0-9]*\.[0-9][0-9]$/;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private addNewExpressionBfService: AddNewExpressionBfServiceProvider,
    private messageService: MessageProvider,
    private bfExpressionTimeService: SaveExpressionBfProvider,
    private expressionBFdateService: BFExpressionDateListProvider,
    private datePipe: DatePipe, private datePicker: DatePicker) {
    this.maxDate = this.datePipe.transform(new Date(),"yyyy-MM-dd");
  }

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
    this.dataForBFEntryPage = this.navParams.get('dataForBFEntryPage');
    let x = this.dataForBFEntryPage.deliveryDate.split('-');
    this.deliveryDate = new Date(+x[2],+x[1]-1,+x[0]);
    let check90Days = new Date(+x[2],+x[1]-1,+x[0]);
    check90Days.setDate(check90Days.getDate() + ConstantProvider.messages.threeMonthsOfLife)

    if(this.dataForBFEntryPage.dischargeDate != null){
      let y = this.dataForBFEntryPage.dischargeDate.split('-')
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
    //Getting method of expressionbf type details
    this.addNewExpressionBfService.getMethodOfExpressionBF()
      .subscribe(data => {
        this.bfExpressionMethods = data;
      }, err => {
        this.messageService.showErrorToast(err)
      });
    //Getting location of expression type detail
    this.addNewExpressionBfService.getLocationOfExpressionBF()
      .subscribe(data => {
        this.locationOfexpressionMethods = data
      }, err => {
        this.messageService.showErrorToast(err)
      });

  }

  /**
   * @author - Naseem Akhtar (naseem@sdrc.co.in)
   * @since - 0.0.1
   * The following two methods is used to open the selected entry accordion and 
   * close the previously selected entry accordion.
   * If same accordion is tapped again and again, then the same accordion will close and 
   * open alternatively.
  */
  toggleGroup(group: IBFExpression) {
    this.existingDate = group.dateOfExpression;
    this.existingTime = group.timeOfExpression;
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
   * This method will save a single feed expression into database
   * 
   * @param {IBFExpression} BfExpression 
   * @author Subhadarshani
   * @since 0.0.1
   */
  saveExpression(bfExpression: IBFExpression) {
    let newData = bfExpression.id === null ? true : false
    //set validations for all the fields
    if(bfExpression.dateOfExpression === null){
      this.messageService.showErrorToast(ConstantProvider.messages.enterDateOfExpression);
    }else if(bfExpression.timeOfExpression === null){
      this.messageService.showErrorToast(ConstantProvider.messages.enterTimeOfExpression);
    }else if(!this.validateDurationOfExpression(bfExpression)){
      this.messageService.showErrorToast(ConstantProvider.messages.volumeOfMilkExpressedFromBreast);
    }else {
      this.bfExpressionTimeService.saveBfExpression(bfExpression, this.existingDate, this.existingTime)
      .then(data => {
        this.findExpressionsByBabyCodeAndDate();
        if(newData)
          this.messageService.showSuccessToast(ConstantProvider.messages.saveSuccessfull)
        else
          this.messageService.showSuccessToast(ConstantProvider.messages.updateSuccessfull);
      })
      .catch(err => {
        bfExpression.createdDate = null;
        this.messageService.showOkAlert('Warning', err);
      })
    }
  }
  /**
 * This method is going to create a new expression entry for selected date and keep it on the top and open
 * 
 * @memberof ExpressionTimeFormPage
 */
  newExpression(){
    this.bFExpressions = this.expressionBFdateService.appendNewRecordAndReturn(this.bFExpressions,
      this.dataForBFEntryPage.babyCode, this.dataForBFEntryPage.selectedDate);
    setTimeout(d => this.toggleGroup(this.bFExpressions[0]),100);
    document.getElementById('scrollHere').scrollIntoView({behavior: 'smooth'})
  }

  /**
 * This method is going to validate the duration of expression field is a decimal field or not and check up to 2 decimal places.
 * 
 * @memberof ExpressionTimeFormPage
 */
  validateDurationOfExpression(bfExpression: IBFExpression) {
    if(bfExpression.volOfMilkExpressedFromLR == null) {
      return true;
    }else if(bfExpression.volOfMilkExpressedFromLR.toString() === ''){
      return true;
    }else {
      let value = bfExpression.volOfMilkExpressedFromLR.toString()
      let rx = /^\d+(?:\.\d{0,2})?$/
      if (rx.test(value) && (bfExpression.volOfMilkExpressedFromLR >= 0 && bfExpression.volOfMilkExpressedFromLR <= 300)) {
        if(value.charAt(value.length-1) === '.')
          bfExpression.volOfMilkExpressedFromLR = parseInt(value.substring(0, value.length-1))
        return true;
      }else {
        return false;
      }
    }
  }
   /**
 * This method is going to validate the volume of milk ranges from 0 to 300 or not.
 * 
 * @memberof ExpressionTimeFormPage
 */
  validateVolumeOfMilk(value) {
    if (value < 0 || value > 300) {
      return false;
    } else {
      return true;
    }
  }

  volumeValidation(item: IBFExpression){
    console.log(item.volOfMilkExpressedFromLR)
  }

  /**
   * This method will delete the given bf expression
   * @author Ratikanta
   * @since 0.0.1
   * @param {IBFExpression} bfExpression The expression which needs to be deleted
   * @memberof ExpressionTimeFormPage
   */
  delete(bfExpression: IBFExpression){
    this.messageService.showAlert(ConstantProvider.messages.warning,ConstantProvider.messages.deleteForm).
    then((data)=>{
      if(data){
        this.bfExpressionTimeService.delete(bfExpression.id)
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
   * This method will help in getting existing bf expression for given baby code and date
   * @author Ratikanta
   * @since 0.0.1
   */
  findExpressionsByBabyCodeAndDate(){

    //getting existing BF expression for given baby code and date
    this.expressionBFdateService.findByBabyCodeAndDate(this.dataForBFEntryPage.babyCode,
      this.dataForBFEntryPage.selectedDate, this.dataForBFEntryPage.isNewExpression)
    .then(data => {
      this.bFExpressions = data;
      if(this.bFExpressions.length === 0){
        this.newExpression();
      }
    })
    .catch(err => {
      this.messageService.showErrorToast(err)
      this.bFExpressions = []
    })
  }

  /**
   * This following two methods i.e datepicker dialog and timepicker dialog will
   * help in opening the native date and time picker respectively.
   * @author - Naseem Akhtar
   * @since - 0.0.1
   */
  
  datePickerDialog(bfExpForm: IBFExpression){
    this.datePicker.show({
    date: this.defaultSelectedDate,
    minDate: this.deliveryDate.valueOf(),
    maxDate: this.dischargeDate.valueOf(),
    mode: 'date',
    androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => {
        bfExpForm.dateOfExpression = this.datePipe.transform(date,"dd-MM-yyyy")
        this.validateTime(bfExpForm.timeOfExpression, bfExpForm)
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  timePickerDialog(bfExpForm: IBFExpression){
    this.datePicker.show({
    date: this.defaultSelectedDate,
    mode: 'time',
    is24Hour: true,
    androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
  }).then(
    time => {
      this.validateTime(this.datePipe.transform(time, 'HH:mm'), bfExpForm)
    },
    err => console.log('Error occurred while getting time: ', err)
    );
  }

  /**
   * This method will be called on change in selection of method of expression.
   * If the method of expression is Breastfeed, then volume of milk expressed will be hidden.
   * @author - Naseem Akhtar
   * @param bfExpform - the form which user is editing
   */
  checkVolumeOfMilkExpressed(bfExpform: IBFExpression) {
      bfExpform.volOfMilkExpressedFromLR = null;
  }

  /** 
   * This method will validate time selected by the user, if it is current date,
   * then future time will not be allowed.
   * @author - Naseem Akhtar
   * @since - 0.0.1
  */
 validateTime(time: string, bfExpForm: IBFExpression){
    if(bfExpForm.dateOfExpression === this.datePipe.transform(new Date(),'dd-MM-yyyy') 
      && time != null && time > this.datePipe.transform(new Date(),'HH:mm')){
        this.messageService.showErrorToast(ConstantProvider.messages.futureTime)
        bfExpForm.timeOfExpression = null;
    }else if(bfExpForm.dateOfExpression === this.dataForBFEntryPage.deliveryDate && time != null
      && time < this.dataForBFEntryPage.deliveryTime){
        this.messageService.showErrorToast(ConstantProvider.messages.pastTime)
        bfExpForm.timeOfExpression = null;
    }else{
      bfExpForm.timeOfExpression = time
    }
  }
}

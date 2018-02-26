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
 * Generated class for the ExpressionTimeFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
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
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private addNewExpressionBfService: AddNewExpressionBfServiceProvider,
    private messageService: MessageProvider,
    private bfExpressionTimeService: SaveExpressionBfProvider,
    private expressionBFdateService: BFExpressionDateListProvider,
    private datePipe: DatePipe, private datePicker: DatePicker) {
    this.maxDate = this.datePipe.transform(new Date(),"yyyy-MM-dd");
  }

  ngOnInit() {
    this.dataForBFEntryPage = this.navParams.get('dataForBFEntryPage');

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
   * This method will save a single feed expression into database
   * 
   * @param {IBFExpression} BfExpression 
   * @author Subhadarshani
   * @since 0.0.1
   */
  saveExpression(bfExpression: IBFExpression) {
    //set validations for all the fields
    if(bfExpression.dateOfExpression === null){
      this.messageService.showErrorToast(ConstantProvider.messages.enterDateOfExpression);
    }else if(bfExpression.timeOfExpression === null){
      this.messageService.showErrorToast(ConstantProvider.messages.enterTimeOfExpression);
    }else if (bfExpression.methodOfExpression == null) {
      this.messageService.showErrorToast(ConstantProvider.messages.enterTypeOfBFExpression);
    } else if (bfExpression.locationOfExpression == null) {
      this.messageService.showErrorToast(ConstantProvider.messages.enterLocOfExpression);
    } else if (bfExpression.volOfMilkExpressedFromLR == null) {
      this.messageService.showErrorToast(ConstantProvider.messages.enterVolumeOfMilkFromLeft);
    } else if (!this.validateVolumeOfMilk(bfExpression.volOfMilkExpressedFromLR)) {
      this.messageService.showErrorToast(ConstantProvider.messages.enterVolumeOfMilkFromRight);
    } else {
      this.bfExpressionTimeService.saveBfExpression(bfExpression)
      .then(data => {
        this.messageService.showSuccessToast("save successful!")
      })
      .catch(err => {
        this.messageService.showErrorToast(err)
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
      this.dataForBFEntryPage.babyCode, null);
    setTimeout(d => this.toggleGroup(this.bFExpressions[0], 0),200);
  }

  /**
 * This method is going to validate the duration of expression field is a decimal field or not and check up to 2 decimal places.
 * 
 * @memberof ExpressionTimeFormPage
 */
  validateDurationOfExpression(value) {
    if (value == null) {
      return false;
    } else {
      let rx = /^\d+(?:\.\d{0,2})?$/

      if (rx.test(value)) {
        return true;
      } else {
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

  /**
   * This method will delete the given bf expression
   * @author Ratikanta
   * @since 0.0.1
   * @param {IBFExpression} bfExpression The expression which needs to be deleted
   * @memberof ExpressionTimeFormPage
   */
  delete(bfExpression: IBFExpression){
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
    date: new Date(),
    maxDate: new Date(),
    allowFutureDates: false,
    mode: 'date',
    androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => {
        bfExpForm.dateOfExpression = this.datePipe.transform(date,"dd-MM-yyyy")
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  timePickerDialog(bfExpForm: IBFExpression){
    this.datePicker.show({
    date: new Date(),
    maxDate: new Date().valueOf(),
    mode: 'time',
    androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
  }).then(
    time => {
      bfExpForm.timeOfExpression = this.datePipe.transform(time,"HH:mm")
    },
    err => console.log('Error occurred while getting time: ', err)
    );
  }
}

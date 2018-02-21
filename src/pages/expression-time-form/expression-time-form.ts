import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddNewExpressionBfServiceProvider } from '../../providers/add-new-expression-bf-service/add-new-expression-bf-service';
import { MessageProvider } from '../../providers/message/message';
import { SaveExpressionBfProvider } from '../../providers/save-expression-bf/save-expression-bf';
import { DatePipe } from '@angular/common';
import { ConstantProvider } from '../../providers/constant/constant';
import { BFExpressionDateListProvider } from '../../providers/bf-expression-date-list-service/bf-expression-date-list-service';
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
  maxTime:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private addNewExpressionBfService: AddNewExpressionBfServiceProvider,
    private messageService: MessageProvider,
    private bfExpressionTimeService: SaveExpressionBfProvider,
    private expressionBFdateService: BFExpressionDateListProvider,
    private datePipe: DatePipe) {
    this.maxDate = this.datePipe.transform(new Date(),"yyyy-MM-dd");
    this.maxTime = this.datePipe.transform(new Date(),"HH:mm");

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
    
    this.methodOfBfExpObject = this.bFExpressions[i].methodOfExpression;
    this.locOfExpressionObject = this.bFExpressions[i].locationOfExpression;

    //getting the id of selected method of expression.
    for (let j = 0; j < this.bfExpressionMethods.length; j++) {
        let id = this.bfExpressionMethods[j].id
        if (this.bFExpressions[i].methodOfExpression === id) {
          this.methodOfBfExpObject= '' + this.bfExpressionMethods[i].name;
          break;
        }
         
    }
     //getting the id of selected location of expression.

     for (let k = 0; k < this.locationOfexpressionMethods.length; k++) {
      let id = this.locationOfexpressionMethods[k].id
      if (this.bFExpressions[i].locationOfExpression === id) {
        this.locOfExpressionObject = '' + this.locationOfexpressionMethods[i].name;
        break;
      }
    }
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
    //getting the id of selected method of expression.
    for (let i = 0; i < this.bfExpressionMethods.length; i++) {
      if (this.bfExpressionMethods[i].name === this.methodOfBfExpObject) {
        bfExpression.methodOfExpression = this.bfExpressionMethods[i].id;
        break;
      }
    }
    //getting the id of selected location of expression.

    for (let i = 0; i < this.locationOfexpressionMethods.length; i++) {
      if (this.locationOfexpressionMethods[i].name === this.locOfExpressionObject) {
        bfExpression.locationOfExpression = this.locationOfexpressionMethods[i].id;
        break;
      }
    }

    //set validations for all the fields
    if (bfExpression.methodOfExpression == null) {
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
    let day = parseInt(this.dataForBFEntryPage.selectedDate.split('-')[0])
    let month = parseInt(this.dataForBFEntryPage.selectedDate.split('-')[1])
    let year = parseInt(this.dataForBFEntryPage.selectedDate.split('-')[2])
    this.bFExpressions = this.expressionBFdateService.appendNewRecordAndReturn(this.bFExpressions, this.dataForBFEntryPage.babyCode, 
    new Date(year, month, day))
    
   
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
      this.bFExpressions = data
    })
    .catch(err => {
      this.messageService.showErrorToast(err)
      this.bFExpressions = []
    })

  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ExpressionTimeFormPage } from '../expression-time-form/expression-time-form';
import { MessageProvider } from '../../providers/message/message';
import { ExpressionBfDateProvider } from '../../providers/expression-bf-date/expression-bf-date'
import { DatePipe } from '@angular/common';
/**
 * Generated class for the ExpressoinFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-expressoin-form',
  templateUrl: 'expressoin-form.html',
})
export class ExpressoinFormPage {

  babyCode: any;
  form: any;
  items: any;
  expBfDateListData: string[];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private datePipe: DatePipe,
    private expressionBFdateService: ExpressionBfDateProvider,
    private messageService: MessageProvider) {
    this.babyCode = this.navParams.get("param1");
    this.form = this.navParams.get("param2");
  }

  goToBabyExBfTimeView(date: any) {
    this.navCtrl.push(ExpressionTimeFormPage, {
      babyCode: this.babyCode,
      date: date,
      isNewExpression:false
    });
  }
  ngOnInit() {
    //Getting date list
    this.expressionBFdateService.getExpressionBFDateListData(this.babyCode)
      .then(data => {
        this.expBfDateListData = data;
      })
      .catch(err => {
        this.messageService.showErrorToast((err as IDBOperationStatus).message)
      })
  }
    /**
   * This is going to send us to entry page with selected date and baby id
   * @author Ratikanta
   * @param date The selected date
   * @since 0.0.1
   */
  dateSelected(date: string){
    let dataForBFEntryPage: IDataForBFEntryPage = {
      babyCode: this.babyCode,
      selectedDate: date,
      isNewExpression: false
    }
    this.navCtrl.push(ExpressionTimeFormPage, {dataForBFEntryPage: dataForBFEntryPage})
  }

/**
 * This methodis going to take us to the entry modal
 * 
 * @memberof FeedDateListPage
 * @author Ratikanta
 * @since 0.0.1
 */
  newExpression(){
    let dataForBFEntryPage: IDataForBFEntryPage = {
      babyCode: this.babyCode,
      selectedDate: this.datePipe.transform(new Date(), 'dd-MM-yyyy'),
      isNewExpression: true
    }
    this.navCtrl.push('ExpressionTimeFormPage', {dataForBFEntryPage: dataForBFEntryPage})
  }

}

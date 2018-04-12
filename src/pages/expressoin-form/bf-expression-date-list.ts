import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessageProvider } from '../../providers/message/message';
import { BFExpressionDateListProvider } from '../../providers/bf-expression-date-list-service/bf-expression-date-list-service';

/**
 * @author Naseem Akhtar (naseem@sdrc.co.in)
 * @since 0.0.1
 * 
 * This component is used to display all the bf expression records of selected baby in date wise order.
 */

@IonicPage()
@Component({
  selector: 'page-expressoin-form',
  templateUrl: 'bf-expression-date-list.html',
})
export class BFExpressionDateListPage {

  babyCode: any;
  form: any;
  items: any;
  expBfDateListData: string[] = [];
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private bfExpressionDateListService: BFExpressionDateListProvider,
    private messageService: MessageProvider) {
  }

  /**
   * Inside this function we are going to write the fetch expression list code.
   * Because init is called onnly while page creation, that is the reason for the
   * list not getting updated while coming back from the form.
   * @author - Naseem Akhtar
   * @since - 0.0.1
   */
  ionViewWillEnter(){

    this.babyCode = this.navParams.get('babyCode')
     //Getting date list
     this.bfExpressionDateListService.getExpressionBFDateListData(this.babyCode)
     .then(data => {
       this.expBfDateListData = data;
     })
     .catch(err => {
      this.expBfDateListData=[]
       this.messageService.showErrorToast(err)
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
      isNewExpression: false,
      deliveryDate: this.navParams.data.deliveryDate,
      deliveryTime: this.navParams.data.deliveryTime,
      dischargeDate: this.navParams.data.dischargeDate
    }
    this.navCtrl.push('ExpressionTimeFormPage', {dataForBFEntryPage: dataForBFEntryPage})
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
      selectedDate: null,
      isNewExpression: true,
      deliveryDate: this.navParams.data.deliveryDate,
      deliveryTime: this.navParams.data.deliveryTime,
      dischargeDate: this.navParams.data.dischargeDate
    }
    this.navCtrl.push('ExpressionTimeFormPage', {dataForBFEntryPage: dataForBFEntryPage})
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessageProvider } from '../../providers/message/message';
import { BfspDateListServiceProvider } from '../../providers/bfsp-date-list-service/bfsp-date-list-service';

/**
 * @author Naseem Akhtar (naseem@sdr.co.in)
 * @since 0.0.1
 * 
 * This component is used to display all the bfsp records of selected baby in date wise order.
 */

@IonicPage()
@Component({
  selector: 'page-bf-supportive-practice-date-list',
  templateUrl: 'bf-supportive-practice-date-list.html',
})
export class BfSupportivePracticeDateListPage {

  babyCode:string;
  items: any;
  bfspDateListData: string[] = [];
  dataForBfspPage: IDataForBfspPage

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private bfspDateListService: BfspDateListServiceProvider, private messageService: MessageProvider) {}

  /**
   * Inside this function we are going to write the fetch expression list code.
   * Because init is called only while page creation, that is the reason for the
   * list not getting updated while coming back from the form.
   * @author - Naseem Akhtar
   * @since - 0.0.1
   */
  ionViewWillEnter(){
    this.babyCode = this.navParams.data.babyCode;
    //Getting date list
    this.bfspDateListService.getBFSPDateList(this.babyCode)
      .then(data => {
        this.bfspDateListData = data;
      })
      .catch(err => {
        this.messageService.showErrorToast(err)
      })

    this.dataForBfspPage = {
      babyCode: this.navParams.data.babyCode,
      selectedDate: null,
      isNewBfsp: true,
      deliveryDate: this.navParams.data.deliveryDate,
      deliveryTime: this.navParams.data.deliveryTime,
      dischargeDate: this.navParams.data.dischargeDate
    }
  }


  /**
   * This is going to send us to entry page with selected date and baby id
   * @author Naseem Akhtar
   * @param date The selected date
   * @since 0.0.1
   */
  dateSelected(date: string) {
    this.dataForBfspPage.selectedDate = date
    this.navCtrl.push('BfSupportivePracticePage', {dataForBfspPage: this.dataForBfspPage});
  };

  /**
   * This methodis going to take us to the entry modal
   * 
   * @memberof BfSupportivePracticeDateListPage
   * @author Naseem Akhtar
   * @since 0.0.1
  */
  newBFSP() {
    this.navCtrl.push('BfSupportivePracticePage', {dataForBfspPage: this.dataForBfspPage})
  };

}

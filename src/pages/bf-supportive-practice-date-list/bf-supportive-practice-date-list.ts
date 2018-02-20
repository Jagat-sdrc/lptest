import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessageProvider } from '../../providers/message/message';
import { DatePipe } from '@angular/common';
import { BfspDateListServiceProvider } from '../../providers/bfsp-date-list-service/bfsp-date-list-service';

/**
 * Generated class for the BfSupportivePracticeDateListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bf-supportive-practice-date-list',
  templateUrl: 'bf-supportive-practice-date-list.html',
})
export class BfSupportivePracticeDateListPage {

  babyCode:string;
  babyCodeHospital: any;
  items: any;
  bfspDateListData: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private datePipe: DatePipe,
    private bfspDateListService: BfspDateListServiceProvider, private messageService: MessageProvider) {
      this.babyCode = this.navParams.data.babyCode;
      this.babyCodeHospital = this.navParams.data.babyCodeByHospital;
  }

  ngOnInit() {
    //Getting date list
    this.bfspDateListService.getBFSPDateList(this.babyCode)
      .then(data => {
        this.bfspDateListData = data;
      })
      .catch(err => {
        this.messageService.showErrorToast((err as IDBOperationStatus).message)
      })
  }


  /**
   * This is going to send us to entry page with selected date and baby id
   * @author Naseem Akhtar
   * @param date The selected date
   * @since 0.0.1
   */
  dateSelected(date: string) {
    let dataForBfspPage: IDataForBfspPage = {
      babyCode: this.babyCode,
      selectedDate: date,
      isNewBfsp: false
    }
    this.navCtrl.push('BfSupportivePracticePage', {dataForBfspPage: dataForBfspPage});
  };

  /**
   * This methodis going to take us to the entry modal
   * 
   * @memberof BfSupportivePracticeDateListPage
   * @author Naseem Akhtar
   * @since 0.0.1
  */
  newBFSP() {
    let dataForBfspPage: IDataForFeedEntryPage = {
      babyCode: this.babyCode,
      selectedDate: this.datePipe.transform(new Date(), 'dd-MM-yyyy'),
      isNewExpression: true
    }
    this.navCtrl.push('BfSupportivePracticePage', {dataForBfspPage: dataForBfspPage})
  };

}

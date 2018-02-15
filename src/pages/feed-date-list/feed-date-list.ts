import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FeedDateListServiceProvider } from '../../providers/feed-date-list-service/feed-date-list-service';
import { MessageProvider } from '../../providers/message/message';
import { FeedPage } from '../feed/feed';
import { DatePipe } from '@angular/common';

/**
 * This page/component will have entries of feed expression by date
 * 
 * @author Ratikanta
 * @since 0.0.1
 */
@IonicPage()
@Component({
  selector: 'page-feed-date-list',
  templateUrl: 'feed-date-list.html',
})
export class FeedDateListPage {

  feedDateListData: string[];
  babyCode:string;
  params: Object;

  constructor(private feedDateListService: FeedDateListServiceProvider,
    private messageService: MessageProvider, private navCtrl: NavController,   
private datePipe: DatePipe) {}

  
  ionViewWillEnter(){
    //test
    this.babyCode = 'qqqqq'
    //Getting date list
    this.feedDateListService.getFeedDateListData(this.babyCode)
    .then(data=>{
      this.feedDateListData = data
    })
    .catch(err=>{
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
    let dataForFeedEntryPage: IDataForFeedEntryPage = {
      babyCode: this.babyCode,
      selectedDate: date,
      isNewExpression: false
    }
    this.navCtrl.push(FeedPage, {dataForFeedEntryPage: dataForFeedEntryPage})
  }

/**
 * This methodis going to take us to the entry modal
 * 
 * @memberof FeedDateListPage
 * @author Ratikanta
 * @since 0.0.1
 */
  newExpression(){
    let dataForFeedEntryPage: IDataForFeedEntryPage = {
      babyCode: this.babyCode,
      selectedDate: this.datePipe.transform(new Date(), 'dd-MM-yyyy'),
      isNewExpression: true
    }
    this.navCtrl.push(FeedPage, {dataForFeedEntryPage: dataForFeedEntryPage})
  }

}

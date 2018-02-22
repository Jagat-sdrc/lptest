import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FeedDateListServiceProvider } from '../../providers/feed-date-list-service/feed-date-list-service';
import { MessageProvider } from '../../providers/message/message';
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
  paramToExpressionPage: IParamToExpresssionPage;

  constructor(private feedDateListService: FeedDateListServiceProvider,
    private messageService: MessageProvider, private navCtrl: NavController,   
private datePipe: DatePipe,private navParams: NavParams) {}

  
  ionViewWillEnter(){

    this.paramToExpressionPage = {
      babyCode: this.navParams.get("babyCode"),
      babyCodeByHospital: this.navParams.get("babyCodeByHospital")
    }

    this.babyCode = this.paramToExpressionPage.babyCode;
    

    //Getting date list
    this.feedDateListService.getFeedDateListData(this.paramToExpressionPage.babyCode)
    .then(data=>{
      this.feedDateListData = data
    })
    .catch(err=>{
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
    let dataForFeedEntryPage: IDataForFeedEntryPage = {
      babyCode: this.babyCode,
      selectedDate: date,
      isNewExpression: false
    }
    this.navCtrl.push('FeedPage', {dataForFeedEntryPage: dataForFeedEntryPage})
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
      selectedDate: null,
      // selectedDate: this.datePipe.transform(new Date(), 'dd-MM-yyyy'),
      isNewExpression: true
    }
    this.navCtrl.push('FeedPage', {dataForFeedEntryPage: dataForFeedEntryPage})
  }

}

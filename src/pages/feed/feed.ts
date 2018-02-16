import { FeedExpressionServiceProvider } from './../../providers/feed-expression-service/feed-expression-service';
import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { MessageProvider } from '../../providers/message/message';


/**
 * This is the feed component(page)
 * @author Ratikanta
 * @since 0.0.1
 */
@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

  feedingMethods: ITypeDetails[];
  feedExpression: IFeed;
  feedExpressions: IFeed[];
  dataForFeedEntryPage: IDataForFeedEntryPage;
  shownGroup: any;

  constructor(private feedExpressionService: FeedExpressionServiceProvider, 
  private messageService: MessageProvider, private navParams: NavParams) {}

  ngOnInit(){

    this.dataForFeedEntryPage = this.navParams.get('dataForFeedEntryPage');
    
    this.findExpressionsByBabyCodeAndDate();    

    //Getting feeding methods type details
    this.feedExpressionService.getFeedingMethods()
    .subscribe(data =>{
      this.feedingMethods = data
    }, err => {
      this.messageService.showErrorToast(err)
    });    

  }

/**
 * This method will save a single feed expression into database
 * 
 * @param {IFeed} feedExpression 
 * @memberof FeedPage
 * @author Ratikanta
 * @since 0.0.1
 */
  saveExpression(feedExpression: IFeed) {   
    this.feedExpressionService.saveFeedExpression(feedExpression)
    .then(data=> {
      this.findExpressionsByBabyCodeAndDate();
      this.messageService.showSuccessToast("save successful!")
    })
    .catch(err =>{
       this.messageService.showErrorToast((err as IDBOperationStatus).message)
    })
  }
  

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };

  isGroupShown(group) {
    return this.shownGroup === group;
  }

/**
 * This method is going to create a new expression entry for selected date and keep it on the top and open
 * 
 * @memberof FeedPage
 */
  newExpression(){

    let day = parseInt(this.dataForFeedEntryPage.selectedDate.split('-')[0])
    let month = parseInt(this.dataForFeedEntryPage.selectedDate.split('-')[1])
    let year = parseInt(this.dataForFeedEntryPage.selectedDate.split('-')[2])

    this.feedExpressions = this.feedExpressionService.appendNewRecordAndReturn(this.feedExpressions, this.dataForFeedEntryPage.babyCode, 
    new Date(year, month, day))

  }

  /**
   * This method will help in getting existing feed expression for given baby code and date
   * @author Ratikanta
   * @since 0.0.1
   */
  findExpressionsByBabyCodeAndDate(){
    //getting existing feed expression for given baby code and date
    this.feedExpressionService.findByBabyCodeAndDate(this.dataForFeedEntryPage.babyCode, 
      this.dataForFeedEntryPage.selectedDate, this.dataForFeedEntryPage.isNewExpression)
    .then(data=>{
      this.feedExpressions = data      
    })
    .catch(err=>{
      this.messageService.showErrorToast(err)
    })
  }
}

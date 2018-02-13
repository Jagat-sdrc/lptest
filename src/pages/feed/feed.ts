import { FeedExpressionServiceProvider } from './../../providers/feed-expression-service/feed-expression-service';
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
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

  constructor(private feedExpressionService: FeedExpressionServiceProvider, 
  private messageService: MessageProvider) {}

  ngOnInit(){

    //Getting feeding methods type details
    this.feedExpressionService.getFeedingMethods()
    .subscribe(data =>{
      this.feedingMethods = data
    }, err => {
      this.messageService.showErrorToast(err)
    });

    //Initialize the feed expression object
    //These are the demo values, we will erase this later
    this.feedExpression = {
     patientId: "qqqqq-ddddd",
     babyCode: "baby code1",
     userId: "demo user id",
     babyWeight: 2.6,
     dateOfFeed: "09-02-2018",
     DHMVolume: 2.9,
     formulaVolume: 2.8,
     methodOfFeed: 2,
     OMMVolume: 2.9,
     otherVolume: 7.0,
     timeOfFeed: "19:18"
    }

    //Test method
    // this.feedExpressionService.getKeys()


    

    this.feedExpressionService.saveFeedExpression(this.feedExpression)
    .then(data=> {
      this.messageService.showSuccessToast("save successful!")
    })
    .catch(err =>{
      this.messageService.showErrorToast((err as IDBOperationStatus).message)
    })

  }
}

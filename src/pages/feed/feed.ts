import { FeedExpressionServiceProvider } from './../../providers/feed-expression-service/feed-expression-service';
import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { MessageProvider } from '../../providers/message/message';
import { ConstantProvider } from '../../providers/constant/constant';


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
  locationOfFeedings: ITypeDetails[];

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
    
    
    //Getting location of feeding type details
    this.feedExpressionService.getLocationOfFeedings()
    .subscribe(data =>{
      this.locationOfFeedings = data
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
    if(feedExpression.dateOfFeed === null) {
      this.messageService.showErrorToast(ConstantProvider.messages.enterDateOfFeed)
    }else if(feedExpression.timeOfFeed === null) {
      this.messageService.showErrorToast(ConstantProvider.messages.enterTimeOfFeed)
    }else if(feedExpression.methodOfFeed === null) {
      this.messageService.showErrorToast(ConstantProvider.messages.methodOfFeed)  
    }else if(feedExpression.ommVolume === null) {
      this.messageService.showErrorToast(ConstantProvider.messages.ommVolumne)
    }else if(feedExpression.dhmVolume === null) {
      this.messageService.showErrorToast(ConstantProvider.messages.dhmVolume)
    }else if(feedExpression.formulaVolume === null) {
      this.messageService.showErrorToast(ConstantProvider.messages.formulaVolume)
    }else if(feedExpression.animalMilkVolume === null) {
      this.messageService.showErrorToast(ConstantProvider.messages.animalMilkVolume)
    }else if(feedExpression.otherVolume === null) {
      this.messageService.showErrorToast(ConstantProvider.messages.otherVolume)
    }else if(feedExpression.locationOfFeeding === null) {
      this.messageService.showErrorToast(ConstantProvider.messages.locationWhereFeedOccured)
    }else if(feedExpression.babyWeight === null) {
      this.messageService.showErrorToast(ConstantProvider.messages.babyWeight)
    }else{
      this.feedExpressionService.saveFeedExpression(feedExpression)
      .then(data=> {
        this.dataForFeedEntryPage.isNewExpression = false;
        this.findExpressionsByBabyCodeAndDate();
        this.messageService.showSuccessToast("save successful!")
      })
      .catch(err =>{
        this.messageService.showErrorToast(err)
      })
    }
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

    // let day = parseInt(this.dataForFeedEntryPage.selectedDate.split('-')[0])
    // let month = parseInt(this.dataForFeedEntryPage.selectedDate.split('-')[1])
    // let year = parseInt(this.dataForFeedEntryPage.selectedDate.split('-')[2])

    this.feedExpressions = this.feedExpressionService.appendNewRecordAndReturn(this.feedExpressions, this.dataForFeedEntryPage.babyCode, 
    new Date());
    this.isGroupShown(this.feedExpressions[0]);
  };

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
      this.feedExpressions = data;
      if(this.feedExpressions.length > 0){
        this.isGroupShown( this.feedExpressions[0]);
      }
    })
    .catch(err=>{
      this.messageService.showErrorToast(err)
    })
  }


/**
   * This method will delete the given bf expression
   * @author Ratikanta
   * @since 0.0.1
   * @param {IBFExpression} bfExpression The expression which needs to be deleted
   * @memberof ExpressionTimeFormPage
   */
  delete(feedExpression: IFeed){
    this.feedExpressionService.delete(feedExpression.id)
    .then(()=>{
      //refreshing the list 
      this.findExpressionsByBabyCodeAndDate();
      this.messageService.showSuccessToast(ConstantProvider.messages.deleted)
    })
    .catch(err=>{
      this.messageService.showErrorToast(err)
    })
  }

}

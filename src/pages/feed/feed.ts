import { FeedExpressionServiceProvider } from './../../providers/feed-expression-service/feed-expression-service';
import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { MessageProvider } from '../../providers/message/message';
import { ConstantProvider } from '../../providers/constant/constant';
import { DatePicker } from '@ionic-native/date-picker';
import { DatePipe } from '@angular/common';


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
  onlyNumberRegex: RegExp = /^[0-9]*$/;
  existingDate: string;
  existingTime: string;

  constructor(private feedExpressionService: FeedExpressionServiceProvider, 
  private messageService: MessageProvider, private navParams: NavParams, private datePicker: DatePicker,
    private datePipe: DatePipe) {}

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
    }else if(feedExpression.ommVolume === undefined || feedExpression.ommVolume === null 
      || feedExpression.ommVolume.toString() === "") {
      this.messageService.showErrorToast(ConstantProvider.messages.ommVolumne)
    }else if(feedExpression.dhmVolume === undefined || feedExpression.dhmVolume === null 
      || feedExpression.dhmVolume.toString() === "") {
      this.messageService.showErrorToast(ConstantProvider.messages.dhmVolume)
    }else if(feedExpression.formulaVolume === undefined || feedExpression.formulaVolume === null
      || feedExpression.formulaVolume.toString() === "") {
      this.messageService.showErrorToast(ConstantProvider.messages.formulaVolume)
    }else if(feedExpression.animalMilkVolume === undefined || feedExpression.animalMilkVolume === null 
      || feedExpression.animalMilkVolume.toString() === "") {
      this.messageService.showErrorToast(ConstantProvider.messages.animalMilkVolume)
    }else if(feedExpression.otherVolume === undefined || feedExpression.otherVolume === null 
      || feedExpression.otherVolume.toString() === "") {
      this.messageService.showErrorToast(ConstantProvider.messages.otherVolume)
    }else if(feedExpression.locationOfFeeding === null) {
      this.messageService.showErrorToast(ConstantProvider.messages.locationWhereFeedOccured)
    }else if(feedExpression.babyWeight === null) {
      this.messageService.showErrorToast(ConstantProvider.messages.babyWeight)
    }else{
      this.feedExpressionService.saveFeedExpression(feedExpression, this.existingDate, this.existingTime)
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
  

  toggleGroup(group: IFeed) {
    this.existingDate = group.dateOfFeed;
    this.existingTime = group.timeOfFeed;
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
    this.feedExpressions = this.feedExpressionService.appendNewRecordAndReturn(this.feedExpressions, this.dataForFeedEntryPage.babyCode, 
    null);
    setTimeout( data => this.toggleGroup(this.feedExpressions[0]), 100);
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
      if(this.feedExpressions.length === 0){
        this.newExpression();
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

  /**
   * This following two methods i.e datepicker dialog and timepicker dialog will
   * help in opening the native date and time picker respectively.
   * @author - Naseem Akhtar
   * @since - 0.0.1
   */
  
  datePickerDialog(feedExp: IFeed){
    this.datePicker.show({
    date: new Date(),
    maxDate: new Date().valueOf(),
    allowFutureDates: false,
    mode: 'date',
    androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => {
        feedExp.dateOfFeed = this.datePipe.transform(date,"dd-MM-yyyy")
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  timePickerDialog(feedExp: IFeed){
    this.datePicker.show({
    date: new Date(),
    mode: 'time',
    is24Hour: true,
    androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
  }).then(
    time => {
      feedExp.timeOfFeed = this.datePipe.transform(time,"HH:mm")
    },
    err => console.log('Error occurred while getting time: ', err)
    );
  }

}

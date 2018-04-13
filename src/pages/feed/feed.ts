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
 * @author Naseem Akhtar (naseem@sdrc.co.in)
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
  existingDate: string;
  existingTime: string;
  deliveryDate: Date;
  dischargeDate: Date;
  defaultSelectedDate: Date;
  onlyNumberRegex: RegExp = /^[0-9]*\.[0-9][0-9]$/;

  constructor(private feedExpressionService: FeedExpressionServiceProvider, 
  private messageService: MessageProvider, private navParams: NavParams, private datePicker: DatePicker,
    private datePipe: DatePipe) {}

  /**
   * @author - Naseem Akhtar (naseem@sdrc.co.in)
   * @since - 0.0.1
   * 
   * This method will be called during after the initiaization of this component.
   * Fetching important baby details like dateOfFeed, babyCode, delivery date etc. from the 
   * {{@see NavParams}} in order to acheive the following points:-
   * 1. Fetch the feed entries for the selected baby for the selected date
   * 2. Restrict min date and max date for which the feed entries can be made.
   */
  ngOnInit(){

    this.dataForFeedEntryPage = this.navParams.get('dataForFeedEntryPage');
    let x = this.dataForFeedEntryPage.deliveryDate.split('-');
    // -1 is done in the second argument, because in new Date(), january is taken a 0.
    this.deliveryDate = new Date(+x[2],+x[1]-1,+x[0])
    let check90Days = new Date(+x[2],+x[1]-1,+x[0])
    check90Days.setDate(check90Days.getDate() + ConstantProvider.messages.threeMonthsOfLife)
    if(this.dataForFeedEntryPage.dischargeDate != null){
      let y = this.dataForFeedEntryPage.dischargeDate.split('-')
      this.dischargeDate = new Date(+y[2],+y[1]-1,+y[0])
      this.defaultSelectedDate = new Date() > this.dischargeDate ? this.deliveryDate : new Date()
    }else{
      if(new Date() > check90Days) {
        this.dischargeDate = check90Days
        this.defaultSelectedDate = this.deliveryDate
      }
      else{
        this.dischargeDate = new Date()
        this.defaultSelectedDate = new Date()
      }
    }
    
    //this method is called to fetch all the records of the selected baby for the selected date.
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
 * @author Naseem Akhtar(naseem@sdrc.co.in)
 * @since 0.0.1
 */
  validateExpression(feedExpression: IFeed) {
    if(feedExpression.dateOfFeed === null) {
      this.messageService.showErrorToast(ConstantProvider.messages.enterDateOfFeed)
    }
    else if(feedExpression.timeOfFeed === null) {
      this.messageService.showErrorToast(ConstantProvider.messages.enterTimeOfFeed)
    }
    else if(!this.checkForOnlyNumber(feedExpression, 'ommVolume')) {
      this.messageService.showErrorToast(ConstantProvider.messages.ommVolumne)
    }
    else if(!this.checkForOnlyNumber(feedExpression, 'dhmVolume')) {
      this.messageService.showErrorToast(ConstantProvider.messages.dhmVolume)
    }
    else if(!this.checkForOnlyNumber(feedExpression, 'formulaVolume')) {
      this.messageService.showErrorToast(ConstantProvider.messages.formulaVolume)
    }
    else if(!this.checkForOnlyNumber(feedExpression, 'animalMilkVolume')) {
      this.messageService.showErrorToast(ConstantProvider.messages.animalMilkVolume)
    }
    else if(!this.checkForOnlyNumber(feedExpression, 'otherVolume')) {
      this.messageService.showErrorToast(ConstantProvider.messages.otherVolume)
    }
    else if(feedExpression.babyWeight != null && feedExpression.babyWeight.toString() != "" 
      && (feedExpression.babyWeight < 400 || feedExpression.babyWeight > 6000)){
      this.messageService.showAlert(ConstantProvider.messages.warning,ConstantProvider.messages.babyOverWeight)
        .then((data)=>{
          if(data){
            this.saveExpression(feedExpression);
          }else{
            feedExpression.babyWeight = null;
          }
        })
    }else{
      this.saveExpression(feedExpression);
    }
  }

  // This method will be called when the user clicks on save of a particular entry.
  saveExpression(feedExpression: IFeed){
    let newData: boolean = feedExpression.id === null ? true : false
    this.feedExpressionService.saveFeedExpression(feedExpression, this.existingDate, this.existingTime)
      .then(data=> {
        this.dataForFeedEntryPage.isNewExpression = false;
        this.findExpressionsByBabyCodeAndDate();
        if(newData)
          this.messageService.showSuccessToast(ConstantProvider.messages.saveSuccessfull)
        else
          this.messageService.showSuccessToast(ConstantProvider.messages.updateSuccessfull);
      })
      .catch(err =>{
        feedExpression.createdDate = null;
        this.messageService.showOkAlert('Warning', err);
      })
  }
  
  /**
   * @author - Naseem Akhtar (naseem@sdrc.co.in)
   * @since - 0.0.1
   * The following two methods is used to open the selected entry accordion and 
   * close the previously selected entry accordion.
   * If same accordion is tapped again and again, then the same accordion will close and 
   * open alternatively.
  */
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
    this.dataForFeedEntryPage.selectedDate);
    setTimeout( data => this.toggleGroup(this.feedExpressions[0]), 100);
    document.getElementById('scrollHere').scrollIntoView({behavior: 'smooth'})
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
    this.messageService.showAlert(ConstantProvider.messages.warning,ConstantProvider.messages.deleteForm).
    then((data)=>{
      if(data){
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
    date: this.defaultSelectedDate,
    minDate: this.deliveryDate.valueOf(),
    maxDate: this.dischargeDate.valueOf(),
    allowFutureDates: false,
    mode: 'date',
    androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => {
        feedExp.dateOfFeed = this.datePipe.transform(date,"dd-MM-yyyy")
        this.validateTime(feedExp.timeOfFeed, feedExp)
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  timePickerDialog(feedExp: IFeed){
    this.datePicker.show({
    date: this.defaultSelectedDate,
    mode: 'time',
    is24Hour: true,
    androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
  }).then(
    time => {
      this.validateTime(this.datePipe.transform(time, 'HH:mm'), feedExp)
    },
    err => console.log('Error occurred while getting time: ', err)
    );
  }

  /**
   * This method will validate whether the given input was number or not
   * @author - Naseem Akhtar
   * @param forValidation - the number entered by the user
   */
  checkForOnlyNumber(feed: IFeed, variableName: string){
    if(feed[variableName] === null)
      return true;
    else if(feed[variableName] === '')
      return true;
    else{
      let forValidation = feed[variableName].toString()
      let rx = /^\d+(?:\.\d{0,2})?$/
      if(rx.test(forValidation) && (feed[variableName] >= 0 && feed[variableName] <= 300)){
        if(forValidation.charAt(forValidation.length-1) === '.')
          feed[variableName] = parseInt(forValidation.substring(0, forValidation.length-1))
        return true;
      } else
          return false;
    }
  }

  /**
   * This function will be called on ion change of method of expression question/
   * Only breastfeeding and Parenteral + Enteral option will be required to fill up the volume questions.
   * @author - Naseem Akhtar
   * @param feedExpression - this is the form that the user is entering
   */
  validateVolumeFields(feedExpression: IFeed){
    // if(feedExpression.methodOfFeed === 61 || feedExpression.methodOfFeed === 66) {
      feedExpression.animalMilkVolume = null
      feedExpression.dhmVolume = null
      feedExpression.formulaVolume = null
      feedExpression.ommVolume = null
      feedExpression.otherVolume = null
    // }
  }

  /** 
   * This method will validate time selected by the user, if it is current date,
   * then future time will not be allowed.
   * @author - Naseem Akhtar
   * @since - 0.0.1
  */
 validateTime(time: string, feedExp: IFeed){
    if(feedExp.dateOfFeed === this.datePipe.transform(new Date(),'dd-MM-yyyy')
      && time != null && time > this.datePipe.transform(new Date(),'HH:mm')){
        this.messageService.showErrorToast(ConstantProvider.messages.futureTime)
        feedExp.timeOfFeed = null;
    }else if(feedExp.dateOfFeed === this.dataForFeedEntryPage.deliveryDate && time != null 
      && time < this.dataForFeedEntryPage.deliveryTime){
      this.messageService.showErrorToast(ConstantProvider.messages.pastTime)
      feedExp.timeOfFeed = null;
    }else{
      feedExp.timeOfFeed = time
    }
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BfPostDischargeServiceProvider } from '../../providers/bf-post-discharge-service/bf-post-discharge-service';
import { MessageProvider } from '../../providers/message/message';
import { ConstantProvider } from '../../providers/constant/constant';
import { DatePicker } from '@ionic-native/date-picker';
import { DatePipe } from '@angular/common';

/**
 * Generated class for the BfPostDischargePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bf-post-discharge',
  templateUrl: 'bf-post-discharge.html',
})
export class BfPostDischargePage {

  babyCode: string;
  timeOfFeedList: ITypeDetails[];
  bfStatusPostDischargeList: ITypeDetails[];
  deliveryDate: Date;
  dischargeDate: Date;
  formHeading: string;
  bfpd: IBFPD = {
    babyCode: null,
    dateOfBreastFeeding: null,
    id: null,
    isSynced: false,
    breastFeedingStatus: null,
    syncFailureMessage: null,
    timeOfBreastFeeding: null,
    userId: null,
    createdDate: null,
    updatedDate: null,
    uuidNumber: null
  }
  dataFromBfpdMenu: IDataForPostDischargePage;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private bfPostDischargeService: BfPostDischargeServiceProvider,
    private messageService: MessageProvider, private datePicker: DatePicker,
    private datePipe: DatePipe
  ) {

  }

  ngOnInit() {
    this.dataFromBfpdMenu = this.navParams.data;
    this.babyCode = this.dataFromBfpdMenu.babyCode;
    //splitting delivery date to use it new date for min date of datepicker
    let x = this.navParams.data.deliveryDate.split('-');
    this.deliveryDate = new Date(+x[2],+x[1]-1,+x[0]);

    if(this.dataFromBfpdMenu.dischargeDate != null){
      let y = this.dataFromBfpdMenu.dischargeDate.split('-')
      this.dischargeDate = new Date(+y[2],+y[1]-1,+y[0])
    }

    switch(this.dataFromBfpdMenu.menuItemId){
      case 67:  this.deliveryDate = this.dischargeDate ? this.dischargeDate : this.deliveryDate;
                this.deliveryDate.setDate(this.deliveryDate.getDate() + ConstantProvider.messages.twoWeeksPostDischarge)
        break;
      case 68:  this.deliveryDate = this.dischargeDate ? this.dischargeDate : this.deliveryDate;
                this.deliveryDate.setDate(this.deliveryDate.getDate() + ConstantProvider.messages.oneMonthPostDischarge);
        break;
      case 69:  this.deliveryDate.setDate(this.deliveryDate.getDate() + ConstantProvider.messages.threeMonthsOfLife);
        break;
      case 70:  this.deliveryDate.setDate(this.deliveryDate.getDate() + ConstantProvider.messages.sixMonthsOfLife);
        break;
    }

    this.bfPostDischargeService.findByBabyCodeAndTimeOfBreastFeedingId(this.babyCode, this.navParams.data.menuItemId)
      .then(data => {
        if(data != null)
          this.bfpd = data;
        else
          this.bfpd.babyCode = this.babyCode;
      }).catch(error => {
        this.messageService.showErrorToast(error)
      });

    this.bfPostDischargeService.getTimeOfBreastfeedingPostDischarge()
      .subscribe(data => {
        let timeOfBf: ITypeDetails;
        this.timeOfFeedList = data;
        timeOfBf = this.timeOfFeedList.find(d => d.id === this.navParams.data.menuItemId);
        this.bfpd.timeOfBreastFeeding = timeOfBf.id;
        this.formHeading = timeOfBf.name;
      }, error => {
        this.messageService.showErrorToast(error);
      });

    this.bfPostDischargeService.getBreastfeedingStatusPostDischarge()
      .subscribe(data => {
        this.bfStatusPostDischargeList = data;
      }, error => {
        this.messageService.showErrorToast(error);
      });
  };

  save() {
    let newData: boolean = this.bfpd.id === null ? true : false
    if(this.bfpd.dateOfBreastFeeding === null) {
      this.messageService.showErrorToast(ConstantProvider.messages.dateOfBfpd)
    }else{
      this.bfPostDischargeService.saveNewBfPostDischargeForm(this.bfpd)
      .then(data=> {
        if(newData)
          this.messageService.showSuccessToast(ConstantProvider.messages.saveSuccessfull);
        else
          this.messageService.showSuccessToast(ConstantProvider.messages.updateSuccessfull);

        this.navCtrl.pop();
      })
      .catch(err =>{
        this.bfpd.createdDate = null
        this.messageService.showOkAlert('Warning', err);
      })
    }
  };



/**
   * This method will delete the given bf expression
   * @author Ratikanta
   * @since 0.0.1
   * @param {IBFExpression} bfExpression The expression which needs to be deleted
   * @memberof ExpressionTimeFormPage
   */
  delete(){
    this.messageService.showAlert(ConstantProvider.messages.warning,ConstantProvider.messages.deleteForm).
    then((data)=>{
      if(data){
        this.bfPostDischargeService.delete(this.bfpd.id)
          .then(()=>{
            this.messageService.showSuccessToast(ConstantProvider.messages.deleted)
            this.navCtrl.pop();
          })
          .catch(err=>{
            this.messageService.showErrorToast(err)
          })
      }
    })
  }

  /**
   * This following method will help in opening the native date and time picker respectively.
   * @author - Naseem Akhtar
   * @since - 0.0.1
   */

  datePickerDialog(bfpd: IBFPD){
    this.datePicker.show({
    date: new Date(),
    minDate: this.deliveryDate.valueOf(),
    maxDate: new Date().valueOf(),
    mode: 'date',
    androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => {
        bfpd.dateOfBreastFeeding = this.datePipe.transform(date,"dd-MM-yyyy")
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  /**
   * @author - Naseem Akhtar
   * @since - 0.0.1
   * This method will delete all the bfsp records whose baby id is not present.
   * This method is written for preventive measrues as this issue was did not happen
   * again
  */
  ionViewWillLeave(){
    this.bfPostDischargeService.sanitizeData()
  }

}

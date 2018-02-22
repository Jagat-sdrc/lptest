import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BfPostDischargeServiceProvider } from '../../providers/bf-post-discharge-service/bf-post-discharge-service';
import { MessageProvider } from '../../providers/message/message';
import { ConstantProvider } from '../../providers/constant/constant';

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
  maxDate:any;
  formHeading: string;
  bfpd: IBFPD = {
    babyCode: null,
    dateOfBreastFeeding: null,
    id: null,
    isSynced: false,
    breastFeedingStatus: null,
    syncFailureMessage: null,
    timeOfBreastFeeding: null,
    userId: null
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private bfPostDischargeService: BfPostDischargeServiceProvider,
    private messageService: MessageProvider,
  ) {
      
  }

  ngOnInit() {

    this.maxDate = this.bfPostDischargeService.getMaxTime();
    this.babyCode = this.navParams.data.babyCode;

    this.bfPostDischargeService.findByBabyCodeAndTimeOfBreastFeedingId(this.babyCode, this.navParams.data.menuItemId)
      .then(data => {
        this.bfpd = data          
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
    this.bfPostDischargeService.saveNewBfPostDischargeForm(this.bfpd)
      .then(data=> {
        this.messageService.showSuccessToast("save successful!");
        this.navCtrl.pop();
      })
      .catch(err =>{
        this.messageService.showErrorToast(err)
      })
    // if(!this.postDischargeForm.valid){
    //   Object.keys(this.postDischargeForm.controls).forEach(field => {
    //     const control = this.postDischargeForm.get(field);
    //     control.markAsTouched({ onlySelf: true });
    //   });
    // } else {
    //   this.postDischargeForm.get('babyCode').setValue(this.babyCode);
    //   this.bfPostDischargeService.saveNewBfPostDischargeForm(this.postDischargeForm.value)
    //   .then(data=> {
    //     this.messageService.showSuccessToast("save successful!");
    //     this.navCtrl.pop();
    //   })
    //   .catch(err =>{
    //     this.messageService.showErrorToast(err)
    //   })
    // }
  };

  

/**
   * This method will delete the given bf expression
   * @author Ratikanta
   * @since 0.0.1
   * @param {IBFExpression} bfExpression The expression which needs to be deleted
   * @memberof ExpressionTimeFormPage
   */
  delete(){
    this.bfPostDischargeService.delete(this.bfpd.id)
    .then(()=>{
      this.messageService.showSuccessToast(ConstantProvider.messages.deleted)
      this.navCtrl.pop();      
    })
    .catch(err=>{
      this.messageService.showErrorToast(err)
    })
  }

}

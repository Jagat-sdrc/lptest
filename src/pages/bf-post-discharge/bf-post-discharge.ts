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

  createPostDischargeForm() {
    // this.postDischargeForm = this.formBuilder.group({
    //   id: [null],
    //   babyCode: [null],
    //   userId: [this.userService.getUser().email],
    //   syncFailureMessage: [null],
    //   isSynced: [false],
    //   dateOfBreastFeeding: [moment.utc(this.datePipe.transform(new Date(), 'yyyy-M-d')).toISOString(), Validators.required],
    //   timeOfBreastFeeding: [this.navParams.data.menuItemId, [Validators.required]],
    //   breastFeedingStatus: ['', Validators.required],
    // });
  };

  displayExistingRecord(bfPdForm: IBFPD){
    // let day = parseInt(bfPdForm.dateOfBreastFeeding.split('-')[0]);
    // let month = parseInt(bfPdForm.dateOfBreastFeeding.split('-')[1]);
    // let year = parseInt(bfPdForm.dateOfBreastFeeding.split('-')[2]);
    // this.postDischargeForm = this.formBuilder.group({
    //   id: [bfPdForm.id],
    //   babyCode: [bfPdForm.babyCode],
    //   userId: [bfPdForm.userId],
    //   syncFailureMessage: [bfPdForm.syncFailureMessage],
    //   isSynced: [bfPdForm.isSynced],
    //   dateOfBreastFeeding: [moment.utc(year+ "-"+ month+"-"+ day).toISOString(), Validators.required],
    //   timeOfBreastFeeding: [bfPdForm.timeOfBreastFeeding, [Validators.required]],
    //   breastFeedingStatus: [bfPdForm.breastFeedingStatus, Validators.required],
    // });
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
        this.timeOfFeedList = data;
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

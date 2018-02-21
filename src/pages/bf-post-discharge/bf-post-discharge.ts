import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { BfPostDischargeServiceProvider } from '../../providers/bf-post-discharge-service/bf-post-discharge-service';
import { MessageProvider } from '../../providers/message/message';

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

  postDischargeForm: FormGroup;
  babyCode: string;
  timeOfFeedList: ITypeDetails[];
  bfStatusPostDischargeList: ITypeDetails[];
  maxDate:any;
  existingPostDischargeForm: IBFPD;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private bfPostDischargeService: BfPostDischargeServiceProvider,
    private formBuilder: FormBuilder, private userService: UserServiceProvider,
    private messageService: MessageProvider) {
      this.createPostDischargeForm();
      this.maxDate = this.bfPostDischargeService.getMaxTime();
      this.babyCode = this.navParams.data.babyCodeHospital;
  }

  createPostDischargeForm() {
    this.postDischargeForm = this.formBuilder.group({
      id: [null],
      babyCode: [null],
      userId: [this.userService.getUser().email],
      syncFailureMessage: [null],
      isSynced: [false],
      dateOfBreastFeeding: ['', Validators.required],
      timeOfBreastFeeding: [this.navParams.data.menuItemId, [Validators.required]],
      breastFeedingStatus: ['', Validators.required],
    });
  };

  displayExistingRecord(bfPdForm: IBFPD){
    this.postDischargeForm = this.formBuilder.group({
      id: [bfPdForm.id],
      babyCode: [bfPdForm.babyCode],
      userId: [bfPdForm.userId],
      syncFailureMessage: [bfPdForm.syncFailureMessage],
      isSynced: [bfPdForm.isSynced],
      dateOfBreastFeeding: [bfPdForm.dateOfBreastFeeding, Validators.required],
      timeOfBreastFeeding: [bfPdForm.timeOfBreastFeeding, [Validators.required]],
      breastFeedingStatus: [bfPdForm.breastFeedingStatus, Validators.required],
    });
  }

  ngOnInit() {
    this.bfPostDischargeService.findByBabyCodeAndTimeOfBreastFeedingId(this.babyCode, this.navParams.data.menuItemId)
      .then(data => {
        this.displayExistingRecord(data);
      }).catch(error => {

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
    if(!this.postDischargeForm.valid){
      Object.keys(this.postDischargeForm.controls).forEach(field => {
        const control = this.postDischargeForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    } else {
      this.postDischargeForm.get('babyCode').setValue(this.babyCode);
      this.bfPostDischargeService.saveNewBfPostDischargeForm(this.postDischargeForm.value)
      .then(data=> {
        this.messageService.showSuccessToast("save successful!");
        this.navCtrl.pop();
      })
      .catch(err =>{
        this.messageService.showErrorToast(err)
      })
    }
  };

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SinglePatientSummaryServiceProvider } from '../../providers/single-patient-summary-service/single-patient-summary-service';
import { MessageProvider } from '../../providers/message/message';

/**
 * Generated class for the BasicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-basic',
  templateUrl: 'basic.html',
})
export class BasicPage {

  babyDetails: IBabyBasicDetails;
  typeDetails: ITypeDetails[];
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public spsService: SinglePatientSummaryServiceProvider, public messageService: MessageProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BasicPage');
  }
  ngOnInit(){
    debugger
    this.spsService.getTypeDetails()
      .subscribe(data => {
        this.typeDetails = data;
        this.babyDetails = this.spsService.setBabyDetails(this.navParams.data, this.typeDetails);
        console.log(this.babyDetails)
      }, err => {
        this.messageService.showErrorToast(err)
      });
  }

}

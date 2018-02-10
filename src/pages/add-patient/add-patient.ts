import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


/**
 * Generated class for the AddPatientPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-patient',
  templateUrl: 'add-patient.html',
})
export class AddPatientPage {



  headerTitle: any;
  today;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.headerTitle = this.navParams.get("param");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPatientPage');
  }

  customBackBUtton(){
    this.navCtrl.pop();
  }
  ngOnIniti(){
    this.today = new Date().toISOString();
  }

  // datepicker(){
  //   this.datePicker.show({
  //     date: new Date(),
  //     mode: 'date',
  //     androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
  //   }).then(
  //     date => console.log('Got date: ', date),
  //     err => console.log('Error occurred while getting date: ', err)
  //   );
  // }

}

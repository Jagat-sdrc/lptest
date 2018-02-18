import { Component } from '@angular/core';
import { NavController, MenuController, IonicPage } from 'ionic-angular';
/**
 * 
 * 
 * @export
 * @class HomePage
 * @author Ratikanta
 * @since 0.0.1
 */
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  registeredPatientPage : any;
  singlePatientSummary : any;
  vurnerableBabies : any;
  constructor(public navCtrl: NavController, public menuCtrl: MenuController) {

  }

  ngOnInit(){
    this.registeredPatientPage = 'RegisteredPatientPage';
    this.singlePatientSummary = 'SinglePatientSummaryPage';
    this.vurnerableBabies = 'VurnerableBabiesPage';
  }

  goToAddNewPatient(){
    this.navCtrl.push('AddPatientPage',{
      param: "Add New Patient"
    });
  }

}

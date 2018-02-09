import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { RegisteredPatientPage } from '../registered-patient/registered-patient';
import { SinglePatientSummaryPage } from '../single-patient-summary/single-patient-summary';
import { VurnerableBabiesPage } from '../vurnerable-babies/vurnerable-babies';
import { AddPatientPage } from '../add-patient/add-patient';

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
    this.registeredPatientPage = RegisteredPatientPage;
    this.singlePatientSummary = SinglePatientSummaryPage;
    this.vurnerableBabies = VurnerableBabiesPage;
  }

  goToAddNewPatient(){
    this.navCtrl.push(AddPatientPage,{
      param: "Add New Patient"
    });
  }

}

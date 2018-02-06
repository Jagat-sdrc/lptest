import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { AddNewPatientPage } from '../add-new-patient/add-new-patient';
import { RegisteredPatientPage } from '../registered-patient/registered-patient';
import { SinglePatientSummaryPage } from '../single-patient-summary/single-patient-summary';
import { VurnerableBabiesPage } from '../vurnerable-babies/vurnerable-babies';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  addNewPatientPage: any;
  registeredPatientPage : any;
  singlePatientSummary : any;
  vurnerableBabies : any;
  constructor(public navCtrl: NavController, public menuCtrl: MenuController) {

  }

  ngOnInit(){
    this.addNewPatientPage = AddNewPatientPage;
    this.registeredPatientPage = RegisteredPatientPage;
    this.singlePatientSummary = SinglePatientSummaryPage;
    this.vurnerableBabies = VurnerableBabiesPage;
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { BabyDashboardPage } from '../baby-dashboard/baby-dashboard';
import { AddPatientPage } from '../add-patient/add-patient';

/**
 * Generated class for the RegisteredPatientPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registered-patient',
  templateUrl: 'registered-patient.html',
})
export class RegisteredPatientPage {

  items: any;
  searchTerm: string = '';
  searchControl: FormControl;
  searching: any = false;
  temp: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public alertCtrl: AlertController) {
    this.searchControl = new FormControl();
    this.items = [
      {id: '1', slno: 'Sl No: 1', date: '02/06/2018', time: '19:14'},
      {id: '2', slno: 'Sl No: 2', date: '02/06/2018', time: '19:14'},
      {id: '3', slno: 'Sl No: 3', date: '02/06/2018', time: '19:14'},
      {id: '4', slno: 'Sl No: 4', date: '02/06/2018', time: '19:14'},
      {id: '5', slno: 'Sl No: 5', date: '02/06/2018', time: '19:14'},
      {id: '6', slno: 'Sl No: 6', date: '02/06/2018', time: '19:14'}    ]
    this.temp = this.items;
  }

  ionViewDidLoad() {
    this.setFilteredItems();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });
  }

  onSearchInput(){
    this.searching = true;
  }

  setFilteredItems() {
      this.items = this.filterItems(this.searchTerm);
  }

  filterItems(searchTerm){
    if(searchTerm){
      return this.items.filter((item) => {
        return item.id.indexOf(searchTerm) > -1;
    }); 
    } else {
        return this.temp;
    } 
  }

  goToBabyDashBoard(babyId: any){
    this.navCtrl.push(BabyDashboardPage,{
      param: babyId
    });
  }

  goToAddNewPatient(){
    this.navCtrl.push(AddPatientPage,{
      param: "Add New Patient"
    });
  }

  refresh(){
    
  }

  sorting(){
    // this.dataService.getTxnDataCount();
    let alert = this.alertCtrl.create({enableBackdropDismiss:false});
    alert.setTitle('Sort By');
    alert.addInput({
      type: 'radio',
      label: 'Delivery Date',
      value: 'Delivery Date'
    });
     alert.addInput({
      type: 'radio',
      label: 'Delivery Time',
      value: 'Delivery Time'
    });
    alert.addInput({
      type: 'radio',
      label: 'Weight',
      value: 'Weight'
    });
    alert.addInput({
      type: 'radio',
      label: 'Inborn Patient',
      value: 'Inborn Patient'
    });
    alert.addInput({
      type: 'radio',
      label: 'Outborn Patient',
      value: 'Outborn Patient'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => { 
           console.log("Sort by:"+ data);
      }
    });
    alert.present();
  }
}

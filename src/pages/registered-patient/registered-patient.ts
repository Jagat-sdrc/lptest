import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { BabyDashboardPage } from '../baby-dashboard/baby-dashboard';
import { AddPatientPage } from '../add-patient/add-patient';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../../providers/constant/constant';

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
  patientList: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public alertCtrl: AlertController,private storage: Storage) {
    this.searchControl = new FormControl();

    this.storage.get(ConstantProvider.dbKeyNames.patient).then((val) => {
      this.patientList = val;
      console.log(this.patientList);
    });
  }

  ionViewDidLoad() {
    this.setFilteredItems();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });
  }

  ngOnInit(){
    this.storage.get(ConstantProvider.dbKeyNames.patient).then((val) => {
      this.patientList = val;
      console.log(this.patientList);
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

import { RegisteredPatientServiceProvider } from './../../providers/registered-patient-service/registered-patient-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { BabyDashboardPage } from '../baby-dashboard/baby-dashboard';
import { AddPatientPage } from '../add-patient/add-patient';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../../providers/constant/constant';
import { MessageProvider } from '../../providers/message/message';

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
    public alertCtrl: AlertController,private storage: Storage, 
    private registeredPatientService: RegisteredPatientServiceProvider,
    private messageService: MessageProvider) {
    this.searchControl = new FormControl();

    this.storage.get(ConstantProvider.dbKeyNames.patient).then((val) => {
      this.patientList = val;
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

  goToBabyDashBoard(babyCode: string,babyCodeHospital: string){

    this.navCtrl.push(BabyDashboardPage,{
      babyCode: babyCode,
      babyCodeByHospital: babyCodeHospital
    });
  }

  goToAddNewPatient(){
    this.navCtrl.push(AddPatientPage,{
      param: "Add New Patient"
    });
  }

  refresh(){
    
  }

  /**
   * This method is going to help us deleting the given patient
   * @param babyCode The baby code of the patient to which we are going to delete
   */
  deletePatient(babyCode: string){
    
    this.registeredPatientService.deletePatient(babyCode)
    .then(data=>{
      this.messageService.showSuccessToast("Deleted successfully")
    })
    .catch(err=>{
      this.messageService.showErrorToast("Could not delete patient, error:" + err)
    })
    
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

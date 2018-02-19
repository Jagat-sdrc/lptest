import { RegisteredPatientServiceProvider } from './../../providers/registered-patient-service/registered-patient-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { ConstantProvider } from '../../providers/constant/constant';
import { MessageProvider } from '../../providers/message/message';
import 'rxjs/add/operator/debounceTime';

@IonicPage()
@Component({
  selector: 'page-registered-patient',
  templateUrl: 'registered-patient.html',
})
export class RegisteredPatientPage {

  searchTerm: string = '';
  searchControl: FormControl;
  patientList: any;
  sortBy: string;
  searching: any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public alertCtrl: AlertController,private registeredPatientService: RegisteredPatientServiceProvider,
    private messageService: MessageProvider) {    
  }

  ionViewWillEnter(){
    this.findAllPatients();
  }

  ngOnInit(){
    this.sortBy = ConstantProvider.patientSortBy.deliveryDate;
    this.searchControl = new FormControl();
  }


  ionViewDidLoad() { 
    this.setSearchedPatients();
    this.searchControl.valueChanges.debounceTime(700)
    .subscribe(search => {
      this.searching = false;
      this.setSearchedPatients();
    });
  }




  goToBabyDashBoard(babyCode: string,babyCodeHospital: string){

    this.navCtrl.push('BabyDashboardPage',{
      babyCode: babyCode,
      babyCodeByHospital: babyCodeHospital
    });
  }

  goToAddNewPatient(){
    this.navCtrl.push('AddPatientPage',{
      param: "Add New Patient"
    });
  }

  refresh(){
    this.sortBy = ConstantProvider.patientSortBy.deliveryDate;
    this.findAllPatients();
  }

  /**
   * This method is going to help us deleting the given patient
   * @param babyCode The baby code of the patient to which we are going to delete
   */
  deletePatient(babyCode: string){
    
    this.registeredPatientService.deletePatient(babyCode)
    .then(data=>{
      this.findAllPatients();
      this.messageService.showSuccessToast("Deleted successfully");
    })
    .catch(err=>{
      this.messageService.showErrorToast("Could not delete patient, error:" + err)
    })
    
  }

  /** 
   * This method will sort the data based on the sort by type.
   * 
   * @author Jagat Bandhu Sahoo
   * @since 0.0.1
  */
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
           switch(data){
             case "Delivery Date":
             this.sortBy = ConstantProvider.patientSortBy.deliveryDate
             break;
             case "Delivery Time":
             this.sortBy = ConstantProvider.patientSortBy.deliveryTime
             break;
             case "Weight":
             this.sortBy = ConstantProvider.patientSortBy.weight
             break;
             case "Inborn Patient":
             this.sortBy = ConstantProvider.patientSortBy.inbornPatient
             break;
             case "Outborn Patient":
             this.sortBy = ConstantProvider.patientSortBy.outbornPatient
             break;
           }
      }
    });
    alert.present();
  }

  /** 
   * This method will call to get the patient data from the database
   * 
   * @author Jagat Bandhu
   * @since 0.0.1
  */
  findAllPatients(){
    this.registeredPatientService.findAllPatients()
    .then(data=>{
      this.patientList = data;
    })
    .catch(err=>{
      this.messageService.showErrorToast(err);
    })
  }

  /** 
   * This method will help us getting searched patients
   * @author Ratikanta
   * @since 0.0.1
  */
  setSearchedPatients(){
    this.patientList = this.registeredPatientService.getSearchedPatients(this.searchTerm)
  }

  /** 
   * This will make the search sprinner visible
   * @author Ratikanta
   * @since 0.0.1
  */
  onSearchInput(){
    this.searching = true;
  }
}

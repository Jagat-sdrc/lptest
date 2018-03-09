import { RegisteredPatientServiceProvider } from './../../providers/registered-patient-service/registered-patient-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { ConstantProvider } from '../../providers/constant/constant';
import { MessageProvider } from '../../providers/message/message';
import 'rxjs/add/operator/debounceTime';
import { SortPatientPipe } from '../../pipes/sort-patient/sort-patient';

@IonicPage()
@Component({
  selector: 'page-registered-patient',
  templateUrl: 'registered-patient.html',
})
export class RegisteredPatientPage {

  searchTerm: string = '';
  searchControl: FormControl;
  patientList: IPatient[] = [];
  sortBy: string;
  searching: any = false;
  babyDashboardPage;
  singlePatientSummary;
  pageStatus: boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController,private registeredPatientService: RegisteredPatientServiceProvider,
    private messageService: MessageProvider, private menuCtrl: MenuController,
    private sortPatient: SortPatientPipe) {
  }

  ionViewWillEnter(){
    this.findAllPatients();
  }

  ionViewDidEnter() {
    this.searchTerm = "";
    this.menuCtrl.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
  }

  ngOnInit(){
    this.sortBy = ConstantProvider.patientSortBy.deliveryDateDescending;
    this.searchTerm = "";
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

  goToBabyDashBoard(babyCode: string,babyCodeHospital: string, deliveryDate: string,babyAllDetails: any){
    if((this.navParams.get('param') == "RegisteredPatientPage")){
      this.navCtrl.push('BabyDashboardPage',{
        babyCode: babyCode,
        babyCodeByHospital: babyCodeHospital,
        deliveryDate: deliveryDate
      });
    }else{
      this.navCtrl.push('SinglePatientSummaryPage',{
        babyAllDetails: babyAllDetails,
      });
    }
  }

  goToAddNewPatient(){
    this.navCtrl.push('AddPatientPage',{
      param: "Add New Patient"
    });
  }

  refresh(){
    this.sortBy = ConstantProvider.patientSortBy.deliveryDateDescending;
    this.searchTerm = "";
    this.findAllPatients();
  }

  /**
   * This method will sort the data based on the sort by type.
   *
   * @author Jagat Bandhu Sahoo
   * @since 0.0.1
  */
  sorting(){
    let alert = this.alertCtrl.create({enableBackdropDismiss:false});
    alert.setTitle('Sort By');
    alert.addInput({
      type: 'radio',
      label: 'Delivery Date (Ascending)',
      value: 'Delivery Date'
    });
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
           switch(data){
             case "Delivery Date":
             this.sortBy = ConstantProvider.patientSortBy.deliveryDateAscending
             break;
           }
           this.patientList = this.sortPatient.transform(this.patientList,this.sortBy);
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
      this.patientList = this.sortPatient.transform(this.patientList,this.sortBy);
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

   /**
   * This method is going to help us deleting the given patient
   * @param babyCode The baby code of the patient to which we are going to delete
   */
  deletePatient(babyCode: string){
    console.log("Delete");
    this.messageService.showAlert(ConstantProvider.messages.warning,ConstantProvider.messages.deletePatient).
    then((data)=>{
      if(data){
        this.registeredPatientService.deletePatient(babyCode)
        .then(data=>{
          this.findAllPatients();
          this.messageService.showSuccessToast("Deleted successfully");
        })
        .catch(err=>{
          this.messageService.showErrorToast("Could not delete patient, error:" + err)
        })
      }
    })
  }
}

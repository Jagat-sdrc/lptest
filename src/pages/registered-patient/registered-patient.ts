import { RegisteredPatientServiceProvider } from './../../providers/registered-patient-service/registered-patient-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { ConstantProvider } from '../../providers/constant/constant';
import { MessageProvider } from '../../providers/message/message';
import 'rxjs/add/operator/debounceTime';
import { SortPatientPipe } from '../../pipes/sort-patient/sort-patient';

/**
 * This component is used for registered patient
 *
 * @author Jagat Bandhu
 * @since 0.0.1
 */
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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController,private registeredPatientService: RegisteredPatientServiceProvider,
    private messageService: MessageProvider, private menuCtrl: MenuController,
    private sortPatient: SortPatientPipe) {
  }

  /**
   * It’s fired when entering a page, before it becomes the active one
   * find all the patients
   *
   * @author Jagat Bandhu
   * @since 0.0.1
   */
  ionViewWillEnter(){
    this.findAllPatients();
  }

  /**
   * Fired when entering a page, after it becomes the active page
   * initilize searchTerm and disable the swipe for the side menu
   *
   * @author Jagat Bandhu
   * @since 0.0.1
   */
  ionViewDidEnter() {
    this.searchTerm = "";
    this.menuCtrl.swipeEnable(false);
  }

  /**
   * Fired when you leave a page, before it stops being the active one.
   * enable the swipe for the side menu
   *
   * @author Jagat Bandhu
   * @since 0.0.1
   */
  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
  }

  /**
   * This method call up the initial load of registered patient page.
   * initialize the searchControl
   * initlalize blank the searchTerm
   * sort the patient list is descending order with respect to delivery date
   *
   * @author Jagat Bandhu
   * @since 0.0.1
   */
  ngOnInit(){
    this.sortBy = ConstantProvider.patientSortBy.deliveryDateDescending;
    this.searchTerm = "";
    this.searchControl = new FormControl();
  }

  /**
   * Fired only when a view is stored in memory
   * Initially, we set searching to be false, and we set it to be true when the user starts searching.
   * Once our observable triggers and we call the filter function, we set searching to be false again so
   * that the spinner is hidden.
   *
   * We are now importing FormControl and the debounceTime operator. We set up a new member variable called
   * searchControl, and then we create a new instance of Control and assign it to that. You will see how we
   * then tie that to the <ion-searchbar> in our template in just a moment. With the FormControl set up, we
   * can subscribe to the valueChanges observable that will emit some data every time that the value of the
   * input field changes. We don’t just listen for changes though, we also chain the debounceTime operator,
   * which allows us to specify a time that we want to wait before triggering the observable. If the value
   * changes again before the debounceTime has expired, then it won’t be triggered. This will stop the
   * setFilteredItems function from being spam called and, depending on how fast the user types, it should
   * only be called once per search. In this case, we are setting a debounceTime of 700 milliseconds, but
   * you can tweak this to be whatever you like.
   *
   * @author Jagat Bandhu
   * @since 0.0.1
   */
  ionViewDidLoad() {
    this.setSearchedPatients();
    this.searchControl.valueChanges.debounceTime(700)
    .subscribe(search => {
      this.searching = false;
      this.setSearchedPatients();
    });
  }

  /**
   * It’s fired when entering a page, before it becomes the active one
   * This method will navigate the user to BabyDashboardPage or SpsPage based on the input param
   *
   * @author Jagat Bandhu
   * @since 0.0.1
   * @param babyDetails
   */
  goToBabyDashBoard(babyDetails: any){
    if((this.navParams.get('param') == "RegisteredPatientPage")){
      this.navCtrl.push('BabyDashboardPage',babyDetails);
    }else{
      this.navCtrl.push('SpsPage',{
        babyDetails: babyDetails
      });
    }
  }

  /**
   * It’s fired when entering a page, before it becomes the active one
   * This method will navigate the user to AddPatientPage
   *
   * @author Jagat Bandhu
   * @since 0.0.1
   */
  goToAddNewPatient(){
    this.navCtrl.push('AddPatientPage',{
      param: "Add New Patient"
    });
  }

  /**
   * This method will call, when user will click the refresh icon on view to get the refresh list
   * make the search item field clear
   * sort the patient list is descending order with respect to delivery date
   *
   * @author Jagat Bandhu
   * @since 0.0.1
   */
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

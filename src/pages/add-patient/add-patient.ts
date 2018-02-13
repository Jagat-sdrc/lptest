import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';
import { Storage } from '@ionic/storage'
import { MessageProvider } from '../../providers/message/message';
import { AddNewPatientServiceProvider } from '../../providers/add-new-patient-service/add-new-patient-service';
import { ConstantProvider } from '../../providers/constant/constant';
import { DatePipe } from '@angular/common';

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
export class AddPatientPage implements OnInit{


  public patientForm: FormGroup;
  headerTitle: any;
  first_exp_time;
  delivery_date;
  delivery_time;
  deliveryMethods: ITypeDetails[];
  motherPrenatalMilk: ITypeDetails[];
  hmLactation: ITypeDetails[];
  inpatientOutpatient: ITypeDetails[];
  babyAdmittedTo: ITypeDetails[];
  nicuAdmission: ITypeDetails[];
  babyId: any;

  patient: IPatient;
  autoBabyId: any;
  countryName: string;
  stateName: string;
  institutionName: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private addNewPatientService: AddNewPatientServiceProvider,private datePipe: DatePipe,
    private messageService: MessageProvider,private storage: Storage) {
    
  }

  /**
   * This method will used for handle the custom back button
   * 
   * @author Jagat Bandhu
   */
  customBackBUtton(){
    this.navCtrl.pop();
  }

  ionViewDidLoad(){
    this.storage.get(ConstantProvider.dbKeyNames.country).then((val) => {
      this.countryName = val;
    });
    this.storage.get(ConstantProvider.dbKeyNames.state).then((val) => {
      this.stateName = val;
    });
    this.storage.get(ConstantProvider.dbKeyNames.institution).then((val) => {
      this.institutionName = val;
    });
  }

  ionViewDidEnter(){
    this.autoBabyId = this.countryName.charAt(0)+this.stateName.charAt(0)+
    this.institutionName.substring(0,3)+new Date().getMilliseconds();
    this.datePipe.transform(new Date(),"ddMMyyyy")
    console.log(this.autoBabyId);
    this.patientForm.controls.baby_id.setValue(this.autoBabyId);
  }
 /**
  * This method call up the initial load of add patient page.
   * date will be initialize
   * get all the options for all the dropdowns.
   * form control validation
   * 
   * @author Jagat Bandhu
  */
  ngOnInit() {

    this.headerTitle = this.navParams.get("param");

    this.first_exp_time = new Date().toISOString();
    this.delivery_date = new Date().toISOString();
    this.delivery_time = new Date().toISOString();

    //Getting delivery methods type details
    this.addNewPatientService.getDeliveryMethod()
    .subscribe(data =>{
      this.deliveryMethods = data
    }, err => {
      this.messageService.showErrorToast(err)
    });

    //Getting mother's prenatal milk type details
    this.addNewPatientService.getMotherParenatalMilk()
    .subscribe(data =>{
      this.motherPrenatalMilk = data
    }, err => {
      this.messageService.showErrorToast(err)
    });

    //Getting hmLactation type details
    this.addNewPatientService.getHmAndLactation()
    .subscribe(data =>{
      this.hmLactation = data
    }, err => {
      this.messageService.showErrorToast(err)
    });

    //Getting inpatient and outpatient type details
    this.addNewPatientService.getInpatientOutpatient()
    .subscribe(data =>{
      this.inpatientOutpatient = data
    }, err => {
      this.messageService.showErrorToast(err)
    });

    //Getting baby admitted to type details
    this.addNewPatientService.getBabyAdmittedTo()
    .subscribe(data =>{
      this.babyAdmittedTo = data
    }, err => {
      this.messageService.showErrorToast(err)
    });

    //Getting nicu admission reason type details
    this.addNewPatientService.getNICAdmissionReason()
    .subscribe(data =>{
      this.nicuAdmission = data
    }, err => {
      this.messageService.showErrorToast(err)
    });

    this.patientForm = new FormGroup({
      baby_id: new FormControl('', [Validators.required,Validators.minLength(6),Validators.minLength(6)]),
      hospital_baby_id: new FormControl(''),
      mother_name: new FormControl('', [Validators.required]),
      mother_age: new FormControl('', [Validators.required,Validators.minLength(2),Validators.maxLength(2)]),
      delivery_date: new FormControl('', [Validators.required]),
      delivery_time: new FormControl('', [Validators.required]),
      delivery_method: new FormControl('', [Validators.required]),
      baby_weight: new FormControl('', [Validators.required,Validators.maxLength(3),Validators.maxLength(3)]),
      gestational_age: new FormControl('', [Validators.required]),
      intent_provide_milk: new FormControl('', [Validators.required]),
      hm_lactation: new FormControl('', [Validators.required]),
      first_exp_time: new FormControl('', [Validators.required]),
      inpatient_outpatient: new FormControl('', [Validators.required]),
      admission_date: new FormControl('', [Validators.required]),
      baby_admitted: new FormControl('', [Validators.required]),
      nicu_admission: new FormControl('', [Validators.required]),
      });
    }

    

    _numberKeyPress(e,no) {
      if (e.target["value"].length > no) {
        e.target["value"] = e.target["value"].substring(0, e.target["value"].length - 1);
      }
     }

     /**
      * This method will save the patient data to the database
      * @author Jagat Bandhu
      * @since 0.0.1
      */
    save(){
      console.log(this.patientForm.controls.baby_id.value);

      //Initialize the add new patient object
      this.patient = {
        patientId: this.patientForm.controls.baby_id.value,
        babyCode: this.patientForm.controls.hospital_baby_id.value,
        mothersName: this.patientForm.controls.mother_name.value,
        mothersAge: this.patientForm.controls.mother_age.value,
        deliveryDate: this.patientForm.controls.delivery_date.value,
        deliveryTime: this.patientForm.controls.delivery_time.value,
        deliveryMethod: this.patientForm.controls.delivery_method.value.typeId,
        babysWeight: this.patientForm.controls.baby_weight.value,
        gestationalAge: this.patientForm.controls.gestational_age.value,
        intentProvideMilk: this.patientForm.controls.intent_provide_milk.value.typeId,
        hmLactation: this.patientForm.controls.hm_lactation.value.typeId,
        firstExpTime: this.patientForm.controls.first_exp_time.value,
        inpatientOutpatient: this.patientForm.controls.inpatient_outpatient.value.typeId,
        admissionDate: this.patientForm.controls.admission_date.value,
        babyAdmitted: this.patientForm.controls.baby_admitted.value.typeId,
        nicuAdmission: this.patientForm.controls.nicu_admission.value.typeId
      }

      this.addNewPatientService.saveNewPatient(this.patient)
        .then(data=> {
        this.messageService.showSuccessToast("save successful!")
      })
        .catch(err =>{
        this.messageService.showErrorToast((err as IDBOperationStatus).message)
      })
    }

}

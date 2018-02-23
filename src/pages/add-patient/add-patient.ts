import { ConstantProvider } from './../../providers/constant/constant';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';
import { MessageProvider } from '../../providers/message/message';
import { AddNewPatientServiceProvider } from '../../providers/add-new-patient-service/add-new-patient-service';
import { DatePipe } from '@angular/common';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { DatePicker } from '@ionic-native/date-picker';
import * as moment from 'moment';


/**
 * 
 * 
 * @export
 * @class AddPatientPage
 * @implements {OnInit}
 * @author Ratikanta
 * @since 0.0.1
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
  resetStatus: boolean = true;
  patient: IPatient;
  autoBabyId: any;
  countryName: string;
  stateName: string;
  institutionName: string;
  maxDate: any;
  maxTime: any;
  outPatientAdmissionStatus: boolean = false;
  paramToExpressionPage: IParamToExpresssionPage;
  forEdit: boolean;
  motherNameRegex: RegExp = /^[a-zA-Z][a-zA-Z\s\.]+$/;
  babyIdPattern: RegExp = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private addNewPatientService: AddNewPatientServiceProvider,private datePipe: DatePipe,
    private messageService: MessageProvider,private datePicker: DatePicker,
  private userService: UserServiceProvider) {
    
  }

  /**
   * This method will used for handle the custom back button
   * 
   * @author Jagat Bandhu
   * @since 0.0.1
   */
  customBackBUtton(){
    this.navCtrl.pop();
  }

  /**
   * This method will used for cancel the current page and redirect to previous page
   * 
   * @author Jagat Bandhu
   * @since 0.0.1
   */
  reset(){
    /**
     * This iteration will be used to untouch all the fields, because the user wants a new form.
     * @author - Naseem Akhtar
     */
    
    Object.keys(this.patientForm.controls).forEach(field => {
      this.resetStatus = false;
      const control = this.patientForm.get(field);
      control.markAsUntouched({onlySelf: true});
      control.markAsPristine({onlySelf: true});
    });
    this.patientForm.controls.hospital_baby_id.setValue(null)
    this.patientForm.controls.mother_name.setValue(null),
    this.patientForm.controls.mother_age.setValue(null),
    this.patientForm.controls.delivery_date.setValue(null),
    this.patientForm.controls.delivery_time.setValue(null),
    this.patientForm.controls.delivery_method.setValue(null),
    this.patientForm.controls.baby_weight.setValue(null),
    this.patientForm.controls.gestational_age.setValue(null),
    this.patientForm.controls.intent_provide_milk.setValue(null),
    this.patientForm.controls.hm_lactation.setValue(null),
    this.patientForm.controls.first_exp_time.setValue(null),
    this.patientForm.controls.inpatient_outpatient.setValue(""),
    this.patientForm.controls.admission_date.setValue(null),
    this.patientForm.controls.baby_admitted.setValue(null),
    this.patientForm.controls.nicu_admission.setValue(null)
  }
  
  ionViewDidEnter(){
    if(!(this.navParams.get('babyCode') == undefined)){
      this.forEdit = true;
      this.autoBabyId = this.patient.babyCode;
      this.setFetchedDataToUi();
    }else{
      this.autoBabyId = this.institutionName.substring(0,3).toUpperCase()+this.datePipe.transform(new Date(),"ddMMyyyy")+
      new Date().getMilliseconds();
      this.patientForm.controls.baby_id.setValue(this.autoBabyId);
    }
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

    if(!(this.navParams.get('babyCode') == undefined)){

      this.headerTitle = "Edit Patient"
      this.paramToExpressionPage = {
        babyCode: this.navParams.get('babyCode'),
        babyCodeByHospital: this.navParams.get('babyCodeByHospital')
      }
      this.addNewPatientService.findByBabyCode(this.paramToExpressionPage.babyCode)
      .then(data=>{
        this.patient = data      
      })
      .catch(err=>{
        this.messageService.showErrorToast(err)
      })

    } else {
      this.headerTitle = "Add New Patient";
      this.addNewPatientService.getInsitutionName(this.userService.getUser().institution)
      .subscribe(data =>{
         this.institutionName = data[0].name;
      }, err => {
        this.messageService.showErrorToast(err)
      });
    }



    this.maxDate = this.datePipe.transform(new Date(),"yyyy-MM-dd");
    this.maxTime = this.datePipe.transform(new Date(),"HH:mm");
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
      baby_id: new FormControl(''),
      hospital_baby_id: new FormControl('',Validators.pattern(this.babyIdPattern)),
      mother_name: new FormControl('', [Validators.required, Validators.pattern(this.motherNameRegex), Validators.maxLength(30)]),
      mother_age: new FormControl('', [Validators.required]),
      delivery_date: new FormControl('', [Validators.required]),
      delivery_time: new FormControl('', [Validators.required]),
      delivery_method: new FormControl('', [Validators.required]),
      baby_weight: new FormControl('', [Validators.required]),
      gestational_age: new FormControl('', [Validators.required]),
      intent_provide_milk: new FormControl('', [Validators.required]),
      hm_lactation: new FormControl('', [Validators.required]),
      first_exp_time: new FormControl('', [Validators.required]),
      inpatient_outpatient: new FormControl('', [Validators.required]),
      admission_date: new FormControl('', [Validators.required]),
      baby_admitted: new FormControl('', [Validators.required]),
      nicu_admission: new FormControl('', [Validators.required]),
      discharge_date: new FormControl(''),
      });
    }

    /**
     * This method will used to update the current time
     * 
     * @author Jagat Bandhu
     * @since 0.0.1
     */
    updateTime(){
      this.maxTime = this.datePipe.transform(new Date(),"HH:mm");
    }

    /**
     * This method will used to update the current time
     * 
     * @author Jagat Bandhu
     * @since 0.0.1
     */
    updateDate(){
      this.maxDate = this.datePipe.transform(new Date(),"yyyy-MM-dd");
    }

    _numberKeyPress(e,no) {
      if (e.target["value"].length > no) {
        e.target["value"] = e.target["value"].substring(0, e.target["value"].length - 1);
      }
     }

     outpatientAdmission(){
       if(this.patientForm.controls.inpatient_outpatient.value.id != undefined || this.patientForm.controls.inpatient_outpatient.value.id != null){
        if(this.patientForm.controls.inpatient_outpatient.value.id==ConstantProvider.typeDetailsIds.outbornPatient){
          this.outPatientAdmissionStatus = true;
         } else {
          this.outPatientAdmissionStatus = false;
          this.patientForm.controls.admission_date.setValue(null);
          this.patientForm.controls["admission_date"].setErrors(null);
         }
       }
     }

     validateMotherAge(){
      if (this.patientForm.controls.mother_age.value < 15 ||
        this.patientForm.controls.mother_age.value > 49) {
       this.messageService.showAlert(ConstantProvider.messages.warning,ConstantProvider.messages.motherAge)
       .then((data)=>{
         if(!data){
           this.patientForm.controls.mother_age.setValue(null);
         }
       })
      }
     }

     validateBabyWeight() {
       if (this.patientForm.controls.baby_weight.value < 500 ||
         this.patientForm.controls.baby_weight.value > 4000) {
        this.messageService.showAlert(ConstantProvider.messages.warning,ConstantProvider.messages.babyOverWeight)
        .then((data)=>{
          if(!data){
            this.patientForm.controls.baby_weight.setValue(null);
          }
        })
       }
     }

     validateGestational() {
      if (this.patientForm.controls.gestational_age.value < 28 ||
        this.patientForm.controls.gestational_age.value > 32) {
       this.messageService.showAlert(ConstantProvider.messages.warning,ConstantProvider.messages.babyGestational)
       .then((data)=>{
         if(!data){
           this.patientForm.controls.gestational_age.setValue(null);
         }
       })
      }
    }



     /**
      * This method will save the patient data to the database
      * @author Jagat Bandhu
      * @since 0.0.1
      */
     submit(){
      this.outpatientAdmission();
      // this.validateMotherAge();
      // this.validateBabyWeight();
      // this.validateGestational();
      if(!this.patientForm.valid){
        this.resetStatus = true;
        Object.keys(this.patientForm.controls).forEach(field => {
          const control = this.patientForm.get(field);
          control.markAsTouched({ onlySelf: true });
        });
      } else {
        this.resetStatus = false;
        let deliveryDate: string = this.patientForm.controls.delivery_date.value;
        if(this.forEdit){
          deliveryDate = this.datePipe.transform(new Date(deliveryDate), 'dd-MM-yyyy');
        }else{
          deliveryDate = deliveryDate.split('-')[2] + "-" + deliveryDate.split('-')[1] + "-" + deliveryDate.split('-')[0];
        }
        
        let admissionDateOfOutdoorPatient: string = this.patientForm.controls.admission_date.value;        
        if(admissionDateOfOutdoorPatient != null && admissionDateOfOutdoorPatient != undefined){

          if(this.forEdit){
            admissionDateOfOutdoorPatient = this.datePipe.transform(new Date(admissionDateOfOutdoorPatient), 'dd-MM-yyyy');
          }else{            
            admissionDateOfOutdoorPatient = admissionDateOfOutdoorPatient.split('-')[2] + "-" + admissionDateOfOutdoorPatient.split('-')[1] + "-" + admissionDateOfOutdoorPatient.split('-')[0];
          }
          
        }


        //Initialize the add new patient object
        this.patient = {
          babyCode: this.autoBabyId,
          babyCodeHospital: this.patientForm.controls.hospital_baby_id.value,
          babyOf: this.patientForm.controls.mother_name.value,
          mothersAge: parseInt(this.patientForm.controls.mother_age.value),
          deliveryDate: this.patientForm.controls.delivery_date.value,
          deliveryTime: this.patientForm.controls.delivery_time.value,
          deliveryMethod: this.patientForm.controls.delivery_method.value.id,
          babyWeight: parseFloat(this.patientForm.controls.baby_weight.value),
          gestationalAgeInWeek: parseInt(this.patientForm.controls.gestational_age.value),
          mothersPrenatalIntent: this.patientForm.controls.intent_provide_milk.value.id,
          parentsKnowledgeOnHmAndLactation: this.patientForm.controls.hm_lactation.value.id,
          timeTillFirstExpression: this.patientForm.controls.first_exp_time.value,
          inpatientOrOutPatient: this.patientForm.controls.inpatient_outpatient.value.id,
          admissionDateForOutdoorPatients: admissionDateOfOutdoorPatient,
          babyAdmittedTo: this.patientForm.controls.baby_admitted.value.id,
          nicuAdmissionReason: this.patientForm.controls.nicu_admission.value.id,
          dischargeDate: this.patientForm.controls.discharge_date.value.id,
          isSynced: false,
          syncFailureMessage: null,
          userId: this.userService.getUser().email

        }

        this.addNewPatientService.saveNewPatient(this.patient)
          .then(data=> {
          this.messageService.showSuccessToast("save successful!");
          this.navCtrl.pop();
        })
          .catch(err =>{
          this.messageService.showErrorToast(err)
        })
      }
    }


    /**
     * This method will set the value taken from the db to ui component.
     * 
     * @author Jagat Bandhu Sahoo
     * @since 0.0.1
     */   
    setFetchedDataToUi(){

      let day = parseInt(this.patient.deliveryDate.split('-')[0]);
      let month = parseInt(this.patient.deliveryDate.split('-')[1]);
      let year = parseInt(this.patient.deliveryDate.split('-')[2]);


      let deliveryDate: string = moment.utc(year+ "-"+ month+"-"+ day).toISOString()
      let admissionDateForOutdoorPatients: string= null;
      if(this.patient.admissionDateForOutdoorPatients != null){
        day = parseInt(this.patient.admissionDateForOutdoorPatients.split('-')[0]);
        month = parseInt(this.patient.admissionDateForOutdoorPatients.split('-')[1]);
        year = parseInt(this.patient.admissionDateForOutdoorPatients.split('-')[2]);
        admissionDateForOutdoorPatients = moment.utc(year+ "-"+ month+"-"+ day).toISOString()
      }
      this.patientForm = new FormGroup({
        baby_id: new FormControl(this.patient.babyCode),
        hospital_baby_id: new FormControl(this.patient.babyCodeHospital,Validators.pattern(this.babyIdPattern)),
        mother_name: new FormControl(this.patient.babyOf, [Validators.required,Validators.pattern(this.motherNameRegex), Validators.maxLength(30)]),
        mother_age: new FormControl(this.patient.mothersAge, [Validators.required]),
        delivery_date: new FormControl(this.patient.deliveryDate,[Validators.required]),
        delivery_time: new FormControl(this.patient.deliveryTime, [Validators.required]),
        delivery_method: new FormControl(this.deliveryMethods.filter(d=>(d.id===this.patient.deliveryMethod))[0], [Validators.required]),
        baby_weight: new FormControl(this.patient.babyWeight, [Validators.required]),
        gestational_age: new FormControl(this.patient.gestationalAgeInWeek, [Validators.required]),
        intent_provide_milk: new FormControl(this.motherPrenatalMilk.filter(d=>(d.id===this.patient.mothersPrenatalIntent))[0], [Validators.required]),
        hm_lactation: new FormControl(this.hmLactation.filter(d=>(d.id===this.patient.parentsKnowledgeOnHmAndLactation))[0], [Validators.required]),
        first_exp_time: new FormControl(this.patient.timeTillFirstExpression, [Validators.required]),
        inpatient_outpatient: new FormControl(this.inpatientOutpatient.filter(d=>(d.id===this.patient.inpatientOrOutPatient))[0], [Validators.required]),
        admission_date: new FormControl(admissionDateForOutdoorPatients == null?null: admissionDateForOutdoorPatients, [Validators.required]),
        baby_admitted: new FormControl(this.babyAdmittedTo.filter(d=>(d.id===this.patient.babyAdmittedTo))[0], [Validators.required]),
        nicu_admission: new FormControl(this.nicuAdmission.filter(d=>(d.id===this.patient.nicuAdmissionReason))[0], [Validators.required]),
        discharge_date: new FormControl(this.patient.dischargeDate),
      });
      this.outpatientAdmission();
    }

    datePickerDialog(type: string){
        this.datePicker.show({
        date: new Date(),
        maxDate: new Date(),
        allowFutureDates: false,
        mode: 'date',
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
      }).then(
        date => {
          switch(type){
            case "delivery":
              this.patientForm.controls.delivery_date.setValue(this.datePipe.transform(date,"dd-MM-yyyy"))
            break;
            case "addmission":
              this.patientForm.controls.admission_date.setValue(this.datePipe.transform(date,"dd-MM-yyyy"))
            break;
            case "discharge":
              this.patientForm.controls.discharge_date.setValue(this.datePipe.transform(date,"dd-MM-yyyy"))
            break;
          }
        },
        err => console.log('Error occurred while getting date: ', err)
      );
    }

    timePickerDialog(){
      this.datePicker.show({
      date: new Date(),
      mode: 'time',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      time => {
        this.patientForm.controls.delivery_time.setValue(this.datePipe.transform(time,"HH:mm"))
      },
      err => console.log('Error occurred while getting time: ', err)
      );
    }

    /**
     * This method is used to restrict the special character in the input field
     * 
     * @author Jagat Bandhu
     * @since 0.0.1
     * @param event 
     */
    omit_special_char(event){   
      var k;  
      k = event.charCode;  //         k = event.keyCode;  (Both can be used)
      return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
    }

}
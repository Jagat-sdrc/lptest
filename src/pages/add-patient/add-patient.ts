import { ConstantProvider } from './../../providers/constant/constant';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';
import { MessageProvider } from '../../providers/message/message';
import { AddNewPatientServiceProvider } from '../../providers/add-new-patient-service/add-new-patient-service';
import { DatePipe } from '@angular/common';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { DatePicker } from '@ionic-native/date-picker';


/**
 * This page is used to add new patient details, view the patient and edit the patient record.
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

  @ViewChild('ddate') ddate ;
  @ViewChild('dtime') dtime ;
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
  countryName: string;
  stateName: string;
  institutionName: string;
  outPatientAdmissionStatus: boolean = false;
  babyAdmittedToStatus: boolean = false;
  paramToExpressionPage: IParamToExpresssionPage;
  forEdit: boolean = false;
  motherNameRegex: RegExp = /^[a-zA-Z][a-zA-Z\s\.]+$/;
  alphaNumeric: RegExp = /^[-_ a-zA-Z0-9]+$/;
  numberRegex: RegExp = /^[0-9]+(\.[0-9]*){0,1}$/;
  hasError: boolean = false;
  private uniquePatientId : IUniquePatientId = {
    id: null,
    idNumber: null
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private addNewPatientService: AddNewPatientServiceProvider,private datePipe: DatePipe,
    private messageService: MessageProvider,private datePicker: DatePicker,
    private userService: UserServiceProvider, private menuCtrl: MenuController) {

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
    this.patientForm.controls.mother_name.setValue(null)
    this.patientForm.controls.mother_age.setValue(null)

    if(!this.forEdit){
      this.patientForm.controls.delivery_date.setValue(null)
      this.patientForm.controls.delivery_time.setValue(null)
    }

    this.patientForm.controls.delivery_method.setValue(null)
    this.patientForm.controls.baby_weight.setValue(null)
    this.patientForm.controls.gestational_age.setValue(null)
    this.patientForm.controls.intent_provide_milk.setValue(null)
    this.patientForm.controls.hm_lactation.setValue(null)
    this.patientForm.controls.first_exp_time_in_hour.setValue(null)
    this.patientForm.controls.first_exp_time_in_minute.setValue(null)
    this.patientForm.controls.inpatient_outpatient.setValue("")
    this.patientForm.controls.admission_date.setValue(null)
    this.patientForm.controls.baby_admitted.setValue(null)
    this.babyAdmittedToStatus = false
    this.patientForm.controls.nicu_admission.setValue(null)
    this.patientForm.controls.discharge_date.setValue(null)
  }

  /**
   * Fired when entering a page, after it becomes the active pages
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  ionViewDidEnter(){
    this.menuCtrl.swipeEnable(false);
    if(!(this.navParams.get('babyCode') == undefined)){
      this.forEdit = true;
      this.uniquePatientId.id = this.patient.babyCode;
      this.setFetchedDataToUi();
    }else{
      this.getUniquePatientId();
    }
  }

  /**
   * It’s fired when entering a page, before it becomes the active one
   * enable the swipe for the side menu
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   */
  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
  }

 /**
  * This method call up the initial load of add patient page.
   * date will be initialize
   * get all the options for all the dropdowns.
   * form control validation
   *
   * @author Jagat Bandhu
   * @since 1.0.0
  */
  ngOnInit() {
    if(!(this.navParams.get('babyCode') == undefined)){

      this.headerTitle = "Edit Patient"
      this.paramToExpressionPage = {
        babyCode: this.navParams.get('babyCode'),
        babyCodeByHospital: this.navParams.get('babyCodeByHospital'),
        deliveryDate: this.navParams.get('deliveryDate'),
        deliveryTime: null,
        dischargeDate: this.navParams.get('dischargeDate')
      }

      this.addNewPatientService.findByBabyCode(this.paramToExpressionPage.babyCode)
      .then(data=>{
        this.patient = data
      })
      .catch(err=>{
        this.messageService.showErrorToast(err)
      })

    } else {
      this.headerTitle = "Add Patient";
    }

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
      baby_id: new FormControl(null),
      hospital_baby_id: new FormControl(null, [Validators.pattern(this.alphaNumeric), Validators.maxLength(25)]),
      mother_name: new FormControl(null, [Validators.pattern(this.motherNameRegex), Validators.maxLength(30)]),
      mother_age: new FormControl(null),
      delivery_date: new FormControl(null,[Validators.required]),
      delivery_time: new FormControl(null,[Validators.required]),
      delivery_method: new FormControl(null),
      baby_weight: new FormControl(null),
      gestational_age: new FormControl(null),
      intent_provide_milk: new FormControl(null),
      hm_lactation: new FormControl(null),
      first_exp_time_in_hour: new FormControl(null,[Validators.pattern(this.numberRegex)]),
      first_exp_time_in_minute: new FormControl(null,[Validators.max(59)]),
      inpatient_outpatient: new FormControl(null),
      admission_date: new FormControl(null),
      baby_admitted: new FormControl(null),
      nicu_admission: new FormControl(null),
      discharge_date: new FormControl(null),
      });
    }

    /**
     * This method will take only nummber input for the respective field.
     *
     * @author Jagat Bandhu
     * @since 1.0.0
     */
     onlyNumberKey(event) {
       return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
      }

    /**
     * This method will make visible the Admission Date field based on the input of inpatient outpatient.
     *
     * @author Jagat Bandhu
     * @since 1.0.0
     */
     outpatientAdmission(){
       if(this.patientForm.controls.inpatient_outpatient.value != undefined && this.patientForm.controls.inpatient_outpatient.value != null){
        if(this.patientForm.controls.inpatient_outpatient.value==ConstantProvider.typeDetailsIds.outPatient){
          this.outPatientAdmissionStatus = true;
         } else {
          this.outPatientAdmissionStatus = false;
          this.patientForm.controls.admission_date.setValue(null);
          this.patientForm.controls["admission_date"].setErrors(null);
         }
       }
     }

    /**
     * This method will validate the mother age.
     *
     * @author Jagat Bandhu
     * @since 1.0.0
     */
     validateMotherAge(){
       if(!this.hasError){
        if (this.patientForm.controls.mother_age.value != "" && this.patientForm.controls.mother_age.value != null){
          if (this.patientForm.controls.mother_age.value < 14 ||
            this.patientForm.controls.mother_age.value > 60) {
            this.hasError = true;
           this.messageService.showAlert(ConstantProvider.messages.warning,ConstantProvider.messages.motherAge)
           .then((data)=>{
             if(!data){
               this.patientForm.controls.mother_age.setValue(null);
             }
             this.hasError = false;
           })
          }
        }
       }
     }

    /**
     * This method will validate the baby weight.
     *
     * @author Jagat Bandhu
     * @since 1.0.0
     */
     validateBabyWeight() {
      if(!this.hasError){
        if(this.patientForm.controls.baby_weight.value != "" && this.patientForm.controls.baby_weight.value != null){
          if (this.patientForm.controls.baby_weight.value < 400 ||
            this.patientForm.controls.baby_weight.value > 6000) {
              this.hasError = true;
           this.messageService.showAlert(ConstantProvider.messages.warning,ConstantProvider.messages.babyOverWeight)
           .then((data)=>{
             if(!data){
               this.patientForm.controls.baby_weight.setValue(null);
             }
             this.hasError = false;
           })
          }
         }
        }
      }

    /**
     * This method will validate the GEstational week.
     *
     * @author Jagat Bandhu
     * @since 1.0.0
     */
     validateGestational() {
      if(!this.hasError){
        if (this.patientForm.controls.gestational_age.value != "" && this.patientForm.controls.gestational_age.value != null){
          if (this.patientForm.controls.gestational_age.value < 38 ||
            this.patientForm.controls.gestational_age.value > 42) {
              this.hasError = true;
           this.messageService.showAlert(ConstantProvider.messages.warning,ConstantProvider.messages.babyGestational)
           .then((data)=>{
             if(!data){
               this.patientForm.controls.gestational_age.setValue(null);
             }
             this.hasError = false;
           })
          }
        }
      }
    }

    /**
    * This method will save the patient data to the database
    * @author Jagat Bandhu
    * @since 0.0.1
    */
    submit(){
      if(this.patientForm.controls.delivery_date.value == null){
        document.getElementById('ddate').scrollIntoView({behavior: 'smooth'})
      } else {
        if(this.patientForm.controls.delivery_time.value == null)
        document.getElementById('dtime').scrollIntoView({behavior: 'smooth'})
      }
      this.outpatientAdmission();
      this.babyAdmitedToCheck();
      if(this.validateDischargeDate()){
        if(!this.patientForm.valid){
          this.resetStatus = true;
          Object.keys(this.patientForm.controls).forEach(field => {
            const control = this.patientForm.get(field);
            control.markAsTouched({ onlySelf: true });
            // this.patientForm.controls.delivery_date.
          });
          this.messageService.showErrorToast(ConstantProvider.messages.allFieldMandatory)
        } else {
          this.resetStatus = false;

          //Initialize the add new patient object
          this.patient = {
            babyCode: this.uniquePatientId.id,
            babyCodeHospital: this.patientForm.controls.hospital_baby_id.value,
            babyOf: this.patientForm.controls.mother_name.value,
            mothersAge: parseInt(this.patientForm.controls.mother_age.value),
            deliveryDate: this.patientForm.controls.delivery_date.value,
            deliveryTime: this.patientForm.controls.delivery_time.value,
            deliveryMethod: this.patientForm.controls.delivery_method.value,
            babyWeight: parseFloat(this.patientForm.controls.baby_weight.value),
            gestationalAgeInWeek: parseInt(this.patientForm.controls.gestational_age.value),
            mothersPrenatalIntent: this.patientForm.controls.intent_provide_milk.value,
            parentsKnowledgeOnHmAndLactation: this.patientForm.controls.hm_lactation.value,
            timeTillFirstExpressionInHour: this.patientForm.controls.first_exp_time_in_hour.value,
            timeTillFirstExpressionInMinute: this.patientForm.controls.first_exp_time_in_minute.value,
            inpatientOrOutPatient: this.patientForm.controls.inpatient_outpatient.value,
            admissionDateForOutdoorPatients: this.patientForm.controls.admission_date.value,
            babyAdmittedTo: this.patientForm.controls.baby_admitted.value,
            nicuAdmissionReason: this.patientForm.controls.nicu_admission.value,
            dischargeDate: this.patientForm.controls.discharge_date.value,
            isSynced: false,
            syncFailureMessage: null,
            userId: this.userService.getUser().email,
            createdDate: null,
            updatedDate: null,
            uuidNumber: null
          }
          //save and update the patient to the db
          this.addNewPatientService.saveNewPatient(this.patient, this.uniquePatientId.idNumber)
            .then(data=> {
              if(this.forEdit){
                this.messageService.showSuccessToast(ConstantProvider.messages.updateSuccessfull);
              }else{
                this.messageService.showSuccessToast(ConstantProvider.messages.submitSuccessfull);
              }
            this.navCtrl.pop();
          })
            .catch(err =>{
            this.messageService.showErrorToast(err)
          })
        }
      }
    }

    /**
     * This method will set the value taken from the db to ui component.
     *
     * @author Jagat Bandhu Sahoo
     * @since 0.0.1
     */
    setFetchedDataToUi(){

      this.patientForm = new FormGroup({
        baby_id: new FormControl(this.patient.babyCode),
        hospital_baby_id: new FormControl(this.patient.babyCodeHospital, [Validators.pattern(this.alphaNumeric), Validators.maxLength(25)]),
        mother_name: new FormControl(this.patient.babyOf, [Validators.pattern(this.motherNameRegex), Validators.maxLength(30)]),
        mother_age: new FormControl(this.patient.mothersAge),
        delivery_date: new FormControl(this.patient.deliveryDate,[Validators.required]),
        delivery_time: new FormControl(this.patient.deliveryTime,[Validators.required]),
        delivery_method: new FormControl(this.patient.deliveryMethod),
        baby_weight: new FormControl(this.patient.babyWeight),
        gestational_age: new FormControl(this.patient.gestationalAgeInWeek),
        intent_provide_milk: new FormControl(this.patient.mothersPrenatalIntent),
        hm_lactation: new FormControl(this.patient.parentsKnowledgeOnHmAndLactation),
        first_exp_time_in_hour: new FormControl(this.patient.timeTillFirstExpressionInHour,[Validators.pattern(this.numberRegex)]),
        first_exp_time_in_minute: new FormControl(this.patient.timeTillFirstExpressionInMinute,[Validators.max(59)]),
        inpatient_outpatient: new FormControl(this.patient.inpatientOrOutPatient),
        admission_date: new FormControl(this.patient.admissionDateForOutdoorPatients == null?null: this.patient.admissionDateForOutdoorPatients),
        baby_admitted: new FormControl(this.patient.babyAdmittedTo),
        nicu_admission: new FormControl(this.patient.nicuAdmissionReason),
        discharge_date: new FormControl(this.patient.dischargeDate),
      });
      this.outpatientAdmission();
      this.babyAdmitedToCheck();
    }

    /**
     * This method will show a native date picker to select date
     *
     * @author Jagat Bandhu
     * @since 1.0.0
     */
    datePickerDialog(type: string){
      if(!this.hasError){
        this.datePicker.show({
          mode: 'date',
          date: new Date(),
          maxDate: new Date().valueOf(),
          androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
        }).then(
          date => {
            switch(type){
              case ConstantProvider.datePickerType.addmissionDate:
                this.patientForm.controls.admission_date.setValue(this.datePipe.transform(date,"dd-MM-yyyy"))
              break;
              case ConstantProvider.datePickerType.dischargeDate:
                this.patientForm.controls.discharge_date.setValue(this.datePipe.transform(date,"dd-MM-yyyy"))
              break;
            }
          },
          err => console.log('Error occurred while getting date: ', err)
        );
      }
    }

    /**
     * This method will show a native date picker to select a date
     *
     * @author Jagat Bandhu
     * @since 1.0.0
     */
    deliveryDatePicker(type: string){
      console.log("hi")
      if(!this.hasError){
        if(!this.forEdit){
          this.datePicker.show({
            mode: 'date',
            date: new Date(),
            minDate: new Date(new Date().getFullYear(),(new Date().getMonth()),(new Date().getDate())-89).valueOf(),
            maxDate: new Date().valueOf(),
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
          }).then(
            date => {
              switch(type){
                case ConstantProvider.datePickerType.deliveryDate:
                  this.patientForm.controls.delivery_date.setValue(this.datePipe.transform(date,"dd-MM-yyyy"));
                  if(this.patientForm.controls.delivery_time.value != ""){
                    this.patientForm.controls.delivery_time.setValue(null);
                  }
              }
            },
            err => console.log('Error occurred while getting date: ', err)
          );
        }
      }
    }

    /**
     * This method will show a native time picker to select a time
     *
     * @author Jagat Bandhu
     * @since 1.0.0
     */
    timePickerDialog(){
      if(!this.hasError){
        if(!this.forEdit){
          this.datePicker.show({
            date: new Date(),
            mode: 'time',
            is24Hour: true,
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
          }).then(
            time => {
              this.validateTime(time)
            },
            err => console.log('Error occurred while getting time: ', err)
            );
        }
      }
    }

    /**
     * This method is used to validate the discharge field that it should not the greater than the delivery date
     *
     * @author Jagat Bandhu
     * @since 0.0.1
     * @param event
     */
    validateDischargeDate(): boolean{
      if(this.patientForm.controls.discharge_date.value != "" && this.patientForm.controls.discharge_date.value != null){
        if(this.patientForm.controls.delivery_date.value != "" && this.patientForm.controls.delivery_date.value != null){

          let dateA = this.patientForm.controls.discharge_date.value;
          let dayA = parseInt(dateA.split('-')[0])
          let monthA = parseInt(dateA.split('-')[1])
          let yearA = parseInt(dateA.split('-')[2])

          let dateB = this.patientForm.controls.delivery_date.value;
          let dayB = parseInt(dateB.split('-')[0])
          let monthB = parseInt(dateB.split('-')[1])
          let yearB = parseInt(dateB.split('-')[2])

          let dateOfA: Date = new Date(yearA, monthA, dayA)
          let dateOfB: Date = new Date(yearB, monthB, dayB)

          if(dateOfA < dateOfB){
            this.patientForm.controls.discharge_date.setValue("");
            this.messageService.showErrorToast(ConstantProvider.messages.dischargeDateValidation)
            return false;
          }else{
            return true;
          }
        }else{
          return true;
        }
      }
      return true;
    }

    /**
     * This method will generate baby id
     *
     * @author Jagat Bandhu
     * @author Ratikanta
     * @since 1.0.0
    */
    async getUniquePatientId(){
      try{
        this.uniquePatientId = await this.addNewPatientService.getBabyId()
        this.patientForm.controls.baby_id.setValue(this.uniquePatientId.id);
      }catch(err){
        this.messageService.showErrorToast(err)
      }
    }

    /**
     * This method will make visible the Reason for NICU admission field based on the input field of baby admitted to.
     *
     * @author Jagat Bandhu
     * @since 1.0.0
     */
    babyAdmitedTo(){
      if(this.patientForm.controls.baby_admitted.value != undefined || this.patientForm.controls.baby_admitted.value != null){
        if(this.patientForm.controls.baby_admitted.value==ConstantProvider.typeDetailsIds.level3NICU ||
          this.patientForm.controls.baby_admitted.value==ConstantProvider.typeDetailsIds.level2SNCU ||
          this.patientForm.controls.baby_admitted.value==ConstantProvider.typeDetailsIds.level1NICU){
          this.patientForm.controls.nicu_admission.setValue(null);
          this.babyAdmittedToStatus = true;
         } else {
          this.babyAdmittedToStatus = false;
          this.patientForm.controls.nicu_admission.setValue(null);
          this.patientForm.controls["nicu_admission"].setErrors(null);
         }
       }
    }

    /**
     * This method will validate the question baby addmitted to and show hide the dependanecy question based
     * on the response of the baby addmitted to
     *
     * @author Jagat Bandhu
     * @since 1.0.0
     */
    babyAdmitedToCheck(){
      if(this.patientForm.controls.baby_admitted.value != undefined || this.patientForm.controls.baby_admitted.value != null){
        if(this.patientForm.controls.baby_admitted.value==ConstantProvider.typeDetailsIds.level3NICU ||
          this.patientForm.controls.baby_admitted.value==ConstantProvider.typeDetailsIds.level2SNCU ||
          this.patientForm.controls.baby_admitted.value==ConstantProvider.typeDetailsIds.level1NICU){
          this.babyAdmittedToStatus = true;
         } else {
          this.babyAdmittedToStatus = false;
          this.patientForm.controls.nicu_admission.setValue(null);
          this.patientForm.controls["nicu_admission"].setErrors(null);
         }
       }
    }

  /**
   * This method will validate the delivery time
   *
   * @author Jagat Bandhu
   * @since 1.0.0
   * @param time
   */
	validateTime(time){
      if(this.patientForm.controls.delivery_date.value != "" && this.patientForm.controls.delivery_date.value != null){
        if(this.patientForm.controls.delivery_date.value === this.datePipe.transform(new Date(),"dd-MM-yyyy") ){
          if(this.datePipe.transform(time,"HH:mm") > this.datePipe.transform(new Date(),"HH:mm")){
            this.patientForm.controls.delivery_time.setValue("")
            this.messageService.showErrorToast(ConstantProvider.messages.futureTime)
          }else{
            this.patientForm.controls.delivery_time.setValue(this.datePipe.transform(time,"HH:mm"))
          }
        }else{
          this.patientForm.controls.delivery_time.setValue(this.datePipe.transform(time,"HH:mm"))
        }
      }else{
        this.patientForm.controls.delivery_time.setValue(this.datePipe.transform(time,"HH:mm"))
      }
    }
}

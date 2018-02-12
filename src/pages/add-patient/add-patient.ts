import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { FormControl, FormGroup, Validators,ValidatorFn,AbstractControl } from '@angular/forms';
import { OnInit } from '@angular/core';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, private datePicker: DatePicker) {
    this.headerTitle = this.navParams.get("param");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPatientPage');
  }

  customBackBUtton(){
    this.navCtrl.pop();
  }
  ngOnIniti(){
    this.first_exp_time = new Date().toISOString();
    this.delivery_date = new Date().toISOString();
    this.delivery_time = new Date().toISOString();
  }
  ngOnInit() {
    //console.log(this.patientForm.invalid);
    this.patientForm = new FormGroup({
      baby_id: new FormControl('', [Validators.required,Validators.minLength(4)]),
      hospital_baby_id: new FormControl('', [Validators.required,Validators.minLength(6)]),
      mother_name: new FormControl('', [Validators.required]),
      mother_age: new FormControl('', [Validators.required,Validators.minLength(2),Validators.maxLength(2)]),
      delivery_date: new FormControl('', [Validators.required]),
      delivery_time: new FormControl('', [Validators.required]),
      delivery_method: new FormControl('', [Validators.required]),
      baby_weight: new FormControl('', [Validators.required,Validators.maxLength(2)]),
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

}

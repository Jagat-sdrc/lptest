import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms/src/model';

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
export class AddPatientPage {


  patientForm: FormGroup;
  headerTitle: any;
  first_exp_time;
  delivery_date;
  delivery_time;
  constructor(public navCtrl: NavController, public navParams: NavParams, private datePicker: DatePicker,
    private formBuilder: FormBuilder) {
    this.headerTitle = this.navParams.get("param");
    this.createForm();
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

  createForm(){
    this.patientForm = this.formBuilder.group({
      baby_id: ['', [Validators.required,Validators.minLength(6)]],
      hospital_baby_id: ['', [Validators.required,Validators.minLength(6)]],
      mother_name: ['', [Validators.required,Validators.pattern('/^[a-zA-Z\s]*$/')]],
      mother_age: ['', [Validators.required,Validators.minLength(2)]],
      delivery_date: ['', [Validators.required]],
      delivery_time: ['', [Validators.required]],
      delivery_method: ['', [Validators.required]],
      baby_weight: ['', [Validators.required,Validators.minLength(2)]],
      gestational_age: ['', [Validators.required]],
      intent_provide_milk: ['', [Validators.required]],
      hm_lactation: ['', [Validators.required]],
      first_exp_time: ['', [Validators.required]],
      inpatient_outpatient: ['', [Validators.required]],
      admission_date: ['', [Validators.required]],
      baby_admitted: ['', [Validators.required]],
      nicu_admission: ['', [Validators.required]],
    });
  }

}

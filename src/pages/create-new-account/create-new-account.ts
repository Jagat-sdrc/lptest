import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';
import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  MessageProvider
} from '../../providers/message/message';
import {
  NewAccountServiceProvider
} from '../../providers/new-account-service/new-account-service';
import {
  ConstantProvider
} from '../../providers/constant/constant';

/**
 * This is registration page component
 * @author Ratikanta
 * @author Jagat
 * @since 0.0.1
 * 
 * @export
 * @class CreateNewAccountPage
 */
@IonicPage()
@Component({
  selector: 'page-create-new-account',
  templateUrl: 'create-new-account.html',
})
export class CreateNewAccountPage {

  public userForm: FormGroup;
  user: IUser = {
    firstName: null,
    lastName: null,
    email: null,
    institution: null,
    country: null,
    state: null,
    district: null,
    isSynced: false,
    syncFailureMessage: null
  }
  firstNamePattern: RegExp = /^[a-zA-Z][a-zA-Z\.]+$/;
  lastNamePattern: RegExp = /^[a-zA-Z]{0,25}$/;
  emailPattern: RegExp = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  // emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  areas: IArea[];
  countries: IArea[];
  states: IArea[];
  districts: IArea[];
  institutes: IArea[];
  countryStatus: boolean = true;
  districtStatus: boolean = true;
  institutionStatus: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private messageService: MessageProvider, public newAccountServiceProvider: NewAccountServiceProvider) {}

  ngOnInit() {

    //Getting all areas
    this.newAccountServiceProvider.getAllAreas()
      .subscribe(data => {
        this.areas = data
        this.countries = this.areas.filter(d => d.areaLevel === ConstantProvider.areaLevels.country)
      }, err => {
        this.messageService.showErrorToast(err)
      });

    this.userForm = new FormGroup({
      first_name: new FormControl('', [Validators.required, Validators.pattern(this.firstNamePattern)]),
      last_name: new FormControl('', [Validators.required, Validators.pattern(this.lastNamePattern)]),
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      country: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
      institution: new FormControl('', [Validators.required]),
    });
  }

  /**
   * This method will show the error message if user will select the state wihtout selecting the country
   * 
   * @author Jagat Bandhu
   * @since 0.0.1
   */
  onClickState(){
    if(this.userForm.controls.country.value == ""){
      this.messageService.showErrorToast(ConstantProvider.messages.stateAlert);
    }
  }

  /**
   * This method will show the error message if user will select the district wihtout selecting the state
   * 
   * @author Jagat Bandhu
   * @since 0.0.1
   */
  onClickDistrict(){
    if(this.userForm.controls.state.value == ""){
      this.messageService.showErrorToast(ConstantProvider.messages.districtAlert);
    }
  }

  /**
   * This method will show the error message if user will select the institution wihtout selecting the district
   * 
   * @author Jagat Bandhu
   * @since 0.0.1
   */
  onClickInstitution(){
    if(this.userForm.controls.district.value == ""){
      this.messageService.showErrorToast(ConstantProvider.messages.institutionAlert);
    }
  }

  /**
   * This method will save the deo data to the database
   * 
   * @author Jagat Bandhu
   * @since 0.0.1
   */
  save() {
    if (!this.userForm.valid) {
      Object.keys(this.userForm.controls).forEach(field => {
        const control = this.userForm.get(field);
        control.markAsTouched({
          onlySelf: true
        });
      });
    } else {
      //Initialize the add new patient object
      this.user = {
        firstName: this.userForm.controls.first_name.value,
        lastName: this.userForm.controls.last_name.value,
        email: this.userForm.controls.email.value,
        institution: this.user.institution,
        country: this.user.country,
        state: this.user.state,
        district: this.user.district,
        isSynced: false,
        syncFailureMessage: null
      }

      this.newAccountServiceProvider.saveNewUser(this.user)
        .then(data => {
          this.messageService.showOkAlert(ConstantProvider.messages.saveSuccessfull,ConstantProvider.messages.forgotPasswordMessage)
          .then(()=>{
            this.navCtrl.pop();
          })
        })
        .catch(err => {
          this.messageService.showErrorToast(err)
        })
    }
  }
  /**
   * This method is going to get executed when country is selected
   * @author Ratikanta
   * @since 0.0.1 
   * @param {IArea} country 
   * @memberof CreateNewAccountPage
   */
  countrySelected(country: IArea) {
    this.user.country = country.id;
    this.states = this.areas.filter(d => d.parentAreaId === country.id)
    this.countryStatus = false;
  }

  /**
   * This method is going to get executed when state is selected
   * @author Ratikanta
   * @since 0.0.1 
   * @param {IArea} state
   * @memberof CreateNewAccountPage
   */
  stateSelected(state: IArea) {
    this.user.state = state.id;
    this.districts = this.areas.filter(d => d.parentAreaId === state.id)
    this.districtStatus  = false;
  }


  /**
   * This method is going to get executed when district is selected
   * @author Ratikanta
   * @since 0.0.1 
   * @param {IArea} district
   * @memberof CreateNewAccountPage
   */
  districtSelected(district: IArea) {
    this.user.district = district.id;
    this.institutes = this.areas.filter(d => d.parentAreaId === district.id)
    this.institutionStatus = false;
  }

  /**
   * This method is going to get executed when institution is selected
   * @author Ratikanta
   * @since 0.0.1 
   * @param {IArea} institution
   * @memberof CreateNewAccountPage
   */
  instituteSelected(institution: IArea) {
    this.user.institution = institution.id;
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

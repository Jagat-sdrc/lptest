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
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  areas: IArea[];
  countries: IArea[];
  states: IArea[];
  districts: IArea[];
  institutes: IArea[];

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
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      country: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
      institution: new FormControl('', [Validators.required]),
    });


  }

  /**
   * This method will save the deo data to the database
   * 
   * @author Jagat Bandhu
   * @since 0.0.1
   */
  submit() {
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
          this.messageService.showSuccessToast(ConstantProvider.messages.registrationSuccessful);
          this.navCtrl.pop();
        })
        .catch(err => {
          this.messageService.showErrorToast((err as IDBOperationStatus).message)
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

}

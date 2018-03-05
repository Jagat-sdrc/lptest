import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  MenuController,
  AlertController
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
    syncFailureMessage: null,
    createdDate: null,
    updatedDate: null
  }
  namePattern: RegExp = /^[a-zA-Z][a-zA-Z\s\.]+$/;
  emailPattern: RegExp = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  // emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  areas: IArea[];
  countries: IArea[];
  states: IArea[];
  districts: IArea[];
  institutes: IArea[];
  countryStatus: boolean = false;
  stateStatus: boolean = true;
  districtStatus: boolean = true;
  institutionStatus: boolean = true;

  selectCountryOptions: any;
  selectStateOptions: any;
  selectDistrictOptions: any;
  selectInstituteOptions: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public menuCtrl: MenuController,
    private messageService: MessageProvider, public createNewAccountService: NewAccountServiceProvider,
    private alertCtrl: AlertController) {}


  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
  }

  ngOnInit() {
    //Getting all areas
    this.createNewAccountService.getAllAreas()
      .subscribe(data => {
        this.areas = data
        console.log(this.areas);
        this.countries = this.areas.filter(d => d.areaLevel === ConstantProvider.areaLevels.country)
        console.log(this.countries)
      }, err => {
        this.messageService.showErrorToast(err)
      });

      this.selectCountryOptions = {
        title: ConstantProvider.messages.selectCountry
      }

      this.selectStateOptions = {
        title: ConstantProvider.messages.selectState
      }

      this.selectDistrictOptions = {
        title: ConstantProvider.messages.selectDistrict
      }

      this.selectInstituteOptions = {
        title: ConstantProvider.messages.selectInstitute
      }

      this.createNewAccountService.getFirstUser()
      .then(data=>{
        if(data != null){
          console.log(data)
          this.countrySelected((data as IUser).country);
          this.stateSelected((data as IUser).state);
          this.districtSelected((data as IUser).district);
          this.instituteSelected((data as IUser).institution);
          this.userForm.controls.country.setValue((data as IUser).country);
          this.userForm.controls.state.setValue((data as IUser).state);
          this.userForm.controls.district.setValue((data as IUser).district);
          this.userForm.controls.institution.setValue((data as IUser).institution);
          this.countryStatus = true;
          this.stateStatus = true;
          this.districtStatus = true;
          this.institutionStatus = true;
        }else{
          console.log("no data")
        }
      })

    this.userForm = new FormGroup({
      first_name: new FormControl('', [Validators.required, Validators.pattern(this.namePattern)]),
      last_name: new FormControl('', [Validators.required, Validators.pattern(this.namePattern)]),
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
        country: this.userForm.controls.country.value,
        state: this.userForm.controls.state.value,
        district: this.userForm.controls.district.value,
        institution:  this.userForm.controls.institution.value,
        isSynced: false,
        syncFailureMessage: null,
        createdDate: null,
        updatedDate: null
      }

      this.createNewAccountService.saveNewUser(this.user)
        .then(data => {
          this.messageService.showSuccessToast(ConstantProvider.messages.submitSuccessfull);
          this.showConfirmAlert();
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
   * @memberof CreateNewAccountPage
   */
  countrySelected(id?:any) {
    if(id != undefined && id != null){
      this.user.country = id;
    }else{
      this.user.country = this.userForm.controls.country.value;
    }
    this.states = this.areas.filter(d => d.parentAreaId === this.user.country)
    this.stateStatus = false;
    this.userForm.controls.state.setValue(null);
    this.userForm.controls.district.setValue(null);
    this.userForm.controls.institution.setValue(null);
  }

  /**
   * This method is going to get executed when state is selected
   * @author Ratikanta
   * @since 0.0.1
   * @param {IArea} state
   * @memberof CreateNewAccountPage
   */
  stateSelected(id?:any) {
    if(id != undefined && id != null){
      this.user.state = id;
    }else{
      this.user.state = this.userForm.controls.state.value;
    }
    this.districts = this.areas.filter(d => d.parentAreaId === this.user.state)
    this.districtStatus  = false;
    this.userForm.controls.district.setValue(null);
    this.userForm.controls.institution.setValue(null);
  }


  /**
   * This method is going to get executed when district is selected
   * @author Ratikanta
   * @since 0.0.1
   * @param {IArea} district
   * @memberof CreateNewAccountPage
   */
  districtSelected(id?:any) {
    if(id != undefined && id != null){
      this.user.district = id;
    }else{
      this.user.district = this.userForm.controls.district.value;
    }
    this.institutes = this.areas.filter(d => d.parentAreaId === this.user.district)
    this.institutionStatus = false;
    this.userForm.controls.institution.setValue(null);
  }

  /**
   * This method is going to get executed when institution is selected
   * @author Ratikanta
   * @since 0.0.1
   * @param {IArea} institution
   * @memberof CreateNewAccountPage
   */
  instituteSelected(id?:any) {
    if(id != undefined && id != null){
      this.user.institution = id;
    }else{
      this.user.institution = this.userForm.controls.institution.value;
    }
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

  /**
   * This method is used to find the duplicate email id.
   *
   * @author Jagat Bandhu
   * @since 0.0.1
   */
  validateEmailId(){
    this.createNewAccountService.validateEmailId(this.userForm.controls.email.value)
    .then((data)=>{
      if(!data){
        this.userForm.controls.email.setValue(null);
        this.messageService.showErrorToast(ConstantProvider.messages.emailIdExists)
      }
    })
  }

  /**
   * This method will show a success alert with some pre-define message with checkbox for confirmation
   * that user has noted the email id to get the password.
   *
   * @author Jagat Bandhu
   * @since 0.0.1
   */
  showConfirmAlert(){
    let confirm = this.alertCtrl.create({
      enableBackdropDismiss: false,
      title: ConstantProvider.messages.important,
      message: ConstantProvider.messages.forgotPasswordMessage,
      inputs: [
        {
          type: 'checkbox',
          label: ConstantProvider.messages.emailNoted,
          checked: false,
          value: 'unchecked',
          handler: (data)=>{
            if(data.checked === true)
              data.value = 'checked';
          }
        },
      ],
      buttons: [
        {
          text: 'Ok',
          handler: (data) => {
            if(data.length === 0){
            this.messageService.showErrorToast(ConstantProvider.messages.selectCheckBox)
              return false;
              }
              else
              this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
  }

}

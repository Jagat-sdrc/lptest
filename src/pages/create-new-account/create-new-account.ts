import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageProvider } from '../../providers/message/message';
import { NewAccountServiceProvider } from '../../providers/new-account-service/new-account-service';

/**
 * Generated class for the CreateNewAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-new-account',
  templateUrl: 'create-new-account.html',
})
export class CreateNewAccountPage {

  public userForm: FormGroup;
  user: IUser;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private messageService: MessageProvider, public newAccountServiceProvider: NewAccountServiceProvider) {
  }

  ngOnInit(){
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

  getCountry(){
    alert("hiiii");
  }

  getState(){

  }

  getDistrict(){

  }

  getInstitutionName(){
    
  }

  /**
    * This method will save the deo data to the database
    * 
    * @author Jagat Bandhu
    * @since 0.0.1
    */
  submit(){
    console.log(this.userForm);
      if(!this.userForm.valid){
        Object.keys(this.userForm.controls).forEach(field => { // {1}
          const control = this.userForm.get(field);            // {2}
          control.markAsTouched({ onlySelf: true });       // {3}
        });
      } else {
        //Initialize the add new patient object
        this.user = {
          firstName: this.userForm.controls.first_name.value,
          lastName: this.userForm.controls.last_name.value,
          emailAddress: this.userForm.controls.email.value,
          country: this.userForm.controls.country.value,
          state: this.userForm.controls.state.value,
          district: this.userForm.controls.district.value,
          institution: this.userForm.controls.institution.value,
        }

        this.newAccountServiceProvider.saveNewUser(this.user)
          .then(data=> {
          this.messageService.showSuccessToast("Created successful!");
          this.navCtrl.pop();
        })
          .catch(err =>{
          this.messageService.showErrorToast((err as IDBOperationStatus).message)
        })
      }
  }

}

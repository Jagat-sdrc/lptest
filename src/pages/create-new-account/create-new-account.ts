import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageProvider } from '../../providers/message/message';
import { NewAccountServiceProvider } from '../../providers/new-account-service/new-account-service';
import { ConstantProvider } from '../../providers/constant/constant';

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

  /**
    * This method will save the deo data to the database
    * 
    * @author Jagat Bandhu
    * @since 0.0.1
    */
  submit(){
    console.log(this.userForm);
      if(!this.userForm.valid){
        Object.keys(this.userForm.controls).forEach(field => {
          const control = this.userForm.get(field);           
          control.markAsTouched({ onlySelf: true });       
        });
      } else {
        //Initialize the add new patient object
        this.user = {
          firstName: this.userForm.controls.first_name.value,
          lastName: this.userForm.controls.last_name.value,
          email: this.userForm.controls.email.value,
          institution: 1,
          country: 1,
          state: 1,
          district: 1,          
          isSynced: false,
          syncFailureMessage: null
        }

        this.newAccountServiceProvider.saveNewUser(this.user)
          .then(data=> {
          this.messageService.showSuccessToast(ConstantProvider.messages.registrationSuccessful);
          this.navCtrl.pop();
        })
          .catch(err =>{
          this.messageService.showErrorToast((err as IDBOperationStatus).message)
        })
      }
  }

}

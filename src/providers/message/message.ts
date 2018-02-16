import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

/**
 * This service we only use to show messages
 * @author Ratikanta
 * @since 0.0.1
 */
@Injectable()
export class MessageProvider {
static messages:any={
  ENTER_DATE_OF_EXPRESSION:'Please enter date of expression',
  ENTER_TIME_OF_EXPRESSION:'Please enter time of expression',
  ENTER_TYPE_OF_EXPRESSION:'Please enter method of expression',
  ENTER_LOC_OF_EXPRESSION:'Please enter location of expression',
  ENTER_VOLUME_OF_MILK_FROM_LEFT:'Please enter volume of milk expressed from left',
  ENTER_VOLUME_OF_MILK_FROM_RIGHT:'Please enter volume of milk expressed from right',
  ENTER_VALID_VOLUME_OF_MILK:'Please enter the volume of milk expressed from left breast (in ml, range 0-300)'
}
  constructor(private toastCtrl: ToastController) {}


  /**
   * This method will be used to show success toast to user
   * @author Ratikanta
   * @param message The message we want to show the user
   * @since 0.0.1
   */
  showSuccessToast(message: string){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000      
    });
    toast.present();
  }

  /**
   * This method will be used to show error toast to user
   * @author Ratikanta
   * @param message The message we want to show the user
   * @since 0.0.1
   */
  showErrorToast(message: string){
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      duration: 5000    
    });
    toast.present();
  }

}

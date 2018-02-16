import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from 'ionic-angular';

/**
 * This service we only use to show messages
 * @author Ratikanta
 * @author Subhadarshani
 * @since 0.0.1
 */
@Injectable()
export class MessageProvider {
  loading;
  static messages:any={
    ENTER_DATE_OF_EXPRESSION:'Please enter date of expression',
    ENTER_TIME_OF_EXPRESSION:'Please enter time of expression',
    ENTER_TYPE_OF_EXPRESSION:'Please enter method of expression',
    ENTER_LOC_OF_EXPRESSION:'Please enter location of expression',
    ENTER_VOLUME_OF_MILK_FROM_LEFT:'Please enter volume of milk expressed from left',
    ENTER_VOLUME_OF_MILK_FROM_RIGHT:'Please enter volume of milk expressed from right',
    ENTER_VALID_VOLUME_OF_MILK:'Please enter the volume of milk expressed from left breast (in ml, range 0-300)'
  };

  /**
   * This static variable will be used to interact with server for synchronization and other purposes.
   * @author Naseem Akhtar (naseem@sdrc.co.in)
   * @since 0.0.1
   */
  static serverUrls:any = {
    SERVER_STATUS: 'http://localhost:8080/serverStatus',
    SYNCHRONIZE: 'http://localhost:8080/sync'
  };

  constructor(private toastCtrl: ToastController, private loadingCtrl: LoadingController) {}

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
      showCloseButton: true     
    });
    toast.present();
  }

  /**
   * This method will display loader above the page which is being rendered
   * @author Naseem Akhtar (naseem@sdrc.co.in)
   * @since 0.0.1
   */
  showLoader() {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait...',
    });
    
    this.loading.present();
  }

  stopLoader(){
    this.loading.dismiss();
  }

}

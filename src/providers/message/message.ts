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
      showCloseButton: true,
      duration: 5000    
    });
    toast.present();
  }

  /**
   * This method will display loader above the page which is being rendered
   * @author Naseem Akhtar (naseem@sdrc.co.in)
   * @author Ratikanta
   * @param message The message which we want to show the user
   * @since 0.0.1
   */
  showLoader(message: string) {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: message,
    });
    
    this.loading.present();
  }

  stopLoader(){
    this.loading.dismiss();
  }

}

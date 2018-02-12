import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

/**
 * This service we only use to show messages
 * @author Ratikanta
 * @since 0.0.1
 */
@Injectable()
export class MessageProvider {

  constructor(private toastCtrl: ToastController) {}

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

}

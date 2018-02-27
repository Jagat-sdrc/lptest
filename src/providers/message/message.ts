import { Injectable } from '@angular/core';
import { ToastController, LoadingController, AlertController } from 'ionic-angular';

/**
 * This service we only use to show messages
 * @author Ratikanta
 * @author Subhadarshani
 * @since 0.0.1
 */
@Injectable()
export class MessageProvider {
  loading;

  constructor(private toastCtrl: ToastController, private loadingCtrl: LoadingController,
  private alertCtrl: AlertController) {}

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

  showAlert(title: string, message: string): Promise<boolean>{
    let promise: Promise<boolean> = new Promise((resolve, reject)=>{
      let confirm = this.alertCtrl.create({
        enableBackdropDismiss: false,
        title: title,
        message: message,
        buttons: [
          {
            text: 'No',
            handler: () => {
              resolve(false)
            }
          },
          {
            text: 'Yes',
            handler: () => {
              resolve(true)
            }
          }
        ]
      });
      confirm.present();
    })
    return promise;
  }

  showOkAlert(title: string, message: string): Promise<any>{
    let promise= new Promise((resolve, reject)=>{
      let confirm = this.alertCtrl.create({
        enableBackdropDismiss: false,
        title: title,
        message: message,
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              resolve()
            }
          }
        ]
      });
      confirm.present();
    })
    return promise;
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { MessageProvider } from '../message/message';

/*
  Generated class for the SynchronizationServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SynchronizationServiceProvider {

  constructor(public http: HttpClient, private messageProvider: MessageProvider,
    private alertController: AlertController) {
    console.log('Hello SynchronizationServiceProvider Provider');
  }

  fetchDataFromDbAndValidateForSync(){
    this.http.get('assets/synchronizationDemo.json').subscribe(data => {
      this.sendDataToTheServer(data);
    }, error =>{
      console.log(error);
    });
  }

  sendDataToTheServer(patientsData: Object){
    this.http.get(MessageProvider.serverUrls.SERVER_STATUS).subscribe(data => {
      this.http.post(MessageProvider.serverUrls.SYNCHRONIZE, patientsData).subscribe(data => {
        this.displaySynchronizationStatus();
      }, error => {
        this.messageProvider.stopLoader();
        console.log(error);
      });
    }, error => {
      this.messageProvider.stopLoader();
      console.log(error);
    });
  };

  displaySynchronizationStatus(){
    let i = 2;
    let alert = this.alertController.create({
      title: 'Sync Report',
      cssClass: 'syncModal',
      subTitle: `
      <div class="reportBody">
        <h5>Facility form(s) synced : {{i}} + </h5><br>
        <h5>Facility form(s) synced : {{i}} + </h5><br>
        <h5>Facility form(s) synced : {{i}} + </h5><br>
        <h5>Facility form(s) synced : {{i}} + </h5><br>
      </div>
      `,
      buttons: ['OK']
    });
    alert.present();
    this.messageProvider.stopLoader();
  };

}

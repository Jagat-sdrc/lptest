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
        this.displaySynchronizationStatus(data);
      }, error => {
        this.messageProvider.stopLoader();
        console.log(error);
      });
    }, error => {
      this.messageProvider.stopLoader();
      console.log(error);
    });
  };

  displaySynchronizationStatus(data: any){
    let alert = this.alertController.create({
      title: 'Sync Report',
      cssClass: 'syncModal',
      message: '<div class="reportBody">'+
        '<h5>Users synced : '+ data.usersSynced +'</h5><br>'+
        '<h5>Users rejected : '+ data.usersFailed +'</h5><br>'+
        '<h5>Babies synced : '+ data.patientsSynced +'</h5><br>'+
        '<h5>Babies rejected : '+ data.patientsFailed +'</h5><br>'+
        '<h5>Bf exp synced : '+ data.bfExpressionSynced +'</h5><br>'+
        '<h5>Bf exp failed : '+ data.bfExpressionFailed +'</h5><br>'+
        '<h5>Feed synced : '+ data.logFeedSynced +'</h5><br>'+
        '<h5>Feed failed : '+ data.logFeedFailed +'</h5><br>'+
        '<h5>Bf supp. practice synced : '+ data.bfSupportivePracticeSynced +'</h5><br>'+
        '<h5>Bf supp. practice failed : '+ data.bfSupportivePracticeFailed +'</h5><br>'+
        '<h5>Bf post discharge synced : '+ data.bfPostDischargeSynced +'</h5><br>'+
        '<h5>Bf post discharge failed : '+ data.bfPostDischargeFailed +'</h5><br>'+
      '</div>',
      buttons: ['OK']
    });
    alert.present();
    this.messageProvider.stopLoader();
  };

}

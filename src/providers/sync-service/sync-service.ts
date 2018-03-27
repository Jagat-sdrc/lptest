import {
  Observable
} from 'rxjs/Observable';
import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  AlertController
} from 'ionic-angular';
import {
  MessageProvider
} from '../message/message';
import {
  Storage
} from '@ionic/storage';
import {
  ConstantProvider
} from '../constant/constant';
import {
  ErrorObservable
} from 'rxjs/observable/ErrorObservable';

/**
 * This service will be execute when an user clicks on sync button. All the sync related functions
 * are written here.
 * @author - Naseem Akhtar (naseem@sdrc.co.in)
 * @author Ratikanta
 * @since - 0.0.1
 */
@Injectable()
export class SyncServiceProvider {

  syncObject: ISyncObject = {
    users: [],
    patients: [],
    bfExpressions: [],
    feedExpressions: [],
    bfsps: [],
    bfpds: [],
  }
  syncReport: ISyncReport = {
    userSyncSuccess: 0,
    userSyncFailed: 0,
    patientSyncSuccess: 0,
    patientSyncFailed: 0,
    bfExpressionSyncSuccess: 0,
    bfExpressionSyncFailed: 0,
    feedSyncSuccess: 0,
    feedSyncFailed: 0,
    bfspSyncSuccess: 0,
    bfspSyncFailed: 0,
    bfpdSyncSuccess: 0,
    bfpdSyncFailed: 0
  }
  syncResult: ISyncResult;
  keyFetched: number = 0;
  postSyncWorkDone: number = 0;

  constructor(public http: HttpClient, private messageProvider: MessageProvider,
    private alertController: AlertController, private storage: Storage) {}

  /**
   * This function will be called by the app.component.ts files prepareForSync() function.
   * This function will basically fetch data from the mobile db and validate them, so that the data
   * can be send for synchronization.
   */
  fetchDataFromDbAndValidateForSync() {
    this.storage.get(ConstantProvider.dbKeyNames.users)
      .then((users) => {
        if (users != null && users.length > 0) {
          users = (users as IUser[]).filter(d => d.isSynced === false && d.syncFailureMessage === null)
          this.syncObject.users = users
        }
        this.sendDataToTheServer();
      });
    this.storage.get(ConstantProvider.dbKeyNames.patients)
      .then((patients) => {
        if (patients != null && patients.length > 0) {
          patients = (patients as IPatient[]).filter(d => d.isSynced === false && d.syncFailureMessage === null)
          this.syncObject.patients = patients
        }
        this.sendDataToTheServer();
      });
    this.storage.get(ConstantProvider.dbKeyNames.bfExpressions)
      .then((bfExpressions) => {
        if (bfExpressions != null && bfExpressions.length > 0) {
          bfExpressions = (bfExpressions as IBFExpression[]).filter(d => d.isSynced === false && d.syncFailureMessage === null)
          this.syncObject.bfExpressions = bfExpressions
        }
        this.sendDataToTheServer();
      });

    this.storage.get(ConstantProvider.dbKeyNames.feedExpressions)
      .then((feedExpressions) => {
        if (feedExpressions != null && feedExpressions.length > 0) {
          feedExpressions = (feedExpressions as IFeed[]).filter(d => d.isSynced === false && d.syncFailureMessage === null)
          this.syncObject.feedExpressions = feedExpressions
        }
        this.sendDataToTheServer();
      });
    this.storage.get(ConstantProvider.dbKeyNames.bfsps)
      .then((bfsps) => {
        if (bfsps != null && bfsps.length > 0) {
          bfsps = (bfsps as IBFSP[]).filter(d => d.isSynced === false && d.syncFailureMessage === null)
          this.syncObject.bfsps = bfsps
        }
        this.sendDataToTheServer();
      });
    this.storage.get(ConstantProvider.dbKeyNames.bfpds)
      .then((bfpds) => {
        if (bfpds != null && bfpds.length > 0) {
          bfpds = (bfpds as IBFPD[]).filter(d => d.isSynced === false && d.syncFailureMessage === null)
          this.syncObject.bfpds = bfpds
        }
        this.sendDataToTheServer();
      });
  }
  /**
   * @author Ratikanta
   * @since 0.0.1
   * 
   * @private
   * @memberof SyncServiceProvider
   */
  private sendDataToTheServer() {
    this.keyFetched++;
    //Checking all key fetched or not
    if (this.keyFetched == 6) {
      //Checking there is any data to sync or not
      if( 
        this.syncObject.users.length > 0 ||
        this.syncObject.patients.length > 0 ||
        this.syncObject.bfExpressions.length > 0 ||
        this.syncObject.feedExpressions.length > 0 ||
        this.syncObject.bfsps.length > 0 ||
        this.syncObject.bfpds.length > 0
      ){
        this.getSyncResult()
        .subscribe(data => {
          this.syncResult = data;
          this.postSyncWork();
        }, err => {
          this.keyFetched = 0;
          this.messageProvider.stopLoader();
          this.messageProvider.showErrorToast(err)
        })
      }else{
        this.keyFetched = 0;
        this.messageProvider.stopLoader();
        this.messageProvider.showErrorToast(ConstantProvider.messages.noDataToSync)
      }
      
    }

  };

  /**
   * This method is going to do all the post sync work
   * @author Ratikanta
   * @since 0.0.1
   * @private
   * @memberof SyncServiceProvider
   */
  private postSyncWork() {
    this.postSyncUserWork();
    this.postSyncPatientWork();
    this.postSyncBFExpressionWork();
    this.postSyncFeedExpressionWork();
    this.postSyncBFSPWork();
    this.postSyncBFPDWork();
  }
  /**
   * This method is going to do post sync user work
   * @author Ratikanta
   * @since 0.0.1
   * @private
   * @memberof SyncServiceProvider
   */
  private postSyncUserWork() {

    //Checking whether we had sent any user to server or not. If we did not send any user to server 
    //Then no need to do following operations
    if (this.syncObject.users.length > 0) {
      this.storage.get(ConstantProvider.dbKeyNames.users)
        .then(users => {
          this.syncResult.failureUsers.forEach(failureUser => {
            this.syncReport.userSyncFailed++;
            //setting the failure message
            (users as IUser[])[(users as IUser[]).findIndex(d => d.email === failureUser.userId)].syncFailureMessage = failureUser.reasonOfFailure;
            //removing from user which we had sent to sync
            this.syncObject.users.splice(this.syncObject.users.findIndex(d => d.email === failureUser.userId), 1)
          })
          this.syncObject.users.forEach(user => {
            this.syncReport.userSyncSuccess++;
            // making the sync true
            (users as IUser[])[(users as IUser[]).findIndex(d => d.email === user.email)].isSynced = true;
          })
          //Again keeping the updated users in db
          this.storage.set(ConstantProvider.dbKeyNames.users, users).then(() => {
            this.showSyncReport()
          })
        })
    } else {
      this.showSyncReport()
    }
  }

  /**
   * This method is going to do post sync patient work
   * @author Ratikanta
   * @since 0.0.1
   * @private
   * @memberof SyncServiceProvider
   */
  private postSyncPatientWork() {
    //Checking whether we had sent any patient to server or not. If we did not send any patient to server 
    //Then no need to do following operations
    if (this.syncObject.patients.length > 0) {
      this.storage.get(ConstantProvider.dbKeyNames.patients)
        .then(patients => {
          this.syncResult.failurePatients.forEach(failurePatient => {
            this.syncReport.patientSyncFailed++;
            //setting the failure message
            (patients as IPatient[])[(patients as IPatient[]).findIndex(d => d.babyCode === failurePatient.babyCode)].syncFailureMessage = failurePatient.reasonOfFailure;
            //removing from patients which we had sent to sync
            this.syncObject.patients.splice(this.syncObject.patients.findIndex(d => d.babyCode === failurePatient.babyCode), 1)
          })
          this.syncObject.patients.forEach(patient => {
            this.syncReport.patientSyncSuccess++;
            // making the sync true
            (patients as IPatient[])[(patients as IPatient[]).findIndex(d => d.babyCode === patient.babyCode)].isSynced = true;
          })
          //Again keeping the updated patients in db
          this.storage.set(ConstantProvider.dbKeyNames.patients, patients).then(() => {
            this.showSyncReport()
          })
        })
    } else {
      this.showSyncReport()
    }
  }

  /**
   * This method is going to do post sync BFExpression work
   * @author Ratikanta
   * @since 0.0.1
   * @private
   * @memberof SyncServiceProvider
   */
  private postSyncBFExpressionWork() {
    //Checking whether we had sent any BFExpression to server or not. If we did not send any BFExpression to server 
    //Then no need to do following operations
    if (this.syncObject.bfExpressions.length > 0) {
      this.storage.get(ConstantProvider.dbKeyNames.bfExpressions)
        .then(bfExpressions => {
          this.syncResult.failureBFExpressions.forEach(failureBFExpression => {
            this.syncReport.bfExpressionSyncFailed++;
            //setting the failure message
            (bfExpressions as IBFExpression[])[(bfExpressions as IBFExpression[]).findIndex(d => d.id === failureBFExpression.id)].syncFailureMessage = failureBFExpression.reasonOfFailure;
            //removing from bfExpression which we had sent to sync
            this.syncObject.bfExpressions.splice(this.syncObject.bfExpressions.findIndex(d => d.id === failureBFExpression.id), 1)
          })
          this.syncObject.bfExpressions.forEach(bfExpression => {
            this.syncReport.bfExpressionSyncSuccess++;
            // making the sync true
            (bfExpressions as IBFExpression[])[(bfExpressions as IBFExpression[]).findIndex(d => d.id === bfExpression.id)].isSynced = true;
          })
          //Again keeping the updated patients in db
          this.storage.set(ConstantProvider.dbKeyNames.bfExpressions, bfExpressions).then(() => {
            this.showSyncReport()
          })
        })
    } else {
      this.showSyncReport()
    }
  }


  /**
   * This method is going to do post sync FeedExpression work
   * @author Ratikanta
   * @since 0.0.1
   * @private
   * @memberof SyncServiceProvider
   */
  private postSyncFeedExpressionWork() {
    //Checking whether we had sent any FeedExpression to server or not. If we did not send any FeedExpression to server 
    //Then no need to do following operations
    if (this.syncObject.feedExpressions.length > 0) {
      this.storage.get(ConstantProvider.dbKeyNames.feedExpressions)
        .then(feedExpressions => {
          this.syncResult.failureFeedExpressions.forEach(failureFeedExpression => {
            this.syncReport.feedSyncFailed++;
            //setting the failure message
            (feedExpressions as IFeed[])[(feedExpressions as IFeed[]).findIndex(d => d.id === failureFeedExpression.id)].syncFailureMessage = failureFeedExpression.reasonOfFailure;
            //removing from feed Expression which we had sent to sync
            this.syncObject.feedExpressions.splice(this.syncObject.feedExpressions.findIndex(d => d.id === failureFeedExpression.id), 1)
          })
          this.syncObject.feedExpressions.forEach(feedExpression => {
            this.syncReport.feedSyncSuccess++;
            // making the sync true
            (feedExpressions as IFeed[])[(feedExpressions as IFeed[]).findIndex(d => d.id === feedExpression.id)].isSynced = true;
          })
          //Again keeping the updated patients in db
          this.storage.set(ConstantProvider.dbKeyNames.feedExpressions, feedExpressions).then(() => {
            this.showSyncReport()
          })
        })
    } else {
      this.showSyncReport()
    }
  }


  /**
   * This method is going to do post sync BFSP work
   * @author Ratikanta
   * @since 0.0.1
   * @private
   * @memberof SyncServiceProvider
   */
  private postSyncBFSPWork() {
    //Checking whether we had sent any BFSP to server or not. If we did not send any BFSP to server 
    //Then no need to do following operations
    if (this.syncObject.bfsps.length > 0) {
      this.storage.get(ConstantProvider.dbKeyNames.bfsps)
        .then(bfsps => {
          this.syncResult.failureBFSPs.forEach(failureBFSP => {
            this.syncReport.bfspSyncFailed++;
            //setting the failure message
            (bfsps as IBFSP[])[(bfsps as IBFSP[]).findIndex(d => d.id === failureBFSP.id)].syncFailureMessage = failureBFSP.reasonOfFailure;
            //removing from BFSP which we had sent to sync
            this.syncObject.bfsps.splice(this.syncObject.bfsps.findIndex(d => d.id === failureBFSP.id), 1)
          })
          this.syncObject.bfsps.forEach(bfsp => {
            this.syncReport.bfspSyncSuccess++;
            // making the sync true
            (bfsps as IBFSP[])[(bfsps as IBFSP[]).findIndex(d => d.id === bfsp.id)].isSynced = true;
          })
          //Again keeping the updated patients in db
          this.storage.set(ConstantProvider.dbKeyNames.bfsps, bfsps).then(() => {
            this.showSyncReport()
          })
        })
    } else {
      this.showSyncReport()
    }
  }


  /**
   * This method is going to do post BFPD user work
   * @author Ratikanta
   * @since 0.0.1
   * @private
   * @memberof SyncServiceProvider
   */
  private postSyncBFPDWork() {
    //Checking whether we had sent any BFPD to server or not. If we did not send any BFPD to server 
    //Then no need to do following operations
    if (this.syncObject.bfpds.length > 0) {
      this.storage.get(ConstantProvider.dbKeyNames.bfpds)
        .then(bfpds => {
          // this.syncResult.failureBFPDs.forEach(failureBFPD => {
          //   this.syncReport.bfpdSyncFailed++;
          //   //setting the failure message
          //   (bfpds as IBFPD[])[(bfpds as IBFPD[]).findIndex(d => d.id === failureBFPD.id)].syncFailureMessage = failureBFPD.reasonOfFailure;
          //   //removing from IBFPD which we had sent to sync
          //   this.syncObject.bfpds.splice(this.syncObject.bfpds.findIndex(d => d.id === failureBFPD.id), 1)
          // })
          // if(bfpds != null && bfpds.length > 0){
            this.syncObject.bfpds.forEach(bfpd => {
              this.syncReport.bfpdSyncSuccess++;
              // making the sync true
              (bfpds as IBFPD[])[(bfpds as IBFPD[]).findIndex(d => d.id === bfpd.id)].isSynced = true;
            })
            //Again keeping the updated patients in db
            this.storage.set(ConstantProvider.dbKeyNames.bfpds, bfpds).then(() => {
              this.showSyncReport()
            })
          // }
        })
    } else {
      this.showSyncReport()
    }
  }


  /**
   * This method is going to show the sync report
   * @author Ratikanta
   * @since 0.0.1 * 
   * @private
   * @memberof SyncServiceProvider
   */
  private showSyncReport() {
    this.postSyncWorkDone++;
    if (this.postSyncWorkDone == 6) {
      let alert = this.alertController.create({
        title: 'Sync Report',
        cssClass: 'syncModal',
        message: 'Sync successful',
        // message: '<div class="reportBody">' +
        //   '<h5>Users synced : ' + this.syncReport.userSyncSuccess + '</h5><br>' +
        //   '<h5>Users rejected : ' + this.syncReport.userSyncFailed + '</h5><br>' +
        //   '<h5>Patients synced : ' + this.syncReport.patientSyncSuccess + '</h5><br>' +
        //   '<h5>Patients rejected : ' + this.syncReport.patientSyncFailed + '</h5><br>' +
        //   '<h5>Bf exp synced : ' + this.syncReport.bfExpressionSyncSuccess + '</h5><br>' +
        //   '<h5>Bf exp failed : ' + this.syncReport.bfExpressionSyncFailed + '</h5><br>' +
        //   '<h5>Feed synced : ' + this.syncReport.feedSyncSuccess + '</h5><br>' +
        //   '<h5>Feed failed : ' + this.syncReport.feedSyncFailed + '</h5><br>' +
        //   '<h5>Bf supp. practice synced : ' + this.syncReport.bfspSyncSuccess + '</h5><br>' +
        //   '<h5>Bf supp. practice failed : ' + this.syncReport.bfspSyncFailed + '</h5><br>' +
        //   '<h5>Bf post discharge synced : ' + this.syncReport.bfpdSyncSuccess + '</h5><br>' +
        //   '<h5>Bf post discharge failed : ' + this.syncReport.bfpdSyncFailed + '</h5><br>' +
        //   '</div>',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.initializeSyncReport();
          }
        }]
      });
      alert.present();

      this.keyFetched = 0;
      this.postSyncWorkDone = 0;
      this.messageProvider.stopLoader();
    }
  }


  /**
   * This method will do the http call to send the data to server
   * @author Ratikanta
   * @since 0.0.1
   * 
   * @private
   * @returns {Observable<ISyncResult>} The failure results if any
   * @memberof SyncServiceProvider
   */
  private getSyncResult(): Observable < ISyncResult > {
    return this.http.post(ConstantProvider.serverUrls.SYNCHRONIZE, this.syncObject).map((response: Response) => {
        return response
      })
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {
    let messageToUser;
    if (error.error instanceof ErrorEvent) {
      messageToUser = `An error occurred: ${error.error.message}`;
    } else {
      switch(error.status){
        case 0:
          if(error.name === 'HttpErrorResponse')
            messageToUser = ConstantProvider.messages.checkInternetConnection;
          else
            messageToUser = `Backend error, code ${error.status}, ` + `message: ${error.message}`;
        break;
        case 500:
          messageToUser = ConstantProvider.messages.serverErrorContactAdmin;
        break;
        default:
          messageToUser = `Backend error, code ${error.status}, ` + `message: ${error.message}`;
        break;
      }
    }
    return new ErrorObservable(messageToUser);
  };

  /** 
   * This function will reset the synReport object after the sync report is closed.
   * @author - Naseem Akhtar (naseem@sdrc.co.in)
   * @since = 0.0.1
  */
  private initializeSyncReport() {
   this.syncReport = {
      userSyncSuccess: 0,
      userSyncFailed: 0,
      patientSyncSuccess: 0,
      patientSyncFailed: 0,
      bfExpressionSyncSuccess: 0,
      bfExpressionSyncFailed: 0,
      feedSyncSuccess: 0,
      feedSyncFailed: 0,
      bfspSyncSuccess: 0,
      bfspSyncFailed: 0,
      bfpdSyncSuccess: 0,
      bfpdSyncFailed: 0
    }
  };
}

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
    // patients: [],
    // bfExpressions: [],
    // feedExpressions: [],
    // bfsps: [],
    // bfpds: [],
    deviceId: 'abc'
  }
  syncReport: ISyncReport = {
    userSyncSuccess: 0,
    userSyncFailed: 0
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
        if (users != null) {
          users = (users as IUser[]).filter(d => d.isSynced === false && d.syncFailureMessage === null)
          this.syncObject.users = users
        }
        this.sendDataToTheServer();
      });
    this.storage.get(ConstantProvider.dbKeyNames.patients)
      .then((patients) => {
        if (patients != null) {
          patients = (patients as IPatient[]).filter(d => d.isSynced === false)
          // this.syncObject.patients = patients
        }
        this.sendDataToTheServer();
      });
    this.storage.get(ConstantProvider.dbKeyNames.bfExpressions)
      .then((bfExpressions) => {
        if (bfExpressions != null) {
          bfExpressions = (bfExpressions as IBFExpression[]).filter(d => d.isSynced === false)
          // this.syncObject.bfExpressions = bfExpressions
        }
        this.sendDataToTheServer();
      });

    this.storage.get(ConstantProvider.dbKeyNames.feedExpressions)
      .then((feedExpressions) => {
        if (feedExpressions != null) {
          feedExpressions = (feedExpressions as IFeed[]).filter(d => d.isSynced === false)
          // this.syncObject.feedExpressions = feedExpressions
        }
        this.sendDataToTheServer();
      });
    this.storage.get(ConstantProvider.dbKeyNames.bfsps)
      .then((bfsps) => {
        if (bfsps != null) {
          bfsps = (bfsps as IBFSP[]).filter(d => d.isSynced === false)
          // this.syncObject.bfsps = bfsps
        }
        this.sendDataToTheServer();
      });
    this.storage.get(ConstantProvider.dbKeyNames.bfpds)
      .then((bfpds) => {
        if (bfpds != null) {
          bfpds = (bfpds as IBFPD[]).filter(d => d.isSynced === false)
          // this.syncObject.bfpds = bfpds
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
      this.getSyncResult()
        .subscribe(data => {
          this.syncResult = data;
          this.postSyncWork();
        }, err => {
          this.messageProvider.stopLoader();
          this.messageProvider.showErrorToast(err)
        })
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
    if (this.syncObject.users.length > 0) {
      this.showSyncReport()
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
    if (this.syncObject.users.length > 0) {
      this.showSyncReport()
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
    if (this.syncObject.users.length > 0) {
      this.showSyncReport()
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
    if (this.syncObject.users.length > 0) {
      this.showSyncReport()
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
    if (this.syncObject.users.length > 0) {
      this.showSyncReport()
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
        message: '<div class="reportBody">' +
          '<h5>Users synced : ' + this.syncReport.userSyncSuccess + '</h5><br>' +
          '<h5>Users rejected : ' + this.syncReport.userSyncFailed + '</h5><br>' +
          // '<h5>Babies synced : ' + data.patientsSynced + '</h5><br>' +
          // '<h5>Babies rejected : ' + data.patientsFailed + '</h5><br>' +
          // '<h5>Bf exp synced : ' + data.bfExpressionSynced + '</h5><br>' +
          // '<h5>Bf exp failed : ' + data.bfExpressionFailed + '</h5><br>' +
          // '<h5>Feed synced : ' + data.logFeedSynced + '</h5><br>' +
          // '<h5>Feed failed : ' + data.logFeedFailed + '</h5><br>' +
          // '<h5>Bf supp. practice synced : ' + data.bfSupportivePracticeSynced + '</h5><br>' +
          // '<h5>Bf supp. practice failed : ' + data.bfSupportivePracticeFailed + '</h5><br>' +
          // '<h5>Bf post discharge synced : ' + data.bfPostDischargeSynced + '</h5><br>' +
          // '<h5>Bf post discharge failed : ' + data.bfPostDischargeFailed + '</h5><br>' +
          '</div>',
        buttons: ['OK']
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
      messageToUser = `Backend error, code ${error.status}, ` +
        `message: ${error.message}`;
    }
    return new ErrorObservable(messageToUser);
  };
}

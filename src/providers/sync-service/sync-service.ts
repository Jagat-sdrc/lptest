import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { MessageProvider } from '../message/message';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../constant/constant';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

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
    instituteId: 0
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
          this.syncObject.instituteId = users[0].institution
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
        this.getSyncResult()
        .subscribe(data => {
          this.syncResult = data;
          if(this.syncResult.syncStatus === 1)
            this.postSyncWork();
          else{
            this.keyFetched = 0;
            this.messageProvider.stopLoader();
            this.messageProvider.showErrorToast(ConstantProvider.messages.syncUnsuccessfull)
          }
        }, err => {
          this.keyFetched = 0;
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
   * @author Naseem Akhtar
   * @since 0.0.1
   * @private
   * @memberof SyncServiceProvider
   */
  private postSyncUserWork() {
    //Checking whether we had sent any user to server or not. If we did not send any user to server 
    //Then no need to do following operations
    if (this.syncResult.users.length > 0) {
      //Setting the latest data received from server to the DB
      this.storage.set(ConstantProvider.dbKeyNames.users, this.syncResult.users).then(() => {
        this.showSyncReport()
      })
    } else {
      this.showSyncReport()
    }
  }


  /**
   * This method is going to do post sync patient work
   * @author Ratikanta
   * @author Naseem Akhtar
   * @since 0.0.1
   * @private
   * @memberof SyncServiceProvider
   */
  private postSyncPatientWork() {
    //Checking whether we had sent any patient to server or not. If we did not send any patient to server 
    //Then no need to do following operations
    if (this.syncResult.patients.length > 0) {
      //Setting the latest data received from server to the DB
      this.storage.set(ConstantProvider.dbKeyNames.patients, this.syncResult.patients).then(() => {
        this.showSyncReport()
      })
    } else {
      this.showSyncReport()
    }
  }

  /**
   * This method is going to do post sync BFExpression work
   * @author Ratikanta
   * @author Naseem Akhtar
   * @since 0.0.1
   * @private
   * @memberof SyncServiceProvider
   */
  private postSyncBFExpressionWork() {
    //Checking whether we had sent any BFExpression to server or not. If we did not send any BFExpression to server 
    //Then no need to do following operations
    if (this.syncResult.bfExpressions.length > 0) {
      //Setting the latest data received from server to the DB
      this.storage.set(ConstantProvider.dbKeyNames.bfExpressions, this.syncResult.bfExpressions).then(() => {
        this.showSyncReport()
      })
    } else {
      this.showSyncReport()
    }
  }


  /**
   * This method is going to do post sync FeedExpression work
   * @author Ratikanta
   * @author Naseem Akhtar
   * @since 0.0.1
   * @private
   * @memberof SyncServiceProvider
   */
  private postSyncFeedExpressionWork() {
    //Checking whether we had sent any FeedExpression to server or not. If we did not send any FeedExpression to server 
    //Then no need to do following operations
    if (this.syncResult.feedExpressions.length > 0) {
      //Setting the latest data received from server to the DB
      this.storage.set(ConstantProvider.dbKeyNames.feedExpressions, this.syncResult.feedExpressions).then(() => {
        this.showSyncReport()
      })
    } else {
      this.showSyncReport()
    }
  }


  /**
   * This method is going to do post sync BFSP work
   * @author Ratikanta
   * @author Naseem Akhtar
   * @since 0.0.1
   * @private
   * @memberof SyncServiceProvider
   */
  private postSyncBFSPWork() {
    //Checking whether we had sent any BFSP to server or not. If we did not send any BFSP to server 
    //Then no need to do following operations
    if (this.syncResult.bfsps.length > 0) {
      //Setting the latest data received from server to the DB
      this.storage.set(ConstantProvider.dbKeyNames.bfsps, this.syncResult.bfsps).then(() => {
        this.showSyncReport()
      })
    } else {
      this.showSyncReport()
    }
  }


  /**
   * This method is going to do post BFPD user work
   * @author Ratikanta
   * @author Naseem Akhtar
   * @since 0.0.1
   * @private
   * @memberof SyncServiceProvider
   */
  private postSyncBFPDWork() {
    //Checking whether we had sent any BFPD to server or not. If we did not send any BFPD to server 
    //Then no need to do following operations
    if (this.syncResult.bfpds.length > 0) {
      //Setting the latest data received from server to the DB
      this.storage.set(ConstantProvider.dbKeyNames.bfpds, this.syncResult.bfpds).then(() => {
        this.showSyncReport()
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
        message: ConstantProvider.messages.syncSuccessfull,
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
    return this.http.post(ConstantProvider.serverUrls.SYNCHRONIZE, this.syncObject).timeout(120000).map((response: Response) => {
        return response
      })
      .catch(this.handleError);
  }

  /**
   * @author - Naseem
   * @param error - this returns the error that occured while making http call
   * @since 0.0.1
   * 
   * This method handles the error that occurs while making a http call
   */
  private handleError(error: HttpErrorResponse) {
    let messageToUser;
    if (error.error instanceof ErrorEvent) {
      messageToUser = `An error occurred: ${error.error.message}`;
    } else {
      if(error.status){
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
      }else if(error.name === 'TimeoutError'){
        messageToUser = `Timeout, please try again`;
      }else{
        messageToUser = `Backend error, code ${error.status}, ` + `message: ${error.message}`;
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

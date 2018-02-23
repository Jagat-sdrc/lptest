import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { ConstantProvider } from '../constant/constant';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import { UserServiceProvider } from '../user-service/user-service';
import * as moment from 'moment';

/*
  Generated class for the BfSupportivePracticeServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BfSupportivePracticeServiceProvider {

  constructor(public http: HttpClient, private storage: Storage, private datePipe: DatePipe,
    private userService: UserServiceProvider) {}

  /**
   * This method should return delivery method lists
   * 
   * @author Naseem Akhtar
   * @returns {Observable<ITypeDetails[]>} 
   * @memberof BfSupportivePracticeServiceProvider
   */
  getBreastfeedingSupportivePractice(): Observable < ITypeDetails[] > {
    return this.http.get("./assets/data.json")
      .map((response: Response) => {
        return (response as any).typeDetails.filter(d => d.typeId === ConstantProvider.BFSupportivePracticesTypeId.bfSupportivePracticesTypeId)
      })
      .catch(this.handleError);
  };

  getPersonWhoPerformedBSFP(): Observable < ITypeDetails[] > {
    return this.http.get("./assets/data.json")
      .map((response: Response) => {
        return (response as any).typeDetails.filter(d => d.typeId === ConstantProvider.PersonWhoPerformedBSFPTypeId.personWhoPerformedBSFPTypeId)
      })
      .catch(this.handleError);
  };

  saveNewBreastFeedingSupportivePracticeForm(bfspForm: IBFSP): Promise <any> {
    let promise = new Promise((resolve, reject) => {
      bfspForm.isSynced = false;
      bfspForm.dateOfBFSP = this.datePipe.transform(new Date(bfspForm.dateOfBFSP), 'dd-MM-yyyy')
      this.storage.get(ConstantProvider.dbKeyNames.bfsps)
        .then((val) => {

          let bfspForms: IBFSP[] = [];
          if (val != null) {
            bfspForms = val
            let index = bfspForms.findIndex(d=>d.dateOfBFSP === bfspForm.dateOfBFSP && d.timeOfBFSP === bfspForm.timeOfBFSP)
            if(index < 0) {
              reject(ConstantProvider.messages.duplicateTime);
            }else{
              bfspForms = this.validateNewEntryAndUpdate(bfspForms, bfspForm)          
              this.storage.set(ConstantProvider.dbKeyNames.bfsps, bfspForms)
              .then(data => {
                resolve()
              })
              .catch(err => {
                reject(err.message);
              })
            }
          } else {
            bfspForms.push(bfspForm)
            this.storage.set(ConstantProvider.dbKeyNames.bfsps, bfspForms)
              .then(data => {
                resolve()
              })
              .catch(err => {
                reject(err.message);
              })
          }
        }).catch(err => {
          reject(err.message);
        })

    });
    return promise;
  };

  findByBabyCodeAndDate(babyCode: string, date: string, isNewExpression: boolean): Promise < IBFSP[] > {
    let promise: Promise < IBFSP[] > = new Promise((resolve, reject) => {
      if(date !== null){
      this.storage.get(ConstantProvider.dbKeyNames.bfsps)
        .then(data => {
          if (data != null) {
            data = (data as IBFSP[]).filter(d => d.babyCode === babyCode && d.dateOfBFSP === date);

            if ((data as IBFSP[]).length > 0) {
              (data as IBFSP[]).forEach(d => {
                let day = parseInt(d.dateOfBFSP.split('-')[0]);
                let month = parseInt(d.dateOfBFSP.split('-')[1]);
                let year = parseInt(d.dateOfBFSP.split('-')[2]);
                d.dateOfBFSP = moment.utc(year+ "-"+ month+"-"+ day).toISOString()
              });

              // if (isNewExpression) {
              //   resolve(this.appendNewRecordAndReturn(data, babyCode, null))
              // } else {
                resolve(data)
              // }
            } else {
              // if (isNewExpression) {
              //   resolve(this.appendNewRecordAndReturn(data, babyCode, null))
              // } else {
                resolve([])
              // }
            }
          } else {
            // if (isNewExpression) {
            //   resolve(this.appendNewRecordAndReturn(data, babyCode, null))
            // } else {
              resolve([])
            // }
          }
        })
        .catch(err => {
          reject(err.message)
        })
      }else{
        resolve([]);
      }
    });
    return promise;
  }

  /**
   * This method is going to give us a new BF expression id
   * 
   * @param {string} babyCode This is the baby code for which we are creating the bf expression id
   * @returns {string} The new bf expression id
   * @author Naseem Akhtar
   * @since 0.0.1
   */
  getNewBfspId(babyCode: string): string {
    return babyCode + "bfsp" + this.datePipe.transform(new Date(), 'ddMMyyyyHHmmssSSS');
  }

  /**
   * This method is going to append a new BfExpression object to existing list
   * 
   * @param {IBFSP[]} data The existing list
   * @param {string} babyCode The unique baby code
   * @param {date} The date of feeding
   * @returns {IBFSP[]} The final appended list
   * @memberof ExpressionBfDateProvider
   */
  appendNewRecordAndReturn(data: IBFSP[], babyCode: string, date: Date): IBFSP[] {
    //The blank feed object
    let bf: IBFSP = {
      id: this.getNewBfspId(babyCode),
      babyCode: babyCode,
      dateOfBFSP: date === null ? null : moment.utc(this.datePipe.transform(new Date(), 'yyyy-M-d')).toISOString(),
      // timeOfBFSP: this.datePipe.transform(new Date(), 'HH:mm'),
      timeOfBFSP: null,
      bfspPerformed: null,
      personWhoPerformedBFSP: null,
      bfspDuration: null,
      isSynced: false,
      userId: this.userService.getUser().email,
      syncFailureMessage: null
    }

    if (data != null && date != undefined) {
      (data as IBFSP[]).splice(0, 0, bf)
    } else {
      data = [];
      data.push(bf)
    }
    return data
  };

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


  /**
   * This method will delete a bfsp expression
   * @author Ratikanta
   * @since 0.0.1
   * @param {string} id 
   * @returns {Promise<any>} 
   * 
   */
  delete(id: string): Promise<any>{
    let promise =  new Promise((resolve, reject)=>{
      this.storage.get(ConstantProvider.dbKeyNames.bfsps)
      .then(data=>{
        let index = (data as IBFSP[]).findIndex(d=>d.id === id);
        if(index >= 0){
          (data as IBFSP[]).splice(index, 1)
          this.storage.set(ConstantProvider.dbKeyNames.bfsps, data)
          .then(()=>{
            resolve()
          })
          .catch(err=>{
            reject(err.message)
          })
        }else{
          reject(ConstantProvider.messages.recordNotFound)  
        }
      })
      .catch(err=>{
        reject(err.message)
      })
    });
    return promise;
  }


    /**
   * This method will check whether we have the record with given baby id, date and time.
   * If all the attribute value will match, this will splice that record and append incoming record.
   * Because it has come for an update.
   * 
   * If record does not match, this will just push the input record with existing once
   * 
   * @author Ratikanta
   * @since 0.0.1
   * @param feedExpressions All the existing feed expressions
   * @param feedExpression incoming feed expression
   * @returns IFeed[] modified feed expressions
   */
  private validateNewEntryAndUpdate(bfsps: IBFSP[], bfsp: IBFSP): IBFSP[]{

    
    for(let i = 0; i < bfsps.length;i++){
      if(bfsps[i].id === bfsp.id){
        //record found, need to splice and enter new
        bfsps.splice(i,1)
        break;
      }
    }
    bfsps.push(bfsp)    
    return bfsps;

  }

}

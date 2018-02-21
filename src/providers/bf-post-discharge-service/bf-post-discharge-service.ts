import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { ConstantProvider } from '../constant/constant';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { UserServiceProvider } from '../user-service/user-service';

/*
  Generated class for the BfPostDischargeServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BfPostDischargeServiceProvider {

  constructor(public http: HttpClient, private datePipe: DatePipe,
    private storage: Storage, private userService: UserServiceProvider) {}

  getMaxTime(){
    return this.datePipe.transform(new Date(),"yyyy-MM-dd");
  }
  /**
   * This method is going to give us a new BF expression id
   * 
   * @param {string} babyCode This is the baby code for which we are creating the bf post discharge
   * @author Naseem Akhtar
   * @since 0.0.1
   */
  getNewBfPdId(babyCode: string): string {
    return babyCode + "bfpd" + this.datePipe.transform(new Date(), 'ddMMyyyyHHmmssSSS');
  }

  /**
   * This method should return delivery method lists
   * 
   * @author Naseem Akhtar
   * @returns {Observable<ITypeDetails[]>} 
   * @memberof getTimeOfBreastfeedingPostDischarge
   */
  getTimeOfBreastfeedingPostDischarge(): Observable < ITypeDetails[] > {
    return this.http.get("./assets/data.json")
      .map((response: Response) => {
        return (response as any).typeDetails.
          filter(d => d.typeId === ConstantProvider.TimeOfBreastFeedingPostDischargeTypeId.timeOfBreastFeedingPostDischargeTypeId)
      })
      .catch(this.handleError);
  };

  getBreastfeedingStatusPostDischarge(): Observable < ITypeDetails[] > {
    return this.http.get("./assets/data.json")
      .map((response: Response) => {
        return (response as any).typeDetails.
          filter(d => d.typeId === ConstantProvider.BFStatusPostDischargeTypeId.bfStatusPostDischargeTypeId)
      })
      .catch(this.handleError);
  };

  saveNewBfPostDischargeForm(bfPdForm: IBFPD): Promise <any> {
    
    let promise = new Promise((resolve, reject) => {     
      bfPdForm.id = this.getNewBfPdId(bfPdForm.babyCode);
      bfPdForm.isSynced = false;
      bfPdForm.dateOfBreastFeeding = this.datePipe.transform(new Date(bfPdForm.dateOfBreastFeeding), 'dd-MM-yyyy')
      
      this.storage.get(ConstantProvider.dbKeyNames.bfpds)
        .then((val) => {

          let bfPdForms: IBFPD[] = [];
          if (val != null) {
            bfPdForms = val;
            bfPdForms = this.validateNewEntryAndUpdate(bfPdForms, bfPdForm)
            this.storage.set(ConstantProvider.dbKeyNames.bfpds, bfPdForms)
              .then(data => {
                resolve()
              })
              .catch(err => {
                reject(err.message);
              })
          } else {
            bfPdForms.push(bfPdForm)
            this.storage.set(ConstantProvider.dbKeyNames.bfpds, bfPdForms)
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

  findByBabyCodeAndTimeOfBreastFeedingId(babyCode: string, timeOfBf: number): Promise < IBFPD > {
    let promise: Promise < IBFPD > = new Promise((resolve, reject) => {
      this.storage.get(ConstantProvider.dbKeyNames.bfpds)
        .then(data => {
          if (data != null) {
            data = (data as IBFPD[]).filter(d => d.babyCode === babyCode && d.timeOfBreastFeeding === timeOfBf);
            if(data.length === 1){
              let day = parseInt((data as IBFPD[])[0].dateOfBreastFeeding.split('-')[0]);
              let month = parseInt((data as IBFPD[])[0].dateOfBreastFeeding.split('-')[1]);
              let year = parseInt((data as IBFPD[])[0].dateOfBreastFeeding.split('-')[2]);
              (data as IBFPD[])[0].dateOfBreastFeeding = moment.utc(year+ "-"+ month+"-"+ day).toISOString()
              resolve(data[0]);
            }else{              
              resolve(this.getBfPd(babyCode, timeOfBf));
            }
          } else {
            resolve(this.getBfPd(babyCode, timeOfBf));
          }
        })
        .catch(err => {
          reject(err.message)
        })
    });
    return promise;
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
  private validateNewEntryAndUpdate(bfPdForms: IBFPD[], bfPdForm: IBFPD): IBFPD[]{

    let index = bfPdForms.findIndex(d=> d.babyCode === bfPdForm.babyCode && d.timeOfBreastFeeding === bfPdForm.timeOfBreastFeeding)
    if(index >=0){
      bfPdForms.splice(index, 1)
    }
    bfPdForms.push(bfPdForm)    
    return bfPdForms;

  }

  /**
   * This method will delete a expression
   * @author Ratikanta
   * @since 0.0.1
   * @param {string} id 
   * @returns {Promise<any>} 
   * @memberof SaveExpressionBfProvider
   */
  delete(id: string): Promise<any>{
    let promise =  new Promise((resolve, reject)=>{
      if(id != null && id != undefined){       
        this.storage.get(ConstantProvider.dbKeyNames.bfpds)
        .then(data=>{
          let index = (data as IBFPD[]).findIndex(d=>d.id === id);
          if(index >= 0){
            (data as IBFPD[]).splice(index, 1)
            this.storage.set(ConstantProvider.dbKeyNames.bfpds, data)
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
      } else {
        reject(ConstantProvider.messages.recordNotFound)
      }
    });
    return promise;
  }

  private getBfPd(babyCode: string, timeOfBf: number): IBFPD{
    let bfpd : IBFPD = {
      babyCode: babyCode,
      dateOfBreastFeeding: moment.utc(this.datePipe.transform(new Date(), 'yyyy-M-d')).toISOString(),
      id: null,
      isSynced: false,
      breastFeedingStatus: null,
      syncFailureMessage: null,
      timeOfBreastFeeding: timeOfBf,
      userId: this.userService.getUser().email

    }
    return bfpd;
  }

}

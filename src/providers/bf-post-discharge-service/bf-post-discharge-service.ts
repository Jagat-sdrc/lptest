import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { ConstantProvider } from '../constant/constant';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { UserServiceProvider } from '../user-service/user-service';
import { PppServiceProvider } from '../ppp-service/ppp-service';
import { UtilServiceProvider } from '../util-service/util-service';

/**
 * @author - Naseem Akhtar (naseem@sdrc.co.in)
 * @since - 0.0.1
 * 
 * This service will be used to fecth the mobile DB related data for 
 * the breast feed post discharge component.
 */

@Injectable()
export class BfPostDischargeServiceProvider {

  constructor(public http: HttpClient, private datePipe: DatePipe,private pppServiceProvider: PppServiceProvider,
    private storage: Storage, private userService: UserServiceProvider, private utilService: UtilServiceProvider) {}

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

  /**
   * This method will return all the possible breast feeding post discharge status's
   * for display in the drop down.
   * 
   * @author - Naseem Akhtar (naseem@sdrc.co.in)
   * @since - 0.0.1
   */
  getBreastfeedingStatusPostDischarge(): Observable < ITypeDetails[] > {
    return this.http.get("./assets/data.json")
      .map((response: Response) => {
        return (response as any).typeDetails.
          filter(d => d.typeId === ConstantProvider.BFStatusPostDischargeTypeId.bfStatusPostDischargeTypeId)
      })
      .catch(this.handleError);
  };

  /**
   * This method will save the breast feeding post discharge entry for a particular
   * time of breast feeding post discharge
   * 
   * @author - Naseem Akhtar (naseem@sdrc.co.in)
   * @since - 0.0.1
   */
  saveNewBfPostDischargeForm(bfPdForm: IBFPD): Promise <any> {
    let promise = new Promise((resolve, reject) => {
      bfPdForm.id = bfPdForm.id === null ? this.getNewBfPdId(bfPdForm.babyCode) : bfPdForm.id;
      bfPdForm.isSynced = false;
      bfPdForm.createdDate = bfPdForm.createdDate === null ?
        this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss') : bfPdForm.createdDate;
      bfPdForm.updatedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
      bfPdForm.userId = this.userService.getUser().email;
      bfPdForm.uuidNumber = this.utilService.getUuid();

      this.storage.get(ConstantProvider.dbKeyNames.bfpds)
        .then((val) => {
          let bfPdForms: IBFPD[] = [];
          this.pppServiceProvider.deleteSpsRecord(bfPdForm.babyCode)
          if (val != null && val.length > 0) {
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

  /**
   * This method checks whether a record exists for the selected baby and for a particular time
   * If exists, then this method returns that record, so that it can updated.
   * 
   * @author - Naseem Akhtar (naseem@sdrc.co.in)
   * @param babyCode 
   * @param timeOfBf 
   */
  findByBabyCodeAndTimeOfBreastFeedingId(babyCode: string, timeOfBf: number): Promise < IBFPD > {
    let promise: Promise < IBFPD > = new Promise((resolve, reject) => {
      this.storage.get(ConstantProvider.dbKeyNames.bfpds)
        .then(data => {
          if (data != null) {
            data = (data as IBFPD[]).filter(d => d.babyCode === babyCode && d.timeOfBreastFeeding === timeOfBf);
            if(data.length === 1) {
              resolve(data[0]);
            }else {
              resolve();
            }
          } else {
            resolve();
          }
        })
        .catch(err => {
          reject(err.message)
        })
    });
    return promise;
  }

  /**
   * @author - Ratikanta
   * @param error - this returns the error that occured while making http call
   * 
   * This method handles the error that occurs while making a http call
   */
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
      if(id != undefined && id != null){
        this.storage.get(ConstantProvider.dbKeyNames.bfpds)
        .then(data=>{
          let index = (data as IBFPD[]).findIndex(d=>d.id === id);
          if(index >= 0){
            this.pppServiceProvider.deleteSpsRecord(data[index].babyCode);
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

  /**
   * @author - Naseem Akhtar
   * This method will be used to sanitize data which do not have a valid
   * baby code
  */
  sanitizeData(){
    this.storage.get(ConstantProvider.dbKeyNames.bfpds)
      .then(data=>{
        if(data != null && data.length > 0){
          data = (data as IBFPD[]).filter(d => d.babyCode != null)
          this.storage.set(ConstantProvider.dbKeyNames.bfpds, data)
          .then(()=>{})
          .catch(err=>{})
        }
      })
      .catch(err=>{})
  }

  /**
   * This method will be called to fecth all the BFPD records of a particular child.
   * This method was initially created for SPS(Single patient summary - exclusive breastfeed)
   *
   * @author - Naseem Akhtar (naseem@sdrc.co.in)
   * @param babyCode - baby whose all records are being fetched
   */
  findByBabyCode(babyCode: string): Promise < IBFPD[] > {
    let promise: Promise < IBFPD[] > = new Promise((resolve, reject) => {
      this.storage.get(ConstantProvider.dbKeyNames.bfpds)
        .then(data => {
            if(data != null)
              resolve(data.filter(d => d.babyCode  === babyCode));
            else
              resolve([]);
        })
        .catch(err => {
          reject(err.message)
        })
    });
    return promise;
  }

}

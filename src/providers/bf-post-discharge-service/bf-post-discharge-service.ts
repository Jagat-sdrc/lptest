import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { ConstantProvider } from '../constant/constant';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';

/*
  Generated class for the BfPostDischargeServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BfPostDischargeServiceProvider {

  constructor(public http: HttpClient, private datePipe: DatePipe,
    private storage: Storage) {}

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
    return babyCode + "bfsp" + this.datePipe.transform(new Date(), 'ddMMyyyyHHmmssSSS');
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
    bfPdForm.id = this.getNewBfPdId(bfPdForm.babyCode);
    let promise = new Promise((resolve, reject) => {      
      this.storage.get(ConstantProvider.dbKeyNames.bfpds)
        .then((val) => {

          let bfPdForms: IBFPD[] = [];
          if (val != null) {
            let exist: boolean = false;
            bfPdForms = val;
            bfPdForms.forEach(d => {
              if(d.babyCode === bfPdForm.babyCode && d.timeOfBreastFeeding === bfPdForm.timeOfBreastFeeding){
                d.breastFeedingStatus = bfPdForm.breastFeedingStatus;
                d.dateOfBreastFeeding = bfPdForm.dateOfBreastFeeding;
                d.timeOfBreastFeeding = bfPdForm.timeOfBreastFeeding;
                d.isSynced = false;
                exist = true;
              }
            });

            if(exist === false){
              bfPdForms.push(bfPdForm);
            }

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
            data = (data as IBFPD[]).filter(d => (d.babyCode === babyCode && d.timeOfBreastFeeding === timeOfBf ));
            if(data.length === 1){
              resolve(data[0]);
            }else{
              reject("No data found");
            }
          } else {
              reject("No data found");
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

}

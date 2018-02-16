import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantProvider } from '../constant/constant';
import { Storage } from '@ionic/storage';

/*
  Generated class for the NewAccountServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NewAccountServiceProvider {

  constructor(public http: HttpClient, private storage: Storage) {
  }

  /**
   * @author Jagat Bandhu
   * @since 0.0.1
   * @param IPatient the patient which we need to save in the database.
   */
  saveNewUser(user: IUser) : Promise<IDBOperationStatus>{
    let promise : Promise<IDBOperationStatus> = new Promise((resolve, reject) => {
      let dbOperationStatus: IDBOperationStatus = {
        isSuccess: false,
        message: ""
      }
      this.storage.get(ConstantProvider.dbKeyNames.patient)
      .then((val) => {

        let patients: IPatient[] = [];
        if(val != null){
          patients = val
          //patients = this.validateNewEntryAndUpdate(patients, patient)          
          this.storage.set(ConstantProvider.dbKeyNames.patient, patients)
          .then(data=>{
            dbOperationStatus.isSuccess = true;
            resolve(dbOperationStatus)
          })
          .catch(err=>{
            dbOperationStatus.isSuccess = false;
            dbOperationStatus.message = err.message;
            reject(dbOperationStatus);    
          })


        }else{
          //patients.push(patient)
          this.storage.set(ConstantProvider.dbKeyNames.patient, patients)
          .then(data=>{
            dbOperationStatus.isSuccess = true;
            resolve(dbOperationStatus)
          })
          .catch(err=>{
            dbOperationStatus.isSuccess = false;
            dbOperationStatus.message = err.message;
            reject(dbOperationStatus);    
          })
          
        }                
      }).catch(err=>{
        dbOperationStatus.isSuccess = false;
        dbOperationStatus.message = err.message;
        reject(dbOperationStatus);
      })
    
    });
    return promise;
  }

}

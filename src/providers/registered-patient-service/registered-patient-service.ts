import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../constant/constant';

/**
 * This service will only provide service to Registered Patient component
 * 
 * @author Jagat Bandhu
 * @since 0.0.1
 */
@Injectable()
export class RegisteredPatientServiceProvider {

  constructor(private storage: Storage){}

  /**
   * 
   * @param babyCode The baby code of the patient to which we are going to delete
   */
  deletePatient(babyCode: string): Promise<any>{
    let promise: Promise<any> = new Promise((resolve, reject)=>{
      this.storage.get(ConstantProvider.dbKeyNames.patient)
      .then(data=>{
        (data as IPatient[]).splice((data as IPatient[]).findIndex(d=> d.babyCode === babyCode), 1)
        this.storage.set(ConstantProvider.dbKeyNames.patient, data)
        .then(result=>{
          resolve()
        })
        .catch(err=>{
          reject(err.message)  
        })
      })
      .catch(err=>{
        reject(err.message)
      })
    })
    return promise;
  }

  /** 
   * This method will return a promise of Patient data from database
   * 
   * @author Jagat Bandhu Sahoo
   * @since 0.0.1
  */
  findAllPatients():Promise<IPatient[]>{
    let promise: Promise<IPatient[]> = new Promise((resolve, reject)=>{
      this.storage.get(ConstantProvider.dbKeyNames.patient)
      .then(data=>{
        if(data != null){
          resolve(data)
        }else{
          reject("No patient found");
        }
      })
      .catch(err=>{
        reject(err.message)
      })
    })
    return promise;
  }
}
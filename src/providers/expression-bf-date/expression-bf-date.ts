import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../constant/constant';
/*
  Generated class for the ExpressionBfDateProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ExpressionBfDateProvider {

  constructor(public http: HttpClient,private storage: Storage) {
    console.log('Hello ExpressionBfDateProvider Provider');
  }
 /**
   * This method will give us all the dates in string array format of which ExpressionBF we have.
   * @author Subhadarshani
   * @since 0.0.1
   * @returns Promise<string[]> string array of dates
   * @param patientId the patient id for which we are extracting data
   */
  getExpressionBFDateListData(patientId: string): Promise<string[]>{

    let promise : Promise<string[]> = new Promise((resolve, reject) => {

      let dbOperationStatus: IDBOperationStatus = {
        isSuccess: false,
        message: ""
      }

      this.storage.get(ConstantProvider.dbKeyNames.bfExpression)
      .then(data=>{
        if(data != null){

          data = (data as IBF[]).filter(d=> d.patientId === patientId)
          
          //Checking if there is any data belong to the patient id or not
          if((data as IBF[]).length > 0){
            let dates:string[] = [];
            (data as IBF[]).forEach(d => {
              dates.push(d.dateOfExpression)
            });
            //removing duplicates
            dates = Array.from(new Set(dates))

            resolve(dates)
          }else{
            dbOperationStatus.isSuccess = false;
            dbOperationStatus.message = "No data found";
            reject(dbOperationStatus);  
          }

        }else{
          dbOperationStatus.isSuccess = false;
          dbOperationStatus.message = "No data found";
          reject(dbOperationStatus);  
        }

      })
      .catch(err=>{
        dbOperationStatus.isSuccess = false;
        dbOperationStatus.message = err.message;
        reject(dbOperationStatus);
      })


    });
    return promise;
  }
}

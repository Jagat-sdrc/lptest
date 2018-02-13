import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../constant/constant';

/**
 * This service will help FeedDateList component
 * @author Ratikanta
 * @since 0.0.1
 */
@Injectable()
export class FeedDateListServiceProvider {

  constructor(private storage: Storage) {}

  /**
   * This method will give us all the dates in string array format of which feed expression we have.
   * @author Ratikanta
   * @since 0.0.1
   * @returns Promise<string[]> string array of dates
   * @param patientId the patient id for which we are extracting data
   */
  getFeedDateListData(patientId: string): Promise<string[]>{

    let promise : Promise<string[]> = new Promise((resolve, reject) => {

      let dbOperationStatus: IDBOperationStatus = {
        isSuccess: false,
        message: ""
      }

      this.storage.get(ConstantProvider.dbKeyNames.feedExpression)
      .then(data=>{
        if(data != null){

          data = (data as IFeed[]).filter(d=> d.patientId === patientId)
          
          //Checking if there is any data belong to the patient id or not
          if((data as IFeed[]).length > 0){
            let dates:string[] = [];
            (data as IFeed[]).forEach(d => {
              dates.push(d.dateOfFeed)
            });
            //removing duplicates
            dates = Array.from(new Set(dates))

            let dateArray: Date[] = [];

            dates.forEach(d=>{
              let day = parseInt(d.split('-')[0]);
              let month = parseInt(d.split('-')[1]);
              let year = parseInt(d.split('-')[2]);
              let individualDate = new Date(year, month, day)
              dateArray.push(individualDate);
            })

            

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

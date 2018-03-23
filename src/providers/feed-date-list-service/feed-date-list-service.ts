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
  getFeedDateListData(babyCode: string): Promise<string[]>{
    let promise : Promise<string[]> = new Promise((resolve, reject) => {

      this.storage.get(ConstantProvider.dbKeyNames.feedExpressions)
      .then(data=>{
        if(data != null){

          data = (data as IFeed[]).filter(d=> d.babyCode === babyCode)

          //Checking if there is any data belong to the patient id or not
          if((data as IFeed[]).length > 0){
            let dates:string[] = [];
            (data as IFeed[]).forEach(d => {
              dates.push(d.dateOfFeed)
            });

            //removing duplicates
            dates = Array.from(new Set(dates))

            resolve(dates)
          }else{
            resolve([]);
          }

        }else{
          resolve([]);
        }

      })
      .catch(err=>{
        reject(err.message);
      })


    });
    return promise;
  }

}

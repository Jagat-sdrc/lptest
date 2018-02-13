import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import "rxjs/Rx";
import { ConstantProvider } from '../constant/constant';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Storage } from '@ionic/storage';

/**
 * This service will only provide service to Feed component
 * @author Ratikanta
 * @since 0.0.1
 */
@Injectable()
export class FeedExpressionServiceProvider {

  constructor(public http: HttpClient,
    private storage: Storage) {   
  }

  

  /**
   * This method should return feeding method lists
   * 
   * @author Ratikanta
   * @returns {Observable<ITypeDetails[]>} 
   * @memberof FeedExpressionServiceProvider
   */
  getFeedingMethods(): Observable<ITypeDetails[]> {

    return this.http.get("./assets/data.json").map((response: Response) => {
               return (response as any).typeDetails.filter(d => d.typeId === ConstantProvider.FeedingTypeIds.feedingMethodTypeId)
           })
        .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {

    let messageToUser;
    if (error.error instanceof ErrorEvent) {
      messageToUser = `An error occurred: ${error.error.message}`;
    } else {
      messageToUser = `Backend error, code ${error.status}, ` +
        `message: ${error.message}`;
    }
    return new ErrorObservable (messageToUser);
  };


  /**
   * This method is going to help us in save feed expression of a single time entry
   * @author Ratikanta
   * @since 0.0.1
   * @returns Promise<IDBOperationStatus>
   * @param feedExpression one feed expression entry
   * 
   */

  saveFeedExpression(feedExpression: IFeed): Promise<IDBOperationStatus>{

    let promise : Promise<IDBOperationStatus> = new Promise((resolve, reject) => {

      let dbOperationStatus: IDBOperationStatus = {
        isSuccess: false,
        message: ""
      }
      this.storage.get(ConstantProvider.dbKeyNames.feedExpression)
      .then((val) => {

        let feedExpressions: IFeed[] = [];
        if(val != null){
          feedExpressions = val
          feedExpressions = this.validateNewEntryAndUpdate(feedExpressions, feedExpression)          
          this.storage.set(ConstantProvider.dbKeyNames.feedExpression, feedExpressions)
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
          feedExpressions.push(feedExpression)
          this.storage.set(ConstantProvider.dbKeyNames.feedExpression, feedExpressions)
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

  //Test method
  getKeys(){
    //All keys
    // this.storage.keys().then(data=>{
    //   console.log(data)
    // })

    //Particular key value
    // this.storage.get("feedExpression").then(data=>{
    //   console.log(data)
    // })


    // this.storage.clear();
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
  private validateNewEntryAndUpdate(feedExpressions: IFeed[], feedExpression: IFeed): IFeed[]{

    
    for(let i = 0; i < feedExpressions.length;i++){
      if(feedExpressions[i].patientId === feedExpression.patientId && 
        feedExpressions[i].dateOfFeed === feedExpression.dateOfFeed &&
        feedExpressions[i].timeOfFeed === feedExpression.timeOfFeed
      ){
        //record found, need to splice and enter new
        feedExpressions.splice(i,1)
        break;
      }
    }
    feedExpressions.push(feedExpression)    
    return feedExpressions;

  }

}

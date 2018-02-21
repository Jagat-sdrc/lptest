import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import "rxjs/Rx";
import { ConstantProvider } from '../constant/constant';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import { UserServiceProvider } from '../user-service/user-service';
import * as moment from 'moment';

/**
 * This service will only provide service to Feed component
 * @author Ratikanta
 * @since 0.0.1
 */
@Injectable()
export class FeedExpressionServiceProvider {

  constructor(public http: HttpClient,
    private storage: Storage, private datePipe: DatePipe,
  private userService: UserServiceProvider) {   
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

  /**
   * This method should return location of feeding lists
   * 
   * @author Ratikanta
   * @returns {Observable<ITypeDetails[]>} 
   * @memberof FeedExpressionServiceProvider
   */
  getLocationOfFeedings(): Observable<ITypeDetails[]> {

    return this.http.get("./assets/data.json").map((response: Response) => {
               return (response as any).typeDetails.filter(d => d.typeId === ConstantProvider.FeedingTypeIds.locationOfFeeding)
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

  saveFeedExpression(feedExpression: IFeed): Promise<any>{

    let promise = new Promise((resolve, reject) => {

      feedExpression.isSynced = false;
      feedExpression.dateOfFeed = this.datePipe.transform(new Date(feedExpression.dateOfFeed), 'dd-MM-yyyy')

      this.storage.get(ConstantProvider.dbKeyNames.feedExpressions)
      .then((val) => {

        let feedExpressions: IFeed[] = [];
        if(val != null){
          feedExpressions = val
          feedExpressions = this.validateNewEntryAndUpdate(feedExpressions, feedExpression)          
          this.storage.set(ConstantProvider.dbKeyNames.feedExpressions, feedExpressions)
          .then(data=>{
            resolve()
          })
          .catch(err=>{
            reject(err.message);    
          })


        }else{
          feedExpressions.push(feedExpression)
          this.storage.set(ConstantProvider.dbKeyNames.feedExpressions, feedExpressions)
          .then(data=>{
            resolve()
          })
          .catch(err=>{
            reject(err.message);    
          })
          
        }                
      }).catch(err=>{
        reject(err.message);
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
  private validateNewEntryAndUpdate(feedExpressions: IFeed[], feedExpression: IFeed): IFeed[]{

    
    for(let i = 0; i < feedExpressions.length;i++){
      if(feedExpressions[i].id === feedExpression.id){
        //record found, need to splice and enter new
        feedExpressions.splice(i,1)
        break;
      }
    }
    feedExpressions.push(feedExpression)    
    return feedExpressions;

  }

  /**
   * This method is going to fetch data from feed expression key by baby code and date
   * @param babyCode The baby code for which we will fetch data
   * @param date The date for which we will fetch data
   * @param isNewExpression If the controll has come from feed date list, to create a new entry
   * @returns Promise<IFeed[]> list of feed expression entries
   * @author Ratikanta
   * @since 0.0.1
   */
  findByBabyCodeAndDate(babyCode: string, date: string, isNewExpression: boolean): Promise<IFeed[]>{
    let promise: Promise<IFeed[]> = new Promise((resolve, reject)=>{
      this.storage.get(ConstantProvider.dbKeyNames.feedExpressions)
      .then(data=>{
        if(data != null){
          data = (data as IFeed[]).filter(d => (d.babyCode === babyCode && d.dateOfFeed === date));

          (data as IFeed[]).forEach(d => {
            let day = parseInt(d.dateOfFeed.split('-')[0]);
            let month = parseInt(d.dateOfFeed.split('-')[1]);
            let year = parseInt(d.dateOfFeed.split('-')[2]);
            d.dateOfFeed = moment.utc(year+ "-"+ month+"-"+ day).toISOString()
          });

          if((data as IFeed[]).length > 0){
            if(isNewExpression){
              resolve(this.appendNewRecordAndReturn(data, babyCode, new Date()))
            }else{
              resolve(data)
            }
            
          }else{
            if(isNewExpression){
              resolve(this.appendNewRecordAndReturn(data, babyCode, new Date()))
            }else{
              data = [];
              resolve(data)
            }
            
          }
        }else{
          if(isNewExpression){
            resolve(this.appendNewRecordAndReturn(data, babyCode, new Date()))
          }else{
            data = [];
            resolve(data)  
          }
        }
      })
      .catch(err=>{
        reject(err.message)
      })
    });
    return promise;
  }

  /**
   * This method is going to give us a new feed expression id
   * 
   * @param {string} babyCode This is the baby code for which we are creating the feed expression id
   * @returns {string} The new feed expression id
   * @memberof FeedExpressionServiceProvider
   * @author Ratikanta
   * @since 0.0.1
   */
  getNewFeedExpressionId(babyCode: string): string{
    return babyCode + "feid" + this.datePipe.transform(new Date(), 'ddMMyyyyHHmmssSSS');
  }

/**
 * This method is going to append a new feed object to axisting list
 * 
 * @param {IFeed[]} data The existing list
 * @param {string} babyCode The unique baby code
 * @param {date} The date of feeding
 * @returns {IFeed[]} The final appended list
 * @memberof FeedExpressionServiceProvider
 */
appendNewRecordAndReturn(data: IFeed[], babyCode: string, date: Date): IFeed[]{
    //The blank feed object
    let feed: IFeed = {
      id: this.getNewFeedExpressionId(babyCode),
      babyCode: babyCode,     
      userId: this.userService.getUser().email,
      babyWeight: null,
      dateOfFeed: moment.utc(this.datePipe.transform(new Date(), 'yyyy-M-d')).toISOString(),
      dhmVolume: null,
      formulaVolume: null,
      animalMilkVolume: null,
      methodOfFeed: null,
      ommVolume: null,
      otherVolume: null,
      timeOfFeed: this.datePipe.transform(new Date(), 'HH:mm'),
      isSynced: false,
      locationOfFeeding: null,
      syncFailureMessage: null
    }


    if(data != null && date != undefined){
      (data as IFeed[]).splice(0, 0, feed)
    }else{
      data = [];
      data.push(feed)
    }
    return data
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
      this.storage.get(ConstantProvider.dbKeyNames.feedExpressions)
      .then(data=>{
        let index = (data as IFeed[]).findIndex(d=>d.id === id);
        if(index >= 0){
          (data as IFeed[]).splice(index, 1)
          this.storage.set(ConstantProvider.dbKeyNames.feedExpressions, data)
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
}

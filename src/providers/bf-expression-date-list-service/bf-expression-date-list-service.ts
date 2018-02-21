import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../constant/constant';
import { DatePipe } from '@angular/common';
import { UserServiceProvider } from '../user-service/user-service';
import * as moment from 'moment';
/*
  Generated class for the ExpressionBfDateProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BFExpressionDateListProvider {

  constructor(public http: HttpClient,private storage: Storage,
    private datePipe: DatePipe, private userService: UserServiceProvider) {
  }
 /**
   * This method will give us all the dates in string array format of which ExpressionBF we have.
   * @author Subhadarshani
   * @since 0.0.1
   * @returns Promise<string[]> string array of dates
   * @param babyid the patient id for which we are extracting data
   */
  getExpressionBFDateListData(babyCode: string): Promise<string[]>{

    let promise : Promise<string[]>= new Promise((resolve, reject) => {


      this.storage.get(ConstantProvider.dbKeyNames.bfExpressions)
      .then(data=>{
        if(data != null){

          data = (data as IBFExpression[]).filter(d=> d.babyCode === babyCode)
          
          //Checking if there is any data belong to the patient id or not
          if((data as IBFExpression[]).length > 0){
            let dates:string[] = [];
            (data as IBFExpression[]).forEach(d => {
              dates.push(d.dateOfExpression)
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
  /**
   * This method will give us all the expressionBF list  array format of the selected date.
   * @author Subhadarshani
   * @since 0.0.1
   * @returns Promise<any[]>  array of dates
   * @param babyid the patient id for which we are extracting data
   */
  findByBabyCodeAndDate(babyCode: string, date: string, isNewExpression: boolean): Promise<IBFExpression[]>{

    let promise: Promise<IBFExpression[]> = new Promise((resolve, reject)=>{
      this.storage.get(ConstantProvider.dbKeyNames.bfExpressions)
      .then(data=>{
        if(data != null){
          data = (data as IBFExpression[]).filter(d => d.babyCode === babyCode && d.dateOfExpression === date);


          
          (data as IBFExpression[]).forEach(d => {
            let day = parseInt(d.dateOfExpression.split('-')[0]);
            let month = parseInt(d.dateOfExpression.split('-')[1]);
            let year = parseInt(d.dateOfExpression.split('-')[2]);
            d.dateOfExpression = moment.utc(year+ "-"+ month+"-"+ day).toISOString()  
          });

          
          if((data as IBFExpression[]).length > 0){
            if(isNewExpression){
              resolve(this.appendNewRecordAndReturn(data, babyCode, new Date()))
            }else{
              resolve(data)
            }
            
          }else{
            if(isNewExpression){
              resolve(this.appendNewRecordAndReturn(data, babyCode, new Date()))
            }else{
              resolve([])  
            }
            
          }
        }else{
          if(isNewExpression){
            resolve(this.appendNewRecordAndReturn(data, babyCode, new Date()))
          }else{
            resolve([])  
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
   * This method is going to give us a new BF expression id
   * 
   * @param {string} babyCode This is the baby code for which we are creating the bf expression id
   * @returns {string} The new bf expression id
   * @memberof ExpressionBfDateProvider
   * @author Subhadarshani
   * @since 0.0.1
   */
  getNewBfExpressionId(babyCode: string): string{
    return babyCode + "bfid" + this.datePipe.transform(new Date(), 'ddMMyyyyHHmmssSSS');
  }
  /**
 * This method is going to append a new BfExpression object to existing list
 * 
 * @param {IBFExpression[]} data The existing list
 * @param {string} babyCode The unique baby code
 * @param {date} The date of feeding
 * @returns {IBFExpression[]} The final appended list
 * @memberof ExpressionBfDateProvider
 */
  appendNewRecordAndReturn(data: IBFExpression[], babyCode: string, date: Date): IBFExpression[]{
    //The blank feed object
    let bf: IBFExpression = {
      id: this.getNewBfExpressionId(babyCode),
      babyCode: babyCode,     
      userId: this.userService.getUser().email,
      dateOfExpression: new Date().toISOString(),
      timeOfExpression: this.datePipe.transform(new Date(), 'HH:mm'),
      methodOfExpression: null,
      locationOfExpression: null,
      volOfMilkExpressedFromLR: null,
      isSynced: false,
      syncFailureMessage: null

    }


    if(data != null && date != undefined){
      (data as IBFExpression[]).splice(0, 0, bf)
    }else{
      data = [];
      data.push(bf)
    }
    return data
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../constant/constant';
import { UserServiceProvider } from '../user-service/user-service';

/**
 * @author - Subhadarshani
 * @since - 0.0.1
 * 
 * This service will help in fetching all the dates for which the breastfeed expressions are
 * present for the selected baby.
 */

@Injectable()
export class BFExpressionDateListProvider {

  constructor(public http: HttpClient,private storage: Storage,
    private userService: UserServiceProvider) {
  }
 /**
   * This method will give us all the dates in string array format of which ExpressionBF we have.
   * @author Subhadarshani
   * @since 0.0.1
   * @returns Promise<string[]> string array of dates
   * @param babyid the patient id for which we are extracting data
   */
  getExpressionBFDateListData(babyCode: string): Promise<string[]> {

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
      if(date !== null){
        this.storage.get(ConstantProvider.dbKeyNames.bfExpressions)
        .then(data=>{
          if(data != null){
            data = (data as IBFExpression[]).filter(d => d.babyCode === babyCode && d.dateOfExpression === date);
            if((data as IBFExpression[]).length > 0){
              resolve(data)
            }else{
              resolve([]);
            }
          }else{
            resolve([])
          }
        })
        .catch(err=>{
          reject(err.message)
        })
      }else{
        resolve([])
      }
    });
    return promise;
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
  appendNewRecordAndReturn(data: IBFExpression[], babyCode: string, date?: string): IBFExpression[]{
    //The blank feed object
    let bf: IBFExpression = {
      id: null,
      babyCode: babyCode,
      userId: this.userService.getUser().email,
      dateOfExpression: date,
      timeOfExpression: null,
      methodOfExpression: null,
      locationOfExpression: null,
      volOfMilkExpressedFromLR: null,
      isSynced: false,
      syncFailureMessage: null,
      createdDate: null,
      updatedDate: null,
      uuidNumber: null
    }

    if(data != null){
      (data as IBFExpression[]).splice(0, 0, bf)
    }else{
      data = [];
      data.push(bf)
    }
    return data
  }
}

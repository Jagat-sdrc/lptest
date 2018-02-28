import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../constant/constant';
import { DatePipe } from '@angular/common';

/**
 * 
 * @author Ratikanta
 * @since 0.0.1
 * @export
 * @class SaveExpressionBfProvider
 */
@Injectable()
export class SaveExpressionBfProvider {

  constructor(public http: HttpClient, private storage: Storage, private datePipe: DatePipe) {
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
   * This method will give us all the save the BF expression in local storage.
   * @author Subhadarshani
   * @since 0.0.1
   * @returns Promise<string[]> string array of dates
   * @param babyid the patient id for which we are saving data
   */
  saveBfExpression(bfExpression: IBFExpression, existingDate: string, existingTime: string): Promise<any>{

    let promise = new Promise((resolve, reject) => {
      bfExpression.id = this.getNewBfExpressionId(bfExpression.babyCode)
      bfExpression.isSynced = false;
      bfExpression.createdDate = bfExpression.createdDate === null ? 
        this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss') : bfExpression.createdDate;
      bfExpression.updatedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
      this.storage.get(ConstantProvider.dbKeyNames.bfExpressions)
      .then((val) => {
        let bfExpressions: IBFExpression[] = [];
        if(val != null){
          bfExpressions = val;
          if(bfExpression.dateOfExpression === existingDate &&  bfExpression.timeOfExpression === existingTime) {
            bfExpressions = this.validateNewEntryAndUpdate(bfExpressions, bfExpression)          
            this.storage.set(ConstantProvider.dbKeyNames.bfExpressions, bfExpressions)
              .then(data=>{
                resolve()
              })
              .catch(err=>{
                reject(err.message);    
              })
          }else{
            let index = bfExpressions.findIndex(d=>d.dateOfExpression === bfExpression.dateOfExpression 
              && d.timeOfExpression === bfExpression.timeOfExpression);
            if(index < 0){
              bfExpressions = this.validateNewEntryAndUpdate(bfExpressions, bfExpression)          
              this.storage.set(ConstantProvider.dbKeyNames.bfExpressions, bfExpressions)
              .then(data=>{
                resolve()
              })
              .catch(err=>{
                reject(err.message);    
              })
            }else{
              reject(ConstantProvider.messages.duplicateTime);
            }
          }
        }else{
          bfExpressions.push(bfExpression)
          this.storage.set(ConstantProvider.dbKeyNames.bfExpressions, bfExpressions)
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
   * @author Subhadarshani
   * @since 0.0.1
   * @param bfExpressions All the existing bf expressions
   * @param bfExpression incoming bf expression
   * @returns IBFExpression[] modified bf expressions
   */
  private validateNewEntryAndUpdate(bfExpressions: IBFExpression[], bfExpression: IBFExpression): IBFExpression[]{

    
    for(let i = 0; i < bfExpressions.length;i++){
      if(bfExpressions[i].id === bfExpression.id){
        //record found, need to splice and enter new
        bfExpressions.splice(i,1)
        break;
      }
    }
    bfExpressions.push(bfExpression)    
    return bfExpressions;

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
      if(id != undefined && id != null) {
        this.storage.get(ConstantProvider.dbKeyNames.bfExpressions)
        .then(data=>{
          let index = (data as IBFExpression[]).findIndex(d=>d.id === id);
          if(index >= 0){
            (data as IBFExpression[]).splice(index, 1)
            this.storage.set(ConstantProvider.dbKeyNames.bfExpressions, data)
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
      }else {
        reject(ConstantProvider.messages.recordNotFound)
      }
    });
    return promise;
  }

}

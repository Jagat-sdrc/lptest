import {
  HttpClient
} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  Storage
} from '@ionic/storage';
import {
  ConstantProvider
} from '../constant/constant';
/*
  Generated class for the SaveExpressionBfProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SaveExpressionBfProvider {

  constructor(public http: HttpClient, private storage: Storage) {
    console.log('Hello SaveExpressionBfProvider Provider');
  }
  /**
   * This method will give us all the save the BF expression in local storage.
   * @author Subhadarshani
   * @since 0.0.1
   * @returns Promise<string[]> string array of dates
   * @param babyid the patient id for which we are saving data
   */
  saveBfExpression(bfExpression: IBFExpression): Promise<IDBOperationStatus>{

    let promise : Promise<IDBOperationStatus> = new Promise((resolve, reject) => {

      let dbOperationStatus: IDBOperationStatus = {
        isSuccess: false,
        message: ""
      }
      this.storage.get(ConstantProvider.dbKeyNames.bfExpression)
      .then((val) => {

        let bfExpressions: IBFExpression[] = [];
        if(val != null){
          bfExpressions = val
          bfExpressions = this.validateNewEntryAndUpdate(bfExpressions, bfExpression)          
          this.storage.set(ConstantProvider.dbKeyNames.bfExpression, bfExpressions)
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
          bfExpressions.push(bfExpression)
          this.storage.set(ConstantProvider.dbKeyNames.bfExpression, bfExpressions)
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

}

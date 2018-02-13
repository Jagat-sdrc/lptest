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
  saveBfExpression(bfExpression: IBFExpression): Promise < IDBOperationStatus > {
    let promise: Promise < IDBOperationStatus > = new Promise((resolve, reject) => {
      let dbOperationStatus: IDBOperationStatus = {
        isSuccess: false,
        message: ""
      }
      this.storage.get(ConstantProvider.dbKeyNames.bfExpression)
        .then((val) => {

          let bfExpList: IBFExpression[] = [];
          if (val != null) {
          //  bfExpList = val
             
          //   this.storage.set(ConstantProvider.dbKeyNames.bfExpression, val)
          //   .then(data=>{
          //     dbOperationStatus.isSuccess = true;
          //     resolve(dbOperationStatus)
          //   })
          //   .catch(err=>{
          //     dbOperationStatus.isSuccess = false;
          //     dbOperationStatus.message = err.message;
          //     reject(dbOperationStatus);    
          //   })
          } else {
            bfExpList.push(bfExpression)
            this.storage.set(ConstantProvider.dbKeyNames.bfExpression, bfExpList)
              .then(data => {
                dbOperationStatus.isSuccess = true;
                resolve(dbOperationStatus)
              })
              .catch(err => {
                dbOperationStatus.isSuccess = false;
                dbOperationStatus.message = err.message;
                reject(dbOperationStatus);
              })

          }
        }).catch(err => {
          dbOperationStatus.isSuccess = false;
          dbOperationStatus.message = err.message;
          reject(dbOperationStatus);
        })

    });
    return promise;
  }
}
